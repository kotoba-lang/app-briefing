goog.provide('briefing.state');
briefing.state.SIGNAL_URL = "wss://briefing-signal.etzhayyim.com";
briefing.state.SIGNAL_HTTP = "https://briefing-signal.etzhayyim.com";
briefing.state.ice_servers = [({"urls": "stun:stun.l.google.com:19302"}),({"urls": "stun:stun1.l.google.com:19302"}),({"urls": "stun:stun.cloudflare.com:3478"})];
briefing.state.project_actors = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:transcriber",new cljs.core.Keyword(null,"role","role",-736691072),"Transcription",new cljs.core.Keyword(null,"description","description",-1428560544),"Speech-to-text via Whisper"], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:translator",new cljs.core.Keyword(null,"role","role",-736691072),"Translation",new cljs.core.Keyword(null,"description","description",-1428560544),"Auto-translate via LLM"], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:recorder",new cljs.core.Keyword(null,"role","role",-736691072),"Recording",new cljs.core.Keyword(null,"description","description",-1428560544),"Audio recording + R2 storage"], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"did","did",593382517),"did:web:briefing.etzhayyim.com:actor:summarizer",new cljs.core.Keyword(null,"role","role",-736691072),"Summarizer",new cljs.core.Keyword(null,"description","description",-1428560544),"Meeting summary generation"], null)], null);
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
var G__20120 = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(msg);
var G__20120__$1 = (((G__20120 instanceof cljs.core.Keyword))?G__20120.fqn:null);
switch (G__20120__$1) {
case "peers":
briefing.state.log([cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"peers","peers",2005345354).cljs$core$IFn$_invoke$arity$1(msg)))," peer(s) in room"].join(''));

return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p){
var pid_20165 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"peerId","peerId",866217794).cljs$core$IFn$_invoke$arity$1(p));
briefing.state.set_peer(pid_20165,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(p)),new cljs.core.Keyword(null,"stream","stream",1534941648),null,new cljs.core.Keyword(null,"state","state",-1988618099),"connecting"], null));

(briefing.state.create_peer_connection.cljs$core$IFn$_invoke$arity$2 ? briefing.state.create_peer_connection.cljs$core$IFn$_invoke$arity$2(pid_20165,true) : briefing.state.create_peer_connection.call(null, pid_20165,true));

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

var G__20121 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg));
var G__20122 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"sdp","sdp",1466074084).cljs$core$IFn$_invoke$arity$1(msg));
return (briefing.state.handle_offer.cljs$core$IFn$_invoke$arity$2 ? briefing.state.handle_offer.cljs$core$IFn$_invoke$arity$2(G__20121,G__20122) : briefing.state.handle_offer.call(null, G__20121,G__20122));

break;
case "answer":
briefing.state.log(["Answer from ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.remote_peers),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg)))))].join(''));

var G__20123 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg));
var G__20124 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"sdp","sdp",1466074084).cljs$core$IFn$_invoke$arity$1(msg));
return (briefing.state.handle_answer.cljs$core$IFn$_invoke$arity$2 ? briefing.state.handle_answer.cljs$core$IFn$_invoke$arity$2(G__20123,G__20124) : briefing.state.handle_answer.call(null, G__20123,G__20124));

break;
case "ice-candidate":
var G__20125 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"from","from",1815293044).cljs$core$IFn$_invoke$arity$1(msg));
var G__20126 = new cljs.core.Keyword(null,"candidate","candidate",-940308314).cljs$core$IFn$_invoke$arity$1(msg);
return (briefing.state.handle_ice_candidate.cljs$core$IFn$_invoke$arity$2 ? briefing.state.handle_ice_candidate.cljs$core$IFn$_invoke$arity$2(G__20125,G__20126) : briefing.state.handle_ice_candidate.call(null, G__20125,G__20126));

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
var seq__20127_20166 = cljs.core.seq(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getTracks()));
var chunk__20128_20167 = null;
var count__20129_20168 = (0);
var i__20130_20169 = (0);
while(true){
if((i__20130_20169 < count__20129_20168)){
var track_20170 = chunk__20128_20167.cljs$core$IIndexed$_nth$arity$2(null, i__20130_20169);
pc.addTrack(track_20170,cljs.core.deref(briefing.state.local_stream));


var G__20171 = seq__20127_20166;
var G__20172 = chunk__20128_20167;
var G__20173 = count__20129_20168;
var G__20174 = (i__20130_20169 + (1));
seq__20127_20166 = G__20171;
chunk__20128_20167 = G__20172;
count__20129_20168 = G__20173;
i__20130_20169 = G__20174;
continue;
} else {
var temp__5823__auto___20175 = cljs.core.seq(seq__20127_20166);
if(temp__5823__auto___20175){
var seq__20127_20176__$1 = temp__5823__auto___20175;
if(cljs.core.chunked_seq_QMARK_(seq__20127_20176__$1)){
var c__5525__auto___20177 = cljs.core.chunk_first(seq__20127_20176__$1);
var G__20178 = cljs.core.chunk_rest(seq__20127_20176__$1);
var G__20179 = c__5525__auto___20177;
var G__20180 = cljs.core.count(c__5525__auto___20177);
var G__20181 = (0);
seq__20127_20166 = G__20178;
chunk__20128_20167 = G__20179;
count__20129_20168 = G__20180;
i__20130_20169 = G__20181;
continue;
} else {
var track_20182 = cljs.core.first(seq__20127_20176__$1);
pc.addTrack(track_20182,cljs.core.deref(briefing.state.local_stream));


var G__20183 = cljs.core.next(seq__20127_20176__$1);
var G__20184 = null;
var G__20185 = (0);
var G__20186 = (0);
seq__20127_20166 = G__20183;
chunk__20128_20167 = G__20184;
count__20129_20168 = G__20185;
i__20130_20169 = G__20186;
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

return briefing.state.set_peer(peer_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"stream","stream",1534941648),(function (){var or__5002__auto__ = cljs.core.first(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(ev.streams));
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
pc.setLocalDescription(offer);

return briefing.state.send_signal(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"offer",new cljs.core.Keyword(null,"to","to",192099007),peer_id,new cljs.core.Keyword(null,"sdp","sdp",1466074084),offer.sdp], null));
})).catch((function (e){
return console.warn("[rtc] renegotiation error:",e);
}));
} else {
return null;
}
}));

if(cljs.core.truth_(is_initiator)){
return pc.createOffer().then((function (offer){
pc.setLocalDescription(offer);

return briefing.state.send_signal(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"offer",new cljs.core.Keyword(null,"to","to",192099007),peer_id,new cljs.core.Keyword(null,"sdp","sdp",1466074084),offer.sdp], null));
}));
} else {
return null;
}
}
});
briefing.state.handle_offer = (function briefing$state$handle_offer(from,sdp){
return Promise.resolve(((cljs.core.contains_QMARK_(cljs.core.deref(briefing.state.peer_connections),from))?null:briefing.state.create_peer_connection(from,false))).then((function (){
var pc = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(briefing.state.peer_connections),from);
pc.setRemoteDescription(({"type": "offer", "sdp": sdp}));

return pc.createAnswer().then((function (answer){
pc.setLocalDescription(answer);

return briefing.state.send_signal(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"answer",new cljs.core.Keyword(null,"to","to",192099007),from,new cljs.core.Keyword(null,"sdp","sdp",1466074084),answer.sdp], null));
}));
}));
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
briefing.state.try_media = (function briefing$state$try_media(specs){
if(cljs.core.empty_QMARK_(specs)){
var msg = "No camera/mic found on this device.";
cljs.core.reset_BANG_(briefing.state.media_error,msg);

return briefing.state.log(["Media: ",msg].join(''));
} else {
return navigator.mediaDevices.getUserMedia(cljs.core.first(specs)).then((function (stream){
cljs.core.reset_BANG_(briefing.state.local_stream,stream);

briefing.state.log((function (){var G__20131 = cljs.core.count(specs);
switch (G__20131) {
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

return (briefing.state.connect_signaling.cljs$core$IFn$_invoke$arity$0 ? briefing.state.connect_signaling.cljs$core$IFn$_invoke$arity$0() : briefing.state.connect_signaling.call(null, ));
})).catch((function (_){
var G__20132 = cljs.core.rest(specs);
return (briefing.state.try_media.cljs$core$IFn$_invoke$arity$1 ? briefing.state.try_media.cljs$core$IFn$_invoke$arity$1(G__20132) : briefing.state.try_media.call(null, G__20132));
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

return briefing.state.try_media(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [({"audio": true, "video": true}),({"audio": true, "video": false}),({"audio": false, "video": true})], null));
});
briefing.state.retry_media = (function briefing$state$retry_media(){
cljs.core.reset_BANG_(briefing.state.media_error,"");

cljs.core.reset_BANG_(briefing.state.status,new cljs.core.Keyword(null,"media","media",-1066138403));

return briefing.state.try_media(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [({"audio": true, "video": true}),({"audio": true, "video": false}),({"audio": false, "video": true})], null));
});
briefing.state.connect_signaling = (function briefing$state$connect_signaling(){
var name = (function (){var or__5002__auto__ = clojure.string.trim(cljs.core.deref(briefing.state.display_name));
if(cljs.core.truth_(or__5002__auto__)){
return or__5002__auto__;
} else {
return briefing.state.my_peer_id;
}
})();
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
}catch (e20133){var e = e20133;
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
if(cljs.core.truth_(cljs.core.deref(briefing.state.convo_id))){
return null;
} else {
return fetch("/xrpc/com.etzhayyim.apps.briefing.createRoom",cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null),new cljs.core.Keyword(null,"body","body",-2049205669),JSON.stringify(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"roomId","roomId",1424562539),cljs.core.deref(briefing.state.room_id),new cljs.core.Keyword(null,"name","name",1843675177),["Briefing: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.room_id))].join(''),new cljs.core.Keyword(null,"actors","actors",-1845636398),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"did","did",593382517),briefing.state.project_actors)], null)))], null))).then((function (_){
cljs.core.reset_BANG_(briefing.state.convo_id,cljs.core.deref(briefing.state.room_id));

briefing.state.log(["Project: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.room_id))," (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(briefing.state.project_actors))," actors)"].join(''));

var seq__20134 = cljs.core.seq(briefing.state.project_actors);
var chunk__20135 = null;
var count__20136 = (0);
var i__20137 = (0);
while(true){
if((i__20137 < count__20136)){
var a = chunk__20135.cljs$core$IIndexed$_nth$arity$2(null, i__20137);
briefing.state.log(["  Actor: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(a))," \u2192 ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(a))].join(''));


var G__20192 = seq__20134;
var G__20193 = chunk__20135;
var G__20194 = count__20136;
var G__20195 = (i__20137 + (1));
seq__20134 = G__20192;
chunk__20135 = G__20193;
count__20136 = G__20194;
i__20137 = G__20195;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__20134);
if(temp__5823__auto__){
var seq__20134__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__20134__$1)){
var c__5525__auto__ = cljs.core.chunk_first(seq__20134__$1);
var G__20196 = cljs.core.chunk_rest(seq__20134__$1);
var G__20197 = c__5525__auto__;
var G__20198 = cljs.core.count(c__5525__auto__);
var G__20199 = (0);
seq__20134 = G__20196;
chunk__20135 = G__20197;
count__20136 = G__20198;
i__20137 = G__20199;
continue;
} else {
var a = cljs.core.first(seq__20134__$1);
briefing.state.log(["  Actor: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(a))," \u2192 ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"did","did",593382517).cljs$core$IFn$_invoke$arity$1(a))].join(''));


var G__20200 = cljs.core.next(seq__20134__$1);
var G__20201 = null;
var G__20202 = (0);
var G__20203 = (0);
seq__20134 = G__20200;
chunk__20135 = G__20201;
count__20136 = G__20202;
i__20137 = G__20203;
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
}
});
briefing.state.leave_room = (function briefing$state$leave_room(){
var temp__5823__auto___20204 = cljs.core.deref(briefing.state.ws);
if(cljs.core.truth_(temp__5823__auto___20204)){
var s_20205 = temp__5823__auto___20204;
s_20205.close();
} else {
}

cljs.core.reset_BANG_(briefing.state.ws,null);

var seq__20138_20206 = cljs.core.seq(cljs.core.keys(cljs.core.deref(briefing.state.peer_connections)));
var chunk__20139_20207 = null;
var count__20140_20208 = (0);
var i__20141_20209 = (0);
while(true){
if((i__20141_20209 < count__20140_20208)){
var id_20210 = chunk__20139_20207.cljs$core$IIndexed$_nth$arity$2(null, i__20141_20209);
briefing.state.close_peer_connection(id_20210);


var G__20211 = seq__20138_20206;
var G__20212 = chunk__20139_20207;
var G__20213 = count__20140_20208;
var G__20214 = (i__20141_20209 + (1));
seq__20138_20206 = G__20211;
chunk__20139_20207 = G__20212;
count__20140_20208 = G__20213;
i__20141_20209 = G__20214;
continue;
} else {
var temp__5823__auto___20215 = cljs.core.seq(seq__20138_20206);
if(temp__5823__auto___20215){
var seq__20138_20216__$1 = temp__5823__auto___20215;
if(cljs.core.chunked_seq_QMARK_(seq__20138_20216__$1)){
var c__5525__auto___20217 = cljs.core.chunk_first(seq__20138_20216__$1);
var G__20218 = cljs.core.chunk_rest(seq__20138_20216__$1);
var G__20219 = c__5525__auto___20217;
var G__20220 = cljs.core.count(c__5525__auto___20217);
var G__20221 = (0);
seq__20138_20206 = G__20218;
chunk__20139_20207 = G__20219;
count__20140_20208 = G__20220;
i__20141_20209 = G__20221;
continue;
} else {
var id_20222 = cljs.core.first(seq__20138_20216__$1);
briefing.state.close_peer_connection(id_20222);


var G__20223 = cljs.core.next(seq__20138_20216__$1);
var G__20224 = null;
var G__20225 = (0);
var G__20226 = (0);
seq__20138_20206 = G__20223;
chunk__20139_20207 = G__20224;
count__20140_20208 = G__20225;
i__20141_20209 = G__20226;
continue;
}
} else {
}
}
break;
}

cljs.core.reset_BANG_(briefing.state.remote_peers,cljs.core.PersistentArrayMap.EMPTY);

if(cljs.core.truth_(cljs.core.deref(briefing.state.local_stream))){
var seq__20142_20227 = cljs.core.seq(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getTracks()));
var chunk__20143_20228 = null;
var count__20144_20229 = (0);
var i__20145_20230 = (0);
while(true){
if((i__20145_20230 < count__20144_20229)){
var t_20231 = chunk__20143_20228.cljs$core$IIndexed$_nth$arity$2(null, i__20145_20230);
t_20231.stop();


var G__20232 = seq__20142_20227;
var G__20233 = chunk__20143_20228;
var G__20234 = count__20144_20229;
var G__20235 = (i__20145_20230 + (1));
seq__20142_20227 = G__20232;
chunk__20143_20228 = G__20233;
count__20144_20229 = G__20234;
i__20145_20230 = G__20235;
continue;
} else {
var temp__5823__auto___20236 = cljs.core.seq(seq__20142_20227);
if(temp__5823__auto___20236){
var seq__20142_20237__$1 = temp__5823__auto___20236;
if(cljs.core.chunked_seq_QMARK_(seq__20142_20237__$1)){
var c__5525__auto___20238 = cljs.core.chunk_first(seq__20142_20237__$1);
var G__20239 = cljs.core.chunk_rest(seq__20142_20237__$1);
var G__20240 = c__5525__auto___20238;
var G__20241 = cljs.core.count(c__5525__auto___20238);
var G__20242 = (0);
seq__20142_20227 = G__20239;
chunk__20143_20228 = G__20240;
count__20144_20229 = G__20241;
i__20145_20230 = G__20242;
continue;
} else {
var t_20243 = cljs.core.first(seq__20142_20237__$1);
t_20243.stop();


var G__20244 = cljs.core.next(seq__20142_20237__$1);
var G__20245 = null;
var G__20246 = (0);
var G__20247 = (0);
seq__20142_20227 = G__20244;
chunk__20143_20228 = G__20245;
count__20144_20229 = G__20246;
i__20145_20230 = G__20247;
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

return cljs.core.reset_BANG_(briefing.state.convo_id,"");
});
briefing.state.toggle_mute = (function briefing$state$toggle_mute(){
if(cljs.core.truth_(cljs.core.deref(briefing.state.local_stream))){
var temp__5823__auto__ = cljs.core.first(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getAudioTracks()));
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
var temp__5823__auto__ = cljs.core.first(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getVideoTracks()));
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
return (briefing.state.start_recording.cljs$core$IFn$_invoke$arity$0 ? briefing.state.start_recording.cljs$core$IFn$_invoke$arity$0() : briefing.state.start_recording.call(null, ));
}
});
briefing.state.start_recording = (function briefing$state$start_recording(){
var ctx_20248 = (new AudioContext());
var dest_20249 = ctx_20248.createMediaStreamDestination();
if(cljs.core.truth_(cljs.core.deref(briefing.state.local_stream))){
var temp__5823__auto___20250 = cljs.core.first(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.local_stream).getAudioTracks()));
if(cljs.core.truth_(temp__5823__auto___20250)){
var la_20251 = temp__5823__auto___20250;
ctx_20248.createMediaStreamSource((new MediaStream([la_20251]))).connect(dest_20249);
} else {
}
} else {
}

var seq__20146_20252 = cljs.core.seq(cljs.core.deref(briefing.state.remote_peers));
var chunk__20147_20253 = null;
var count__20148_20254 = (0);
var i__20149_20255 = (0);
while(true){
if((i__20149_20255 < count__20148_20254)){
var vec__20156_20256 = chunk__20147_20253.cljs$core$IIndexed$_nth$arity$2(null, i__20149_20255);
var __20257 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20156_20256,(0),null);
var peer_20258 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20156_20256,(1),null);
var temp__5823__auto___20259 = new cljs.core.Keyword(null,"stream","stream",1534941648).cljs$core$IFn$_invoke$arity$1(peer_20258);
if(cljs.core.truth_(temp__5823__auto___20259)){
var st_20260 = temp__5823__auto___20259;
var temp__5823__auto___20261__$1 = cljs.core.first(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(st_20260.getAudioTracks()));
if(cljs.core.truth_(temp__5823__auto___20261__$1)){
var ra_20262 = temp__5823__auto___20261__$1;
ctx_20248.createMediaStreamSource((new MediaStream([ra_20262]))).connect(dest_20249);
} else {
}
} else {
}


var G__20263 = seq__20146_20252;
var G__20264 = chunk__20147_20253;
var G__20265 = count__20148_20254;
var G__20266 = (i__20149_20255 + (1));
seq__20146_20252 = G__20263;
chunk__20147_20253 = G__20264;
count__20148_20254 = G__20265;
i__20149_20255 = G__20266;
continue;
} else {
var temp__5823__auto___20267 = cljs.core.seq(seq__20146_20252);
if(temp__5823__auto___20267){
var seq__20146_20268__$1 = temp__5823__auto___20267;
if(cljs.core.chunked_seq_QMARK_(seq__20146_20268__$1)){
var c__5525__auto___20269 = cljs.core.chunk_first(seq__20146_20268__$1);
var G__20270 = cljs.core.chunk_rest(seq__20146_20268__$1);
var G__20271 = c__5525__auto___20269;
var G__20272 = cljs.core.count(c__5525__auto___20269);
var G__20273 = (0);
seq__20146_20252 = G__20270;
chunk__20147_20253 = G__20271;
count__20148_20254 = G__20272;
i__20149_20255 = G__20273;
continue;
} else {
var vec__20159_20274 = cljs.core.first(seq__20146_20268__$1);
var __20275 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20159_20274,(0),null);
var peer_20276 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20159_20274,(1),null);
var temp__5823__auto___20277__$1 = new cljs.core.Keyword(null,"stream","stream",1534941648).cljs$core$IFn$_invoke$arity$1(peer_20276);
if(cljs.core.truth_(temp__5823__auto___20277__$1)){
var st_20278 = temp__5823__auto___20277__$1;
var temp__5823__auto___20279__$2 = cljs.core.first(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(st_20278.getAudioTracks()));
if(cljs.core.truth_(temp__5823__auto___20279__$2)){
var ra_20280 = temp__5823__auto___20279__$2;
ctx_20248.createMediaStreamSource((new MediaStream([ra_20280]))).connect(dest_20249);
} else {
}
} else {
}


var G__20281 = cljs.core.next(seq__20146_20268__$1);
var G__20282 = null;
var G__20283 = (0);
var G__20284 = (0);
seq__20146_20252 = G__20281;
chunk__20147_20253 = G__20282;
count__20148_20254 = G__20283;
i__20149_20255 = G__20284;
continue;
}
} else {
}
}
break;
}

var mime_20285 = (cljs.core.truth_(MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))?"audio/webm;codecs=opus":"audio/webm");
var mr_20286 = (new MediaRecorder(dest_20249.stream,({"mimeType": mime_20285})));
cljs.core.reset_BANG_(briefing.state.recording_chunks,cljs.core.PersistentVector.EMPTY);

cljs.core.reset_BANG_(briefing.state.media_recorder,mr_20286);

(mr_20286.ondataavailable = (function (ev){
if((ev.data.size > (0))){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(briefing.state.recording_chunks,cljs.core.conj,ev.data);
} else {
return null;
}
}));

(mr_20286.onstop = (function (){
return (briefing.state.process_recording.cljs$core$IFn$_invoke$arity$0 ? briefing.state.process_recording.cljs$core$IFn$_invoke$arity$0() : briefing.state.process_recording.call(null, ));
}));

mr_20286.start((1000));

cljs.core.reset_BANG_(briefing.state.is_recording,true);

cljs.core.reset_BANG_(briefing.state.recording_duration,(0));

cljs.core.reset_BANG_(briefing.state.recording_status,"recording");

cljs.core.reset_BANG_(briefing.state.recording_timer,setInterval((function (){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(briefing.state.recording_duration,cljs.core.inc);
}),(1000)));

return briefing.state.log("Recording started");
});
briefing.state.process_recording = (function briefing$state$process_recording(){
var chunks = cljs.core.deref(briefing.state.recording_chunks);
var n = cljs.core.count(chunks);
cljs.core.reset_BANG_(briefing.state.recording_status,"uploading");

if((n === (0))){
briefing.state.log("Recording: no audio captured");

return cljs.core.reset_BANG_(briefing.state.recording_status,"");
} else {
var blob = (new Blob(cljs.core.to_array(chunks),({"type": "audio/webm"})));
var fd = (new FormData());
fd.append("audio",blob,"briefing.webm");

fd.append("roomId",cljs.core.deref(briefing.state.room_id));

fd.append("peerId",briefing.state.my_peer_id);

return fetch("/xrpc/com.etzhayyim.apps.briefing.uploadRecording",({"method": "POST", "body": fd})).then((function (res){
if(cljs.core.truth_(res.ok)){
return res.json().then((function (j){
cljs.core.reset_BANG_(briefing.state.transcript,cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(j,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));

cljs.core.reset_BANG_(briefing.state.recording_status,"done");

return briefing.state.log(["Transcript ready (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"language","language",-1591107564).cljs$core$IFn$_invoke$arity$1(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(j,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)))),")"].join(''));
})).catch((function (_){
return cljs.core.reset_BANG_(briefing.state.recording_status,"done");
}));
} else {
briefing.state.log(["Upload failed: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(res.status)].join(''));

return cljs.core.reset_BANG_(briefing.state.recording_status,"");
}
})).catch((function (e){
briefing.state.log(["Upload error: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e.message)].join(''));

return cljs.core.reset_BANG_(briefing.state.recording_status,"");
}));
}
});
briefing.state.stop_recording = (function briefing$state$stop_recording(){
if(cljs.core.truth_((function (){var and__5000__auto__ = cljs.core.deref(briefing.state.media_recorder);
if(cljs.core.truth_(and__5000__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("recording",cljs.core.deref(briefing.state.media_recorder).state);
} else {
return and__5000__auto__;
}
})())){
cljs.core.deref(briefing.state.media_recorder).stop();
} else {
}

if(cljs.core.truth_(cljs.core.deref(briefing.state.recording_timer))){
clearInterval(cljs.core.deref(briefing.state.recording_timer));

cljs.core.reset_BANG_(briefing.state.recording_timer,null);
} else {
}

cljs.core.reset_BANG_(briefing.state.is_recording,false);

return briefing.state.log(["Recording stopped (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(briefing.state.recording_duration)),"s)"].join(''));
});

//# sourceMappingURL=briefing.state.js.map
