const roomToHostId = room => 'xo-room-' + room.replace(/[^a-zA-Z0-9_-]/g,'');

export class P2PRoom {
  constructor(onData,onStatus){ this.peer=null; this.conn=null; this.onData=onData; this.onStatus=onStatus; }
  ensurePeer(){ if(!this.peer) this.peer=new Peer(); }
  host(room){ this.ensurePeer(); const hostId=roomToHostId(room);
    this.peer.on('open',()=>{ this.peer.destroy(); this.peer=new Peer(hostId); this.peer.on('open',()=>this.onStatus(`✅ Host phòng ${room}, chờ người vào...`)); this.peer.on('connection',c=>this.bindConn(c,`🎉 Đã kết nối phòng ${room}`)); }); }
  join(room){ this.ensurePeer(); this.peer.on('open',()=>{ this.bindConn(this.peer.connect(roomToHostId(room)),`🎉 Đã vào phòng ${room}`); }); }
  bindConn(c,msg){ this.conn=c; c.on('open',()=>this.onStatus(msg)); c.on('data',d=>this.onData(d)); c.on('error',()=>this.onStatus('❌ Lỗi kết nối phòng')); }
  send(payload){ try{ this.conn?.send(payload); }catch{} }
  isConnected(){ return !!(this.conn && this.conn.open); }
}
