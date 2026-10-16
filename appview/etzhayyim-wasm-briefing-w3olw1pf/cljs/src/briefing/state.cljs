(ns briefing.state
  (:require [reagent.core :as reagent]
            [clojure.string :as str]))

;; Port of App.svelte state (WebRTC briefing room).

(def SIGNAL_URL "wss://briefing-signal.etzhayyim.com")

(def ice-servers
  #js [#js {:urls "stun:stun.l.google.com:19302"}
       #js {:urls "stun:stun1.l.google.com:19302"}
       #js {:urls "stun:stun.cloudflare.com:3478"}])

(def available-project-actors
  [{:did "did:web:briefing.etzhayyim.com:actor:transcriber" :role "Transcription" :description "Speech-to-text via Whisper"}
   {:did "did:web:briefing.etzhayyim.com:actor:translator" :role "Translation" :description "Auto-translate via LLM"}
   {:did "did:web:briefing.etzhayyim.com:actor:recorder" :role "Recording" :description "Audio recording + R2 storage"}
   {:did "did:web:briefing.etzhayyim.com:actor:summarizer" :role "Summarizer" :description "Meeting summary generation"}])
(def project-actors (reagent/atom [])) ; actors are shown only after createRoom succeeds

(def my-peer-id (str "peer-" (.slice (.toString (js/Math.random) 36) 2 8)))

(def room-id (reagent/atom ""))
(def display-name (reagent/atom ""))
(def embed-mode (reagent/atom false))
(def status (reagent/atom :idle)) ; :idle :media :joining :joined
(def media-error (reagent/atom ""))
(def local-stream (reagent/atom nil))
(def remote-peers (reagent/atom {})) ; peer-id -> {:name :stream :state}
(def event-log (reagent/atom []))
(def audio-muted (reagent/atom false))
(def video-off (reagent/atom false))
(def is-recording (reagent/atom false))
(def recording-duration (reagent/atom 0))
(def recording-status (reagent/atom "")) ; "" recording uploading transcribing translating done
(def transcript (reagent/atom nil))
(def convo-id (reagent/atom ""))
(def local-video-el (reagent/atom nil))

;; Non-reactive handles (JS side effects).
(defonce ws (atom nil))
(defonce peer-connections (volatile! {}))
(defonce media-recorder (atom nil))
(defonce recording-chunks (atom []))
(defonce recording-timer (atom nil))

(defn log [msg]
  (let [ts (.toLocaleTimeString (js/Date.))]
    (swap! event-log (fn [v] (cons (str "[" ts "] " msg) (take 49 v))))))

;; Forward declarations (mutually recursive logic).
(declare connect-signaling create-peer-connection handle-offer handle-answer
         handle-ice-candidate request-media leave-room stop-recording
         create-project)

(defn set-peer [peer-id patch]
  (swap! remote-peers (fn [m]
                        (if (contains? m peer-id)
                          (update-in m [peer-id] merge patch)
                          (assoc m peer-id (merge {:name "" :stream nil :state "new"} patch))))))

(defn send-signal [msg]
  (when-let [s @ws]
    (when (= (.-OPEN js/WebSocket) (.-readyState s))
      (.send s (js/JSON.stringify (clj->js msg))))))

(defn close-peer-connection [peer-id]
  (when-let [pc (get (deref peer-connections) peer-id)]
    (.close pc)
    (vswap! peer-connections dissoc peer-id)))

(declare handle-offer handle-answer handle-ice-candidate request-media)

(defn handle-signal [msg]
  (let [raw-type (:type msg)
        type (cond
               (keyword? raw-type) raw-type
               (string? raw-type) (keyword raw-type)
               :else nil)]
  (case type
    :peers (do (log (str (count (:peers msg)) " peer(s) in room"))
               (reduce (fn [acc p]
                         (let [pid (str (:peerId p))]
                           (set-peer pid {:name (str (:displayName p)) :stream nil :state "connecting"})
                           (create-peer-connection pid true))
                         acc)
                       nil (:peers msg)))
    :peer-joined (do (log (str (:displayName msg) " joined"))
                     (set-peer (str (:peerId msg)) {:name (str (:displayName msg)) :stream nil :state "new"}))
    :peer-left (do (log (str (:name (get @remote-peers (str (:peerId msg)))) " left"))
                   (close-peer-connection (str (:peerId msg)))
                   (swap! remote-peers dissoc (str (:peerId msg))))
    :offer (do (log (str "Offer from " (:name (get @remote-peers (str (:from msg))))))
               (handle-offer (str (:from msg)) (str (:sdp msg))))
    :answer (do (log (str "Answer from " (:name (get @remote-peers (str (:from msg))))))
                (handle-answer (str (:from msg)) (str (:sdp msg))))
    :ice-candidate (handle-ice-candidate (str (:from msg)) (:candidate msg))
    nil)))

;; ── Step 3: WebRTC peer connections ──

(defn create-peer-connection [peer-id is-initiator]
  (when-not (contains? (deref peer-connections) peer-id)
    (let [pc (new js/RTCPeerConnection #js {:iceServers ice-servers})]
      (vswap! peer-connections assoc peer-id pc)
      (if @local-stream
        (doseq [track (array-seq (.getTracks @local-stream))]
          (.addTrack pc track @local-stream))
        (do (.addTransceiver pc "audio" #js {:direction "recvonly"})
            (.addTransceiver pc "video" #js {:direction "recvonly"})))
      (set! (.-onicecandidate pc)
            (fn [ev]
              (when (.-candidate ev)
                (send-signal {:type "ice-candidate" :to peer-id :candidate (.toJSON (.-candidate ev))}))))
      (set! (.-ontrack pc)
            (fn [ev]
              (log (str "Track: " (.-kind (.-track ev)) " from " (:name (get @remote-peers peer-id))))
              (set-peer peer-id {:stream (or (first (array-seq (.-streams ev)))
                                             (new js/MediaStream #js [(.-track ev)]))
                                 :state "connected"})))
      (set! (.-oniceconnectionstatechange pc)
            (fn []
              (let [st (.-iceConnectionState pc)]
                (when (get @remote-peers peer-id)
                  (set-peer peer-id {:state st}))
                (if (contains? #{"connected" "completed"} st)
                  (log (str "Connected to " (:name (get @remote-peers peer-id))))
                  (when (= st "failed")
                    (log (str "Connection failed to " (:name (get @remote-peers peer-id)))))))))
      (set! (.-onnegotiationneeded pc)
            (fn []
              (when (or is-initiator (= "stable" (.-signalingState pc)))
                (-> (.createOffer pc)
                    (.then (fn [offer]
                             (.setLocalDescription pc offer)))
                    (.then (fn []
                             (send-signal {:type "offer" :to peer-id
                                           :sdp (.-sdp (.-localDescription pc))})))
                    (.catch (fn [e] (js/console.warn "[rtc] renegotiation error:" e)))))))
      (when is-initiator
        (-> (.createOffer pc)
            (.then (fn [offer]
                     (.setLocalDescription pc offer)))
            (.then (fn []
                     (send-signal {:type "offer" :to peer-id
                                   :sdp (.-sdp (.-localDescription pc))})))
            (.catch (fn [e] (js/console.warn "[rtc] initial offer error:" e))))))))

(defn handle-offer [from sdp]
  (when-not (contains? (deref peer-connections) from)
    (create-peer-connection from false))
  (when-let [pc (get (deref peer-connections) from)]
    (-> (.setRemoteDescription pc #js {:type "offer" :sdp sdp})
        (.then (fn [] (.createAnswer pc)))
        (.then (fn [answer] (.setLocalDescription pc answer)))
        (.then (fn []
                 (send-signal {:type "answer" :to from
                               :sdp (.-sdp (.-localDescription pc))})))
        (.catch (fn [e] (js/console.warn "[rtc] answer error:" e))))))

(defn handle-answer [from sdp]
  (when-let [pc (get (deref peer-connections) from)]
    (when (= "have-local-offer" (.-signalingState pc))
      (.setRemoteDescription pc #js {:type "answer" :sdp sdp}))))

(defn handle-ice-candidate [from candidate]
  (when-let [pc (get (deref peer-connections) from)]
    (when candidate
      (.addIceCandidate pc (clj->js candidate)
                        (fn []) (fn [])))))

;; ── Step 1: media ──

(defn try-media [specs join-after-media?]
  (if (empty? specs)
    (let [msg "No camera/mic found on this device."]
      (reset! media-error msg)
      (log (str "Media: " msg))
      (when join-after-media? (connect-signaling)))
    (-> (js/navigator.mediaDevices.getUserMedia (first specs))
        (.then (fn [stream]
                 (reset! local-stream stream)
                 (reset! media-error "")
                 (when-let [el @local-video-el]
                   (set! (.-srcObject el) stream))
                 (log (case (count specs) 3 "Camera + mic ready" 2 "Mic only (no camera)" "Camera only (no mic)"))
                 (if join-after-media?
                   (connect-signaling)
                   (doseq [[peer-id pc] (deref peer-connections)]
                     (doseq [track (array-seq (.getTracks stream))]
                       (.addTrack pc track stream))
                     (log (str "Added local media to " peer-id))))))
        (.catch (fn [_] (try-media (rest specs) join-after-media?))))))

(defn request-media []
  (when (empty? (str/trim @room-id))
    (reset! room-id (str "room-" (.getTime (js/Date.)))))
  (reset! status :media)
  (reset! media-error "")
  (try-media [#js {:audio true :video true}
              #js {:audio true :video false}
              #js {:audio false :video true}]
             true))

(defn retry-media []
  (reset! media-error "")
  (try-media [#js {:audio true :video true}
              #js {:audio true :video false}
              #js {:audio false :video true}]
             false))

;; ── Step 2: WebSocket signaling ──

(defn connect-signaling []
  (let [entered-name (str/trim @display-name)
        name (if (str/blank? entered-name) my-peer-id entered-name)
        url (str SIGNAL_URL "/rooms/" (js/encodeURIComponent @room-id) "/ws")]
    (log (str "Connecting to room: " @room-id))
    (reset! status :joining)
    (let [s (new js/WebSocket url)]
      (reset! ws s)
      (set! (.-onopen s)
            (fn []
              (log "Connected")
              (.send s (js/JSON.stringify (clj->js {:type "join" :peerId my-peer-id :displayName name})))
              (reset! status :joined)
              (create-project)))
      (set! (.-onmessage s)
            (fn [ev]
              (try
                (handle-signal (js->clj (js/JSON.parse (.-data ev)) :keywordize-keys true))
                (catch :default e (js/console.warn "[signal]" e)))))
      (set! (.-onclose s)
            (fn []
              (log "Disconnected")
              (when (= :joined @status) (leave-room))))
      (set! (.-onerror s) (fn [] (log "Connection error"))))))

;; ── Convo project ──

(defn create-project []
  (when (str/blank? @convo-id)
    (-> (js/fetch "/xrpc/com.etzhayyim.apps.briefing.createRoom"
                  (clj->js {:method "POST"
                            :headers {"Content-Type" "application/json"}
                            :body (js/JSON.stringify
                                   (clj->js {:roomId @room-id
                                             :name (str "Briefing: " @room-id)
                                             :actors (mapv :did available-project-actors)}))}))
        (.then (fn [response]
                 (when-not (.-ok response)
                   (throw (js/Error. (str "createRoom HTTP " (.-status response)))))
                 (.json response)))
        (.then (fn [body]
                 (let [result (js->clj body :keywordize-keys true)]
                   (when-not (:ok result)
                     (throw (js/Error. (str "createRoom refused: " (:error result)))))
                   (reset! convo-id @room-id)
                   (reset! project-actors available-project-actors)
                   (log (str "Project: " @room-id " (" (count available-project-actors) " actors)"))
                   (doseq [a available-project-actors]
                     (log (str "  Actor: " (:role a) " → " (:did a)))))))
        (.catch (fn [e] (log (str "Project: " (.-message e))))))))

(defn leave-room []
  (when-let [s @ws] (.close s))
  (reset! ws nil)
  (doseq [id (keys (deref peer-connections))] (close-peer-connection id))
  (reset! remote-peers {})
  (when @local-stream
    (doseq [t (array-seq (.getTracks @local-stream))] (.stop t))
    (reset! local-stream nil))
  (when @is-recording (stop-recording))
  (reset! status :idle)
  (reset! media-error "")
  (reset! recording-status "")
  (reset! transcript nil)
  (reset! convo-id "")
  (reset! project-actors []))

(defn toggle-mute []
  (when @local-stream
    (when-let [t (first (array-seq (.getAudioTracks @local-stream)))]
      (set! (.-enabled t) (not (.-enabled t)))
      (reset! audio-muted (not (.-enabled t))))))

(defn toggle-video []
  (when @local-stream
    (when-let [t (first (array-seq (.getVideoTracks @local-stream)))]
      (set! (.-enabled t) (not (.-enabled t)))
      (reset! video-off (not (.-enabled t))))))

;; The repository governance requires explicit consent from every participant
;; and immediate pause on revocation. The signaling service has no verified
;; consent protocol, so this client must not capture or upload meeting audio.
(defn toggle-recording []
  (if @is-recording
    (stop-recording)
    (log "Recording is disabled until every participant can explicitly consent and revoke consent.")))

(defn stop-recording []
  (when-let [mr @media-recorder]
    (set! (.-ondataavailable mr) nil)
    (set! (.-onstop mr) nil)
    (when (= "recording" (.-state mr))
      (.stop mr)))
  (reset! media-recorder nil)
  (reset! recording-chunks [])
  (when @recording-timer
    (js/clearInterval @recording-timer)
    (reset! recording-timer nil))
  (reset! is-recording false)
  (reset! recording-status "")
  (log "Recording discarded; this client has no unanimous-consent flow"))
