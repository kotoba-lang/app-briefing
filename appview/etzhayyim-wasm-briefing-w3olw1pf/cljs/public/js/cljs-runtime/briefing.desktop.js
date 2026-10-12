goog.provide('briefing.desktop');
if((typeof briefing !== 'undefined') && (typeof briefing.desktop !== 'undefined') && (typeof briefing.desktop.root !== 'undefined')){
} else {
briefing.desktop.root = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
briefing.desktop.root_view = (function briefing$desktop$root_view(){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",-2030961996),"app"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"header","header",119441134),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"h1","h1",-1896887462),"Briefing"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"span","span",1394872991),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",-2030961996),"badge"], null),"KAMI WebRTC"], null)], null),((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"idle","idle",-2007156861),null,new cljs.core.Keyword(null,"joining","joining",-1465537833),null,new cljs.core.Keyword(null,"media","media",-1066138403),null], null), null),cljs.core.deref(briefing.state.status)))?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [briefing.ui.join_panel], null):null),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"joined","joined",-231861661),cljs.core.deref(briefing.state.status)))?new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"<>","<>",1280186386),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [briefing.ui.joined_panel], null),(((cljs.core.count(briefing.state.project_actors) > (0)))?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [briefing.ui.actors_panel], null):null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [briefing.ui.transcript_panel], null)], null):null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [briefing.ui.log_panel], null)], null);
});
briefing.desktop.init_BANG_ = (function briefing$desktop$init_BANG_(){
var container = document.getElementById("app");
if(cljs.core.truth_(cljs.core.deref(briefing.desktop.root))){
} else {
cljs.core.reset_BANG_(briefing.desktop.root,reagent.dom.client.create_root(container));
}

return reagent.dom.client.render.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.desktop.root),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [briefing.desktop.root_view], null));
});
goog.exportSymbol('briefing.desktop.init_BANG_', briefing.desktop.init_BANG_);

//# sourceMappingURL=briefing.desktop.js.map
