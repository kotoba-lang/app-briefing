(ns briefing.desktop
  (:require [briefing.state :as state]
            [briefing.ui :as ui]
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
      (when (pos? (count state/project-actors)) [ui/actors-panel])
      [ui/transcript-panel]])
   [ui/log-panel]])

(defn ^:export init! []
  (let [container (js/document.getElementById "app")]
    (when-not @root
      (reset! root (rdc/create-root container)))
    (rdc/render @root [root-view])))
