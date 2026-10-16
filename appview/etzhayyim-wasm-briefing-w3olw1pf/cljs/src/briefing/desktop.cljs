(ns briefing.desktop
  (:require [briefing.state :as state]
            [briefing.ui :as ui]
            [clojure.string :as str]
            [reagent.core :as r]
            [reagent.dom.client :as rdc]))

(defonce root (atom nil))

(defn root-view []
  [:div {:class "app"}
   [:header
    [:h1 "Briefing"]
    [:span {:class "badge"} "KAMI WebRTC"]]
   (when (contains? #{:idle :media :joining} @state/status)
     [ui/join-panel])
   (when (= :joined @state/status)
     [:<>
      [ui/joined-panel]
      (when (seq @state/project-actors) [ui/actors-panel])
      [ui/transcript-panel]])
   [ui/log-panel]])

(defn ^:export init! []
  (let [first-mount? (nil? @root)
        container (js/document.getElementById "app")]
    (when first-mount?
      (reset! root (rdc/create-root container)))
    (rdc/render @root [root-view])
    (when first-mount?
      (let [params (js/URLSearchParams. (.-search js/location))
            room (.get params "room")]
        (reset! state/embed-mode (.has params "embed"))
        (when-not (str/blank? room)
          (reset! state/room-id room)
          (js/setTimeout state/request-media 100))))))
