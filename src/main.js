import { GameEngine } from './game.js';
import { BoardRenderer } from './render.js';
import { SoundFx } from './sound.js';
import { P2PRoom } from './p2p.js';

const $=s=>document.querySelector(s);
const game=new GameEngine();
const render=new BoardRenderer($('#board'));
const sound=new SoundFx();
let mode='ai', myRole='X', dragging=false, lx=0, ly=0;
const room=new P2PRoom(onRemoteData, s=>$('#roomStatus').textContent=s);

function status(t){ $('#statusText').textContent=t; }
function role(t){ $('#roleText').textContent=t; }
function redraw(){ render.draw(game.board); }
function reset(emit=true){ game.reset(); status('Lượt: X'); redraw(); if(emit && mode==='online') room.send({type:'reset'}); }

function localPlace(x,y){
  if(game.winner || game.get(x,y)) return;
  if(mode==='online' && room.isConnected() && game.turn!==myRole) return;
  const s=game.turn;
  if(!game.place(x,y,s)) return;
  s==='X'?sound.x():sound.o();
  if(game.winner){ status(`🏆 ${game.winner} thắng!`); sound.win(); }
  else status(`Lượt: ${game.turn}`);
  redraw();
  if(mode==='online') room.send({type:'move',x,y,symbol:s,turn:game.turn,winner:game.winner});
  if(mode==='ai' && !game.winner && game.turn==='O') setTimeout(()=>{ const [ax,ay]=game.bestAiMove(); localPlace(ax,ay); },220);
}

function onRemoteData(msg){
  if(msg.type==='reset'){ reset(false); return; }
  if(msg.type==='move' && !game.get(msg.x,msg.y)){
    game.place(msg.x,msg.y,msg.symbol);
    if(msg.winner) game.winner=msg.winner; else game.turn=msg.turn;
    if(game.winner){ status(`🏆 ${game.winner} thắng!`); sound.win(); } else status(`Lượt: ${game.turn}`);
    redraw();
  }
}

$('#mode').onchange=e=>{ mode=e.target.value; $('#roomPanel').hidden = mode!=='online'; myRole='X'; role('Bạn: X'); reset(false); };
$('#resetBtn').onclick=()=>reset(true);
$('#soundBtn').onclick=()=> $('#soundBtn').textContent = sound.toggle() ? '🔊 Sound' : '🔇 Sound';
$('#zoomIn').onclick=()=>{ render.scale=Math.min(68,render.scale+4); redraw(); };
$('#zoomOut').onclick=()=>{ render.scale=Math.max(26,render.scale-4); redraw(); };
$('#centerBtn').onclick=()=>{ render.cameraX=0; render.cameraY=0; redraw(); };
$('#hostBtn').onclick=()=>{ const r=$('#roomInput').value.trim(); if(!r) return alert('Nhập số phòng'); room.host(r); myRole='X'; role('Bạn: X (Host)'); };
$('#joinBtn').onclick=()=>{ const r=$('#roomInput').value.trim(); if(!r) return alert('Nhập số phòng'); room.join(r); myRole='O'; role('Bạn: O (Guest)'); };

const cv=$('#board');
cv.addEventListener('pointerdown',e=>{ dragging=true; lx=e.clientX; ly=e.clientY; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove',e=>{ if(!dragging) return; const dx=e.clientX-lx, dy=e.clientY-ly; render.cameraX -= dx/render.scale; render.cameraY -= dy/render.scale; lx=e.clientX; ly=e.clientY; redraw(); });
cv.addEventListener('pointerup',()=> dragging=false);
cv.addEventListener('click',e=>{ const r=cv.getBoundingClientRect(); const [x,y]=render.screenToCell(e.clientX-r.left,e.clientY-r.top); localPlace(x,y); });

redraw();
