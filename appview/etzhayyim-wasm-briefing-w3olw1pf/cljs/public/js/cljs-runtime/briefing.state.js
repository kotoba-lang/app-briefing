goog.provide('briefing.state');
briefing.state.SIGNAL_URL = "wss://briefing-signal.etzhayyim.com";
briefing.state.ice_servers = [({"urls": "stun:stun.l.google.com:19302"}),({"urls": "stun:stun1.l.google.com:19302"}),({"urls": "stun:stun.cloudflare.com:3478"})];
briefing.state.available_project_actors = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:transcriber",new cljs.core.Keyword(null,"role","role",-736691072),"Transcription",new cljs.core.Keyword(null,"description","description",-1428560544),"Speech-to-text via Whisper"], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:translator",new cljs.core.Keyword(null,"role","role",-736691072),"Translation",new cljs.core.Keyword(null,"description","description",-1428560544),"Auto-translate via LLM"], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:recorder",new cljs.core.Keyword(null,"role","role",-736691072),"Recording",new cljs.core.Keyword(null,"description","description",-1428560544),"Audio recording + R2 storage"], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:summarizer",new cljs.core.Keyword(null,"role","role",-736691072),"Summarizer",new cljs.core.Keyword(null,"description","description",-1428560544),"Meeting summary generation"], null)], null);
briefing.state.project_actors = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
briefing.state.my_peer_id = ["peer-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(Math.random().toString((36)).slice((2),(8)))].join('');
briefing.state.room_id = reagent.core.atom.cljs$core$IFn$_invoke$arity$1("");
briefing.state.display_name = reagent.core.atom.cljs$core$IFn$_invoke$arity$1("");
briefing.state.embed_mode = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(false);
briefing.state.status = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"idle","idle",-2007156861));
briefing.state.media_error = reagent.core.atom.cljs$core$IFn$_invoke$arity$1("");
briefing.state.local_stream = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(null);
briefing.state.remote_peers = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
briefing.state.event_log = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
briefing.state.audio_muted = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(false);
briefing.state.video_off = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(false);
briefing.state.is_recording = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(false);
briefing.state.recording_duration = reagent.core.atom.cljs$core$IFn$_invoke$arity$1((0));
briefing.state.recording_status = reagent.core.atom.cljs$core$IFn$_invoke$arity$1("");
briefing.state.transcript = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(null);
briefing.state.convo_id = reagent.core.atom.cljs$core$IFn$_invoke$arity$1("");
briefing.state.local_video_el = reagent.core.atom.cljs$core$IFn$_invoke$arity$1(null);
if((typeof briefing !== 'undefined') && (typeof briefing.state !== 'undefined') && (typeof briefing.state.ws !== 'undefined')){
} else {
briefing.state.ws = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof briefing !== 'undefined') && (typeof briefing.state !== 'undefined') && (typeof briefing.state.peer_connections !== 'undefined')){
} else {
briefing.state.peer_connections = cljs.core.volatile_BANG_(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof briefing !== 'undefined') && (typeof briefing.state !== 'undefined') && (typeof briefing.state.media_recorder !== 'undefined')){
} else {
briefing.state.media_recorder = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof briefing !== 'undefined') && (typeof briefing.state !== 'undefined') && (typeof briefing.state.recording_chunks !== 'undefined')){
} else {
briefing.state.recording_chunks = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
}
if((typeof briefing !== 'undefined') && (typeof briefing.state !== 'undefined') && (typeof briefing.state.recording_timer !== 'undefined')){
} else {
briefing.state.recording_timer = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
briefing.state.log = (function briefing$state$log(msg){
var ts = (new Date()).toLocaleTimeString();
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(briefing.state.event_log,(function (v){
return cljs.core.cons(["[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ts),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg)].join(''),cljs.core.take.cljs$core$IFn$_invoke$arity$2((49),v));
}));
});








briefing.state.set_peer = (function briefing$state$set_peer(peer_id,patch){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(briefing.state.remote_peers,(function (m){
if(cljs.core.contains_QMARK_(m,peer_id)){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(m,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [peer_id], null),cljs.core.merge,patch);
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(m,peer_id,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),"",new cljs.core.Keyword(null,"stream","stream",1534941648),null,new cljs.core.Keyword(null,"state","state",-1988618099),"new"], null),patch], 0)));
}
}));
});
briefing.state.send_signal = (function briefing$state$send_signal(msg){
var temp__5823__auto__ = cljs.core.deref(briefing.state.ws);
if(cljs.core.truth_(temp__5823__auto__)){
var s = temp__5823__auto__;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(WebSocket.OPEN,s.readyState)){
return s.send(JSON.stringify(cljs.core.clj__GT_js(msg)));
} else {
return null;
}
} else {
return null;
}
});
briefing.state.close_peer_connection = (function briefing$state$close_peer_connection(peer_id){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.peer_connections),peer_id);
if(cljs.core.truth_(temp__5823__auto__)){
var pc = temp__5823__auto__;
pc.close();

return briefing.state.peer_connections.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(briefing.state.peer_connections.cljs$core$IDeref$_deref$arity$1(null, ),peer_id));
} else {
return null;
}
});



briefing.state.handle_signal = (function briefing$state$handle_signal(msg){
var raw_type = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(msg);
var type = (((raw_type instanceof cljs.core.Keyword))?raw_type:((typeof raw_type === 'string')?cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(raw_type):null
));
var G__22521 = type;
var G__22521__$1 = (((G__22521 instanceof cljs.core.Keyword))?G__22521.fqn:null);
switch (G__22521__$1) {
case "peers":
briefing.state.log([cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"peers","peers",2005345354).cljs$core$IFn$_invoke$arity$1(msg)))," peer(s) in room"].join(''));

return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p){
var pid_22690 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"peerId","peerId",866217794).cljs$core$IFn$_invoke$arity$1(p));
briefing.state.set_peer(pid_22690,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(p)),new cljs.core.Keyword(null,"stream","stream",1534941648),null,new cljs.core.Keyword(null,"state","state",-1988618099),"connecting"], null));

(briefing.state.create_peer_connection.cljs$core$IFn$_invoke$arity$2 ? briefing.state.create_peer_connection.cljs$core$IFn$_invoke$arity$2(pid_22690,true) : briefing.state.create_peer_connection.call(null, pid_22690,true));

return acc;
}),null,new cljs.core.Keyword(null,"peers","peers",2005345354).cljs$core$IFn$_invoke$arity$1(msg));

break;
case "peer-joined":
briefing.state.log([cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(msg))," joined"].join(''));

return briefing.state.set_peer(cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"peerId","peerId",866217794).cljs$core$IFn$_invoke$arity$1(msg)),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(msg)),new cljs.core.Keyword(null,"stream","stream",1534941648),null,new cljs.core.Keyword(null,"state","state",-1988618099),"new"], null));

break;
case "peer-left":
briefing.state.log([cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"peerId","peerId",866217794).cljs$core$IFn$_invoke$arity$1(msg)))))," left"].join(''));

briefing.state.close_peer_connection(cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"peerId","peerId",866217794).cljs$core$IFn$_invoke$arity$1(msg)));

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(briefing.state.remote_peers,cljs.core.dissoc,cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"peerId","peerId",866217794).cljs$core$IFn$_invoke$arity$1(msg)));

break;
case "offer":
briefing.state.log(["Offer from ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg)))))].join(''));

var G__22528 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg));
var G__22529 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"sdp","sdp",1466074084).cljs$core$IFn$_invoke$arity$1(msg));
return (briefing.state.handle_offer.cljs$core$IFn$_invoke$arity$2 ? briefing.state.handle_offer.cljs$core$IFn$_invoke$arity$2(G__22528,G__22529) : briefing.state.handle_offer.call(null, G__22528,G__22529));

break;
case "answer":
briefing.state.log(["Answer from ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg)))))].join(''));

var G__22533 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg));
var G__22534 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"sdp","sdp",1466074084).cljs$core$IFn$_invoke$arity$1(msg));
return (briefing.state.handle_answer.cljs$core$IFn$_invoke$arity$2 ? briefing.state.handle_answer.cljs$core$IFn$_invoke$arity$2(G__22533,G__22534) : briefing.state.handle_answer.call(null, G__22533,G__22534));

break;
case "ice-candidate":
var G__22537 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg));
var G__22538 = new cljs.core.Keyword(null,"candidate","candidate",-940308314).cljs$core$IFn$_invoke$arity$1(msg);
return (briefing.state.handle_ice_candidate.cljs$core$IFn$_invoke$arity$2 ? briefing.state.handle_ice_candidate.cljs$core$IFn$_invoke$arity$2(G__22537,G__22538) : briefing.state.handle_ice_candidate.call(null, G__22537,G__22538));

break;
default:
return null;

}
});
briefing.state.create_peer_connection = (function briefing$state$create_peer_connection(peer_id,is_initiator){
if(cljs.core.contains_QMARK_(cljs.core.deref(briefing.state.peer_connections),peer_id)){
return null;
} else {
var pc = (new RTCPeerConnection(({"iceServers": briefing.state.ice_servers})));
briefing.state.peer_connections.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(briefing.state.peer_connections.cljs$core$IDeref$_deref$arity$1(null, ),peer_id,pc));

if(cljs.core.truth_(cljs.core.deref(briefing.state.local_stream))){
var seq__22544_22691 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getTracks()));
var chunk__22545_22692 = null;
var count__22546_22693 = (0);
var i__22547_22694 = (0);
while(true){
if((i__22547_22694 < count__22546_22693)){
var track_22695 = chunk__22545_22692.cljs$core$IIndexed$_nth$arity$2(null, i__22547_22694);
pc.addTrack(track_22695,cljs.core.deref(briefing.state.local_stream));


var G__22696 = seq__22544_22691;
var G__22697 = chunk__22545_22692;
var G__22698 = count__22546_22693;
var G__22699 = (i__22547_22694 + (1));
seq__22544_22691 = G__22696;
chunk__22545_22692 = G__22697;
count__22546_22693 = G__22698;
i__22547_22694 = G__22699;
continue;
} else {
var temp__5823__auto___22700 = cljs.core.seq(seq__22544_22691);
if(temp__5823__auto___22700){
var seq__22544_22701__$1 = temp__5823__auto___22700;
if(cljs.core.chunked_seq_QMARK_(seq__22544_22701__$1)){
var c__5525__auto___22702 = cljs.core.chunk_first(seq__22544_22701__$1);
var G__22703 = cljs.core.chunk_rest(seq__22544_22701__$1);
var G__22704 = c__5525__auto___22702;
var G__22705 = cljs.core.count(c__5525__auto___22702);
var G__22706 = (0);
seq__22544_22691 = G__22703;
chunk__22545_22692 = G__22704;
count__22546_22693 = G__22705;
i__22547_22694 = G__22706;
continue;
} else {
var track_22707 = cljs.core.first(seq__22544_22701__$1);
pc.addTrack(track_22707,cljs.core.deref(briefing.state.local_stream));


var G__22708 = cljs.core.next(seq__22544_22701__$1);
var G__22709 = null;
var G__22710 = (0);
var G__22711 = (0);
seq__22544_22691 = G__22708;
chunk__22545_22692 = G__22709;
count__22546_22693 = G__22710;
i__22547_22694 = G__22711;
continue;
}
} else {
}
}
break;
}
} else {
pc.addTransceiver("audio",({"direction": "recvonly"}));

pc.addTransceiver("video",({"direction": "recvonly"}));
}

(pc.onicecandidate = (function (ev){
if(cljs.core.truth_(ev.candidate)){
return briefing.state.send_signal(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"ice-candidate",new cljs.core.Keyword(null,"to","to",192099007),peer_id,new cljs.core.Keyword(null,"candidate","candidate",-940308314),ev.candidate.toJSON()], null));
} else {
return null;
}
}));

(pc.ontrack = (function (ev){
briefing.state.log(["Track: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ev.track.kind)," from ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),peer_id)))].join(''));

return briefing.state.set_peer(peer_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"stream","stream",1534941648),(function (){var or__5002__auto__ = cljs.core.first(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(ev.streams));
if(cljs.core.truth_(or__5002__auto__)){
return or__5002__auto__;
} else {
return (new MediaStream([ev.track]));
}
})(),new cljs.core.Keyword(null,"state","state",-1988618099),"connected"], null));
}));

(pc.oniceconnectionstatechange = (function (){
var st = pc.iceConnectionState;
if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),peer_id))){
briefing.state.set_peer(peer_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"state","state",-1988618099),st], null));
} else {
}

if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["completed",null,"connected",null], null), null),st)){
return briefing.state.log(["Connected to ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),peer_id)))].join(''));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(st,"failed")){
return briefing.state.log(["Connection failed to ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),peer_id)))].join(''));
} else {
return null;
}
}
}));

(pc.onnegotiationneeded = (function (){
if(cljs.core.truth_((function (){var or__5002__auto__ = is_initiator;
if(cljs.core.truth_(or__5002__auto__)){
return or__5002__auto__;
} else {
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("stable",pc.signalingState);
}
})())){
return pc.createOffer().then((function (offer){
return pc.setLocalDescription(offer);
})).then((function (){
return briefing.state.send_signal(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"offer",new cljs.core.Keyword(null,"to","to",192099007),peer_id,new cljs.core.Keyword(null,"sdp","sdp",1466074084),pc.localDescription.sdp], null));
})).catch((function (e){
return console.warn("[rtc] renegotiation error:",e);
}));
} else {
return null;
}
}));

if(cljs.core.truth_(is_initiator)){
return pc.createOffer().then((function (offer){
return pc.setLocalDescription(offer);
})).then((function (){
return briefing.state.send_signal(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"offer",new cljs.core.Keyword(null,"to","to",192099007),peer_id,new cljs.core.Keyword(null,"sdp","sdp",1466074084),pc.localDescription.sdp], null));
})).catch((function (e){
return console.warn("[rtc] initial offer error:",e);
}));
} else {
return null;
}
}
});
briefing.state.handle_offer = (function briefing$state$handle_offer(from,sdp){
if(cljs.core.contains_QMARK_(cljs.core.deref(briefing.state.peer_connections),from)){
} else {
briefing.state.create_peer_connection(from,false);
}

var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.peer_connections),from);
if(cljs.core.truth_(temp__5823__auto__)){
var pc = temp__5823__auto__;
return pc.setRemoteDescription(({"type": "offer", "sdp": sdp})).then((function (){
return pc.createAnswer();
})).then((function (answer){
return pc.setLocalDescription(answer);
})).then((function (){
return briefing.state.send_signal(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"answer",new cljs.core.Keyword(null,"to","to",192099007),from,new cljs.core.Keyword(null,"sdp","sdp",1466074084),pc.localDescription.sdp], null));
})).catch((function (e){
return console.warn("[rtc] answer error:",e);
}));
} else {
return null;
}
});
briefing.state.handle_answer = (function briefing$state$handle_answer(from,sdp){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.peer_connections),from);
if(cljs.core.truth_(temp__5823__auto__)){
var pc = temp__5823__auto__;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("have-local-offer",pc.signalingState)){
return pc.setRemoteDescription(({"type": "answer", "sdp": sdp}));
} else {
return null;
}
} else {
return null;
}
});
briefing.state.handle_ice_candidate = (function briefing$state$handle_ice_candidate(from,candidate){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.peer_connections),from);
if(cljs.core.truth_(temp__5823__auto__)){
var pc = temp__5823__auto__;
if(cljs.core.truth_(candidate)){
return pc.addIceCandidate(cljs.core.clj__GT_js(candidate),(function (){
return null;
}),(function (){
return null;
}));
} else {
return null;
}
} else {
return null;
}
});
briefing.state.try_media = (function briefing$state$try_media(specs,join_after_media_QMARK_){
if(cljs.core.empty_QMARK_(specs)){
var msg = "No camera/mic found on this device.";
cljs.core.reset_BANG_(briefing.state.media_error,msg);

briefing.state.log(["Media: ",msg].join(''));

if(cljs.core.truth_(join_after_media_QMARK_)){
return (briefing.state.connect_signaling.cljs$core$IFn$_invoke$arity$0 ? briefing.state.connect_signaling.cljs$core$IFn$_invoke$arity$0() : briefing.state.connect_signaling.call(null, ));
} else {
return null;
}
} else {
return navigator.mediaDevices.getUserMedia(cljs.core.first(specs)).then((function (stream){
cljs.core.reset_BANG_(briefing.state.local_stream,stream);

cljs.core.reset_BANG_(briefing.state.media_error,"");

var temp__5823__auto___22720 = cljs.core.deref(briefing.state.local_video_el);
if(cljs.core.truth_(temp__5823__auto___22720)){
var el_22721 = temp__5823__auto___22720;
(el_22721.srcObject = stream);
} else {
}

briefing.state.log((function (){var G__22626 = cljs.core.count(specs);
switch (G__22626) {
case (3):
return "Camera + mic ready";

break;
case (2):
return "Mic only (no camera)";

break;
default:
return "Camera only (no mic)";

}
})());

if(cljs.core.truth_(join_after_media_QMARK_)){
return (briefing.state.connect_signaling.cljs$core$IFn$_invoke$arity$0 ? briefing.state.connect_signaling.cljs$core$IFn$_invoke$arity$0() : briefing.state.connect_signaling.call(null, ));
} else {
var seq__22627 = cljs.core.seq(cljs.core.deref(briefing.state.peer_connections));
var chunk__22628 = null;
var count__22629 = (0);
var i__22630 = (0);
while(true){
if((i__22630 < count__22629)){
var vec__22645 = chunk__22628.cljs$core$IIndexed$_nth$arity$2(null, i__22630);
var peer_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22645,(0),null);
var pc = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22645,(1),null);
var seq__22648_22727 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(stream.getTracks()));
var chunk__22649_22728 = null;
var count__22650_22729 = (0);
var i__22651_22730 = (0);
while(true){
if((i__22651_22730 < count__22650_22729)){
var track_22731 = chunk__22649_22728.cljs$core$IIndexed$_nth$arity$2(null, i__22651_22730);
pc.addTrack(track_22731,stream);


var G__22732 = seq__22648_22727;
var G__22733 = chunk__22649_22728;
var G__22734 = count__22650_22729;
var G__22735 = (i__22651_22730 + (1));
seq__22648_22727 = G__22732;
chunk__22649_22728 = G__22733;
count__22650_22729 = G__22734;
i__22651_22730 = G__22735;
continue;
} else {
var temp__5823__auto___22736 = cljs.core.seq(seq__22648_22727);
if(temp__5823__auto___22736){
var seq__22648_22737__$1 = temp__5823__auto___22736;
if(cljs.core.chunked_seq_QMARK_(seq__22648_22737__$1)){
var c__5525__auto___22738 = cljs.core.chunk_first(seq__22648_22737__$1);
var G__22739 = cljs.core.chunk_rest(seq__22648_22737__$1);
var G__22740 = c__5525__auto___22738;
var G__22741 = cljs.core.count(c__5525__auto___22738);
var G__22742 = (0);
seq__22648_22727 = G__22739;
chunk__22649_22728 = G__22740;
count__22650_22729 = G__22741;
i__22651_22730 = G__22742;
continue;
} else {
var track_22743 = cljs.core.first(seq__22648_22737__$1);
pc.addTrack(track_22743,stream);


var G__22744 = cljs.core.next(seq__22648_22737__$1);
var G__22745 = null;
var G__22746 = (0);
var G__22747 = (0);
seq__22648_22727 = G__22744;
chunk__22649_22728 = G__22745;
count__22650_22729 = G__22746;
i__22651_22730 = G__22747;
continue;
}
} else {
}
}
break;
}

briefing.state.log(["Added local media to ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(peer_id)].join(''));


var G__22748 = seq__22627;
var G__22749 = chunk__22628;
var G__22750 = count__22629;
var G__22751 = (i__22630 + (1));
seq__22627 = G__22748;
chunk__22628 = G__22749;
count__22629 = G__22750;
i__22630 = G__22751;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__22627);
if(temp__5823__auto__){
var seq__22627__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__22627__$1)){
var c__5525__auto__ = cljs.core.chunk_first(seq__22627__$1);
var G__22752 = cljs.core.chunk_rest(seq__22627__$1);
var G__22753 = c__5525__auto__;
var G__22754 = cljs.core.count(c__5525__auto__);
var G__22755 = (0);
seq__22627 = G__22752;
chunk__22628 = G__22753;
count__22629 = G__22754;
i__22630 = G__22755;
continue;
} else {
var vec__22653 = cljs.core.first(seq__22627__$1);
var peer_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22653,(0),null);
var pc = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22653,(1),null);
var seq__22656_22758 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(stream.getTracks()));
var chunk__22657_22759 = null;
var count__22658_22760 = (0);
var i__22659_22761 = (0);
while(true){
if((i__22659_22761 < count__22658_22760)){
var track_22762 = chunk__22657_22759.cljs$core$IIndexed$_nth$arity$2(null, i__22659_22761);
pc.addTrack(track_22762,stream);


var G__22763 = seq__22656_22758;
var G__22764 = chunk__22657_22759;
var G__22765 = count__22658_22760;
var G__22766 = (i__22659_22761 + (1));
seq__22656_22758 = G__22763;
chunk__22657_22759 = G__22764;
count__22658_22760 = G__22765;
i__22659_22761 = G__22766;
continue;
} else {
var temp__5823__auto___22767__$1 = cljs.core.seq(seq__22656_22758);
if(temp__5823__auto___22767__$1){
var seq__22656_22770__$1 = temp__5823__auto___22767__$1;
if(cljs.core.chunked_seq_QMARK_(seq__22656_22770__$1)){
var c__5525__auto___22771 = cljs.core.chunk_first(seq__22656_22770__$1);
var G__22772 = cljs.core.chunk_rest(seq__22656_22770__$1);
var G__22773 = c__5525__auto___22771;
var G__22774 = cljs.core.count(c__5525__auto___22771);
var G__22775 = (0);
seq__22656_22758 = G__22772;
chunk__22657_22759 = G__22773;
count__22658_22760 = G__22774;
i__22659_22761 = G__22775;
continue;
} else {
var track_22776 = cljs.core.first(seq__22656_22770__$1);
pc.addTrack(track_22776,stream);


var G__22777 = cljs.core.next(seq__22656_22770__$1);
var G__22778 = null;
var G__22779 = (0);
var G__22780 = (0);
seq__22656_22758 = G__22777;
chunk__22657_22759 = G__22778;
count__22658_22760 = G__22779;
i__22659_22761 = G__22780;
continue;
}
} else {
}
}
break;
}

briefing.state.log(["Added local media to ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(peer_id)].join(''));


var G__22783 = cljs.core.next(seq__22627__$1);
var G__22784 = null;
var G__22785 = (0);
var G__22786 = (0);
seq__22627 = G__22783;
chunk__22628 = G__22784;
count__22629 = G__22785;
i__22630 = G__22786;
continue;
}
} else {
return null;
}
}
break;
}
}
})).catch((function (_){
var G__22660 = cljs.core.rest(specs);
var G__22661 = join_after_media_QMARK_;
return (briefing.state.try_media.cljs$core$IFn$_invoke$arity$2 ? briefing.state.try_media.cljs$core$IFn$_invoke$arity$2(G__22660,G__22661) : briefing.state.try_media.call(null, G__22660,G__22661));
}));
}
});
briefing.state.request_media = (function briefing$state$request_media(){
if(cljs.core.empty_QMARK_(clojure.string.trim(cljs.core.deref(briefing.state.room_id)))){
cljs.core.reset_BANG_(briefing.state.room_id,["room-",cljs.core.str.cljs$core$IFn$_invoke$arity$1((new Date()).getTime())].join(''));
} else {
}

cljs.core.reset_BANG_(briefing.state.status,new cljs.core.Keyword(null,"media","media",-1066138403));

cljs.core.reset_BANG_(briefing.state.media_error,"");

return briefing.state.try_media(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [({"audio": true, "video": true}),({"audio": true, "video": false}),({"audio": false, "video": true})], null),true);
});
briefing.state.retry_media = (function briefing$state$retry_media(){
cljs.core.reset_BANG_(briefing.state.media_error,"");

return briefing.state.try_media(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [({"audio": true, "video": true}),({"audio": true, "video": false}),({"audio": false, "video": true})], null),false);
});
briefing.state.connect_signaling = (function briefing$state$connect_signaling(){
var entered_name = clojure.string.trim(cljs.core.deref(briefing.state.display_name));
var name = ((clojure.string.blank_QMARK_(entered_name))?briefing.state.my_peer_id:entered_name);
var url = [briefing.state.SIGNAL_URL,"/rooms/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(cljs.core.deref(briefing.state.room_id))),"/ws"].join('');
briefing.state.log(["Connecting to room: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.room_id))].join(''));

cljs.core.reset_BANG_(briefing.state.status,new cljs.core.Keyword(null,"joining","joining",-1465537833));

var s = (new WebSocket(url));
cljs.core.reset_BANG_(briefing.state.ws,s);

(s.onopen = (function (){
briefing.state.log("Connected");

s.send(JSON.stringify(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"join",new cljs.core.Keyword(null,"peerId","peerId",866217794),briefing.state.my_peer_id,new cljs.core.Keyword(null,"displayName","displayName",-809144601),name], null))));

cljs.core.reset_BANG_(briefing.state.status,new cljs.core.Keyword(null,"joined","joined",-231861661));

return (briefing.state.create_project.cljs$core$IFn$_invoke$arity$0 ? briefing.state.create_project.cljs$core$IFn$_invoke$arity$0() : briefing.state.create_project.call(null, ));
}));

(s.onmessage = (function (ev){
try{return briefing.state.handle_signal(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(ev.data),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
}catch (e22662){var e = e22662;
return console.warn("[signal]",e);
}}));

(s.onclose = (function (){
briefing.state.log("Disconnected");

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"joined","joined",-231861661),cljs.core.deref(briefing.state.status))){
return (briefing.state.leave_room.cljs$core$IFn$_invoke$arity$0 ? briefing.state.leave_room.cljs$core$IFn$_invoke$arity$0() : briefing.state.leave_room.call(null, ));
} else {
return null;
}
}));

return (s.onerror = (function (){
return briefing.state.log("Connection error");
}));
});
briefing.state.create_project = (function briefing$state$create_project(){
if(clojure.string.blank_QMARK_(cljs.core.deref(briefing.state.convo_id))){
return fetch("/xrpc/com.etzhayyim.apps.briefing.createRoom",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null),new cljs.core.Keyword(null,"body","body",-2049205669),JSON.stringify(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"roomId","roomId",1424562539),cljs.core.deref(briefing.state.room_id),new cljs.core.Keyword(null,"name","name",1843675177),["Briefing: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.room_id))].join(''),new cljs.core.Keyword(null,"actors","actors",-1845636398),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"did","did",593382517),briefing.state.available_project_actors)], null)))], null))).then((function (response){
if(cljs.core.truth_(response.ok)){
} else {
throw (new Error(["createRoom HTTP ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(response.status)].join('')));
}

return response.json();
})).then((function (body){
var result = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(result))){
} else {
throw (new Error(["createRoom refused: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result))].join('')));
}

cljs.core.reset_BANG_(briefing.state.convo_id,cljs.core.deref(briefing.state.room_id));

cljs.core.reset_BANG_(briefing.state.project_actors,briefing.state.available_project_actors);

briefing.state.log(["Project: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.room_id))," (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(briefing.state.available_project_actors))," actors)"].join(''));

var seq__22666 = cljs.core.seq(briefing.state.available_project_actors);
var chunk__22667 = null;
var count__22668 = (0);
var i__22669 = (0);
while(true){
if((i__22669 < count__22668)){
var a = chunk__22667.cljs$core$IIndexed$_nth$arity$2(null, i__22669);
briefing.state.log(["  Actor: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(a))," \u2192 ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(a))].join(''));


var G__22819 = seq__22666;
var G__22820 = chunk__22667;
var G__22821 = count__22668;
var G__22822 = (i__22669 + (1));
seq__22666 = G__22819;
chunk__22667 = G__22820;
count__22668 = G__22821;
i__22669 = G__22822;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__22666);
if(temp__5823__auto__){
var seq__22666__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__22666__$1)){
var c__5525__auto__ = cljs.core.chunk_first(seq__22666__$1);
var G__22824 = cljs.core.chunk_rest(seq__22666__$1);
var G__22825 = c__5525__auto__;
var G__22826 = cljs.core.count(c__5525__auto__);
var G__22827 = (0);
seq__22666 = G__22824;
chunk__22667 = G__22825;
count__22668 = G__22826;
i__22669 = G__22827;
continue;
} else {
var a = cljs.core.first(seq__22666__$1);
briefing.state.log(["  Actor: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(a))," \u2192 ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(a))].join(''));


var G__22828 = cljs.core.next(seq__22666__$1);
var G__22829 = null;
var G__22830 = (0);
var G__22831 = (0);
seq__22666 = G__22828;
chunk__22667 = G__22829;
count__22668 = G__22830;
i__22669 = G__22831;
continue;
}
} else {
return null;
}
}
break;
}
})).catch((function (e){
return briefing.state.log(["Project: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e.message)].join(''));
}));
} else {
return null;
}
});
briefing.state.leave_room = (function briefing$state$leave_room(){
var temp__5823__auto___22832 = cljs.core.deref(briefing.state.ws);
if(cljs.core.truth_(temp__5823__auto___22832)){
var s_22833 = temp__5823__auto___22832;
s_22833.close();
} else {
}

cljs.core.reset_BANG_(briefing.state.ws,null);

var seq__22673_22834 = cljs.core.seq(cljs.core.keys(cljs.core.deref(briefing.state.peer_connections)));
var chunk__22674_22835 = null;
var count__22675_22836 = (0);
var i__22676_22837 = (0);
while(true){
if((i__22676_22837 < count__22675_22836)){
var id_22838 = chunk__22674_22835.cljs$core$IIndexed$_nth$arity$2(null, i__22676_22837);
briefing.state.close_peer_connection(id_22838);


var G__22839 = seq__22673_22834;
var G__22840 = chunk__22674_22835;
var G__22841 = count__22675_22836;
var G__22842 = (i__22676_22837 + (1));
seq__22673_22834 = G__22839;
chunk__22674_22835 = G__22840;
count__22675_22836 = G__22841;
i__22676_22837 = G__22842;
continue;
} else {
var temp__5823__auto___22843 = cljs.core.seq(seq__22673_22834);
if(temp__5823__auto___22843){
var seq__22673_22844__$1 = temp__5823__auto___22843;
if(cljs.core.chunked_seq_QMARK_(seq__22673_22844__$1)){
var c__5525__auto___22845 = cljs.core.chunk_first(seq__22673_22844__$1);
var G__22846 = cljs.core.chunk_rest(seq__22673_22844__$1);
var G__22847 = c__5525__auto___22845;
var G__22848 = cljs.core.count(c__5525__auto___22845);
var G__22849 = (0);
seq__22673_22834 = G__22846;
chunk__22674_22835 = G__22847;
count__22675_22836 = G__22848;
i__22676_22837 = G__22849;
continue;
} else {
var id_22850 = cljs.core.first(seq__22673_22844__$1);
briefing.state.close_peer_connection(id_22850);


var G__22851 = cljs.core.next(seq__22673_22844__$1);
var G__22852 = null;
var G__22853 = (0);
var G__22854 = (0);
seq__22673_22834 = G__22851;
chunk__22674_22835 = G__22852;
count__22675_22836 = G__22853;
i__22676_22837 = G__22854;
continue;
}
} else {
}
}
break;
}

cljs.core.reset_BANG_(briefing.state.remote_peers,cljs.core.PersistentArrayMap.EMPTY);

if(cljs.core.truth_(cljs.core.deref(briefing.state.local_stream))){
var seq__22677_22855 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getTracks()));
var chunk__22678_22856 = null;
var count__22679_22857 = (0);
var i__22680_22858 = (0);
while(true){
if((i__22680_22858 < count__22679_22857)){
var t_22859 = chunk__22678_22856.cljs$core$IIndexed$_nth$arity$2(null, i__22680_22858);
t_22859.stop();


var G__22860 = seq__22677_22855;
var G__22861 = chunk__22678_22856;
var G__22862 = count__22679_22857;
var G__22863 = (i__22680_22858 + (1));
seq__22677_22855 = G__22860;
chunk__22678_22856 = G__22861;
count__22679_22857 = G__22862;
i__22680_22858 = G__22863;
continue;
} else {
var temp__5823__auto___22864 = cljs.core.seq(seq__22677_22855);
if(temp__5823__auto___22864){
var seq__22677_22865__$1 = temp__5823__auto___22864;
if(cljs.core.chunked_seq_QMARK_(seq__22677_22865__$1)){
var c__5525__auto___22866 = cljs.core.chunk_first(seq__22677_22865__$1);
var G__22867 = cljs.core.chunk_rest(seq__22677_22865__$1);
var G__22868 = c__5525__auto___22866;
var G__22869 = cljs.core.count(c__5525__auto___22866);
var G__22870 = (0);
seq__22677_22855 = G__22867;
chunk__22678_22856 = G__22868;
count__22679_22857 = G__22869;
i__22680_22858 = G__22870;
continue;
} else {
var t_22871 = cljs.core.first(seq__22677_22865__$1);
t_22871.stop();


var G__22872 = cljs.core.next(seq__22677_22865__$1);
var G__22873 = null;
var G__22874 = (0);
var G__22875 = (0);
seq__22677_22855 = G__22872;
chunk__22678_22856 = G__22873;
count__22679_22857 = G__22874;
i__22680_22858 = G__22875;
continue;
}
} else {
}
}
break;
}

cljs.core.reset_BANG_(briefing.state.local_stream,null);
} else {
}

if(cljs.core.truth_(cljs.core.deref(briefing.state.is_recording))){
(briefing.state.stop_recording.cljs$core$IFn$_invoke$arity$0 ? briefing.state.stop_recording.cljs$core$IFn$_invoke$arity$0() : briefing.state.stop_recording.call(null, ));
} else {
}

cljs.core.reset_BANG_(briefing.state.status,new cljs.core.Keyword(null,"idle","idle",-2007156861));

cljs.core.reset_BANG_(briefing.state.media_error,"");

cljs.core.reset_BANG_(briefing.state.recording_status,"");

cljs.core.reset_BANG_(briefing.state.transcript,null);

cljs.core.reset_BANG_(briefing.state.convo_id,"");

return cljs.core.reset_BANG_(briefing.state.project_actors,cljs.core.PersistentVector.EMPTY);
});
briefing.state.toggle_mute = (function briefing$state$toggle_mute(){
if(cljs.core.truth_(cljs.core.deref(briefing.state.local_stream))){
var temp__5823__auto__ = cljs.core.first(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getAudioTracks()));
if(cljs.core.truth_(temp__5823__auto__)){
var t = temp__5823__auto__;
(t.enabled = cljs.core.not(t.enabled));

return cljs.core.reset_BANG_(briefing.state.audio_muted,cljs.core.not(t.enabled));
} else {
return null;
}
} else {
return null;
}
});
briefing.state.toggle_video = (function briefing$state$toggle_video(){
if(cljs.core.truth_(cljs.core.deref(briefing.state.local_stream))){
var temp__5823__auto__ = cljs.core.first(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getVideoTracks()));
if(cljs.core.truth_(temp__5823__auto__)){
var t = temp__5823__auto__;
(t.enabled = cljs.core.not(t.enabled));

return cljs.core.reset_BANG_(briefing.state.video_off,cljs.core.not(t.enabled));
} else {
return null;
}
} else {
return null;
}
});
briefing.state.toggle_recording = (function briefing$state$toggle_recording(){
if(cljs.core.truth_(cljs.core.deref(briefing.state.is_recording))){
return (briefing.state.stop_recording.cljs$core$IFn$_invoke$arity$0 ? briefing.state.stop_recording.cljs$core$IFn$_invoke$arity$0() : briefing.state.stop_recording.call(null, ));
} else {
return briefing.state.log("Recording is disabled until every participant can explicitly consent and revoke consent.");
}
});
briefing.state.stop_recording = (function briefing$state$stop_recording(){
var temp__5823__auto___22879 = cljs.core.deref(briefing.state.media_recorder);
if(cljs.core.truth_(temp__5823__auto___22879)){
var mr_22880 = temp__5823__auto___22879;
(mr_22880.ondataavailable = null);

(mr_22880.onstop = null);

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("recording",mr_22880.state)){
mr_22880.stop();
} else {
}
} else {
}

cljs.core.reset_BANG_(briefing.state.media_recorder,null);

cljs.core.reset_BANG_(briefing.state.recording_chunks,cljs.core.PersistentVector.EMPTY);

if(cljs.core.truth_(cljs.core.deref(briefing.state.recording_timer))){
clearInterval(cljs.core.deref(briefing.state.recording_timer));

cljs.core.reset_BANG_(briefing.state.recording_timer,null);
} else {
}

cljs.core.reset_BANG_(briefing.state.is_recording,false);

cljs.core.reset_BANG_(briefing.state.recording_status,"");

return briefing.state.log("Recording discarded; this client has no unanimous-consent flow");
});

//# sourceMappingURL=briefing.state.js.map
