export class SoundFx {
  constructor(){ this.enabled=true; }
  toggle(){ this.enabled=!this.enabled; return this.enabled; }
  beep(f,d=0.06){ if(!this.enabled) return; const ac=new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(); const g=ac.createGain(); o.type='triangle'; o.frequency.value=f; g.gain.value=.03; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+d); }
  x(){ this.beep(760); setTimeout(()=>this.beep(920,.05),45); }
  o(){ this.beep(430); setTimeout(()=>this.beep(350,.05),45); }
  win(){ [660,820,990].forEach((f,i)=>setTimeout(()=>this.beep(f,.08),i*80)); }
}
