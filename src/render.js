export class BoardRenderer {
  constructor(canvas){ this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.cameraX=0; this.cameraY=0; this.scale=42; }
  screenToCell(sx,sy){ return [Math.floor((sx-this.canvas.width/2)/this.scale+this.cameraX+0.5), Math.floor((sy-this.canvas.height/2)/this.scale+this.cameraY+0.5)]; }
  draw(board){ const {ctx,canvas}=this; ctx.clearRect(0,0,canvas.width,canvas.height);
    const cols=Math.ceil(canvas.width/this.scale)+2, rows=Math.ceil(canvas.height/this.scale)+2;
    const startX=Math.floor(this.cameraX-cols/2), startY=Math.floor(this.cameraY-rows/2);
    ctx.strokeStyle='rgba(148,163,184,.25)';
    for(let i=0;i<=cols;i++){ const x=(startX+i-this.cameraX)*this.scale+canvas.width/2; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
    for(let j=0;j<=rows;j++){ const y=(startY+j-this.cameraY)*this.scale+canvas.height/2; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
    for(const [k,v] of board.entries()){
      const [x,y]=k.split(',').map(Number); const sx=(x-this.cameraX)*this.scale+canvas.width/2; const sy=(y-this.cameraY)*this.scale+canvas.height/2;
      if(v==='X'){ ctx.strokeStyle='rgba(34,211,238,.95)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(sx-this.scale*.32,sy-this.scale*.32); ctx.lineTo(sx+this.scale*.32,sy+this.scale*.32); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx+this.scale*.32,sy-this.scale*.32); ctx.lineTo(sx-this.scale*.32,sy+this.scale*.32); ctx.stroke(); }
      else { ctx.strokeStyle='rgba(251,113,133,.95)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(sx,sy,this.scale*.34,0,Math.PI*2); ctx.stroke(); }
    }
  }
}
