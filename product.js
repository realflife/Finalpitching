const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const road = (repaired = false) => `<svg class="product-map" viewBox="0 0 360 185" role="img" aria-label="${repaired ? 'ถนนหลังแก้ไข' : 'หมุดถนนชำรุด'} ภาพสมมติ"><rect width="360" height="185" rx="16" fill="#e3efe5"/><path d="M0 45H360M80 0V185M285 0V185" stroke="#c4ddcb" stroke-width="22"/><rect x="115" y="25" width="50" height="35" rx="6" fill="#b5d3bc"/><rect x="240" y="120" width="70" height="35" rx="6" fill="#bed6c4"/><path d="M-10 173L360 13" stroke="white" stroke-width="55"/><path d="M-10 173L360 13" stroke="#9db4aa" stroke-width="40"/><path d="M-10 173L360 13" stroke="white" stroke-width="2" stroke-dasharray="12 12"/>${repaired ? '' : '<path d="m170 98 15 -8 -4 13 19 -6" stroke="#526b60" stroke-width="5" fill="none"/>'}<g class="map-demo-pin"><ellipse cx="185" cy="109" rx="18" ry="6" fill="#163e3033"/><path d="M185 105Q155 74 168 60Q185 43 202 60Q215 74 185 105" fill="${repaired ? '#087f5b' : '#d58b38'}"/><circle cx="185" cy="70" r="7" fill="white"/></g></svg>`;

const features = [
  { title: 'ภาพ + พิกัด + รายละเอียด', status: 'รอรับเรื่อง', copy: 'ข้อมูลประกอบครบในเรื่องเดียว', body: `${road()}<div class="visual-meta"><span>ภาพประกอบ</span><span>หมุดเหตุการณ์</span><span>รายละเอียด</span></div>` },
  { title: 'ความคืบหน้าของเรื่องที่แจ้ง', status: 'กำลังดำเนินการ', copy: 'กลับมาดูเรื่องของตนได้ทุกขั้น', body: '<div class="visual-timeline">' + ['รอรับเรื่อง', 'รับเรื่องแล้ว', 'กำลังดำเนินการ', 'รอตรวจสอบ', 'เสร็จสิ้น'].map((x, i) => `<div class="${i < 3 ? 'done' : ''}"><i></i><span>${x}</span></div>`).join('') + '</div>' },
  { title: 'งานที่รับผิดชอบ', status: 'รอรับงาน', copy: 'แยกงานตามสถานะ พร้อมการกระทำถัดไป', body: '<div class="visual-job"><small>งานตัวอย่าง · DEMO-001</small><strong>ถนนชำรุดบริเวณทางเข้าชุมชน</strong><p>ฝ่ายช่างโยธา · มีข้อมูลจุดเกิดเหตุ</p><div class="visual-action">รับงาน</div><div class="visual-meta"><span>ดูรายละเอียด</span><span>แผนที่ในระบบ</span></div></div>' },
  { title: 'หลักฐานก่อนปิดเรื่อง', status: 'รอตรวจสอบ', copy: 'ผู้ดูแลตรวจผล แล้วจึงยืนยันเสร็จสิ้น', body: `<div class="visual-proof"><div><small>ก่อนดำเนินการ</small>${road()}</div><div><small>หลังดำเนินการ</small>${road(true)}</div></div><div class="visual-review">✓ ภาพประกอบ + รายละเอียดผลการแก้ไข</div>` }
];

function selectFeature(index) {
  const f = features[index];
  if (!f) return;
  document.querySelectorAll('[data-product-feature]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.productFeature === index)));
  const vis = $('feature-visual');
  if (vis) {
    vis.innerHTML = `<div class="feature-shadow-card" aria-hidden="true"></div><div class="feature-main-card"><div class="visual-brand">Phetpri<span>Report</span><small>DEMO</small></div><h3>${f.title}</h3>${f.body}<div class="visual-state"><i></i>${f.status}</div></div><div class="feature-floating-card"><span>0${index + 1}</span><strong>${f.copy}</strong></div>`;
  }
  const ann = $('feature-announcer');
  if (ann) ann.textContent = f.title + ' — ' + f.copy;
}

document.querySelectorAll('[data-product-feature]').forEach(b => b.onclick = () => selectFeature(+b.dataset.productFeature));
selectFeature(0);

// Roles preview on Slide 14
const roles = {
  citizen: { title: 'ประชาชน', copy: 'แจ้งปัญหา แล้วกลับมาดูความคืบหน้าของเรื่องที่ตนเองแจ้ง', image: 'citizen-profile-desktop.webp' },
  officer: { title: 'เจ้าหน้าที่', copy: 'รับงาน ตรวจรายละเอียด แล้วบันทึกผลพร้อมภาพเพื่อส่งตรวจสอบ', image: 'officer-profile-desktop.webp' },
  admin: { title: 'ผู้ดูแล', copy: 'ตรวจเรื่อง มอบหมายงาน ดูภาพรวม และตรวจผลก่อนปิดเรื่อง', image: 'dashboard-desktop.webp' }
};

document.querySelectorAll('[data-launch-role]').forEach(b => b.onclick = () => {
  const r = roles[b.dataset.launchRole];
  if (!r) return;
  document.querySelectorAll('[data-launch-role]').forEach(n => n.setAttribute('aria-pressed', String(n === b)));
  const img = $('launch-screen-image');
  if (img) {
    img.src = 'assets/screens/' + r.image;
    img.alt = 'ตัวอย่าง UI ' + r.title + ' ใช้ข้อมูลสมมติ';
  }
  const t = $('launch-role-title');
  if (t) t.textContent = r.title;
  const d = $('launch-role-description');
  if (d) d.textContent = r.copy;
});

// Benchmark Details Dialog on Slide 12
const benchDetailModal = $('bench-detail-dialog');
const openBenchDetail = $('open-bench-detail');
const closeBenchDetail = $('close-bench-detail');
if (benchDetailModal && openBenchDetail) {
  openBenchDetail.onclick = () => {
    if (typeof benchDetailModal.showModal === 'function') benchDetailModal.showModal();
  };
  closeBenchDetail?.addEventListener('click', () => benchDetailModal.close());
  benchDetailModal.addEventListener('click', e => { if (e.target === benchDetailModal) benchDetailModal.close(); });
}

// QR Dialog on Slide 14
const qrDialog = $('qr-dialog');
const openQr = $('open-qr-dialog');
const closeQr = $('close-qr-dialog');
const qrImg = document.querySelector('.launch-qr-img');
if (qrDialog) {
  const showQr = () => { if (typeof qrDialog.showModal === 'function' && !qrDialog.open) qrDialog.showModal(); };
  openQr?.addEventListener('click', showQr);
  qrImg?.addEventListener('click', showQr);
  closeQr?.addEventListener('click', () => qrDialog.close());
  qrDialog.addEventListener('click', e => { if (e.target === qrDialog) qrDialog.close(); });
}
