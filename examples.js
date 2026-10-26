// Presentation-only images: report excerpts and captured UI with fictional fixtures.
const triggers=[...document.querySelectorAll('[data-example-image]')];
const allowed=new Set(triggers.map(b=>b.dataset.exampleImage));
const dialog=document.createElement('dialog');dialog.className='example-viewer';dialog.setAttribute('aria-labelledby','example-viewer-title');
dialog.innerHTML='<header class="analysis-dialog-header"><h2 id="example-viewer-title"></h2><button type="button" class="analysis-close">ปิดภาพ ×</button></header><div class="viewer-tools"><button type="button" data-image-zoom="out" aria-label="ซูมออก">−</button><output aria-live="polite">100%</output><button type="button" data-image-zoom="in" aria-label="ซูมเข้า">+</button><button type="button" data-image-zoom="fit">พอดีจอ</button><button type="button" data-image-zoom="read">ขนาดอ่าน</button><p>ภาพนิ่งจากตัวอย่าง · เลื่อนดูส่วนที่อยู่ใต้จอได้</p></div><div class="example-image-scroll"><img alt=""></div><p class="example-image-error" hidden>โหลดภาพไม่ได้ กรุณาปิดและลองอีกครั้ง</p>';
document.body.append(dialog);
const img=dialog.querySelector('img'),scroll=dialog.querySelector('.example-image-scroll'),error=dialog.querySelector('.example-image-error');let trigger,zoom=1,mode='read';
function scale(value){zoom=Math.max(.1,Math.min(3,value));img.style.width=img.naturalWidth*zoom+'px';dialog.querySelector('output').textContent=Math.round(zoom*100)+'%';}
function view(nextMode){mode=nextMode;if(!img.naturalWidth)return;const availableWidth=scroll.clientWidth-32,availableHeight=scroll.clientHeight-32;scale(Math.min(1,availableWidth/img.naturalWidth,...(mode==='fit'?[availableHeight/img.naturalHeight]:[])));scroll.scrollTo(0,0);}
img.onload=()=>{error.hidden=true;img.hidden=false;view('read');};img.onerror=()=>{img.hidden=true;error.hidden=false;};
triggers.forEach(b=>b.addEventListener('click',()=>{if(!allowed.has(b.dataset.exampleImage))return;trigger=b;dialog.querySelector('h2').textContent=b.dataset.exampleTitle;img.alt=b.dataset.exampleTitle+' · ตัวอย่างสำหรับการนำเสนอ';img.hidden=true;error.hidden=true;dialog.showModal();dialog.querySelector('.analysis-close').focus();img.src=b.dataset.exampleImage;}));
dialog.querySelector('.analysis-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));dialog.addEventListener('keydown',e=>e.stopPropagation());
dialog.querySelectorAll('[data-image-zoom]').forEach(b=>b.onclick=()=>{const action=b.dataset.imageZoom;if(action==='fit'||action==='read')view(action);else{mode='manual';scale(zoom+(action==='in'?.2:-.2));}});
window.addEventListener('resize',()=>{if(dialog.open&&mode!=='manual')view(mode);});
