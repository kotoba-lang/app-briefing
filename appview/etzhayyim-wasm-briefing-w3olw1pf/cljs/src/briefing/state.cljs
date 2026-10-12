(ns briefing.state
  (:require [reagent.core :as reagent]
            [clojure.string :as str]))

;; Port of App.svelte state (WebRTC briefing room).

(def SIGNAL_URL "wss://briefing-signal.etzhayyim.com")
(def SIGNAL_HTTP "https://briefing-signal.etzhayyim.com")

(def ice-servers
  #js [#js {:urls "stun:stun.l.google.com:19302"}
       #js {:urls "stun:stun1.l.google.com:19302"}
       #js {:urls "stun:stun.cloudflare.com:3478"}])

(def project-actors
  [{:did "did:web:briefing.etzhayyim.com:actor:transcriber" :role "Transcription" :description "Speech-to-text via Whisper"}
   {:did "did:web:briefing.etzhayyim.com:actor:translator" :role "Translation" :description "Auto-translate via LLM"}
   {:did "did:web:briefing.etzhayyim.com:actor:recorder" :role "Recording" :description "Audio recording + R2 storage"}
   {:did "did:web:briefing.etzhayyim.com:actor:summarizer" :role "Summarizer" :description "Meeting summary generation"}])

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
         start-recording process-recording create-project)

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
  (case (:type msg)
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
    nil))

;; ── Step 3: WebRTC peer connections ──

(defn create-peer-connection [peer-id is-initiator]
  (when-not (contains? (deref peer-connections) peer-id)
    (let [pc (new js/RTCPeerConnection #js {:iceServers ice-servers})]
      (vswap! peer-connections assoc peer-id pc)
      (if @local-stream
        (doseq [track (js->clj (.getTracks @local-stream))]
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
              (set-peer peer-id {:stream (or (first (js->clj (.-streams ev)))
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
                             (.setLocalDescription pc offer)
                             (send-signal {:type "offer" :to peer-id :sdp (.-sdp offer)})))
                    (.catch (fn [e] (js/console.warn "[rtc] renegotiation error:" e)))))))
      (when is-initiator
        (-> (.createOffer pc)
            (.then (fn [offer]
                     (.setLocalDescription pc offer)
                     (send-signal {:type "offer" :to peer-id :sdp (.-sdp offer)}))))))))

(defn handle-offer [from sdp]
  (-> (js/Promise.resolve
        (when-not (contains? (deref peer-connections) from)
          (create-peer-connection from false)))
      (.then (fn []
               (let [pc (get (deref peer-connections) from)]
                 (.setRemoteDescription pc #js {:type "offer" :sdp sdp})
                 (.then (.createAnswer pc)
                        (fn [answer]
                          (.setLocalDescription pc answer)
                          (send-signal {:type "answer" :to from :sdp (.-sdp answer)}))))))))

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

(defn try-media [specs]
  (if (empty? specs)
    (let [msg "No camera/mic found on this device."]
      (reset! media-error msg)
      (log (str "Media: " msg)))
    (-> (js/navigator.mediaDevices.getUserMedia (first specs))
        (.then (fn [stream]
                 (reset! local-stream stream)
                 (log (case (count specs) 3 "Camera + mic ready" 2 "Mic only (no camera)" "Camera only (no mic)"))
                 (connect-signaling)))
        (.catch (fn [_] (try-media (rest specs)))))))

(defn request-media []
  (when (empty? (str/trim @room-id))
    (reset! room-id (str "room-" (.getTime (js/Date.)))))
  (reset! status :media)
  (reset! media-error "")
  (try-media [#js {:audio true :video true}
              #js {:audio true :video false}
              #js {:audio false :video true}]))

(defn retry-media []
  (reset! media-error "")
  (reset! status :media)
  (try-media [#js {:audio true :video true}
              #js {:audio true :video false}
              #js {:audio false :video true}]))

;; ── Step 2: WebSocket signaling ──

(defn connect-signaling []
  (let [name (or (str/trim @display-name) my-peer-id)
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
  (when-not @convo-id
    (-> (js/fetch "/xrpc/com.etzhayyim.apps.briefing.createRoom"
                  (clj->js {:method "POST"
                            :headers {"Content-Type" "application/json"}
                            :body (js/JSON.stringify
                                   (clj->js {:roomId @room-id
                                             :name (str "Briefing: " @room-id)
                                             :actors (mapv :did project-actors)}))}))
        (.then (fn [_]
                 (reset! convo-id @room-id)
                 (log (str "Project: " @room-id " (" (count project-actors) " actors)"))
                 (doseq [a project-actors]
                   (log (str "  Actor: " (:role a) " → " (:did a))))))
        (.catch (fn [e] (log (str "Project: " (.-message e))))))))

(defn leave-room []
  (when-let [s @ws] (.close s))
  (reset! ws nil)
  (doseq [id (keys (deref peer-connections))] (close-peer-connection id))
  (reset! remote-peers {})
  (when @local-stream
    (doseq [t (js->clj (.getTracks @local-stream))] (.stop t))
    (reset! local-stream nil))
  (when @is-recording (stop-recording))
  (reset! status :idle)
  (reset! media-error "")
  (reset! recording-status "")
  (reset! transcript nil)
  (reset! convo-id ""))

(defn toggle-mute []
  (when @local-stream
    (when-let [t (first (js->clj (.getAudioTracks @local-stream)))]
      (set! (.-enabled t) (not (.-enabled t)))
      (reset! audio-muted (not (.-enabled t))))))

(defn toggle-video []
  (when @local-stream
    (when-let [t (first (js->clj (.getVideoTracks @local-stream)))]
      (set! (.-enabled t) (not (.-enabled t)))
      (reset! video-off (not (.-enabled t))))))

(defn toggle-recording []
  (if @is-recording (stop-recording) (start-recording)))

(defn start-recording []
  (let [ctx (new js/AudioContext)
        dest (.createMediaStreamDestination ctx)]
    (when @local-stream
      (when-let [la (first (js->clj (.getAudioTracks @local-stream)))]
        (.connect (.createMediaStreamSource ctx (new js/MediaStream #js [la])) dest)))
    (doseq [[_ peer] @remote-peers]
      (when-let [st (:stream peer)]
        (when-let [ra (first (js->clj (.getAudioTracks st)))]
          (.connect (.createMediaStreamSource ctx (new js/MediaStream #js [ra])) dest))))
    (let [mime (if (.isTypeSupported js/MediaRecorder "audio/webm;codecs=opus")
                 "audio/webm;codecs=opus" "audio/webm")
          mr (new js/MediaRecorder (.-stream dest) #js {:mimeType mime})]
      (reset! recording-chunks [])
      (reset! media-recorder mr)
      (set! (.-ondataavailable mr)
            (fn [ev] (when (pos? (.-size (.-data ev)))
                       (swap! recording-chunks conj (.-data ev)))))
      (set! (.-onstop mr) (fn [] (process-recording)))
      (.start mr 1000)))
  (reset! is-recording true)
  (reset! recording-duration 0)
  (reset! recording-status "recording")
  (reset! recording-timer (js/setInterval #(swap! recording-duration inc) 1000))
  (log "Recording started"))

(defn process-recording []
  (let [chunks @recording-chunks
        n (count chunks)]
    (reset! recording-status "uploading")
    (if (zero? n)
      (do (log "Recording: no audio captured")
          (reset! recording-status ""))
      (let [blob (new js/Blob (to-array chunks) #js {:type "audio/webm"})
            fd (new js/FormData)]
        (.append fd "audio" blob "briefing.webm")
        (.append fd "roomId" @room-id)
        (.append fd "peerId" my-peer-id)
        (-> (js/fetch "/xrpc/com.etzhayyim.apps.briefing.uploadRecording"
                      #js {:method "POST" :body fd})
            (.then (fn [res]
                     (if (.-ok res)
                       (-> (.json res)
                           (.then (fn [j]
                                    (reset! transcript (js->clj j :keywordize-keys true))
                                    (reset! recording-status "done")
                                    (log (str "Transcript ready (" (:language (js->clj j :keywordize-keys true)) ")"))))
                           (.catch (fn [_] (reset! recording-status "done"))))
                       (do (log (str "Upload failed: " (.-status res)))
                           (reset! recording-status "")))))
            (.catch (fn [e]
                      (log (str "Upload error: " (.-message e)))
                      (reset! recording-status ""))))))))


(defn stop-recording []
  (when (and @media-recorder (= "recording" (.-state @media-recorder)))
    (.stop @media-recorder))
  (when @recording-timer
    (js/clearInterval @recording-timer)
    (reset! recording-timer nil))
  (reset! is-recording false)
  (log (str "Recording stopped (" @recording-duration "s)")))
