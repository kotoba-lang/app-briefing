(ns briefing.ui
  (:require [briefing.state :as state]
            [clojure.string :as str]
            [reagent.core :as reagent]))

;; Port of App.svelte markup. Structural chrome is hand-rolled hiccup
;; (appkit.core is still .cljk on main and invisible to shadow-cljs —
;; same contract as the app-sbom cljs port).

(defn- bind-stream [stream]
  {:ref (fn [el] (when (and el stream) (set! (.-srcObject el) stream)))})

(defn- connected? [s] (contains? #{"connected" "completed"} s))

(defn- join-panel []
  [:section {:class "panel"}
   [:h2 "Join Room"]
   [:div {:class "form-grid"}
    [:label
     [:span "Room ID"]
     [:input {:value @state/room-id
              :placeholder "room name..."
              :on-change #(reset! state/room-id (.. % -target -value))}]]
    [:label
     [:span "Display Name"]
     [:input {:value @state/display-name
              :placeholder "Your name"
              :on-change #(reset! state/display-name (.. % -target -value))}]]]
   (when-not (empty? @state/media-error)
     [:p {:class "media-warn"} (str @state/media-error " — joining without camera")])
   [:button {:class "btn primary"
             :on-click state/request-media
             :disabled (not= :idle @state/status)}
    (if (= :idle @state/status) "Join Room" "Connecting...")]])

(defn- peer-cell [peer-id peer]
  ^{:key peer-id}
  [:div {:class "video-cell"}
   [:div {:class "video-container"}
    (when (:stream peer) [:video (merge {:auto-play true :plays-inline true} (bind-stream (:stream peer)))])
    (when-not (:stream peer)
      [:div {:class "video-placeholder"}
       (if (connected? (:state peer)) (:name peer) (str (:name peer) " (" (:state peer) ")"))])]
   [:div {:class "video-label"}
    (:name peer)
    (when (connected? (:state peer)) [:span {:class "connected-dot"}])]])

(defn- local-cell []
  [:div {:class "video-cell"}
   [:div {:class "video-container"}
    [:video (merge {:auto-play true :muted true :plays-inline true}
                   {:ref (fn [el]
                           (when el
                             (reset! state/local-video-el el)
                             (when @state/local-stream
                               (set! (.-srcObject el) @state/local-stream))))})]
    (when (or (nil? @state/local-stream) @state/video-off)
      [:div {:class "video-placeholder"} "You"])]
   [:div {:class "video-label"} (str (or (str/trim @state/display-name) state/my-peer-id) " (You)")]])

(defn- rec-label []
  (if @state/is-recording
    (let [d @state/recording-duration
          mm (js/Math.floor (/ d 60))
          ss (.padStart (str (mod d 60)) 2 "0")]
      (str "Stop (" mm ":" ss ")"))
    (if (and (not (empty? @state/recording-status))
             (not (contains? #{"done" "recording"} @state/recording-status)))
      (str @state/recording-status "...")
      "Record")))

(defn- joined-panel []
  [:section {:class "panel"}
   [:div {:class "room-header"}
    [:h2 (str "Room: " @state/room-id)]
    [:span {:class "peer-count"} (str (count @state/remote-peers) " peer"
                                      (when (not= 1 (count @state/remote-peers)) "s"))]
    (when @state/convo-id
      [:span {:class "badge project-badge"} "Project"])
    [:button {:class "btn danger" :on-click state/leave-room} "Leave"]]
   [:div {:class "video-grid"}
    [local-cell]
    (map (fn [[pid peer]] ^{:key pid} [peer-cell pid peer]) @state/remote-peers)]
   (when-not (empty? @state/media-error)
     [:p {:class "media-warn"} @state/media-error])
   [:div {:class "media-controls"}
    (if @state/local-stream
      [:<> [:button {:class (str "btn" (when-not @state/audio-muted " active"))
                :on-click state/toggle-mute}
       (if @state/audio-muted "Unmute" "Mute")]
       [:button {:class (str "btn" (when-not @state/video-off " active"))
                 :on-click state/toggle-video}
        (if @state/video-off "Camera On" "Camera Off")]]
      [:button {:class "btn primary" :on-click state/retry-media} "Allow Camera & Mic"])
    [:button {:class (str "btn" (when @state/is-recording " recording"))
              :on-click state/toggle-recording
              :disabled (contains? #{"uploading" "transcribing" "translating"} @state/recording-status)}
     (rec-label)]]])

(defn- actors-panel []
  [:section {:class "panel actors-panel"}
   [:h3 (str "Project Actors (" (count state/project-actors) " DIDs)")]
   [:div {:class "actor-list"}
    (map (fn [actor]
           ^{:key (:did actor)}
           [:div {:class "actor-item"}
            [:span {:class "actor-role"} (:role actor)]
            [:span {:class "actor-did"} (last (str/split (:did actor) #":"))]])
         state/project-actors)]])

(defn- transcript-panel []
  (when-let [t @state/transcript]
    [:section {:class "panel"}
     [:h3 (str "Transcript (" (:language t) ")")]
     [:div {:class "transcript-text"} (:text t)]
     (when-not (empty? (:translatedText t))
       [:div
        [:h3 "Translation"]
        [:div {:class "transcript-text translated"} (:translatedText t)]])]))

(defn- log-panel []
  [:section {:class "panel log-panel"}
   [:h3 "Event Log"]
   [:div {:class "log"}
    (map (fn [entry] ^{:key entry} [:div {:class "log-entry"} entry]) @state/event-log)
    (when (empty? @state/event-log)
      [:div {:class "log-entry dim"} "No events yet"])]])
