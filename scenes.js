/* Built-in cartoon scenes (one per page). To use your own picture instead, put
   images/scene01.jpg ... scene10.jpg (or .png) in the images/ folder - they replace these automatically. */
(function(){
var P=function(d,f,s,w){return '<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||4)+'" stroke-linecap="round" stroke-linejoin="round"':'')+'/>';};
var C=function(x,y,r,f){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"/>';};
var E=function(x,y,rx,ry,f,o){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'"'+(o?' opacity="'+o+'"':'')+'/>';};
var R=function(x,y,w,h,f){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'"/>';};
function sky(a,b){return '<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient><linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb4dc"/><stop offset="1" stop-color="#2a78a8"/></linearGradient></defs>'+R(0,0,800,800,'url(#sk)');}
function hills(){return P('M0,430 Q150,300 300,400 T620,380 T800,420 V520 H0Z','#7bb369')+P('M0,470 Q200,380 420,450 T800,460 V560 H0Z','#5a9a4c');}
function water(y,h){var s=R(0,y,800,h,'url(#wt)');for(var i=0;i<5;i++)s+=P('M'+(40+i*160)+','+(y+30+i%2*40)+' q20,-12 40,0 t40,0','none','#bfe6f5',3);return s;}
function sun(x,y,r,c){return C(x,y,r,c||'#fcd34d')+C(x,y,r+14,'rgba(252,211,77,.3)');}
function cloud(x,y,s){return '<g transform="translate('+x+','+y+') scale('+(s||1)+')" fill="#fff" opacity=".92">'+E(0,0,60,26,'#fff')+E(40,-14,40,24,'#fff')+E(-34,-12,34,20,'#fff')+'</g>';}
function crane(x,y,s,f,mood){f=f||1;return '<g transform="translate('+x+','+y+') scale('+(s*f)+','+s+')">'+
 P('M-12,30 L-16,120 M16,30 L18,120','none','#f59e0b',7)+P('M-30,122 h30 M2,122 h32','none','#f59e0b',6)+
 E(0,0,70,42,'#eef2f6')+P('M-60,-8 Q-10,-44 50,-10 Q0,24 -60,-8Z','#cfd8e3','#94a3b8',3)+
 P('M45,-18 C85,-55 20,-100 62,-150','none','#94a3b8',17)+P('M45,-18 C85,-55 20,-100 62,-150','none','#eef2f6',11)+
 C(66,-156,16,'#eef2f6')+P('M78,-160 L135,-148 L79,-146Z','#fb923c','#c2410c',2)+C(70,-162,3.5,'#111')+
 (mood==='sad'?P('M62,-174 l16,6','none','#475569',3):'')+'</g>';}
function fish(x,y,s,c,f,o){f=f||1;return '<g transform="translate('+x+','+y+') scale('+(s*f)+','+s+')"'+(o?' opacity="'+o+'"':'')+'>'+P('M-34,0 L-62,-22 L-62,22Z',c,'#0f172a',2)+E(0,0,38,22,c)+P('M-6,-18 q10,-14 24,-6 q-8,10 -24,6Z','#fde68a')+C(22,-5,5,'#fff')+C(23,-5,2.5,'#111')+P('M34,6 q-6,5 -12,2','none','#7c2d12',2.5)+'</g>';}
function eel(x,y,s,f){f=f||1;return '<g transform="translate('+x+','+y+') scale('+(s*f)+','+s+')">'+P('M-120,20 C-80,-30 -40,50 0,0 S70,-30 100,0','none','#2f4f3a',20)+P('M-120,20 C-80,-30 -40,50 0,0 S70,-30 100,0','none','#5b8a67',12)+E(104,-2,17,13,'#5b8a67')+C(108,-6,4,'#fff')+C(109,-6,2,'#111')+'</g>';}
function lily(x,y){return E(x,y,34,9,'#4ade80')+E(x+6,y-3,10,4,'#f9a8d4');}
function bubbles(x,y,n){var s='';for(var i=0;i<n;i++)s+='<circle cx="'+(x+i*22%70)+'" cy="'+(y-i*34)+'" r="'+(6+i%3*3)+'" fill="none" stroke="#e0f2fe" stroke-width="2.5"/>';return s;}
function bubble(x,y,t){return '<g>'+E(x,y,44,32,'#fff')+C(x-34,y+40,7,'#fff')+C(x-48,y+58,4,'#fff')+'<text x="'+x+'" y="'+(y+12)+'" font-size="40" font-weight="700" text-anchor="middle" fill="#334155" font-family="Fredoka,sans-serif">'+t+'</text></g>';}
function stone(x,y,w){return E(x,y,w,w*.28,'#94a3b8')+E(x,y-w*.1,w*.85,w*.18,'#cbd5e1');}
function cracks(){return R(0,520,800,280,'#c9a36b')+P('M60,600 l60,30 l-20,50 l70,30 M300,560 l40,60 l60,-10 l30,70 M560,600 l-50,50 l60,40 l-10,60 M180,740 l50,-30 M650,720 l-60,-20','none','#7c5a2e',5);}

var S=[
/*1*/function(){return sky('#bfe4f6','#f3f9e9')+sun(640,120,56)+cloud(180,130,1.1)+hills()+R(0,520,800,280,'#7bb369')+E(430,640,330,120,'#2a78a8')+E(430,634,318,108,'#5fb4dc')+lily(360,650)+lily(520,630)+fish(430,660,.7,'#fb923c',1,.55)+crane(150,540,1.15,1,'sad');},
/*2*/function(){return sky('#bfe4f6','#f3f9e9')+hills()+R(0,520,800,280,'#7bb369')+E(480,650,330,120,'#2a78a8')+E(480,644,318,108,'#5fb4dc')+fish(470,520,1.7,'#f97316',1)+P('M380,600 q60,-40 160,0','none','#e0f2fe',5)+bubble(560,430,'?')+crane(130,560,1.1,1,'sad');},
/*3*/function(){return sky('#fde7b0','#fbd38d')+sun(120,110,80,'#f59e0b')+cracks()+E(400,610,200,50,'#a16207')+crane(560,560,1.3,-1,'sad')+'<g>'+E(250,250,130,70,'#fff')+C(150,330,12,'#fff')+C(110,372,7,'#fff')+'</g>'+fish(250,255,.8,'#f97316',1,.5)+P('M215,270 l70,0','none','#7c5a2e',4);},
/*4*/function(){return R(0,0,800,800,'#1e6f9f')+R(0,0,800,140,'#5fb4dc')+P('M0,140 q50,-14 100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0','#5fb4dc')+bubbles(120,620,6)+bubbles(640,700,5)+P('M0,800 V700 q100,-50 220,0 t300,10 t280,-20 V800Z','#c8a86a')+fish(250,420,1.5,'#f97316',1)+fish(520,330,1.2,'#facc15',-1)+fish(560,560,1.4,'#fb7185',-1)+fish(180,600,1.1,'#a78bfa',1)+fish(400,640,1,'#34d399',1)+fish(410,250,.9,'#60a5fa',1);},
/*5*/function(){return sky('#bfe4f6','#f3f9e9')+sun(640,110,50)+P('M0,430 L140,250 L260,400 L400,230 L560,410 L700,280 L800,380 V480 H0Z','#9fb4c7')+R(0,470,800,330,'#7bb369')+E(570,540,230,60,'#2a78a8')+E(570,536,220,52,'#5fb4dc')+E(150,690,250,80,'#2a78a8')+E(150,686,240,72,'#5fb4dc')+fish(120,690,.7,'#fb923c',1,.7)+fish(210,700,.6,'#facc15',1,.7)+crane(300,610,1.2,1)+P('M370,455 L520,520','none','#fbbf24',6);},
/*6*/function(){return sky('#bfe4f6','#f3f9e9')+R(0,430,800,370,'#7bb369')+R(0,430,800,12,'#5a9a4c')+R(0,520,800,280,'url(#wt)')+P('M0,520 q50,-16 100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0','#5fb4dc')+fish(260,640,1.9,'#f97316',1)+fish(470,700,1.5,'#facc15',-1)+fish(610,610,1.3,'#fb7185',-1)+bubble(250,520,'?')+bubble(560,540,'?')+crane(670,470,.55,-1);},
/*7*/function(){return sky('#bfe4f6','#f3f9e9')+hills()+R(0,520,800,280,'#7bb369')+E(220,700,260,70,'#2a78a8')+E(220,696,250,62,'#5fb4dc')+fish(110,690,.8,'#f97316',1)+fish(230,700,.8,'#facc15',1)+fish(340,692,.8,'#fb7185',1)+crane(520,560,1.25,-1)+bubble(660,300,'✓')+fish(560,430,.5,'#a78bfa',1);},
/*8*/function(){return sky('#a5d8f0','#eaf6e4')+cloud(160,120,1.2)+cloud(620,200,.9)+P('M0,640 q200,-70 420,-20 T800,610 V800 H0Z','#7bb369')+E(640,720,120,30,'#5fb4dc')+stone(600,640,120)+'<g transform="rotate(-12 400 330)">'+crane(400,350,1.3,-1)+'</g>'+fish(300,225,.65,'#f97316',-1)+P('M-20,0','none');},
/*9*/function(){return sky('#bfe4f6','#f3f9e9')+hills()+R(0,540,800,260,'#7bb369')+E(520,690,300,90,'#2a78a8')+E(520,686,290,80,'#5fb4dc')+stone(300,580,170)+crane(320,500,1.15,1)+fish(380,420,.6,'#f97316',-1,.95)+eel(560,700,.75,-1);},
/*10*/function(){return sky('#fcd9d0','#fdeedb')+hills()+R(0,540,800,260,'#7bb369')+E(540,690,300,90,'#2a78a8')+E(540,686,290,80,'#5fb4dc')+stone(300,590,170)+crane(310,520,1.15,1,'sad')+'<g transform="translate(330,330) rotate(-35)">'+eel(0,0,.7,1)+'</g>'+bubble(150,250,'!')+P('M520,560 q40,-70 20,-120','none','#e0f2fe',5);}
];
window.sceneSVG=function(i){return '<svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">'+(S[i]?S[i]():sky('#bfe4f6','#f3f9e9'))+'</svg>';};
})();
