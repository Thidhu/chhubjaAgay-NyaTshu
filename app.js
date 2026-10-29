/* Click & Read — story player. Sound priority: 1) teacher recording  2) audio/<key>.mp3  3) silent shake (no Dzongkha computer voice) */
(function(){
"use strict";
var $=function(id){return document.getElementById(id);};
var S=window.STORY, N=S.pages.length, cur=0, state="idle", stopReq=false, timer=null, currentAudio=null, mr=null, chunks=[];
var practised=JSON.parse(localStorage.getItem("story_practised")||"[]");
var pageEl=$("page"), filePlayer=$("filePlayer");

/* ---- IndexedDB recordings ---- */
var DB="StoryClickReadDB", ST="sounds";
function openDB(){return new Promise(function(res,rej){var r=indexedDB.open(DB,1);r.onupgradeneeded=function(){r.result.createObjectStore(ST);};r.onsuccess=function(){res(r.result);};r.onerror=function(){rej(r.error);};});}
function dbReq(mode,fn){return openDB().then(function(db){return new Promise(function(res){var tx=db.transaction(ST,mode),rq=fn(tx.objectStore(ST));tx.oncomplete=function(){res(rq&&rq.result!==undefined?rq.result:null);};tx.onerror=function(){res(null);};});});}
function getRec(k){return dbReq("readonly",function(s){return s.get(k);});}
function putRec(k,b){return dbReq("readwrite",function(s){return s.put(b,k);});}
function delRec(k){return dbReq("readwrite",function(s){return s["delete"](k);});}

/* ---- Rendering ---- */
function picHTML(i){return '<img alt="" src="images/scene'+("0"+(i+1)).slice(-2)+'.jpg">';}
function renderPage(i,back){
  cur=i; var p=S.pages[i];
  pageEl.className="page "+p.layout+(back?" back":""); void pageEl.offsetWidth;
  pageEl.innerHTML='<div class="pic"></div><div class="txt"><p class="line dz"></p></div>';
  var pic=pageEl.querySelector(".pic"), img=new Image(), n=("0"+(i+1)).slice(-2), tried=0;
  img.alt=""; img.onload=function(){pic.innerHTML="";pic.appendChild(img);};
  img.onerror=function(){ if(tried++===0){img.src="images/scene"+n+".png";} else {pic.innerHTML=window.sceneSVG(i);} };
  img.src="images/scene"+n+".jpg";
  pic.innerHTML=window.sceneSVG(i);   /* show the drawn scene instantly; replaced if a real image exists */
  var line=pageEl.querySelector(".line");
  p.tokens.forEach(function(t){
    var s=document.createElement("span");
    if(t.t===" "){s.className="space";s.textContent=" ";}
    else if(t.punct){s.className="punct";s.textContent=t.t;}
    else{
      s.className="tok"+(practised.indexOf(t.k)>-1?" practised":"");s.textContent=t.t;s.dataset.key=t.k;s.dataset.text=t.t;
      s.addEventListener("click",function(){
        if(!$("teacherPanel").classList.contains("hidden")){$("recordKey").value=t.k;$("recWord").textContent=t.t+"  →  audio/"+t.k+".mp3";}
        stopAll(); playToken(s);
      });
    }
    line.appendChild(s);
  });
  $("prevBtn").disabled=i===0; $("nextBtn").disabled=i===N-1;
  $("dots").querySelectorAll("button").forEach(function(b,j){b.classList.toggle("on",j===i);});
  updateProgress();
}
function buildDots(){var d=$("dots");for(var i=0;i<N;i++){(function(i){var b=document.createElement("button");b.setAttribute("aria-label","Page "+(i+1));b.onclick=function(){stopAll();renderPage(i,i<cur);};d.appendChild(b);})(i);}}
function allKeys(){var o={};S.pages.forEach(function(p){p.tokens.forEach(function(t){if(t.k)o[t.k]=1;});});return Object.keys(o);}
function updateProgress(){var ks=allKeys(),done=ks.filter(function(k){return practised.indexOf(k)>-1;}).length;$("pc").textContent=done+"/"+ks.length;$("progressBar").style.width=Math.round(done/ks.length*100)+"%";}
function markPractised(k){if(practised.indexOf(k)<0){practised.push(k);localStorage.setItem("story_practised",JSON.stringify(practised));}
  pageEl.querySelectorAll('.tok[data-key="'+k+'"]').forEach(function(e){e.classList.add("practised");});updateProgress();}

/* ---- Playback ---- */
function speed(){return parseFloat($("speedSelect").value)||1;}
function stopCurrent(){if(currentAudio){try{currentAudio.pause();}catch(e){} if(currentAudio!==filePlayer){try{currentAudio.src="";}catch(e){}} currentAudio=null;}}
function playBlob(b){return new Promise(function(res,rej){stopCurrent();var u=URL.createObjectURL(b),a=new Audio(u);a.playbackRate=speed();currentAudio=a;
  a.onended=function(){URL.revokeObjectURL(u);currentAudio=null;res();};a.onerror=function(){currentAudio=null;rej();};a.play()["catch"](function(){currentAudio=null;rej();});});}
function playFile(k){return new Promise(function(res,rej){stopCurrent();filePlayer.src="audio/"+encodeURIComponent(k)+".mp3";filePlayer.playbackRate=speed();currentAudio=filePlayer;
  function end(){clean();res();} function err(){clean();rej();} function clean(){filePlayer.removeEventListener("ended",end);filePlayer.removeEventListener("error",err);currentAudio=null;}
  filePlayer.addEventListener("ended",end);filePlayer.addEventListener("error",err);filePlayer.play()["catch"](function(){clean();rej();});});}
function playToken(el){return new Promise(function(done){
  var k=el.dataset.key; el.classList.add("playing");
  function silent(){el.classList.remove("noaudio");void el.offsetWidth;el.classList.add("noaudio");return new Promise(function(r){setTimeout(r,650);});}
  getRec(k).then(function(b){return b?playBlob(b):playFile(k);})["catch"](silent).then(function(){el.classList.remove("playing");markPractised(k);done();});});}
function stopAll(){stopReq=true;stopCurrent();clearTimeout(timer);state="idle";document.querySelectorAll(".tok.playing").forEach(function(e){e.classList.remove("playing");});}

/* Read All: reads the current page word by word, then turns the page and keeps going */
function readAll(){
  if(state==="playing")return; state="playing"; stopReq=false;
  function readPage(){
    var toks=[].slice.call(pageEl.querySelectorAll(".tok")), i=0;
    (function next(){
      if(stopReq){state="idle";return;}
      if(i>=toks.length){
        if(cur<N-1){timer=setTimeout(function(){if(stopReq)return;renderPage(cur+1);timer=setTimeout(readPage,500);},900);} else state="idle";
        return;
      }
      playToken(toks[i++]).then(function(){timer=setTimeout(next,120);});
    })();
  }
  readPage();
}
function go(d){stopAll();var n=cur+d;if(n>=0&&n<N)renderPage(n,d<0);}

/* ---- Teacher recording ---- */
function status(m,err){$("recStatus").textContent=m;$("recStatus").style.color=err?"#b91c1c":"";}
function startRec(){var k=$("recordKey").value.trim().toLowerCase();if(!k){status("Click a word first, or type its key (e.g. c001).",true);return;}
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){status("Recording not supported here. Try Chrome or Edge.",true);return;}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){chunks=[];mr=new MediaRecorder(st);
    mr.ondataavailable=function(e){if(e.data.size)chunks.push(e.data);};
    mr.onstop=function(){st.getTracks().forEach(function(t){t.stop();});putRec(k,new Blob(chunks,{type:mr.mimeType||"audio/webm"})).then(function(){status("Saved '"+k+"'. Click the word to hear it.");});};
    mr.start();$("recordBtn").classList.add("hidden");$("stopRecBtn").classList.remove("hidden");status("Recording… press Stop when done.");
  })["catch"](function(){status("Microphone permission denied.",true);});}
function stopRec(){if(mr&&mr.state!=="inactive")mr.stop();$("recordBtn").classList.remove("hidden");$("stopRecBtn").classList.add("hidden");}
function exportRec(){openDB().then(function(db){var tx=db.transaction(ST,"readonly"),s=tx.objectStore(ST),ks,vs;
  s.getAllKeys().onsuccess=function(e){ks=e.target.result;s.getAll().onsuccess=function(e2){vs=e2.target.result;
    if(!ks.length){status("No recordings to export.",true);return;}
    var out={},c=0;ks.forEach(function(k,i){var r=new FileReader();r.onloadend=function(){out[k]={mime:vs[i].type,b64:r.result.split(",")[1]};if(++c===ks.length){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:"application/json"}));a.download="story-recordings.json";a.click();}};r.readAsDataURL(vs[i]);});};};});}
function importRec(f){var r=new FileReader();r.onload=function(){try{var d=JSON.parse(r.result),ks=Object.keys(d),n=0;ks.forEach(function(k){var bin=atob(d[k].b64),a=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);putRec(k,new Blob([a],{type:d[k].mime||"audio/webm"})).then(function(){if(++n===ks.length)status("Imported "+n+" recording(s).");});});}catch(e){status("Import failed: invalid file.",true);}};r.readAsText(f);}

/* ---- Events ---- */
$("barTitle").textContent=S.title;
$("playAllBtn").onclick=readAll; $("stopBtn").onclick=stopAll;
$("prevBtn").onclick=function(){go(-1);}; $("nextBtn").onclick=function(){go(1);};
$("teacherBtn").onclick=function(){$("teacherPanel").classList.toggle("hidden");};
$("fsBtn").onclick=function(){var d=document;if(d.fullscreenElement)d.exitFullscreen();else if(d.documentElement.requestFullscreen)d.documentElement.requestFullscreen();};
$("recordBtn").onclick=startRec; $("stopRecBtn").onclick=stopRec;
$("playRecBtn").onclick=function(){var k=$("recordKey").value.trim().toLowerCase();getRec(k).then(function(b){if(b)playBlob(b);else status("No recording for '"+k+"'.",true);});};
$("delRecBtn").onclick=function(){var k=$("recordKey").value.trim().toLowerCase();if(k)delRec(k).then(function(){status("Deleted '"+k+"'.");});};
$("exportBtn").onclick=exportRec; $("importInput").onchange=function(e){if(e.target.files[0])importRec(e.target.files[0]);};
$("resetProgressBtn").onclick=function(){if(confirm("Reset all practised-word progress?")){practised=[];localStorage.removeItem("story_practised");pageEl.querySelectorAll(".tok").forEach(function(e){e.classList.remove("practised");});updateProgress();}};
document.addEventListener("keydown",function(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==="ArrowRight")go(1);else if(e.key==="ArrowLeft")go(-1);});
var sx=null;pageEl.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});
pageEl.addEventListener("touchend",function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>70)go(dx<0?1:-1);},{passive:true});

/* ---- Opening scene ---- */
(function(){var sp=$("splash"),t,closed=false;
  function s2(){if(closed||sp.classList.contains("step2"))return;clearTimeout(t);sp.classList.remove("step1");sp.classList.add("step2");}
  function close(){if(closed)return;closed=true;clearTimeout(t);sp.classList.add("leaving");setTimeout(function(){sp.style.display="none";},650);}
  sp.classList.add("step1");t=setTimeout(s2,2800);sp.querySelector(".s1").addEventListener("click",s2);$("startBtn").onclick=close;$("skipSplash").onclick=close;})();

buildDots(); renderPage(0); if(window.lucide)lucide.createIcons();
})();
