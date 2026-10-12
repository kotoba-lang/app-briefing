goog.provide('reagent.debug');
reagent.debug.has_console = (typeof console !== 'undefined');
reagent.debug.tracking = false;
if((typeof reagent !== 'undefined') && (typeof reagent.debug !== 'undefined') && (typeof reagent.debug.warnings !== 'undefined')){
} else {
reagent.debug.warnings = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof reagent !== 'undefined') && (typeof reagent.debug !== 'undefined') && (typeof reagent.debug.track_console !== 'undefined')){
} else {
reagent.debug.track_console = (function (){var o = ({});
(o.warn = (function() { 
var G__21550__delegate = function (args){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagent.debug.warnings,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"warn","warn",-436710552)], null),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,args)], 0));
};
var G__21550 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__21569__i = 0, G__21569__a = new Array(arguments.length -  0);
while (G__21569__i < G__21569__a.length) {G__21569__a[G__21569__i] = arguments[G__21569__i + 0]; ++G__21569__i;}
  args = new cljs.core.IndexedSeq(G__21569__a,0,null);
} 
return G__21550__delegate.call(this,args);};
G__21550.cljs$lang$maxFixedArity = 0;
G__21550.cljs$lang$applyTo = (function (arglist__21570){
var args = cljs.core.seq(arglist__21570);
return G__21550__delegate(args);
});
G__21550.cljs$core$IFn$_invoke$arity$variadic = G__21550__delegate;
return G__21550;
})()
);

(o.error = (function() { 
var G__21572__delegate = function (args){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagent.debug.warnings,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"error","error",-978969032)], null),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,args)], 0));
};
var G__21572 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__21573__i = 0, G__21573__a = new Array(arguments.length -  0);
while (G__21573__i < G__21573__a.length) {G__21573__a[G__21573__i] = arguments[G__21573__i + 0]; ++G__21573__i;}
  args = new cljs.core.IndexedSeq(G__21573__a,0,null);
} 
return G__21572__delegate.call(this,args);};
G__21572.cljs$lang$maxFixedArity = 0;
G__21572.cljs$lang$applyTo = (function (arglist__21574){
var args = cljs.core.seq(arglist__21574);
return G__21572__delegate(args);
});
G__21572.cljs$core$IFn$_invoke$arity$variadic = G__21572__delegate;
return G__21572;
})()
);

return o;
})();
}
reagent.debug.track_warnings = (function reagent$debug$track_warnings(f){
(reagent.debug.tracking = true);

cljs.core.reset_BANG_(reagent.debug.warnings,null);

(f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));

var warns = cljs.core.deref(reagent.debug.warnings);
cljs.core.reset_BANG_(reagent.debug.warnings,null);

(reagent.debug.tracking = false);

return warns;
});

//# sourceMappingURL=reagent.debug.js.map
