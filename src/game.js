const dirs=[[1,0],[0,1],[1,1],[1,-1]];
const key=(x,y)=>`${x},${y}`;

export class GameEngine {
  constructor(){ this.reset(); }
  reset(){ this.board=new Map(); this.turn='X'; this.winner=null; }
  get(x,y){ return this.board.get(key(x,y)); }
  place(x,y,s){ if(this.get(x,y)||this.winner) return false; this.board.set(key(x,y),s); if(this.checkWin(x,y,s)){ this.winner=s; } else { this.turn=s==='X'?'O':'X'; } return true; }
  countDir(x,y,dx,dy,s){ let c=0; for(let nx=x+dx,ny=y+dy; this.get(nx,ny)===s; nx+=dx,ny+=dy) c++; return c; }
  checkWin(x,y,s){ return dirs.some(([dx,dy])=>1+this.countDir(x,y,dx,dy,s)+this.countDir(x,y,-dx,-dy,s)>=5); }
  bestAiMove(){
    if(this.board.size===0) return [0,0];
    const cand=new Set();
    for(const k of this.board.keys()){
      const [x,y]=k.split(',').map(Number);
      for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++) if(dx||dy){ const nx=x+dx,ny=y+dy; if(!this.get(nx,ny)) cand.add(key(nx,ny)); }
    }
    const cells=[...cand].map(k=>k.split(',').map(Number));
    let best=cells[0], bestScore=-1;
    const scoreAt=(x,y,s)=>Math.max(...dirs.map(([dx,dy])=>1+this.countDir(x,y,dx,dy,s)+this.countDir(x,y,-dx,-dy,s)));
    for(const [x,y] of cells){ const sc=scoreAt(x,y,'O')*2 + scoreAt(x,y,'X')*2.3 - 0.02*(Math.abs(x)+Math.abs(y)) + Math.random()*0.2; if(sc>bestScore){ bestScore=sc; best=[x,y]; } }
    return best;
  }
}
