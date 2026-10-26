/* A restrained contour field, not a geographic map. No external WebGL library. */
(() => {
  'use strict';
  const canvas = document.getElementById('contour-canvas');
  if (!canvas) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = true, frame = 0, last = 0;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) { canvas.hidden = true; return; }
  const vertex = 'attribute vec2 a_position; void main(){gl_Position=vec4(a_position,0.0,1.0);}';
  const fragment = `precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    void main(){
      vec2 p=gl_FragCoord.xy/u_resolution;
      float wave=.20*sin(p.x*5.4+u_time*.06)+.065*sin(p.x*10.0-u_time*.04);
      float bend=.32+wave+.28*p.x;
      float field=(p.y-bend)*49.0;
      float line=1.0-smoothstep(.015,.085,abs(fract(field)-.5));
      float band=exp(-pow((p.y-bend)*2.0,2.0));
      float fade=smoothstep(.02,.60,p.x)*smoothstep(0.0,.20,p.y)*(.2+.8*band);
      vec3 emerald=vec3(.03,.50,.36);
      gl_FragColor=vec4(mix(vec3(1.0),emerald,line*fade*.48),1.0);
    }`;
  function shader(type, source) {
    const result = gl.createShader(type); gl.shaderSource(result, source); gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) { gl.deleteShader(result); return null; }
    return result;
  }
  const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) { canvas.hidden = true; return; }
  const program = gl.createProgram(); gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) { canvas.hidden = true; return; }
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program,'a_position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const resolution = gl.getUniformLocation(program,'u_resolution'), time = gl.getUniformLocation(program,'u_time');
  function resize() {
    const rect = canvas.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1,1.5);
    const width = Math.max(1,Math.round(rect.width*ratio)), height = Math.max(1,Math.round(rect.height*ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height); }
    gl.uniform2f(resolution,width,height);
  }
  function draw(now) {
    frame=0;
    if (!active || document.hidden || gl.isContextLost()) return;
    if (now-last>=33 || reduced.matches) {
      resize(); gl.uniform1f(time,reduced.matches ? 0 : now/1000); gl.drawArrays(gl.TRIANGLES,0,6); last=now;
    }
    if (!reduced.matches) frame=requestAnimationFrame(draw);
  }
  function refresh() { if(frame)cancelAnimationFrame(frame);frame=0;if(active && !document.hidden)frame=requestAnimationFrame(draw); }
  window.PhetpriContours = { setActive(value){ active=value;refresh(); } };
  window.addEventListener('resize',refresh,{passive:true});
  document.addEventListener('visibilitychange',refresh);
  reduced.addEventListener('change',refresh);
  canvas.addEventListener('webglcontextlost',event => { event.preventDefault();if(frame)cancelAnimationFrame(frame);canvas.hidden=true; });
  refresh();
})();
