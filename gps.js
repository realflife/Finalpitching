/* Live GPS slides in Final-pitching:
   - Slide 11: Interactive Live GPS Journey Map (comparing After Optimization 0.48s vs Before Optimization 9.47s)
   - Slide 13: GPS Precision & Guardrail Scatter Radar (>100m auto-rejection)
*/
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = id => document.getElementById(id);
  const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

  function createQuad(canvas, fragment, names) {
    let gl = null;
    try { gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'low-power' }); } catch { gl = null; }
    if (!gl) return null;
    const compile = (type, source) => {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      console.warn('[gps] shader error', gl.getShaderInfoLog(shader)); return null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return null;
    const program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const u = {}; names.forEach(name => { u[name] = gl.getUniformLocation(program, name); });
    return {
      gl, u,
      resize() {
        const ratio = Math.min(devicePixelRatio || 1, 1.75);
        const w = Math.max(1, Math.round(canvas.clientWidth * ratio)), h = Math.max(1, Math.round(canvas.clientHeight * ratio));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        gl.viewport(0, 0, w, h); return [w, h];
      },
      draw() { gl.drawArrays(gl.TRIANGLES, 0, 6); }
    };
  }

  function watchSlide(slide, onChange) {
    const active = () => slide.classList.contains('active') && !document.hidden;
    let was = null;
    const check = () => { const now = active(); if (now !== was) { was = now; onChange(now); } };
    new MutationObserver(check).observe(slide, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', check);
    check();
    return active;
  }

  /* ---------- Live Journey Map ---------- */
  const MAP_FRAGMENT = `precision highp float;
uniform vec2 u_res; uniform float u_time, u_scale, u_prog, u_view, u_acc, u_arrived, u_head;
uniform vec2 u_route[8]; uniform float u_cum[8];
uniform vec2 u_seen, u_true, u_dest, u_ptr;
float box(vec2 p, vec2 b, float r){ vec2 q=abs(p)-b+r; return length(max(q,0.))+min(max(q.x,q.y),0.)-r; }
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float seg(vec2 p, vec2 a, vec2 b, out float t){ vec2 pa=p-a, ba=b-a; t=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*t); }
float fill(float d, float px){ return 1.-smoothstep(0.,px,d); }
void main(){
  vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y/u_scale;
  float px=1.6/u_res.y/u_scale;
  vec3 green=vec3(.027,.506,.357), ink=vec3(.08,.24,.19), amber=vec3(.84,.40,.18);
  vec3 col=vec3(.957,.976,.961);
  vec2 cell=vec2(.16,.12); vec2 g=p+vec2(.03,.02);
  vec2 id=floor(g/cell); vec2 lp=mod(g,cell)-cell*.5; float h=hash(id);
  vec3 block=mix(vec3(.885,.93,.905),vec3(.85,.915,.88),h);
  if(h>.87) block=vec3(.80,.90,.83);
  col=mix(col,block,fill(box(lp,cell*.5-vec2(.018),.012),px));
  float av=abs(dot(p-vec2(0.,-.05),normalize(vec2(1.,.35))));
  col=mix(col,vec3(1.),fill(av-.013,px));
  float rv=abs(p.y+.36+.05*sin(p.x*5.+.6));
  col=mix(col,vec3(.79,.885,.9),fill(rv-.035,px));
  float d=1e3, along=0.;
  for(int i=0;i<7;i++){ float t; float s=seg(p,u_route[i],u_route[i+1],t); if(s<d){ d=s; along=mix(u_cum[i],u_cum[i+1],t);} }
  float done=step(along,u_prog);
  col=mix(col,green,exp(-d*d*1800.)*.16);
  float dash=max(done,step(.45,fract(along*34.-u_time*.9)));
  col=mix(col,vec3(1.),fill(d-.012,px));
  col=mix(col,mix(vec3(.6,.75,.68),green,done),fill(d-.0068,px)*dash);
  float dd=length(p-u_dest);
  vec3 destCol=mix(amber,green,u_arrived);
  for(int k=0;k<3;k++){ float ph=fract(u_time*.42+float(k)/3.); col=mix(col,destCol,fill(abs(dd-ph*.13),px*1.6)*(1.-ph)*.55); }
  col=mix(col,vec3(1.),fill(dd-.024,px)); col=mix(col,destCol,fill(dd-.018,px)); col=mix(col,vec3(1.),fill(dd-.0065,px));
  float dt=length(p-u_true);
  float accA=u_view*(1.-u_arrived);
  col=mix(col,green,fill(dt-u_acc,px)*.11*accA);
  col=mix(col,green,fill(abs(dt-u_acc),px*1.2)*.5*accA);
  float ghostA=(1.-u_view)*(1.-u_arrived)*smoothstep(.004,.02,length(u_true-u_seen));
  float lt; float lag=seg(p,u_seen,u_true,lt);
  col=mix(col,amber,fill(lag,px*1.4)*step(.45,fract(lt*9.))*.75*ghostA);
  col=mix(col,green,fill(abs(dt-.016),px*1.5)*.65*ghostA);
  float ds=length(p-u_seen);
  float ph=fract(u_time*.75);
  col=mix(col,green,fill(abs(ds-ph*.075),px*1.6)*(1.-ph)*.6*(1.-u_arrived));
  col=mix(col,ink,exp(-ds*ds*900.)*.18);
  col=mix(col,vec3(1.),fill(ds-.026,px)); col=mix(col,green,fill(ds-.02,px));
  vec2 q=p-u_seen; float c=cos(u_head), s=sin(u_head);
  vec2 r=vec2(q.x*c+q.y*s,-q.x*s+q.y*c);
  float tri=max(-r.x-.006,abs(r.y)*1.45+r.x-.0105);
  col=mix(col,vec3(1.),fill(tri,px)*(1.-u_arrived));
  col=mix(col,vec3(1.),fill(ds-.0075,px)*u_arrived);
  float sp=length(p-u_ptr); col+=vec3(.025,.05,.035)*exp(-sp*sp*30.);
  vec2 uv=gl_FragCoord.xy/u_res;
  float v=smoothstep(0.,.18,uv.x)*smoothstep(1.,.82,uv.x)*smoothstep(0.,.16,uv.y)*smoothstep(1.,.84,uv.y);
  col=mix(vec3(.93,.96,.945),col,.4+.6*v);
  gl_FragColor=vec4(col,1.);
}`;

  const ROUTE = [[-0.67, 0.34], [-0.35, 0.34], [-0.35, 0.10], [-0.03, 0.10], [-0.03, -0.02], [0.29, -0.02], [0.29, -0.14], [0.45, -0.14]];
  const CUM = [0];
  for (let i = 1; i < ROUTE.length; i++) CUM.push(CUM[i - 1] + Math.hypot(ROUTE[i][0] - ROUTE[i - 1][0], ROUTE[i][1] - ROUTE[i - 1][1]));
  const LENGTH = CUM[CUM.length - 1];
  const TRIP_METERS = 1547;
  const TRIP = 150;
  const SPEEDUP = 6;
  const START_HOLD = 1.6, END_HOLD = 6.0;
  const METERS_PER_SECOND = TRIP_METERS / TRIP;
  const easeTrip = t => t - Math.sin(2 * Math.PI * t) / (2 * Math.PI);

  function routeAt(len) {
    const clamped = Math.max(0, Math.min(LENGTH, len));
    let i = 0; while (i < ROUTE.length - 2 && CUM[i + 1] < clamped) i++;
    const a = ROUTE[i], b = ROUTE[i + 1], t = (clamped - CUM[i]) / ((CUM[i + 1] - CUM[i]) || 1);
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, heading: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }
  const lengthAt = simT => LENGTH * easeTrip(Math.max(0, Math.min(1, simT / TRIP)));
  function knownTime(simT, pollMode) {
    if (pollMode <= 1) {
      // Optimized: Movement-Aware 1s send + 1s citizen poll -> ~0.48s average lag
      return Math.max(0, Math.min(TRIP, simT - 0.48));
    }
    // Before Optimization: 10s server throttle + 5s citizen poll -> ~9.47s lag
    const step = 9.5;
    if (simT < 1.0) return -1;
    const synced = Math.floor(simT / step) * step;
    return synced >= TRIP ? TRIP : synced;
  }
  function formatEta(seconds) {
    if (seconds <= 0) return 'ถึงแล้ว';
    const m = Math.floor(seconds / 60), s = Math.round(seconds % 60);
    return m ? `${m} น. ${String(s).padStart(2, '0')} วิ` : `${s} วิ`;
  }

  function initJourney() {
    const slide = document.querySelector('[data-gps-journey-slide]') || $('slide-11') || $('slide-34');
    const stage = $('gps-stage'), canvas = $('gps-map-canvas');
    if (!slide || !stage || !canvas) return;
    const steps = [...slide.querySelectorAll('[data-gps-step]')];
    const viewButtons = [...stage.parentElement.parentElement.querySelectorAll('[data-gps-view]')];
    const pollButtons = [...stage.parentElement.parentElement.querySelectorAll('[data-gps-poll]')];
    const ui = {
      status: $('gps-status'), statusText: $('gps-status-text'), distance: $('gps-distance'), eta: $('gps-eta'),
      thirdLabel: $('gps-third-label'), third: $('gps-third'), lag: $('gps-lag'), pollGroup: $('gps-poll-group'), replay: $('gps-replay')
    };
    const quad = createQuad(canvas, MAP_FRAGMENT, ['u_res', 'u_time', 'u_scale', 'u_prog', 'u_view', 'u_acc', 'u_arrived', 'u_head', 'u_route', 'u_cum', 'u_seen', 'u_true', 'u_dest', 'u_ptr']);
    if (!quad) stage.classList.add('gps-no-webgl');
    else {
      const { gl, u } = quad;
      gl.uniform2fv(u.u_route, new Float32Array(ROUTE.flat()));
      gl.uniform1fv(u.u_cum, new Float32Array(CUM));
      gl.uniform2f(u.u_dest, ...ROUTE[ROUTE.length - 1]);
    }
    const state = { view: 'citizen', poll: 0.5, clock: 0, last: 0, frame: 0, viewMix: 0, arrivedMix: 0, seen: { x: ROUTE[0][0], y: ROUTE[0][1] }, ptr: [9, 9] };

    function setText(el, text) { if (el && el.textContent !== text) el.textContent = text; }
    function snapshot() {
      const simT = Math.max(0, (state.clock - START_HOLD) * SPEEDUP);
      const officer = state.view === 'officer';
      const known = officer ? simT : knownTime(simT, state.poll);
      const knownLen = known < 0 ? 0 : lengthAt(known);
      const truePos = routeAt(lengthAt(simT));
      const target = routeAt(knownLen);
      const phase = state.clock < START_HOLD ? 0 : (known >= TRIP ? 2 : 1);
      return { simT, known, knownLen, truePos, target, phase, officer };
    }
    function updateUi(s) {
      const remaining = (LENGTH - s.knownLen) / LENGTH * TRIP_METERS;
      const accuracy = 6.5 + 2.0 * Math.sin(state.clock * 1.3);
      const messages = s.officer
        ? ['กดเริ่มเดินทางเมื่อพร้อมออกไปตรวจสอบ', 'GPS กำลังทำงาน · Movement-Aware ส่งทันทีเมื่อขยับ', 'เจ้าหน้าที่ถึงหน้างานแล้ว การแชร์ตำแหน่งสิ้นสุดลง']
        : ['รอเจ้าหน้าที่เริ่มเดินทาง', 'เจ้าหน้าที่กำลังเดินทางไปจุดเกิดเหตุ (ซิงก์เรียลไทม์)', 'เจ้าหน้าที่ถึงหน้างานแล้ว การแชร์ตำแหน่งสิ้นสุดลง'];
      setText(ui.statusText, messages[s.phase]);
      ui.status.dataset.phase = String(s.phase);
      setText(ui.distance, s.phase === 2 ? '0 ม.' : remaining >= 1000 ? `${(remaining / 1000).toFixed(2)} กม.` : `${Math.round(remaining)} ม.`);
      setText(ui.eta, s.phase === 0 ? 'รอเริ่ม' : formatEta(remaining / METERS_PER_SECOND));
      if (s.officer) {
        setText(ui.thirdLabel, 'ความแม่นยำ GPS');
        setText(ui.third, s.phase === 2 ? 'หยุดแชร์' : `±${accuracy.toFixed(0)} ม.`);
        setText(ui.lag, 'อ่านจากชิป GPS โดยตรง · ส่งทันทีเมื่อขยับ ≥1.5ม. (<30 ms) / Heartbeat 10 วิ');
      } else {
        const isOpt = state.poll <= 1;
        const ago = s.known < 0 ? null : isOpt ? 0.48 : Math.max(0, Math.round(s.simT - s.known));
        const lagMeters = Math.max(0, (lengthAt(s.simT) - s.knownLen) / LENGTH * TRIP_METERS);
        setText(ui.thirdLabel, 'ดีเลย์ซิงก์ล่าสุด');
        setText(ui.third, ago === null ? '—' : s.phase === 2 ? 'สิ้นสุด' : isOpt ? '0.48 วิ' : `${ago} วิที่แล้ว`);
        setText(ui.lag, s.phase === 1
          ? (isOpt
              ? `หลัง Optimize: ดีเลย์เฉลี่ย 0.48 วิ · ห่างจากตำแหน่งรถจริงเพียง ~${Math.max(1, Math.round(lagMeters))} ม. (0 HTTP 429)`
              : `ก่อน Optimize: ดีเลย์ ~9.47 วิ (ชนลิมิต 10s + Poll 5s) · หมุดตามหลังรถจริง ~${Math.round(lagMeters)} ม.`)
          : s.phase === 0 ? 'รอข้อมูลรอบแรกจากเจ้าหน้าที่' : 'เห็นการมาถึงพร้อมกับเจ้าหน้าที่ทันที');
      }
      steps.forEach((step, i) => { if (i === s.phase) step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current'); step.dataset.done = String(i < s.phase); });
      return accuracy;
    }
    function render(dt) {
      const s = snapshot();
      const accuracy = updateUi(s);
      const k = reduced.matches ? 1 : 1 - Math.exp(-dt * (state.poll <= 1 ? 14 : 9));
      state.seen.x += (s.target.x - state.seen.x) * k; state.seen.y += (s.target.y - state.seen.y) * k;
      state.viewMix += ((s.officer ? 1 : 0) - state.viewMix) * (reduced.matches ? 1 : 1 - Math.exp(-dt * 6));
      state.arrivedMix += ((s.phase === 2 ? 1 : 0) - state.arrivedMix) * (reduced.matches ? 1 : 1 - Math.exp(-dt * 4));
      if (!quad) return;
      const { gl, u } = quad;
      const [w, h] = quad.resize();
      gl.uniform2f(u.u_res, w, h);
      gl.uniform1f(u.u_time, reduced.matches ? 0.3 : state.clock);
      gl.uniform1f(u.u_scale, Math.min(1, (w / h) / 1.55));
      gl.uniform1f(u.u_prog, s.knownLen);
      gl.uniform1f(u.u_view, state.viewMix);
      gl.uniform1f(u.u_acc, 0.03 + accuracy * 0.0028);
      gl.uniform1f(u.u_arrived, state.arrivedMix);
      gl.uniform1f(u.u_head, s.target.heading);
      gl.uniform2f(u.u_seen, state.seen.x, state.seen.y);
      gl.uniform2f(u.u_true, s.truePos.x, s.truePos.y);
      gl.uniform2f(u.u_ptr, state.ptr[0], state.ptr[1]);
      quad.draw();
    }
    function tick(time) {
      state.frame = 0;
      if (!active()) return;
      const dt = state.last ? Math.min((time - state.last) / 1000, 0.1) : 0;
      state.last = time; state.clock += dt;
      if (state.clock > START_HOLD + (TRIP / SPEEDUP) + END_HOLD) restart(false);
      render(dt);
      state.frame = requestAnimationFrame(tick);
    }
    function stop() { cancelAnimationFrame(state.frame); state.frame = 0; state.last = 0; }
    function restart(redraw = true) {
      state.clock = reduced.matches ? START_HOLD + 70 / SPEEDUP : 0;
      state.seen = { x: ROUTE[0][0], y: ROUTE[0][1] };
      state.arrivedMix = 0;
      if (reduced.matches) { const s = snapshot(); state.seen = { x: s.target.x, y: s.target.y }; }
      if (redraw) render(0);
    }
    function start() {
      stop(); render(0);
      if (!reduced.matches) state.frame = requestAnimationFrame(tick);
    }
    const active = watchSlide(slide, isActive => { if (isActive) { restart(); start(); } else stop(); });
    viewButtons.forEach(button => button.addEventListener('click', () => {
      state.view = button.dataset.gpsView;
      viewButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      if (ui.pollGroup) ui.pollGroup.hidden = state.view !== 'citizen';
      stage.dataset.view = state.view;
      if (reduced.matches || !state.frame) render(1);
    }));
    pollButtons.forEach(button => button.addEventListener('click', () => {
      state.poll = Number(button.dataset.gpsPoll);
      pollButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      stage.dataset.poll = String(state.poll);
      if (reduced.matches || !state.frame) render(1);
    }));
    ui.replay?.addEventListener('click', () => { restart(); if (active()) start(); });
    stage.addEventListener('pointermove', event => {
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width * 2 - 1, ny = (event.clientY - rect.top) / rect.height * 2 - 1;
      if (!reduced.matches) { stage.style.setProperty('--tilt-x', (ny * -3.5).toFixed(2) + 'deg'); stage.style.setProperty('--tilt-y', (nx * 4.5).toFixed(2) + 'deg'); }
      const scale = Math.min(1, (canvas.clientWidth / Math.max(1, canvas.clientHeight)) / 1.55);
      state.ptr = [(nx * canvas.clientWidth / 2) / canvas.clientHeight / scale, (-ny * canvas.clientHeight / 2) / canvas.clientHeight / scale];
    });
    stage.addEventListener('pointerleave', () => { state.ptr = [9, 9]; stage.style.setProperty('--tilt-x', '0deg'); stage.style.setProperty('--tilt-y', '0deg'); });
    addEventListener('resize', () => { if (active() && !state.frame) render(0); });
  }

  /* ---------- GPS Precision Scatter Radar ---------- */
  const PRECISION_POINTS = 40;
  const PRECISION_FRAGMENT = `precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform vec4 u_pts[${PRECISION_POINTS}];
float fill(float d, float px){ return 1.-smoothstep(0.,px,d); }
void main(){
  float m=min(u_res.x,u_res.y);
  vec2 p=(gl_FragCoord.xy-.5*u_res)/(.5*m);
  float px=2.4/m; float r=length(p);
  if(r>1.01){ gl_FragColor=vec4(0.); return; }
  vec3 green=vec3(.027,.506,.357), ink=vec3(.08,.24,.19), red=vec3(.85,.30,.18);
  vec3 col=mix(vec3(.93,.965,.945),vec3(.99,1.,.995),smoothstep(1.,0.,r));
  float ang=atan(p.y,p.x);
  float sw=fract(ang/6.2831853-u_time*.16);
  col=mix(col,green,pow(sw,9.)*.2);
  float R10=.274, R50=.613, R100=.867;
  col=mix(col,green,fill(r-R10,px)*.1);
  col=mix(col,green,fill(abs(r-R10),px)*.9);
  col=mix(col,vec3(.55,.68,.61),fill(abs(r-R50),px)*.55);
  col=mix(col,red,fill(abs(r-R100),px)*.85*step(.45,fract(ang*28./6.2831853)));
  col=mix(col,red,smoothstep(R100,1.,r)*.07);
  col=mix(col,ink,fill(min(abs(p.x),abs(p.y)),px*.7)*.1);
  for(int i=0;i<${PRECISION_POINTS};i++){
    vec4 q=u_pts[i];
    if(q.w<0.) continue;
    float pop=clamp(q.z/.22,0.,1.);
    float size=.032+(1.-pop)*.035;
    float d=length(p-q.xy);
    bool bad=q.w>.5;
    vec3 c=bad?red:green;
    float alpha=bad?clamp(1.7-q.z,0.,1.):1.;
    col=mix(col,vec3(1.),fill(d-size,px)*alpha);
    col=mix(col,c,fill(d-size*.68,px)*alpha);
    if(bad) col=mix(col,red,fill(abs(d-q.z*.3),px)*clamp(1.-q.z,0.,1.)*.75);
  }
  col=mix(col,ink,fill(r-.024,px)); col=mix(col,vec3(1.),fill(r-.011,px));
  float edge=1.-smoothstep(.985,1.,r);
  gl_FragColor=vec4(col*edge,edge);
}`;

  function initAccuracy() {
    const slide = document.querySelector('[data-gps-precision-slide]') || $('slide-13') || $('slide-35');
    if (!slide) return;
    const canvas = $('gps-precision-canvas'), wrap = $('gps-precision');
    const ui = { accepted: $('gps-prec-accepted'), rejected: $('gps-prec-rejected'), within: $('gps-prec-within'), reset: $('gps-prec-reset') };
    const envButtons = [...slide.querySelectorAll('[data-gps-env]')];
    const ENV = { outdoor: { sigma: 4.08, outlier: 0.03 }, indoor: { sigma: 9.5, outlier: 0.16 } };
    const quad = canvas ? createQuad(canvas, PRECISION_FRAGMENT, ['u_res', 'u_time', 'u_pts']) : null;
    if (canvas && !quad) wrap?.classList.add('gps-no-webgl');
    const state = { env: 'outdoor', points: [], accepted: 0, rejected: 0, within: 0, clock: 0, nextEmit: 0, last: 0, frame: 0 };
    const buffer = new Float32Array(PRECISION_POINTS * 4);

    function sample() {
      const env = ENV[state.env];
      const outlier = Math.random() < env.outlier;
      const meters = outlier ? 100 + Math.random() * 60 : env.sigma * Math.sqrt(-2 * Math.log(1 - Math.random()));
      const radius = Math.min(Math.sqrt(meters / 120) * 0.95, 0.97), angle = Math.random() * Math.PI * 2;
      const rejected = meters > 100;
      if (rejected) state.rejected++; else { state.accepted++; if (meters <= 10) state.within++; }
      state.points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, born: state.clock, rejected });
      while (state.points.length > PRECISION_POINTS) state.points.shift();
    }
    function updateStats() {
      ui.accepted.textContent = String(state.accepted);
      ui.rejected.textContent = String(state.rejected);
      ui.within.textContent = state.accepted ? `${(state.within / state.accepted * 100).toFixed(1)}%` : '—';
    }
    function draw() {
      if (!quad) return;
      const { gl, u } = quad;
      const [w, h] = quad.resize();
      buffer.fill(0);
      for (let i = 0; i < PRECISION_POINTS; i++) {
        const point = state.points[i];
        if (!point) { buffer[i * 4 + 3] = -1; continue; }
        buffer.set([point.x, point.y, reduced.matches ? 1 : state.clock - point.born, point.rejected ? 1 : 0], i * 4);
      }
      gl.uniform2f(u.u_res, w, h);
      gl.uniform1f(u.u_time, reduced.matches ? 0.2 : state.clock);
      gl.uniform4fv(u.u_pts, buffer);
      quad.draw();
    }
    function reset() {
      Object.assign(state, { points: [], accepted: 0, rejected: 0, within: 0, nextEmit: 0 });
      if (reduced.matches) { for (let i = 0; i < 60; i++) sample(); state.points = state.points.filter(p => !p.rejected); }
      updateStats(); draw();
    }
    function tick(time) {
      state.frame = 0;
      if (!active()) return;
      const dt = state.last ? Math.min((time - state.last) / 1000, 0.1) : 0;
      state.last = time; state.clock += dt;
      if (state.clock >= state.nextEmit) { sample(); updateStats(); state.nextEmit = state.clock + 0.3; }
      state.points = state.points.filter(p => !p.rejected || state.clock - p.born < 1.8);
      draw();
      state.frame = requestAnimationFrame(tick);
    }
    function stop() { cancelAnimationFrame(state.frame); state.frame = 0; state.last = 0; }
    const active = watchSlide(slide, isActive => {
      stop();
      if (!isActive) return;
      reset();
      if (!reduced.matches && canvas) { state.nextEmit = state.clock + 0.4; state.frame = requestAnimationFrame(tick); }
    });
    envButtons.forEach(button => button.addEventListener('click', () => {
      state.env = button.dataset.gpsEnv;
      envButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      reset();
    }));
    ui.reset?.addEventListener('click', reset);
    addEventListener('resize', () => { if (active()) draw(); });
  }

  const boot = () => { initJourney(); initAccuracy(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
