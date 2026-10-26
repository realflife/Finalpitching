import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

function makeSoftShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  grad.addColorStop(0, 'rgba(15, 55, 40, 0.38)');
  grad.addColorStop(1, 'rgba(15, 55, 40, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

const sharedShadowTex = makeSoftShadowTexture();

function attachStageDrag(stage, getYaw, setYaw, step = 0.22, onClickPick = null) {
  let drag = null;
  stage.style.cursor = 'grab';
  stage.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, startYaw: getYaw(), moved: false };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!drag || drag.id !== e.pointerId) return;
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) drag.moved = true;
    if (!drag.moved) return;
    stage.style.cursor = 'grabbing';
    setYaw(drag.startYaw + (e.clientX - drag.x) * 0.0055);
  });
  stage.addEventListener('pointerup', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const wasClick = !drag.moved;
    drag = null;
    if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    stage.style.cursor = 'grab';
    if (wasClick && onClickPick) onClickPick(e);
  });
  stage.addEventListener('pointercancel', () => { drag = null; stage.style.cursor = 'grab'; });
  stage.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Home') setYaw(0);
    else setYaw(getYaw() + (e.key === 'ArrowLeft' ? -step : step));
  });
}

/* ==========================================================================
   SCENE 1: Slide 2 — Legacy 6-Step Workflow 3D Motion Simulation
   (Shows the actual resolution flow of the legacy system:
    1. Phone call vs Walking in person -> 2. Registry ledger & paper receipt ->
    3. Supervisor folder routing -> 4. Field inspection & budget estimate ->
    5. Budget stamp approval & road repair -> 6. Internal filing & citizen calling to ask)
   ========================================================================== */
const LEGACY_STEPS_DATA = [
  {
    title: 'ประชาชนแจ้งปัญหา (โทรแจ้ง หรือ เดินทางไปเอง)',
    actor: 'ประชาชน → เจ้าหน้าที่รับเรื่อง (ในเวลาราชการ)',
    detail: 'เมื่อพบปัญหา เช่น ถนนชำรุด ประชาชนต้องโทรศัพท์แจ้งในเวลาราชการ (อธิบายตำแหน่งด้วยคำพูด) หรือต้องเดินทางไปแจ้งด้วยตนเองที่สำนักงานเทศบาล',
    note: '60.5% เลือกปล่อยผ่านเพราะต้องเดินทางไปสำนักงานหรือโทรในเวลาราชการ และอธิบายพิกัดด้วยคำพูดทำให้คลาดเคลื่อนง่าย',
    activePins: ['home', 'desk1', 'site'],
    phases: [
      {
        label: '1/3 · พบปัญหาหน้างาน → โทรศัพท์แจ้งเทศบาล (อธิบายพิกัดด้วยคำพูด)',
        bubble: '📞 โทรแจ้งในเวลาราชการ · อธิบายตำแหน่งด้วยคำพูด',
        tone: 'warn',
      },
      {
        label: '2/3 · หรือต้องเดินทางจากบ้านมาติดต่อที่เคาน์เตอร์เทศบาลด้วยตนเอง',
        bubble: '🚶 เดินทางมาแจ้งด้วยตนเองที่สำนักงานเทศบาล',
        tone: 'gold',
      },
      {
        label: '3/3 · ยืนอธิบายรายละเอียดปัญหาและจุดเกิดเหตุต่อเจ้าหน้าที่รับเรื่อง',
        bubble: '🗣️ อธิบายรายละเอียดปัญหาหน้าเคาน์เตอร์รับเรื่อง',
        tone: 'normal',
      },
    ],
  },
  {
    title: 'เจ้าหน้าที่บันทึกเรื่องลงสมุดทะเบียน & ออกใบรับเรื่อง',
    actor: 'เจ้าหน้าที่รับเรื่อง → สมุดทะเบียน / ใบรับเรื่องกระดาษ',
    detail: 'เจ้าหน้าที่จดชื่อผู้แจ้ง เบอร์โทรศัพท์ ลักษณะปัญหา และสถานที่ลงในสมุดทะเบียนรับเรื่องด้วยมือ พร้อมออกใบรับเรื่องกระดาษให้ประชาชนถือกลับบ้าน',
    note: 'ข้อมูลอยู่ในสมุดกระดาษค้นหายาก ประชาชนได้แค่ใบรับเรื่องกลับบ้านแต่เช็กสถานะออนไลน์ไม่ได้เลย',
    activePins: ['desk1', 'home'],
    phases: [
      {
        label: '1/3 · เจ้าหน้าที่รับเรื่องจดข้อมูลลงสมุดทะเบียนรับเรื่องด้วยมือ',
        bubble: '📒 จดชื่อผู้แจ้งและพิกัดลงสมุดทะเบียนกระดาษ',
        tone: 'gold',
      },
      {
        label: '2/3 · ออกเอกสารใบรับเรื่องกระดาษส่งมอบให้ประชาชน',
        bubble: '🧾 ออกใบรับเรื่องกระดาษให้ประชาชน',
        tone: 'normal',
      },
      {
        label: '3/3 · ประชาชนถือใบรับเรื่องกลับบ้าน (เริ่มรอโดยไม่รู้ความคืบหน้า)',
        bubble: '🏠 ประชาชนกลับบ้านรอผล · ไม่รู้ว่าเรื่องถึงขั้นไหน',
        tone: 'warn',
      },
    ],
  },
  {
    title: 'หัวหน้าส่วนงานพิจารณามอบหมายงาน',
    actor: 'โต๊ะรับเรื่อง → หัวหน้าส่วนงาน → เจ้าหน้าที่ผู้รับผิดชอบ',
    detail: 'เจ้าหน้าที่รวบรวมเรื่องใส่แฟ้มกระดาษเดินส่งให้หัวหน้าส่วนงานพิจารณาประเภทปัญหา แล้วจึงส่งแฟ้มมอบหมายต่อให้เจ้าหน้าที่ฝ่ายช่างที่รับผิดชอบ',
    note: 'ต้องรอแฟ้มกระดาษเดินตามลำดับชั้น (โต๊ะต่อโต๊ะ) เสี่ยงเอกสารตกหล่นหรือค้างบนโต๊ะ',
    activePins: ['desk1', 'desk2', 'desk3'],
    phases: [
      {
        label: '1/3 · เดินส่งแฟ้มกระดาษจากโต๊ะรับเรื่องไปยังโต๊ะหัวหน้าส่วนงาน',
        bubble: '📁 ส่งแฟ้มเอกสารให้หัวหน้าส่วนงาน',
        tone: 'gold',
      },
      {
        label: '2/3 · หัวหน้าส่วนงานเปิดแฟ้มพิจารณาประเภทปัญหาและหน่วยงาน',
        bubble: '🧐 หัวหน้าพิจารณาประเภทปัญหาจากแฟ้ม',
        tone: 'normal',
      },
      {
        label: '3/3 · ส่งแฟ้มมอบหมายงานต่อให้เจ้าหน้าที่ฝ่ายช่างผู้รับผิดชอบ',
        bubble: '👉 มอบหมายแฟ้มงานให้เจ้าหน้าที่ฝ่ายช่าง',
        tone: 'normal',
      },
    ],
  },
  {
    title: 'เจ้าหน้าที่ลงพื้นที่สำรวจ & ประเมินงบประมาณ',
    actor: 'เจ้าหน้าที่ฝ่ายช่าง → พื้นที่เกิดเหตุถนนชำรุด',
    detail: 'เจ้าหน้าที่เดินทางออกสำรวจพื้นที่จริงตามคำบอกเล่า ตรวจสอบความเสียหาย วัดขนาดพื้นที่ และจดประเมินงบประมาณกลับไปทำเรื่องขออนุมัติ (ยังซ่อมทันทีไม่ได้)',
    note: 'ไร้พิกัด GPS ที่แม่นยำทำให้หาจุดเกิดเหตุยาก และลงพื้นที่รอบแรกเป็นเพียงการสำรวจประเมินงบ ถนนจึงยังไม่ถูกซ่อม',
    activePins: ['desk3', 'site'],
    phases: [
      {
        label: '1/3 · เจ้าหน้าที่ฝ่ายช่างเดินทางจากสำนักงานไปยังจุดถนนชำรุด',
        bubble: '🛻 เดินทางออกสำรวจพื้นที่จริงตามคำบอกเล่า',
        tone: 'gold',
      },
      {
        label: '2/3 · ตรวจสอบความเสียหายจริงและวัดขนาดหลุม/รอยแตก',
        bubble: '🔍 สำรวจความเสียหายจริงหน้างาน',
        tone: 'normal',
      },
      {
        label: '3/3 · จดประเมินงบประมาณแล้วเดินทางกลับสำนักงาน (ยังไม่ได้ซ่อม)',
        bubble: '💰 ประเมินงบประมาณกลับไปขออนุมัติ (ยังไม่ซ่อม)',
        tone: 'warn',
      },
    ],
  },
  {
    title: 'ขออนุมัติงบประมาณและแผน → ลงพื้นที่แก้ไขจริง',
    actor: 'หัวหน้าส่วนงานอนุมัติ → เจ้าหน้าที่ลงมือซ่อมแซม',
    detail: 'เจ้าหน้าที่ทำเรื่องขออนุมัติงบประมาณและแผนการดำเนินงาน เมื่อหัวหน้าประทับตราอนุมัติแล้ว จึงนำรถและเครื่องมือลงพื้นที่ซ่อมแซมถนนตามแผน',
    note: 'ต้องรออนุมัติงบประมาณและแผนงานเป็นเอกสารก่อนเริ่มลงมือซ่อม โดยประชาชนไม่เห็นความคืบหน้าเลย',
    activePins: ['desk2', 'desk3', 'site'],
    phases: [
      {
        label: '1/3 · เสนอแฟ้มแผนดำเนินงานและงบประมาณต่อหัวหน้าส่วนงาน',
        bubble: '📋 เสนอขออนุมัติงบประมาณและแผนซ่อมแซม',
        tone: 'gold',
      },
      {
        label: '2/3 · หัวหน้าส่วนงานประทับตราอนุมัติงบประมาณและแผนงาน',
        bubble: '✅ ประทับตราอนุมัติงบประมาณและแผนดำเนินงาน',
        tone: 'normal',
      },
      {
        label: '3/3 · เจ้าหน้าที่นำเครื่องมือลงพื้นที่ซ่อมแซมถนนจนเรียบร้อย',
        bubble: '🛠️ ลงพื้นที่ดำเนินการซ่อมแซมถนนจนเสร็จ',
        tone: 'normal',
      },
    ],
  },
  {
    title: 'รายงานผลเป็นหนังสือภายใน & ประชาชนต้องโทรถามเอง',
    actor: 'เก็บหนังสือเข้าตู้เอกสาร · ประชาชนต้องโทรสอบถามเอง',
    detail: 'เมื่อซ่อมเสร็จ เจ้าหน้าที่ทำหนังสือรายงานผลภายในเก็บเข้าตู้เอกสารเทศบาล ไม่มีการแจ้งเตือนอัตโนมัติ ประชาชนจะรู้ผลก็ต่อเมื่อโทรศัพท์เข้ามาสอบถามเองเท่านั้น',
    note: '94.4% ระบุว่าติดตามเรื่องยากหรือไม่เคยรู้ผลเลย และ 78.9% ต้องการระบบแจ้งเตือนอัตโนมัติแทนการโทรถามเอง',
    activePins: ['cabinet', 'home', 'desk1'],
    phases: [
      {
        label: '1/3 · เจ้าหน้าที่ทำหนังสือรายงานผลภายในเก็บเข้าตู้เอกสารเทศบาล',
        bubble: '🗄️ เก็บหนังสือรายงานผลภายในเข้าตู้เอกสาร',
        tone: 'gold',
      },
      {
        label: '2/3 · ประชาชนที่บ้านไม่รู้ว่าแก้เสร็จหรือยัง ต้องโทรศัพท์เข้ามาถามเอง!',
        bubble: '❓ ไม่มีแจ้งเตือน! ประชาชนต้องโทรถามผลเอง',
        tone: 'warn',
      },
      {
        label: '3/3 · เจ้าหน้าที่เปิดแฟ้มตรวจสอบแล้วแจ้งผลทางโทรศัพท์เมื่อมีคนโทรถาม',
        bubble: '📞 เจ้าหน้าที่เปิดแฟ้มแจ้งผลเมื่อประชาชนโทรมาถาม',
        tone: 'normal',
      },
    ],
  },
];

function initPainpointScene() {
  const slide = document.getElementById('slide-2');
  const stage = document.getElementById('painpoint-3d-stage');
  if (!slide || !stage) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xffffff, 0);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
  camera.position.set(0, 8.8, 13.6);
  camera.lookAt(0, 0.25, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x769987, 2.0));
  const dirLight = new THREE.DirectionalLight(0xfff8eb, 2.3);
  dirLight.position.set(-5, 12, 8);
  scene.add(dirLight);

  const root = new THREE.Group();
  scene.add(root);

  const mat = (color, rough = 0.48, emissive = 0x000000, eInt = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.06, emissive, emissiveIntensity: eInt });

  const box = (parent, size, pos, color, radius = 0.06, rough = 0.48) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(size[0], size[1], size[2], 2, radius), mat(color, rough));
    m.position.set(pos[0], pos[1], pos[2]);
    parent.add(m);
    return m;
  };

  const sphere = (parent, r, pos, color, emissive = 0x000000, eInt = 0) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), mat(color, 0.35, emissive, eInt));
    m.position.set(pos[0], pos[1], pos[2]);
    parent.add(m);
    return m;
  };

  // 1. Town Ground Platform & Road Network
  box(root, [11.8, 0.32, 7.6], [0, -0.22, 0], 0xd9eee2, 0.16, 0.65);
  // Main horizontal road in front
  box(root, [11.2, 0.1, 1.9], [0, -0.02, 1.8], 0x7a918a, 0.04, 0.75);
  for (let x = -4.8; x <= 4.8; x += 1.05) {
    box(root, [0.48, 0.02, 0.07], [x, 0.04, 1.8], 0xffffff, 0.01, 0.3);
  }
  // Walkway from road to Municipal Reception Desk (-2.65)
  box(root, [1.15, 0.06, 2.1], [-2.65, 0.0, 0.35], 0xb8cfc4, 0.02, 0.6);
  // Driveway from road to Field Officer Station (+1.85)
  box(root, [1.35, 0.06, 2.1], [1.85, 0.0, 0.35], 0x9ab0a7, 0.02, 0.65);

  // 2. Left Zone: Citizen Home / Community (-4.3, 1.65)
  const homeGroup = new THREE.Group();
  homeGroup.position.set(-4.35, 0.04, 1.55);
  root.add(homeGroup);
  box(homeGroup, [1.65, 1.15, 1.45], [0, 0.58, -0.35], 0xffffff, 0.08, 0.4);
  const homeRoof = new THREE.Mesh(new THREE.ConeGeometry(1.32, 0.78, 4), mat(0x087f5b, 0.42));
  homeRoof.position.set(0, 1.52, -0.35);
  homeRoof.rotation.y = Math.PI / 4;
  homeGroup.add(homeRoof);
  box(homeGroup, [0.38, 0.68, 0.08], [0, 0.36, 0.38], 0x164e3b, 0.02);

  // 3. Center-Back Zone: Open-Cutaway Municipal Office Building
  const officeGroup = new THREE.Group();
  root.add(officeGroup);
  // Office Floor & Back/Side Walls
  box(officeGroup, [7.6, 0.2, 3.3], [-0.4, 0.04, -1.75], 0xfcfbf7, 0.08);
  box(officeGroup, [7.6, 2.35, 0.18], [-0.4, 1.22, -3.32], 0xf7f5ec, 0.06);
  box(officeGroup, [7.8, 0.32, 0.42], [-0.4, 2.48, -3.26], 0x087f5b, 0.08);
  box(officeGroup, [0.16, 2.2, 3.1], [-4.12, 1.12, -1.75], 0xf2efe4, 0.04);
  box(officeGroup, [0.16, 2.2, 3.1], [3.32, 1.12, -1.75], 0xf2efe4, 0.04);
  // Municipal Crest
  const crest = sphere(officeGroup, 0.28, [-0.4, 2.02, -3.16], 0x087f5b, 0x087f5b, 0.2);
  crest.scale.z = 0.2;

  // 3 Interior Desks: Desk 1 (Reception -2.65), Desk 2 (Supervisor -0.35), Desk 3 (Field Officer +1.85)
  const deskPositions = [-2.65, -0.35, 1.85];
  const deskColors = [0x0c8599, 0x1e3a5f, 0xd97706];
  deskPositions.forEach((dx, idx) => {
    box(officeGroup, [1.58, 0.14, 0.78], [dx, 0.84, -1.5], 0xeab308, 0.04);
    box(officeGroup, [1.46, 0.72, 0.08], [dx, 0.44, -1.16], deskColors[idx], 0.02);
    for (const legX of [-0.65, 0.65]) {
      box(officeGroup, [0.1, 0.74, 0.58], [dx + legX, 0.42, -1.5], 0xffffff, 0.02);
    }
    // Backboard panel behind each station
    box(officeGroup, [1.2, 0.75, 0.06], [dx, 1.62, -3.2], 0xd9eee2, 0.03);
  });

  // Desk 1 Landline Telephone & Registry Book (สมุดทะเบียนรับเรื่อง)
  const deskPhone = new THREE.Group();
  deskPhone.position.set(-3.12, 0.95, -1.42);
  officeGroup.add(deskPhone);
  box(deskPhone, [0.26, 0.1, 0.22], [0, 0, 0], 0x1e293b, 0.03);
  box(deskPhone, [0.28, 0.06, 0.09], [0, 0.08, 0], 0xd9483b, 0.03);

  const registryBook = new THREE.Group();
  registryBook.position.set(-2.5, 0.93, -1.48);
  officeGroup.add(registryBook);
  box(registryBook, [0.58, 0.04, 0.42], [0, 0, 0], 0x0c8599, 0.02);
  box(registryBook, [0.25, 0.02, 0.36], [-0.13, 0.03, 0], 0xffffff, 0.01);
  box(registryBook, [0.25, 0.02, 0.36], [0.13, 0.03, 0], 0xffffff, 0.01);

  // Filing Cabinet (ตู้เก็บเอกสารภายใน) at left-back of office (-3.55, -2.45)
  const cabinetGroup = new THREE.Group();
  cabinetGroup.position.set(-3.55, 0.14, -2.45);
  officeGroup.add(cabinetGroup);
  box(cabinetGroup, [0.68, 1.35, 0.65], [0, 0.68, 0], 0x94b8a8, 0.05);
  for (let i = 0; i < 3; i++) {
    box(cabinetGroup, [0.54, 0.34, 0.05], [0, 0.32 + i * 0.4, 0.33], 0xdff0e6, 0.02);
    box(cabinetGroup, [0.2, 0.04, 0.04], [0, 0.32 + i * 0.4, 0.37], 0x087f5b, 0.01);
  }

  // 4. Right-Front Zone: Damaged Road Incident Site (+3.55, 1.8)
  const siteGroup = new THREE.Group();
  siteGroup.position.set(3.55, 0.04, 1.8);
  root.add(siteGroup);
  const damageMesh = box(siteGroup, [1.75, 0.07, 1.05], [0, 0.02, 0], 0x3b4d47, 0.08, 0.8);
  const cracksGroup = new THREE.Group();
  siteGroup.add(cracksGroup);
  for (let i = 0; i < 6; i++) {
    const crack = box(
      cracksGroup,
      [0.62, 0.025, 0.06],
      [-0.45 + i * 0.18, 0.065, -0.2 + (i % 2) * 0.32],
      0x182621,
      0.01
    );
    crack.rotation.y = (i % 2 ? 1 : -1) * 0.58;
  }
  const conesGroup = new THREE.Group();
  siteGroup.add(conesGroup);
  for (const cx of [-0.95, 0.95]) {
    box(conesGroup, [0.34, 0.05, 0.34], [cx, 0.04, 0.58], 0x1e293b, 0.02);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.46, 14), mat(0xf97316, 0.35, 0xc2410c, 0.2));
    cone.position.set(cx, 0.28, 0.58);
    conesGroup.add(cone);
  }
  const siteRing = new THREE.Mesh(
    new THREE.RingGeometry(0.85, 1.02, 36),
    new THREE.MeshBasicMaterial({ color: 0xe0533c, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
  );
  siteRing.rotation.x = -Math.PI / 2;
  siteRing.position.y = 0.07;
  siteGroup.add(siteRing);

  // 5. Articulated 3D Characters
  function makePerson(shirtColor, hatColor = null) {
    const group = new THREE.Group();
    root.add(group);
    box(group, [0.38, 0.62, 0.28], [0, 0.78, 0], shirtColor, 0.08);
    sphere(group, 0.21, [0, 1.3, 0], 0xeab68c);
    if (hatColor) {
      const helmet = sphere(group, 0.23, [0, 1.42, 0], hatColor, hatColor, 0.15);
      helmet.scale.set(1.05, 0.65, 1.08);
    } else {
      const hair = sphere(group, 0.215, [0, 1.4, -0.02], 0x1d352e);
      hair.scale.set(1, 0.62, 0.92);
    }
    const legs = [-0.1, 0.1].map(lx => box(group, [0.13, 0.45, 0.16], [lx, 0.24, 0], 0x1f3a33, 0.04));
    const arms = [-0.26, 0.26].map(ax => box(group, [0.12, 0.48, 0.13], [ax, 0.8, 0], shirtColor, 0.04));
    return { group, legs, arms };
  }

  const citizen = makePerson(0x087f5b);      // Emerald shirt (ประชาชน)
  const receiver = makePerson(0x0c8599);     // Cyan-blue uniform (เจ้าหน้าที่รับเรื่อง)
  const boss = makePerson(0x1e3a5f);         // Navy suit (หัวหน้าส่วนงาน)
  const officer = makePerson(0xd97706, 0xfbbf24); // Amber vest + yellow safety helmet (เจ้าหน้าที่ฝ่ายช่าง)

  receiver.group.position.set(-2.65, 0.14, -2.15);
  boss.group.position.set(-0.35, 0.14, -2.15);

  // 6. Animated Props (Hand Phone, Signal Wave, Walk Path, Receipt, Folder, Stamp, Truck, Clipboard, Tool)
  const handPhone = new THREE.Group();
  root.add(handPhone);
  box(handPhone, [0.14, 0.28, 0.08], [0, 0, 0], 0x111827, 0.02);
  box(handPhone, [0.1, 0.2, 0.02], [0, 0.02, 0.05], 0x38bdf8, 0.01);

  // Phone Signal Curve + Moving Signal Pulses (Citizen <-> Desk 1)
  const phoneArcGroup = new THREE.Group();
  root.add(phoneArcGroup);
  const phoneCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-3.55, 1.45, 1.55),
    new THREE.Vector3(-3.1, 3.25, 0.05),
    new THREE.Vector3(-3.05, 1.15, -1.42)
  );
  const phoneTube = new THREE.Mesh(
    new THREE.TubeGeometry(phoneCurve, 32, 0.038, 8, false),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.82 })
  );
  phoneArcGroup.add(phoneTube);
  const signalDots = [0, 1, 2].map(() =>
    sphere(phoneArcGroup, 0.13, [0, 0, 0], 0xfef08a, 0xf59e0b, 0.85)
  );
  const phoneWaveRing = new THREE.Mesh(
    new THREE.RingGeometry(0.32, 0.46, 28),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  phoneWaveRing.rotation.x = -Math.PI / 2;
  phoneArcGroup.add(phoneWaveRing);

  // Walking Path Guide (Citizen House -> Municipal Reception Counter)
  const walkPathGroup = new THREE.Group();
  root.add(walkPathGroup);
  const walkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.75, 0.08, 1.55),
    new THREE.Vector3(-2.65, 0.08, 1.55),
    new THREE.Vector3(-2.65, 0.08, -0.35),
  ]);
  const walkTube = new THREE.Mesh(
    new THREE.TubeGeometry(walkCurve, 28, 0.05, 8, false),
    new THREE.MeshBasicMaterial({ color: 0x087f5b, transparent: true, opacity: 0.75 })
  );
  walkPathGroup.add(walkTube);
  const walkMarkers = [0.15, 0.4, 0.65, 0.9].map(t => {
    const pt = walkCurve.getPoint(t);
    const m = sphere(walkPathGroup, 0.09, [pt.x, pt.y + 0.04, pt.z], 0x22c55e, 0x087f5b, 0.5);
    return { mesh: m, baseT: t };
  });

  // Receipt Slip (ใบรับเรื่องกระดาษ)
  const receiptGroup = new THREE.Group();
  root.add(receiptGroup);
  box(receiptGroup, [0.42, 0.03, 0.52], [0, 0, 0], 0xffffff, 0.01);
  box(receiptGroup, [0.3, 0.015, 0.08], [0, 0.02, -0.14], 0x087f5b, 0.005);
  box(receiptGroup, [0.3, 0.015, 0.05], [0, 0.02, 0.02], 0x94a3b8, 0.005);

  // Complaint Paper Folder (แฟ้มเรื่องร้องเรียน / แฟ้มขออนุมัติ / หนังสือภายใน)
  const folderGroup = new THREE.Group();
  root.add(folderGroup);
  box(folderGroup, [0.58, 0.045, 0.72], [0, 0, 0], 0xfbbf24, 0.015);
  box(folderGroup, [0.48, 0.025, 0.62], [0, 0.03, 0], 0xffffff, 0.01);
  for (let i = 0; i < 3; i++) {
    box(folderGroup, [0.34, 0.01, 0.04], [0, 0.048, -0.16 + i * 0.14], 0x087f5b, 0.005);
  }

  // Approval Stamp (ตราประทับอนุมัติงบประมาณ)
  const stampGroup = new THREE.Group();
  root.add(stampGroup);
  box(stampGroup, [0.42, 0.14, 0.34], [0, 0, 0], 0x087f5b, 0.03);
  box(stampGroup, [0.15, 0.32, 0.15], [0, 0.22, 0], 0xf59e0b, 0.03);
  const stampSeal = box(root, [0.32, 0.02, 0.24], [-0.35, 0.94, -1.42], 0x10b981, 0.01);

  // Municipal Survey & Repair Pickup Truck (รถตรวจการ/ซ่อมบำรุงเทศบาล)
  const truckGroup = new THREE.Group();
  truckGroup.position.set(1.85, 0.24, 0.35);
  root.add(truckGroup);
  box(truckGroup, [1.15, 0.36, 0.66], [0, 0, 0], 0x087f5b, 0.06);
  box(truckGroup, [0.56, 0.28, 0.58], [0.18, 0.28, 0], 0xe6f7f0, 0.05);
  const truckBeacon = sphere(truckGroup, 0.09, [0.18, 0.46, 0], 0xf59e0b, 0xd97706, 0.9);

  // Inspection Clipboard (แผ่นประเมินงบประมาณ) & Repair Tool (เครื่องมือซ่อมถนน)
  const clipboardGroup = new THREE.Group();
  root.add(clipboardGroup);
  box(clipboardGroup, [0.36, 0.04, 0.48], [0, 0, 0], 0x92400e, 0.01);
  box(clipboardGroup, [0.3, 0.02, 0.4], [0, 0.025, 0], 0xffffff, 0.01);

  const toolGroup = new THREE.Group();
  root.add(toolGroup);
  box(toolGroup, [0.09, 0.72, 0.09], [0, 0, 0], 0xf59e0b, 0.02);
  box(toolGroup, [0.46, 0.18, 0.2], [0, 0.34, 0], 0x1e293b, 0.02);

  // Active Station Floor Halo
  const activeHalo = new THREE.Mesh(
    new THREE.RingGeometry(0.54, 0.68, 40),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  activeHalo.rotation.x = -Math.PI / 2;
  activeHalo.position.y = 0.08;
  root.add(activeHalo);

  // 7. Playback & Step State
  let currentStep = 0;       // 0..5
  let stepProgress = 0;      // 0..1 within current step
  let stepDuration = 5800;   // 5.8s per step for clear viewing
  let isPlaying = true;
  let isAutoAll = true;      // Start playing smoothly on load
  let step1Channel = 'both'; // 'both' | 'phone' | 'walk'
  let yaw = 0;
  let targetYaw = 0;
  let lastTime = 0;
  let frame = 0;

  const ease = t => {
    const c = THREE.MathUtils.clamp(t, 0, 1);
    return c * c * (3 - 2 * c);
  };

  const lerpPos = (obj, a, b, t) => {
    const k = ease(t);
    obj.position.set(
      THREE.MathUtils.lerp(a[0], b[0], k),
      THREE.MathUtils.lerp(a[1], b[1], k),
      THREE.MathUtils.lerp(a[2], b[2], k)
    );
  };

  const animateWalk = (personObj, timeVal, intensity = 0.42) => {
    personObj.legs.forEach((leg, i) => {
      leg.rotation.x = Math.sin(timeVal * 16 + i * Math.PI) * intensity;
    });
    personObj.arms.forEach((arm, i) => {
      arm.rotation.x = -Math.sin(timeVal * 16 + i * Math.PI) * (intensity * 0.7);
    });
  };

  const resetPose = personObj => {
    personObj.legs.forEach(l => { l.rotation.x = 0; });
    personObj.arms.forEach(a => { a.rotation.x = 0; a.rotation.z = 0; });
  };

  // 8. Synchronize UI Narration & Controls
  function syncStepUI() {
    const data = LEGACY_STEPS_DATA[currentStep];
    let phaseIdx = stepProgress < 0.36 ? 0 : stepProgress < 0.72 ? 1 : 2;
    if (currentStep === 0) {
      if (step1Channel === 'phone') phaseIdx = 0;
      else if (step1Channel === 'walk') phaseIdx = stepProgress < 0.65 ? 1 : 2;
    }
    const phaseInfo = data.phases[phaseIdx];

    const badge = document.getElementById('painpoint-stage-badge');
    if (badge) {
      badge.textContent = `ขั้นที่ ${currentStep + 1} / 6 · ${data.title}`;
    }

    const chGroup = document.getElementById('step1-channel-group');
    if (chGroup) chGroup.hidden = currentStep !== 0;

    const elNum = document.getElementById('legacy-step-num');
    const elActor = document.getElementById('legacy-step-actor');
    const elTitle = document.getElementById('legacy-step-title');
    const elDetail = document.getElementById('legacy-step-detail');
    const elNote = document.getElementById('legacy-step-note');
    const elPhase = document.getElementById('legacy-step-phase');
    const elFill = document.getElementById('legacy-progress-fill');

    if (elNum) elNum.textContent = `ขั้นที่ ${currentStep + 1} / 6`;
    if (elActor) elActor.textContent = data.actor;
    if (elTitle) elTitle.textContent = data.title;
    if (elDetail) elDetail.textContent = data.detail;
    if (elNote) elNote.textContent = data.note;
    if (elPhase) elPhase.textContent = phaseInfo.label;
    if (elFill) elFill.style.width = `${Math.round(stepProgress * 100)}%`;

    document.querySelectorAll('[data-legacy-step]').forEach((btn, idx) => {
      btn.setAttribute('aria-pressed', String(idx === currentStep));
      btn.dataset.done = String(idx < currentStep);
    });

    const prevBtn = document.getElementById('legacy-prev-btn');
    const nextBtn = document.getElementById('legacy-next-btn');
    const playBtn = document.getElementById('legacy-play-btn');
    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) nextBtn.disabled = currentStep === 5;
    if (playBtn) playBtn.textContent = isPlaying ? '⏸ พักแอนิเมชัน' : '▶ เล่นขั้นนี้';

    // Update Callout Pins active state
    document.querySelectorAll('#legacy-3d-callouts .callout-pin').forEach(pin => {
      const key = pin.dataset.callout;
      pin.classList.toggle('is-active', data.activePins.includes(key));
    });

    // Update Floating Action Bubble text & tone
    const bubble = document.getElementById('legacy-action-bubble');
    const bubbleText = document.getElementById('legacy-bubble-text');
    if (bubble && bubbleText) {
      bubbleText.textContent = phaseInfo.bubble;
      bubble.dataset.tone = phaseInfo.tone;
    }

    // Show Citizen Wait Badge in Steps 2..5 and Step 6 Phase 1-2
    const waitBadge = document.getElementById('citizen-wait-badge');
    if (waitBadge) {
      const isCitizenWaiting =
        (currentStep === 1 && stepProgress > 0.72) ||
        currentStep === 2 ||
        currentStep === 3 ||
        currentStep === 4 ||
        (currentStep === 5 && stepProgress < 0.72);
      waitBadge.hidden = !isCitizenWaiting;
    }
  }

  // 9. Update 3D Scene Choreography & Project 3D Callouts to 2D Screen
  const calloutAnchors = {
    home: new THREE.Vector3(-4.35, 2.05, 1.35),
    desk1: new THREE.Vector3(-2.45, 2.45, -2.75),
    desk2: new THREE.Vector3(-0.25, 2.45, -2.75),
    desk3: new THREE.Vector3(1.95, 2.45, -2.75),
    cabinet: new THREE.Vector3(-4.15, 1.25, -1.65),
    site: new THREE.Vector3(3.55, 1.15, 1.8),
  };
  const bubbleAnchor = new THREE.Vector3(0, 2.2, 0);
  const waitAnchor = new THREE.Vector3(-4.35, 2.85, 1.35);
  const projVec = new THREE.Vector3();

  function projectToOverlay(el, localPos) {
    if (!el || el.hidden) return;
    projVec.copy(localPos).applyAxisAngle(new THREE.Vector3(0, 1, 0), root.rotation.y);
    projVec.project(camera);
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const x = (projVec.x * 0.5 + 0.5) * w;
    const y = (-projVec.y * 0.5 + 0.5) * h;
    el.style.left = `${THREE.MathUtils.clamp(x, 68, w - 68)}px`;
    el.style.top = `${THREE.MathUtils.clamp(y, 52, h - 48)}px`;
  }

  function updateChoreography(p, timeSec) {
    // Reset defaults before applying current step
    [citizen, receiver, boss, officer].forEach(resetPose);
    citizen.group.position.set(-3.65, 0.1, 1.55);
    citizen.group.rotation.y = 0;
    receiver.group.position.set(-2.65, 0.14, -2.15);
    receiver.group.rotation.y = 0;
    boss.group.position.set(-0.35, 0.14, -2.15);
    boss.group.rotation.y = 0;
    officer.group.position.set(1.85, 0.14, -2.15);
    officer.group.rotation.y = 0;

    handPhone.visible = false;
    phoneArcGroup.visible = false;
    walkPathGroup.visible = false;
    receiptGroup.visible = false;
    folderGroup.visible = false;
    stampGroup.visible = false;
    stampSeal.visible = false;
    clipboardGroup.visible = false;
    toolGroup.visible = false;

    truckGroup.position.set(1.85, 0.24, 0.35);
    truckGroup.rotation.y = 0;
    truckBeacon.material.emissiveIntensity = 0.2;

    const isRoadFixed = currentStep > 4 || (currentStep === 4 && p > 0.88);
    damageMesh.material.color.setHex(isRoadFixed ? 0x74b896 : 0x3b4d47);
    cracksGroup.visible = !isRoadFixed;
    conesGroup.visible = !isRoadFixed;
    siteRing.material.color.setHex(isRoadFixed ? 0x10b981 : 0xe0533c);
    siteRing.scale.setScalar(1 + 0.08 * Math.sin(timeSec * 4));

    // ---- STEP 0: ประชาชนแจ้งปัญหา (โทรแจ้ง หรือ เดินทางไปสำนักงานด้วยตนเอง) ----
    if (currentStep === 0) {
      let modeP = p;
      let subMode = 'phone';
      if (step1Channel === 'phone') {
        subMode = 'phone';
        modeP = p;
      } else if (step1Channel === 'walk') {
        subMode = p < 0.68 ? 'walk' : 'counter';
        modeP = p < 0.68 ? p / 0.68 : (p - 0.68) / 0.32;
      } else {
        // 'both': 0..0.38 phone call -> 0.38..0.75 walking to office -> 0.75..1.0 explaining at counter
        if (p < 0.38) {
          subMode = 'phone';
          modeP = p / 0.38;
        } else if (p < 0.75) {
          subMode = 'walk';
          modeP = (p - 0.38) / 0.37;
        } else {
          subMode = 'counter';
          modeP = (p - 0.75) / 0.25;
        }
      }

      if (subMode === 'phone') {
        // Citizen stands near house/road looking toward the road damage & calling Municipal Office
        citizen.group.position.set(-3.55, 0.1, 1.55);
        citizen.group.rotation.y = 0.35;
        citizen.arms[1].rotation.x = -1.25;
        handPhone.visible = true;
        handPhone.position.set(-3.32, 1.24, 1.68);
        handPhone.rotation.z = -0.2;

        phoneArcGroup.visible = true;
        signalDots.forEach((dot, i) => {
          const t = (timeSec * 0.85 + i / 3) % 1;
          dot.position.copy(phoneCurve.getPoint(t));
        });
        phoneWaveRing.position.set(-3.05, 1.05, -1.42);
        phoneWaveRing.scale.setScalar(0.8 + 0.5 * ((timeSec * 2) % 1));

        activeHalo.position.set(-3.55, 0.08, 1.55);
        bubbleAnchor.set(-3.2, 2.65, 0.2);
      } else if (subMode === 'walk') {
        // Citizen must travel from home along the walkway all the way to the Reception Desk
        walkPathGroup.visible = true;
        walkMarkers.forEach(wm => {
          wm.mesh.scale.setScalar(0.85 + 0.35 * Math.sin(timeSec * 6 + wm.baseT * 6));
        });
        const pt = walkCurve.getPoint(ease(modeP));
        citizen.group.position.set(pt.x, 0.1, pt.z);
        citizen.group.rotation.y = modeP < 0.4 ? Math.PI / 2 : Math.PI;
        animateWalk(citizen, timeSec, 0.48);

        activeHalo.position.set(pt.x, 0.08, pt.z);
        bubbleAnchor.set(pt.x, 2.35, pt.z);
      } else {
        // Citizen stands in front of Reception Desk 1 explaining the issue
        walkPathGroup.visible = true;
        citizen.group.position.set(-2.65, 0.1, -0.42);
        citizen.group.rotation.y = Math.PI;
        citizen.arms[0].rotation.x = -0.5 + Math.sin(timeSec * 8) * 0.25;
        citizen.arms[1].rotation.x = -0.5 - Math.sin(timeSec * 8) * 0.25;
        receiver.arms[0].rotation.x = -0.35;

        activeHalo.position.set(-2.65, 0.08, -0.95);
        bubbleAnchor.set(-2.65, 2.45, -0.95);
      }
    }

    // ---- STEP 1: เจ้าหน้าที่บันทึกเรื่องลงสมุดทะเบียน & ออกใบรับเรื่อง ----
    else if (currentStep === 1) {
      if (p < 0.4) {
        // Phase 1: Officer writes into Registry Book while Citizen waits at counter
        citizen.group.position.set(-2.65, 0.1, -0.42);
        citizen.group.rotation.y = Math.PI;
        receiver.arms[1].rotation.x = -0.75 + Math.sin(timeSec * 14) * 0.18;
        activeHalo.position.set(-2.65, 0.08, -1.45);
        bubbleAnchor.set(-2.65, 2.45, -1.35);
      } else if (p < 0.72) {
        // Phase 2: Officer hands Paper Receipt across counter to Citizen
        const subP = (p - 0.4) / 0.32;
        citizen.group.position.set(-2.65, 0.1, -0.42);
        citizen.group.rotation.y = Math.PI;
        receiptGroup.visible = true;
        lerpPos(receiptGroup, [-2.65, 1.02, -1.42], [-2.65, 1.05, -0.55], subP);
        folderGroup.visible = true;
        folderGroup.position.set(-2.2, 0.94, -1.45);
        activeHalo.position.set(-2.65, 0.08, -0.95);
        bubbleAnchor.set(-2.65, 2.4, -0.95);
      } else {
        // Phase 3: Citizen walks back home holding paper receipt (starts waiting without status updates)
        const subP = (p - 0.72) / 0.28;
        const pt = walkCurve.getPoint(1 - ease(subP));
        citizen.group.position.set(pt.x, 0.1, pt.z);
        citizen.group.rotation.y = subP < 0.6 ? 0 : -Math.PI / 2;
        animateWalk(citizen, timeSec, 0.42);
        receiptGroup.visible = true;
        receiptGroup.position.set(pt.x + 0.24, 0.95, pt.z + 0.12);
        folderGroup.visible = true;
        folderGroup.position.set(-2.2, 0.94, -1.45);
        activeHalo.position.set(pt.x, 0.08, pt.z);
        bubbleAnchor.set(pt.x, 2.35, pt.z);
      }
    }

    // ---- STEP 2: หัวหน้าส่วนงานพิจารณามอบหมายงาน (เดินแฟ้มโต๊ะต่อโต๊ะ) ----
    else if (currentStep === 2) {
      folderGroup.visible = true;
      if (p < 0.4) {
        // Phase 1: Reception Officer carries paper folder from Desk 1 (-2.65) to Supervisor Desk 2 (-0.35)
        const subP = p / 0.4;
        lerpPos(receiver.group, [-2.65, 0.14, -2.15], [-0.95, 0.14, -2.15], subP);
        receiver.group.rotation.y = Math.PI / 2;
        animateWalk(receiver, timeSec, 0.38);
        lerpPos(folderGroup, [-2.35, 1.02, -1.48], [-0.45, 1.02, -1.48], subP);
        activeHalo.position.set(folderGroup.position.x, 0.08, -1.5);
        bubbleAnchor.set(folderGroup.position.x, 2.45, -1.5);
      } else if (p < 0.72) {
        // Phase 2: Supervisor inspects folder at Desk 2
        folderGroup.position.set(-0.35, 0.96, -1.45);
        boss.arms[0].rotation.x = -0.65;
        boss.arms[1].rotation.x = -0.65;
        activeHalo.position.set(-0.35, 0.08, -1.5);
        bubbleAnchor.set(-0.35, 2.5, -1.5);
      } else {
        // Phase 3: Folder is routed from Supervisor Desk 2 (-0.35) to Field Officer Desk 3 (+1.85)
        const subP = (p - 0.72) / 0.28;
        lerpPos(folderGroup, [-0.35, 1.02, -1.45], [1.75, 1.02, -1.45], subP);
        officer.arms[0].rotation.x = -0.5 * ease(subP);
        activeHalo.position.set(folderGroup.position.x, 0.08, -1.5);
        bubbleAnchor.set(folderGroup.position.x, 2.45, -1.5);
      }
    }

    // ---- STEP 3: สำรวจพื้นที่ (ลงตรวจความเสียหายจริง & ประเมินงบประมาณ — ยังไม่ได้ซ่อม) ----
    else if (currentStep === 3) {
      truckBeacon.material.emissiveIntensity = 0.8 + 0.6 * Math.sin(timeSec * 10);
      if (p < 0.38) {
        // Phase 1: Officer & Inspection Truck travel from Office (+1.85) to Road Damage Site (+3.55)
        const subP = p / 0.38;
        lerpPos(truckGroup, [1.85, 0.24, 0.35], [2.45, 0.24, 1.65], subP);
        truckGroup.rotation.y = THREE.MathUtils.lerp(0, -0.35, ease(subP));
        lerpPos(officer.group, [1.85, 0.14, -0.4], [3.05, 0.1, 1.25], subP);
        officer.group.rotation.y = -0.45;
        animateWalk(officer, timeSec, 0.45);
        activeHalo.position.set(officer.group.position.x, 0.08, officer.group.position.z);
        bubbleAnchor.set(officer.group.position.x, 2.35, officer.group.position.z);
      } else if (p < 0.72) {
        // Phase 2: Officer inspects road damage with clipboard
        truckGroup.position.set(2.45, 0.24, 1.65);
        truckGroup.rotation.y = -0.35;
        officer.group.position.set(3.15 + Math.sin(timeSec * 3) * 0.22, 0.1, 1.25);
        officer.group.rotation.y = 0.25;
        officer.arms[1].rotation.x = -0.8;
        clipboardGroup.visible = true;
        clipboardGroup.position.set(officer.group.position.x + 0.22, 0.96, 1.48);
        activeHalo.position.set(3.55, 0.08, 1.8);
        bubbleAnchor.set(3.45, 2.35, 1.65);
      } else {
        // Phase 3: Officer finishes budget calculation and returns to Municipal Office (road still broken!)
        const subP = (p - 0.72) / 0.28;
        lerpPos(truckGroup, [2.45, 0.24, 1.65], [1.85, 0.24, 0.35], subP);
        lerpPos(officer.group, [3.15, 0.1, 1.25], [1.85, 0.14, -0.8], subP);
        officer.group.rotation.y = Math.PI - 0.3;
        animateWalk(officer, timeSec, 0.42);
        clipboardGroup.visible = true;
        clipboardGroup.position.set(officer.group.position.x - 0.22, 0.96, officer.group.position.z);
        activeHalo.position.set(officer.group.position.x, 0.08, officer.group.position.z);
        bubbleAnchor.set(officer.group.position.x, 2.35, officer.group.position.z);
      }
    }

    // ---- STEP 4: อนุมัติและดำเนินงาน (ขออนุมัติงบประมาณ → ลงมือซ่อมแซมจริง) ----
    else if (currentStep === 4) {
      folderGroup.visible = true;
      if (p < 0.36) {
        // Phase 1: Submit budget & plan folder from Desk 3 (+1.85) to Supervisor Desk 2 (-0.35)
        const subP = p / 0.36;
        lerpPos(folderGroup, [1.85, 1.0, -1.45], [-0.35, 0.96, -1.45], subP);
        activeHalo.position.set(-0.35, 0.08, -1.5);
        bubbleAnchor.set(-0.35, 2.5, -1.5);
      } else if (p < 0.65) {
        // Phase 2: Supervisor stamps approval onto the budget & plan folder
        const subP = (p - 0.36) / 0.29;
        folderGroup.position.set(-0.35, 0.95, -1.45);
        stampGroup.visible = true;
        const press = Math.sin(ease(subP) * Math.PI);
        stampGroup.position.set(-0.35, 1.48 - press * 0.46, -1.42);
        stampSeal.visible = subP > 0.45;
        boss.arms[1].rotation.x = -0.85 * press;
        activeHalo.position.set(-0.35, 0.08, -1.5);
        bubbleAnchor.set(-0.35, 2.55, -1.5);
      } else {
        // Phase 3: Officer drives truck & repair tool to Incident Site and repairs the road!
        const subP = (p - 0.65) / 0.35;
        folderGroup.position.set(-0.35, 0.95, -1.45);
        stampSeal.visible = true;
        truckBeacon.material.emissiveIntensity = 1.0;
        truckGroup.position.set(2.45, 0.24, 1.65);
        truckGroup.rotation.y = -0.35;
        officer.group.position.set(3.2, 0.1, 1.32);
        officer.group.rotation.y = 0.3;
        toolGroup.visible = true;
        toolGroup.position.set(3.52, 0.78, 1.65);
        toolGroup.rotation.z = Math.sin(timeSec * 18) * 0.48;
        officer.arms[1].rotation.x = -0.7 + Math.sin(timeSec * 18) * 0.3;
        activeHalo.position.set(3.55, 0.08, 1.8);
        bubbleAnchor.set(3.55, 2.35, 1.65);
      }
    }

    // ---- STEP 5: รายงานและแจ้งผล (เก็บหนังสือเข้าตู้ · ประชาชนไม่รู้ผลต้องโทรถามเอง) ----
    else if (currentStep === 5) {
      if (p < 0.38) {
        // Phase 1: Officer files internal completion memo into the Filing Cabinet (-3.55, -2.45)
        const subP = p / 0.38;
        folderGroup.visible = true;
        lerpPos(folderGroup, [1.85, 1.04, -1.55], [-3.55, 0.95, -2.15], subP);
        activeHalo.position.set(-3.55, 0.08, -2.35);
        bubbleAnchor.set(-3.2, 2.4, -2.2);
      } else if (p < 0.72) {
        // Phase 2: Citizen at home has no notification -> picks up phone to ask
        citizen.group.position.set(-3.55, 0.1, 1.55);
        citizen.group.rotation.y = 0.25;
        citizen.arms[1].rotation.x = -1.2;
        handPhone.visible = true;
        handPhone.position.set(-3.32, 1.24, 1.68);
        activeHalo.position.set(-3.55, 0.08, 1.55);
        bubbleAnchor.set(-3.55, 2.45, 1.55);
      } else {
        // Phase 3: Phone call connects Citizen <-> Reception Desk; Reception Officer checks folder & replies
        citizen.group.position.set(-3.55, 0.1, 1.55);
        citizen.group.rotation.y = 0.25;
        citizen.arms[1].rotation.x = -1.2;
        handPhone.visible = true;
        handPhone.position.set(-3.32, 1.24, 1.68);

        phoneArcGroup.visible = true;
        signalDots.forEach((dot, i) => {
          const t = (timeSec * 0.85 + i / 3) % 1;
          dot.position.copy(phoneCurve.getPoint(t));
        });
        phoneWaveRing.position.set(-3.05, 1.05, -1.42);
        phoneWaveRing.scale.setScalar(0.8 + 0.5 * ((timeSec * 2) % 1));

        folderGroup.visible = true;
        folderGroup.position.set(-2.5, 0.96, -1.45);
        receiver.arms[0].rotation.x = -0.6;
        activeHalo.position.set(-2.65, 0.08, -1.5);
        bubbleAnchor.set(-2.65, 2.5, -1.2);
      }
    }

    // Project all 3D Callout anchors to 2D overlay
    Object.entries(calloutAnchors).forEach(([key, vec]) => {
      const pinEl = document.querySelector(`#legacy-3d-callouts .callout-pin[data-callout="${key}"]`);
      projectToOverlay(pinEl, vec);
    });
    projectToOverlay(document.getElementById('legacy-action-bubble'), bubbleAnchor);
    projectToOverlay(document.getElementById('citizen-wait-badge'), waitAnchor);
  }

  // 10. Wire Up Interactive Controls
  function selectStep(stepIdx, autoPlayStep = true) {
    currentStep = THREE.MathUtils.clamp(stepIdx, 0, 5);
    stepProgress = 0;
    isPlaying = autoPlayStep && !reduced.matches;
    isAutoAll = false;
    syncStepUI();
  }

  document.querySelectorAll('[data-legacy-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectStep(Number(btn.dataset.legacyStep), true);
    });
  });

  document.querySelectorAll('[data-step1-channel]').forEach(btn => {
    btn.addEventListener('click', () => {
      step1Channel = btn.dataset.step1Channel || 'both';
      document.querySelectorAll('[data-step1-channel]').forEach(b => {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      currentStep = 0;
      stepProgress = 0;
      isPlaying = !reduced.matches;
      syncStepUI();
    });
  });

  document.getElementById('legacy-prev-btn')?.addEventListener('click', () => {
    selectStep(currentStep - 1, true);
  });
  document.getElementById('legacy-next-btn')?.addEventListener('click', () => {
    selectStep(currentStep + 1, true);
  });
  document.getElementById('legacy-play-btn')?.addEventListener('click', () => {
    if (isPlaying) {
      isPlaying = false;
    } else {
      if (stepProgress >= 0.99) stepProgress = 0;
      isPlaying = true;
    }
    syncStepUI();
  });
  document.getElementById('legacy-playall-btn')?.addEventListener('click', () => {
    currentStep = 0;
    stepProgress = 0;
    isPlaying = true;
    isAutoAll = true;
    syncStepUI();
  });
  document.getElementById('legacy-restart-btn')?.addEventListener('click', () => {
    currentStep = 0;
    stepProgress = 0;
    isPlaying = true;
    isAutoAll = false;
    targetYaw = 0;
    syncStepUI();
  });

  document.getElementById('pain-rot-left')?.addEventListener('click', () => {
    targetYaw = THREE.MathUtils.clamp(targetYaw - 0.25, -0.85, 0.85);
  });
  document.getElementById('pain-rot-right')?.addEventListener('click', () => {
    targetYaw = THREE.MathUtils.clamp(targetYaw + 0.25, -0.85, 0.85);
  });
  document.getElementById('pain-rot-reset')?.addEventListener('click', () => {
    targetYaw = 0;
  });

  attachStageDrag(stage, () => targetYaw, v => {
    targetYaw = THREE.MathUtils.clamp(v, -0.85, 0.85);
  });

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 1.25 ? 15.6 : 13.4;
    camera.updateProjectionMatrix();
  }

  function tick(now = 0) {
    frame = 0;
    if (!slide.classList.contains('active') || document.hidden) return;
    const dtMs = Math.min(now - lastTime || 16, 60);
    const dtSec = dtMs / 1000;
    lastTime = now;

    yaw = THREE.MathUtils.damp(yaw, targetYaw, 8, dtSec);
    root.rotation.y = yaw;

    if (isPlaying && !reduced.matches) {
      stepProgress += dtMs / stepDuration;
      if (stepProgress >= 1) {
        if (isAutoAll && currentStep < 5) {
          currentStep += 1;
          stepProgress = 0;
        } else if (isAutoAll && currentStep === 5) {
          currentStep = 0;
          stepProgress = 0;
        } else {
          // Loop the selected step smoothly so presenter can talk while motion continues
          stepProgress = 0;
        }
      }
      syncStepUI();
    }

    updateChoreography(stepProgress, now / 1000);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  function checkVisibility() {
    if (slide.classList.contains('active') && !document.hidden) {
      resize();
      syncStepUI();
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  syncStepUI();
  new ResizeObserver(resize).observe(stage);
  new MutationObserver(checkVisibility).observe(slide, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', checkVisibility);
  checkVisibility();
}

/* ==========================================================================
   SCENE 2: Slide 3 — 5-Step New System Digital Workflow 3D Simulation
   ========================================================================== */
const MODERN_STEPS_DATA = [
  {
    title: '1. แจ้งปัญหาผ่านเว็บ (รูปถ่าย + พิกัด GPS)',
    actor: '👤 ประชาชน ➔ 🤖 ระบบเว็บ',
    statusText: 'สถานะ: รอรับเรื่อง',
    statusKey: 'pending',
    citizenBadge: '📤 กำลังส่งรูป + พิกัด GPS',
    activePins: ['citizen', 'ai'],
    visualFlow: [
      { icon: '📱', text: 'เปิดเว็บมือถือ' },
      { icon: '📍', text: 'ถ่ายรูป + ปักหมุด GPS' },
      { icon: '⚡', text: 'ส่งเข้าระบบทันที' },
    ],
    screenGraphic: {
      icon: '📷',
      title: 'แนบภาพจุดเกิดเหตุ + พิกัด GPS อัตโนมัติ',
      sub: 'แจ้งออนไลน์ได้ 24 ชม. ไม่ต้องเดินทางไปเทศบาล',
      pill: '📍 พิกัดแม่นยำ',
    },
    phases: [
      { label: '1/3 · ถ่ายภาพหน้างานและดึงพิกัด GPS จากมือถือ', bubble: '📱 1. ถ่ายรูปจุดเกิดเหตุ + ปักหมุด GPS บนเว็บ', tone: 'normal' },
      { label: '2/3 · กดส่งเรื่องออนไลน์ (ข้อมูลวิ่งเข้าเซิร์ฟเวอร์ทันที)', bubble: '🚀 ส่งรูปและพิกัดเข้าสู่ระบบ Cloud ทันที (ไม่ต้องเดินทาง)', tone: 'normal' },
      { label: '3/3 · ระบบรับข้อมูลและสร้างรายการแจ้งเรื่องสำเร็จ', bubble: '✅ ระบบรับเรื่องเรียบร้อย · เตรียมคัดกรองอัตโนมัติ', tone: 'normal' },
    ],
  },
  {
    title: '2. ระบบบันทึก & AI คัดกรองความเร่งด่วน',
    actor: '🤖 ระบบ & AI ➔ 🖥️ ผู้ดูแลระบบ',
    statusText: 'สถานะ: รอรับเรื่อง (AI คัดกรอง)',
    statusKey: 'pending',
    citizenBadge: '🎫 ได้รหัสเรื่อง #DEMO-001',
    activePins: ['ai', 'admin'],
    visualFlow: [
      { icon: '🤖', text: 'ระบบเว็บ & AI' },
      { icon: '⚡', text: 'ออกรหัส + จัดลำดับด่วน' },
      { icon: '🖥️', text: 'ส่งต่อผู้ดูแลทันที' },
    ],
    screenGraphic: {
      icon: '🤖',
      title: 'รหัส #DEMO-001 · AI ประเมินระดับความเร่งด่วน',
      sub: 'วิเคราะห์ภาพและข้อความเพื่อช่วยผู้ดูแลจัดคิวงาน',
      pill: '⚡ AI Triage',
    },
    phases: [
      { label: '1/3 · ระบบบันทึกฐานข้อมูลและออกรหัสเรื่อง #DEMO-001', bubble: '🤖 2. ระบบสร้างรหัสเรื่อง #DEMO-001 อัตโนมัติ', tone: 'gold' },
      { label: '2/3 · AI วิเคราะห์ภาพและข้อความเพื่อประเมินระดับความเร่งด่วน', bubble: '⚡ AI คัดกรองความรุนแรงเบื้องต้นเพื่อจัดลำดับคิว', tone: 'gold' },
      { label: '3/3 · ส่งการ์ดงานพร้อมผลวิเคราะห์ขึ้นหน้าจอผู้ดูแลระบบ', bubble: '📨 แจ้งเตือนเรื่องใหม่ไปยัง Dashboard ผู้ดูแลทันที', tone: 'normal' },
    ],
  },
  {
    title: '3. ผู้ดูแลตรวจสอบ & กดมอบหมายงานทันที',
    actor: '🖥️ ผู้ดูแล ➔ 👷 เจ้าหน้าที่ & 👤 ประชาชน',
    statusText: 'สถานะ: รับเรื่องแล้ว',
    statusKey: 'assigned',
    citizenBadge: '🔔 แจ้งเตือน: รับเรื่อง & มอบหมายแล้ว',
    activePins: ['admin', 'site', 'citizen'],
    visualFlow: [
      { icon: '🖥️', text: 'ผู้ดูแลระบบ' },
      { icon: '👉', text: 'คลิกเลือกช่างรับงาน' },
      { icon: '🔔', text: 'แจ้งช่าง + แจ้งประชาชน' },
    ],
    screenGraphic: {
      icon: '📋',
      title: 'มอบหมายฝ่ายช่างออนไลน์ (ไม่ต้องเดินแฟ้ม)',
      sub: 'ส่งงานเข้ามือถือช่าง และแจ้งเตือนผู้แจ้งพร้อมกันทันที',
      pill: '🔔 แจ้ง 2 ทางทันที',
    },
    phases: [
      { label: '1/3 · ผู้ดูแลตรวจพิกัดแผนที่และภาพถ่ายบน Dashboard', bubble: '🖥️ 3. ผู้ดูแลตรวจพิกัดและภาพถ่ายบนหน้าจอ', tone: 'normal' },
      { label: '2/3 · คลิกมอบหมายงานให้เจ้าหน้าที่ฝ่ายช่างผ่านระบบออนไลน์', bubble: '📲 กดมอบหมายงานออนไลน์ (ไม่ต้องเดินแฟ้มโต๊ะต่อโต๊ะ)', tone: 'normal' },
      { label: '3/3 · ระบบแจ้งเตือนเจ้าหน้าที่ให้รับงาน และแจ้งความคืบหน้าแก่ประชาชน', bubble: '🔔 แจ้งเตือนทั้งเจ้าหน้าที่และประชาชนพร้อมกันทันที', tone: 'normal' },
    ],
  },
  {
    title: '4. เจ้าหน้าที่ลงพื้นที่ซ่อม & แชร์พิกัด GPS สด',
    actor: '🛻 เจ้าหน้าที่ ➔ 🚧 ซ่อมหน้างาน ➔ 🖥️ ส่งตรวจ',
    statusText: 'สถานะ: กำลังดำเนินการ ➔ รอตรวจสอบ',
    statusKey: 'working',
    citizenBadge: '📡 เห็นพิกัดรถเจ้าหน้าที่สด (0.48s)',
    activePins: ['site', 'citizen', 'admin'],
    visualFlow: [
      { icon: '🛻', text: 'ช่างออกเดินทาง' },
      { icon: '📡', text: 'GPS สด + ซ่อมหน้างาน' },
      { icon: '📸', text: 'ถ่ายรูปส่งผู้ดูแลตรวจ' },
    ],
    screenGraphic: {
      icon: '📡',
      title: 'เห็นพิกัดรถเจ้าหน้าที่สดบนแผนที่ (ดีเลย์ 0.48s)',
      sub: 'ซ่อมเสร็จต้องแนบรูปหลังแก้ไขเพื่อส่งผู้ดูแลตรวจสอบ',
      pill: '📸 มีภาพหลักฐาน',
    },
    phases: [
      { label: '1/3 · กดเริ่มเดินทาง พร้อมแชร์พิกัด GPS สด (0.48s) ให้ผู้แจ้งเห็นบนแผนที่', bubble: '📡 4. เดินทางด้วย GPS สด (ผู้แจ้งเห็นตำแหน่งรถเรียลไทม์)', tone: 'normal' },
      { label: '2/3 · ลงมือซ่อมแซมถนนชำรุดหน้างานจนเรียบร้อย', bubble: '🛠️ เจ้าหน้าที่ดำเนินการซ่อมแซมจุดเกิดเหตุทันที', tone: 'gold' },
      { label: '3/3 · ถ่ายรูปหลังแก้ไขส่งเข้าระบบ เปลี่ยนสถานะเป็น “รอตรวจสอบ”', bubble: '📸 ถ่ายรูปหลังซ่อมส่งให้ผู้ดูแลตรวจสอบหลักฐาน', tone: 'normal' },
    ],
  },
  {
    title: '5. ผู้ดูแลตรวจหลักฐาน & ปิดงานอัตโนมัติ',
    actor: '🖥️ ผู้ดูแล ➔ 🎉 แจ้งเตือนประชาชนอัตโนมัติ',
    statusText: 'สถานะ: เสร็จสิ้น ✓',
    statusKey: 'done',
    citizenBadge: '🎉 แจ้งเตือน: ซ่อมเสร็จสิ้นแล้ว!',
    activePins: ['admin', 'citizen', 'site'],
    visualFlow: [
      { icon: '🔍', text: 'ตรวจรูปก่อน–หลัง' },
      { icon: '✅', text: 'กดยืนยันปิดงาน' },
      { icon: '🎉', text: 'แจ้งประชาชนอัตโนมัติ' },
    ],
    screenGraphic: {
      icon: '✅',
      title: 'ตรวจภาพหลักฐานครบถ้วน · ปิดเรื่อง “เสร็จสิ้น”',
      sub: 'แจ้งเตือนผลและรูปหลังซ่อมถึงประชาชนทันที ไม่ต้องโทรถาม',
      pill: '🎉 เสร็จสมบูรณ์',
    },
    phases: [
      { label: '1/3 · ผู้ดูแลตรวจสอบภาพถ่ายก่อน–หลังแก้ไขและรายละเอียดงาน', bubble: '🔍 5. ผู้ดูแลตรวจสอบภาพหลักฐานหลังการซ่อมแซม', tone: 'normal' },
      { label: '2/3 · กดยืนยันอนุมัติปิดงาน เปลี่ยนสถานะเป็น “เสร็จสิ้น”', bubble: '✅ ข้อมูลครบถ้วน · กดยืนยันปิดงาน (เสร็จสิ้น)', tone: 'normal' },
      { label: '3/3 · ระบบแจ้งเตือนประชาชนอัตโนมัติ ดูผลและรูปหลังซ่อมได้ทันที', bubble: '🎉 แจ้งเตือนประชาชนอัตโนมัติ ไม่ต้องโทรถามซ้ำ!', tone: 'normal' },
    ],
  },
];

function initFeatureHubScene() {
  const slide = document.getElementById('slide-3');
  const stage = document.getElementById('feature-3d-stage');
  if (!slide || !stage) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xffffff, 0);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
  camera.position.set(0, 8.6, 13.4);
  camera.lookAt(0, 0.25, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x739886, 2.0));
  const dir = new THREE.DirectionalLight(0xfff9ee, 2.3);
  dir.position.set(-4, 12, 8);
  scene.add(dir);

  const root = new THREE.Group();
  scene.add(root);

  const mat = (color, rough = 0.42, emissive = 0x000000, eInt = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.06, emissive, emissiveIntensity: eInt });

  const box = (parent, size, pos, color, radius = 0.06, rough = 0.45, emissive = 0x000000, eInt = 0) => {
    const m = new THREE.Mesh(
      new RoundedBoxGeometry(size[0], size[1], size[2], 2, radius),
      mat(color, rough, emissive, eInt)
    );
    m.position.set(pos[0], pos[1], pos[2]);
    parent.add(m);
    return m;
  };

  const sphere = (parent, r, pos, color, emissive = 0x000000, eInt = 0) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), mat(color, 0.3, emissive, eInt));
    m.position.set(pos[0], pos[1], pos[2]);
    parent.add(m);
    return m;
  };

  // 1. Clean Digital City Platform & Road
  box(root, [11.6, 0.32, 7.4], [0, -0.22, 0], 0xdcf2e6, 0.16, 0.6);
  // Front Road connecting Citizen Home (-4.1) and Incident Site (+3.55)
  box(root, [11.0, 0.1, 1.85], [0, -0.02, 1.75], 0x758e86, 0.04, 0.7);
  for (let x = -4.6; x <= 4.6; x += 1.05) {
    box(root, [0.46, 0.02, 0.07], [x, 0.04, 1.75], 0xffffff, 0.01, 0.3);
  }
  // Driveway from Officer Station (+2.15) to Road
  box(root, [1.35, 0.06, 2.0], [2.15, 0.0, 0.35], 0x9cb4aa, 0.02, 0.6);

  // 2. STATION 1 (Left-Front): Citizen + Smartphone + Home (-4.15, 1.45)
  const citizenStation = new THREE.Group();
  citizenStation.position.set(-4.15, 0.04, 1.45);
  citizenStation.userData.stationStep = 0;
  root.add(citizenStation);
  box(citizenStation, [1.55, 1.1, 1.35], [0, 0.55, -0.35], 0xffffff, 0.08, 0.38);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.25, 0.74, 4), mat(0x087f5b, 0.4));
  roof.position.set(0, 1.45, -0.35);
  roof.rotation.y = Math.PI / 4;
  citizenStation.add(roof);
  box(citizenStation, [0.36, 0.64, 0.08], [0, 0.34, 0.34], 0x134e3a, 0.02);

  // 3. STATION 2 (Center-Left Back): Cloud Web Server & AI Triage Core (-2.05, -1.55)
  const aiStation = new THREE.Group();
  aiStation.position.set(-2.05, 0.04, -1.55);
  aiStation.userData.stationStep = 1;
  root.add(aiStation);
  // Sleek platform & server tower
  box(aiStation, [2.1, 0.18, 1.75], [0, 0.09, 0], 0xe6f7f0, 0.08, 0.35);
  box(aiStation, [1.35, 1.45, 0.85], [0, 0.88, -0.15], 0x103b2e, 0.1, 0.28);
  // Glowing AI Server Bars
  const aiBars = [0, 1, 2].map(i =>
    box(aiStation, [0.95, 0.14, 0.06], [0, 0.52 + i * 0.34, 0.3], 0x20c997, 0.02, 0.2, 0x12b886, 0.65)
  );
  // Floating AI Crystal Ring above tower
  const aiCoreOrb = sphere(aiStation, 0.3, [0, 1.98, -0.15], 0x38d9a9, 0x0ca678, 0.75);
  const aiScanRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.045, 12, 36),
    new THREE.MeshBasicMaterial({ color: 0x20c997 })
  );
  aiScanRing.rotation.x = Math.PI / 2;
  aiScanRing.position.set(0, 1.98, -0.15);
  aiStation.add(aiScanRing);

  // 4. STATION 3 (Center-Right Back): Admin Control Desk & Wide Monitor (+1.1, -1.55)
  const adminStation = new THREE.Group();
  adminStation.position.set(1.1, 0.04, -1.55);
  adminStation.userData.stationStep = 2;
  root.add(adminStation);
  box(adminStation, [2.35, 0.18, 1.75], [0, 0.09, 0], 0xf4faf7, 0.08, 0.35);
  // Modern Control Desk
  box(adminStation, [1.75, 0.12, 0.82], [0, 0.84, 0.1], 0xffffff, 0.04, 0.3);
  box(adminStation, [1.55, 0.68, 0.1], [0, 0.46, 0.45], 0x087f5b, 0.03, 0.35);
  // Wide Curved Dashboard Screen
  box(adminStation, [1.45, 0.82, 0.08], [0, 1.42, -0.05], 0x132a23, 0.05, 0.25);
  const adminScreenFace = box(adminStation, [1.32, 0.68, 0.03], [0, 1.42, 0.0], 0x12b886, 0.02, 0.2, 0x0ca678, 0.45);
  box(adminStation, [0.16, 0.26, 0.12], [0, 0.94, -0.05], 0x64748b, 0.02);

  // 5. STATION 4 (Right-Front): Damaged Road Site & Repair Zone (+3.55, 1.75)
  const siteGroup = new THREE.Group();
  siteGroup.position.set(3.55, 0.04, 1.75);
  siteGroup.userData.stationStep = 3;
  root.add(siteGroup);
  const damageMesh = box(siteGroup, [1.78, 0.07, 1.05], [0, 0.02, 0], 0x3b4d47, 0.08, 0.75);
  const cracksGroup = new THREE.Group();
  siteGroup.add(cracksGroup);
  for (let i = 0; i < 5; i++) {
    const crack = box(
      cracksGroup,
      [0.58, 0.025, 0.055],
      [-0.4 + i * 0.2, 0.065, -0.18 + (i % 2) * 0.3],
      0x182621,
      0.01
    );
    crack.rotation.y = (i % 2 ? 1 : -1) * 0.55;
  }
  const siteRing = new THREE.Mesh(
    new THREE.RingGeometry(0.88, 1.06, 36),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
  );
  siteRing.rotation.x = -Math.PI / 2;
  siteRing.position.y = 0.07;
  siteGroup.add(siteRing);

  // 6. Articulated 3D Characters (Citizen, Admin, Field Officer)
  function makePerson(shirtColor, hatColor = null) {
    const group = new THREE.Group();
    root.add(group);
    box(group, [0.38, 0.62, 0.28], [0, 0.78, 0], shirtColor, 0.08);
    sphere(group, 0.21, [0, 1.3, 0], 0xeab68c);
    if (hatColor) {
      const helmet = sphere(group, 0.23, [0, 1.42, 0], hatColor, hatColor, 0.15);
      helmet.scale.set(1.05, 0.65, 1.08);
    } else {
      const hair = sphere(group, 0.215, [0, 1.4, -0.02], 0x1d352e);
      hair.scale.set(1, 0.62, 0.92);
    }
    const legs = [-0.1, 0.1].map(lx => box(group, [0.13, 0.45, 0.16], [lx, 0.24, 0], 0x1f3a33, 0.04));
    const arms = [-0.26, 0.26].map(ax => box(group, [0.12, 0.48, 0.13], [ax, 0.8, 0], shirtColor, 0.04));
    return { group, legs, arms };
  }

  const citizen = makePerson(0x087f5b);           // Citizen (Emerald)
  const adminPerson = makePerson(0x0c8599);       // Admin (Cyan-Blue)
  const officer = makePerson(0xd97706, 0xfbbf24); // Field Officer (Amber + Safety Helmet)

  citizen.group.position.set(-3.35, 0.1, 1.5);
  adminPerson.group.position.set(1.1, 0.14, -2.18);

  // Citizen Smartphone Prop
  const smartPhone = new THREE.Group();
  root.add(smartPhone);
  box(smartPhone, [0.18, 0.34, 0.06], [0, 0, 0], 0x0f172a, 0.02);
  box(smartPhone, [0.14, 0.26, 0.02], [0, 0.01, 0.04], 0x20c997, 0.01, 0.2, 0x20c997, 0.6);

  // Municipal Officer Pickup Truck + Live GPS Radar Rings
  const truckGroup = new THREE.Group();
  truckGroup.position.set(2.15, 0.24, 0.25);
  root.add(truckGroup);
  box(truckGroup, [1.18, 0.36, 0.68], [0, 0, 0], 0x087f5b, 0.06);
  box(truckGroup, [0.58, 0.28, 0.6], [0.18, 0.28, 0], 0xe6f7f0, 0.05);
  const truckBeacon = sphere(truckGroup, 0.1, [0.18, 0.48, 0], 0x20c997, 0x0ca678, 0.9);
  const gpsRadarRing1 = new THREE.Mesh(
    new THREE.RingGeometry(0.65, 0.82, 32),
    new THREE.MeshBasicMaterial({ color: 0x12b886, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
  );
  gpsRadarRing1.rotation.x = -Math.PI / 2;
  gpsRadarRing1.position.y = -0.14;
  truckGroup.add(gpsRadarRing1);

  const gpsRadarRing2 = new THREE.Mesh(
    new THREE.RingGeometry(1.05, 1.2, 32),
    new THREE.MeshBasicMaterial({ color: 0x38d9a9, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
  );
  gpsRadarRing2.rotation.x = -Math.PI / 2;
  gpsRadarRing2.position.y = -0.15;
  truckGroup.add(gpsRadarRing2);

  // Floating 3D Visual Props (Photo Card, GPS Pin, Green Check Seal, Repair Tool)
  const photoCardProp = new THREE.Group();
  root.add(photoCardProp);
  box(photoCardProp, [0.56, 0.42, 0.05], [0, 0, 0], 0xffffff, 0.02);
  const photoCardInner = box(photoCardProp, [0.44, 0.3, 0.03], [0, 0.02, 0.03], 0x0ca678, 0.01, 0.2, 0x0ca678, 0.35);

  const gpsPinProp = new THREE.Group();
  root.add(gpsPinProp);
  sphere(gpsPinProp, 0.18, [0, 0.22, 0], 0x12b886, 0x087f5b, 0.5);
  const pinCone = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 14), mat(0x087f5b, 0.3));
  pinCone.position.set(0, 0.04, 0);
  pinCone.rotation.x = Math.PI;
  gpsPinProp.add(pinCone);

  const checkSealProp = new THREE.Group();
  root.add(checkSealProp);
  sphere(checkSealProp, 0.32, [0, 0, 0], 0x10b981, 0x059669, 0.75);

  const toolGroup = new THREE.Group();
  root.add(toolGroup);
  box(toolGroup, [0.09, 0.72, 0.09], [0, 0, 0], 0xf59e0b, 0.02);
  box(toolGroup, [0.46, 0.18, 0.2], [0, 0.34, 0], 0x1e293b, 0.02);

  // 7. Ultra-Clear 3D Signal Beams + Moving Data Packets
  function makeSignalBeam(p0, p1, p2, colorHex) {
    const group = new THREE.Group();
    root.add(group);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...p0),
      new THREE.Vector3(...p1),
      new THREE.Vector3(...p2)
    );
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, 0.045, 8, false),
      new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85 })
    );
    group.add(tube);
    const packets = [0, 1, 2].map(() => sphere(group, 0.14, [0, 0, 0], 0xffffff, colorHex, 0.95));
    return { group, curve, tube, packets };
  }

  // Beam 1: Citizen Phone (-3.2, 1.3, 1.5) -> Cloud & AI (-2.05, 1.5, -1.3)
  const beamCitizenToAI = makeSignalBeam([-3.2, 1.3, 1.5], [-2.7, 3.1, 0.1], [-2.05, 1.5, -1.3], 0x12b886);
  // Beam 2: Cloud & AI (-1.6, 1.6, -1.4) -> Admin Dashboard (0.7, 1.5, -1.4)
  const beamAIToAdmin = makeSignalBeam([-1.6, 1.6, -1.4], [-0.45, 2.85, -1.4], [0.7, 1.5, -1.4], 0x0ea5e9);
  // Beam 3A: Admin (1.4, 1.5, -1.3) -> Field Officer / Truck (2.15, 0.9, 0.25)
  const beamAdminToOfficer = makeSignalBeam([1.4, 1.5, -1.3], [1.9, 2.75, -0.5], [2.15, 0.9, 0.25], 0xf59e0b);
  // Beam 3B / 5: Admin (0.8, 1.5, -1.3) -> Citizen Phone (-3.2, 1.35, 1.5)
  const beamAdminToCitizen = makeSignalBeam([0.8, 1.5, -1.3], [-1.2, 3.35, 0.2], [-3.2, 1.35, 1.5], 0x10b981);
  // Beam 4A: Truck Live GPS (2.8, 0.8, 1.6) -> Citizen Phone (-3.2, 1.25, 1.5)
  const beamGpsToCitizen = makeSignalBeam([2.8, 0.8, 1.6], [-0.2, 2.55, 2.1], [-3.2, 1.25, 1.5], 0x20c997);
  // Beam 4B: Incident Site After-Photo (3.3, 1.2, 1.6) -> Admin Dashboard (1.3, 1.5, -1.3)
  const beamSiteToAdmin = makeSignalBeam([3.3, 1.2, 1.6], [2.4, 3.1, 0.1], [1.3, 1.5, -1.3], 0x8b5cf6);

  const allBeams = [
    beamCitizenToAI,
    beamAIToAdmin,
    beamAdminToOfficer,
    beamAdminToCitizen,
    beamGpsToCitizen,
    beamSiteToAdmin,
  ];

  // Active Station Floor Halo
  const activeHalo = new THREE.Mesh(
    new THREE.RingGeometry(0.62, 0.78, 40),
    new THREE.MeshBasicMaterial({ color: 0x12b886, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
  );
  activeHalo.rotation.x = -Math.PI / 2;
  activeHalo.position.y = 0.08;
  root.add(activeHalo);

  // 8. Playback & Step State (0..4 for 5 steps)
  let currentStep = 0;
  let stepProgress = 0;
  let stepDuration = 5400;
  let isPlaying = true;
  let isAutoAll = true;
  let yaw = 0;
  let targetYaw = 0;
  let lastTime = 0;
  let frame = 0;

  const ease = t => {
    const c = THREE.MathUtils.clamp(t, 0, 1);
    return c * c * (3 - 2 * c);
  };

  const lerpPos = (obj, a, b, t) => {
    const k = ease(t);
    obj.position.set(
      THREE.MathUtils.lerp(a[0], b[0], k),
      THREE.MathUtils.lerp(a[1], b[1], k),
      THREE.MathUtils.lerp(a[2], b[2], k)
    );
  };

  function syncModernUI() {
    const data = MODERN_STEPS_DATA[currentStep];
    const phaseIdx = stepProgress < 0.36 ? 0 : stepProgress < 0.72 ? 1 : 2;
    const phaseInfo = data.phases[phaseIdx];

    const stageBadge = document.getElementById('modern-stage-badge');
    if (stageBadge) stageBadge.textContent = `ขั้นที่ ${currentStep + 1} / 5 · ${data.title}`;

    const statusPill = document.getElementById('modern-status-pill');
    if (statusPill) {
      statusPill.textContent = data.statusText;
      statusPill.dataset.status = data.statusKey;
    }

    const citizenBadge = document.getElementById('modern-citizen-badge');
    if (citizenBadge) citizenBadge.textContent = data.citizenBadge;

    const elNum = document.getElementById('modern-step-num');
    const elActor = document.getElementById('modern-step-actor');
    const elTitle = document.getElementById('modern-step-title');
    const elPhase = document.getElementById('modern-step-phase');
    const elFill = document.getElementById('modern-progress-fill');

    if (elNum) elNum.textContent = `ขั้นที่ ${currentStep + 1} / 5`;
    if (elActor) elActor.textContent = data.actor;
    if (elTitle) elTitle.textContent = data.title;
    if (elPhase) elPhase.textContent = phaseInfo.label;
    if (elFill) elFill.style.width = `${Math.round(stepProgress * 100)}%`;

    // Visual 3-Chip Flow
    data.visualFlow.forEach((vf, idx) => {
      const iconEl = document.getElementById(`mv-icon-${idx + 1}`);
      const textEl = document.getElementById(`mv-text-${idx + 1}`);
      if (iconEl) iconEl.textContent = vf.icon;
      if (textEl) textEl.textContent = vf.text;
    });

    // Visual Screen Graphic (only re-render when step changes)
    const screenBox = document.getElementById('modern-screen-graphic');
    if (screenBox && screenBox.dataset.renderedStep !== String(currentStep)) {
      screenBox.dataset.renderedStep = String(currentStep);
      const sg = data.screenGraphic;
      screenBox.innerHTML = `
        <div class="msg-left">
          <div class="msg-badge-icon">${sg.icon}</div>
          <div class="msg-copy">
            <strong>${sg.title}</strong>
            <span>${sg.sub}</span>
          </div>
        </div>
        <span class="msg-pill">${sg.pill}</span>
      `;
    }

    // Bottom Step Buttons
    document.querySelectorAll('[data-modern-step]').forEach((btn, idx) => {
      btn.setAttribute('aria-pressed', String(idx === currentStep));
      btn.dataset.done = String(idx < currentStep);
    });

    const prevBtn = document.getElementById('modern-prev-btn');
    const nextBtn = document.getElementById('modern-next-btn');
    const playBtn = document.getElementById('modern-play-btn');
    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) nextBtn.disabled = currentStep === 4;
    if (playBtn) playBtn.textContent = isPlaying ? '⏸ พักแอนิเมชัน' : '▶ เล่นขั้นนี้';

    // Update 3D Callout Pins active highlight
    document.querySelectorAll('#modern-3d-callouts .callout-pin').forEach(pin => {
      const key = pin.dataset.modernCallout;
      pin.classList.toggle('is-active', data.activePins.includes(key));
    });

    // Update Bottom Action Bubble
    const bubble = document.getElementById('modern-action-bubble');
    const bubbleText = document.getElementById('modern-bubble-text');
    if (bubble && bubbleText) {
      bubbleText.textContent = phaseInfo.bubble;
      bubble.dataset.tone = phaseInfo.tone;
    }
  }

  const calloutAnchors = {
    citizen: new THREE.Vector3(-4.15, 2.05, 1.35),
    ai: new THREE.Vector3(-2.05, 2.55, -1.65),
    admin: new THREE.Vector3(1.1, 2.45, -1.65),
    site: new THREE.Vector3(3.55, 1.25, 1.75),
  };
  const citizenBadgeAnchor = new THREE.Vector3(-4.15, 2.85, 1.35);
  const projVec = new THREE.Vector3();

  function projectToOverlay(el, localPos) {
    if (!el || el.hidden) return;
    projVec.copy(localPos).applyAxisAngle(new THREE.Vector3(0, 1, 0), root.rotation.y);
    projVec.project(camera);
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    const x = (projVec.x * 0.5 + 0.5) * w;
    const y = (-projVec.y * 0.5 + 0.5) * h;
    el.style.left = `${THREE.MathUtils.clamp(x, 74, w - 74)}px`;
    el.style.top = `${THREE.MathUtils.clamp(y, 50, h - 50)}px`;
  }

  function animateBeam(beamObj, timeSec, speed = 0.9) {
    beamObj.group.visible = true;
    beamObj.packets.forEach((pkt, i) => {
      const t = (timeSec * speed + i / 3) % 1;
      pkt.position.copy(beamObj.curve.getPoint(t));
    });
  }

  function updateModernChoreography(p, timeSec) {
    // Reset default poses & props
    allBeams.forEach(b => { b.group.visible = false; });
    photoCardProp.visible = false;
    gpsPinProp.visible = false;
    checkSealProp.visible = false;
    toolGroup.visible = false;
    gpsRadarRing1.visible = false;
    gpsRadarRing2.visible = false;

    citizen.group.position.set(-3.25, 0.1, 1.5);
    citizen.group.rotation.y = 0.35;
    citizen.arms[0].rotation.x = 0;
    citizen.arms[1].rotation.x = -1.15;
    smartPhone.position.set(-3.02, 1.18, 1.65);

    adminPerson.group.position.set(1.1, 0.14, -2.18);
    adminPerson.arms[0].rotation.x = -0.35;
    adminPerson.arms[1].rotation.x = -0.35;

    officer.group.position.set(2.15, 0.14, -0.55);
    officer.group.rotation.y = 0;
    officer.arms[0].rotation.x = 0;
    officer.arms[1].rotation.x = 0;

    truckGroup.position.set(2.15, 0.24, 0.25);
    truckGroup.rotation.y = 0;

    aiCoreOrb.rotation.y = timeSec * 1.4;
    aiScanRing.rotation.z = timeSec * 1.8;
    aiScanRing.position.y = 1.98 + Math.sin(timeSec * 3) * 0.08;

    const isRoadRepaired = currentStep === 4 || (currentStep === 3 && p > 0.62);
    damageMesh.material.color.setHex(isRoadRepaired ? 0x6ec49c : 0x3b4d47);
    cracksGroup.visible = !isRoadRepaired;
    siteRing.material.color.setHex(isRoadRepaired ? 0x10b981 : 0xf59e0b);
    siteRing.scale.setScalar(1 + 0.08 * Math.sin(timeSec * 4));

    // ---- STEP 0: ประชาชนแจ้งปัญหาผ่านเว็บ (แนบรูป + ปักหมุด GPS) ----
    if (currentStep === 0) {
      animateBeam(beamCitizenToAI, timeSec, 0.85);
      photoCardProp.visible = true;
      gpsPinProp.visible = true;
      photoCardInner.material.color.setHex(0xf59e0b);
      const flightT = ease((p * 1.35) % 1);
      const pt = beamCitizenToAI.curve.getPoint(flightT);
      photoCardProp.position.set(pt.x, pt.y + 0.22, pt.z);
      gpsPinProp.position.set(pt.x + 0.32, pt.y + 0.18, pt.z);
      activeHalo.position.set(-3.25, 0.08, 1.5);
    }

    // ---- STEP 1: ระบบบันทึก & AI คัดกรองความเร่งด่วนอัตโนมัติ ----
    else if (currentStep === 1) {
      animateBeam(beamAIToAdmin, timeSec, 0.9);
      aiScanRing.scale.setScalar(1.15 + 0.2 * Math.sin(timeSec * 8));
      aiBars.forEach((bar, idx) => {
        bar.scale.x = 0.85 + 0.25 * Math.sin(timeSec * 10 + idx * 1.5);
      });
      activeHalo.position.set(-2.05, 0.08, -1.55);
    }

    // ---- STEP 2: ผู้ดูแลตรวจสอบ & กดมอบหมายเจ้าหน้าที่ (แจ้งเตือน 2 ทาง) ----
    else if (currentStep === 2) {
      animateBeam(beamAdminToOfficer, timeSec, 0.95);
      animateBeam(beamAdminToCitizen, timeSec, 0.85);
      adminPerson.arms[1].rotation.x = -0.75 + Math.sin(timeSec * 8) * 0.2;
      adminScreenFace.material.emissiveIntensity = 0.7 + 0.3 * Math.sin(timeSec * 6);
      activeHalo.position.set(1.1, 0.08, -1.55);
    }

    // ---- STEP 3: เจ้าหน้าที่ลงพื้นที่ซ่อม (GPS สด) & ถ่ายรูปส่งตรวจ ----
    else if (currentStep === 3) {
      gpsRadarRing1.visible = true;
      gpsRadarRing2.visible = true;
      gpsRadarRing1.scale.setScalar(0.9 + 0.45 * ((timeSec * 1.8) % 1));
      gpsRadarRing2.scale.setScalar(0.9 + 0.55 * (((timeSec * 1.8) + 0.5) % 1));
      animateBeam(beamGpsToCitizen, timeSec, 1.1);

      if (p < 0.38) {
        // Phase 1: Truck & Officer travel to Damaged Road while streaming live GPS
        const subP = p / 0.38;
        lerpPos(truckGroup, [2.15, 0.24, 0.25], [2.48, 0.24, 1.65], subP);
        truckGroup.rotation.y = THREE.MathUtils.lerp(0, -0.32, ease(subP));
        lerpPos(officer.group, [2.15, 0.14, -0.45], [3.1, 0.1, 1.28], subP);
        activeHalo.position.set(truckGroup.position.x, 0.08, truckGroup.position.z);
      } else if (p < 0.68) {
        // Phase 2: Officer repairs the road at Incident Site
        truckGroup.position.set(2.48, 0.24, 1.65);
        truckGroup.rotation.y = -0.32;
        officer.group.position.set(3.18, 0.1, 1.32);
        officer.group.rotation.y = 0.28;
        toolGroup.visible = true;
        toolGroup.position.set(3.52, 0.78, 1.62);
        toolGroup.rotation.z = Math.sin(timeSec * 18) * 0.45;
        officer.arms[1].rotation.x = -0.7 + Math.sin(timeSec * 18) * 0.28;
        activeHalo.position.set(3.55, 0.08, 1.75);
      } else {
        // Phase 3: Officer snaps After-Repair Photo and sends to Admin for review
        const subP = (p - 0.68) / 0.32;
        truckGroup.position.set(2.48, 0.24, 1.65);
        truckGroup.rotation.y = -0.32;
        officer.group.position.set(3.18, 0.1, 1.32);
        animateBeam(beamSiteToAdmin, timeSec, 1.0);
        photoCardProp.visible = true;
        photoCardInner.material.color.setHex(0x10b981);
        const pt = beamSiteToAdmin.curve.getPoint(ease(subP));
        photoCardProp.position.set(pt.x, pt.y + 0.2, pt.z);
        activeHalo.position.set(3.55, 0.08, 1.75);
      }
    }

    // ---- STEP 4: ผู้ดูแลตรวจหลักฐาน ปิดงาน & แจ้งเตือนประชาชนอัตโนมัติ ----
    else if (currentStep === 4) {
      animateBeam(beamAdminToCitizen, timeSec, 0.95);
      checkSealProp.visible = true;
      checkSealProp.position.set(1.1, 2.15 + Math.sin(timeSec * 4) * 0.08, -1.45);
      photoCardProp.visible = true;
      photoCardInner.material.color.setHex(0x10b981);
      photoCardProp.position.set(1.75, 1.45, -1.35);
      // Citizen raises arm happily upon receiving completion notification
      citizen.arms[0].rotation.x = -2.2 + Math.sin(timeSec * 8) * 0.2;
      activeHalo.position.set(-3.25, 0.08, 1.5);
    }

    // Project 3D Callouts to 2D Screen
    Object.entries(calloutAnchors).forEach(([key, vec]) => {
      const pinEl = document.querySelector(`#modern-3d-callouts .callout-pin[data-modern-callout="${key}"]`);
      projectToOverlay(pinEl, vec);
    });
    projectToOverlay(document.getElementById('modern-citizen-badge'), citizenBadgeAnchor);
  }

  function selectModernStep(idx, autoPlayStep = true) {
    currentStep = THREE.MathUtils.clamp(idx, 0, 4);
    stepProgress = 0;
    isPlaying = autoPlayStep && !reduced.matches;
    isAutoAll = false;
    syncModernUI();
  }

  document.querySelectorAll('[data-modern-step]').forEach(btn => {
    btn.addEventListener('click', () => selectModernStep(Number(btn.dataset.modernStep), true));
  });

  document.getElementById('modern-prev-btn')?.addEventListener('click', () => selectModernStep(currentStep - 1, true));
  document.getElementById('modern-next-btn')?.addEventListener('click', () => selectModernStep(currentStep + 1, true));
  document.getElementById('modern-play-btn')?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    syncModernUI();
  });
  document.getElementById('modern-playall-btn')?.addEventListener('click', () => {
    currentStep = 0;
    stepProgress = 0;
    isPlaying = !reduced.matches;
    isAutoAll = true;
    syncModernUI();
  });
  document.getElementById('modern-restart-btn')?.addEventListener('click', () => {
    currentStep = 0;
    stepProgress = 0;
    isPlaying = !reduced.matches;
    isAutoAll = false;
    targetYaw = 0;
    syncModernUI();
  });

  document.getElementById('modern-rot-left')?.addEventListener('click', () => { targetYaw -= 0.28; });
  document.getElementById('modern-rot-right')?.addEventListener('click', () => { targetYaw += 0.28; });
  document.getElementById('modern-rot-reset')?.addEventListener('click', () => { targetYaw = 0; });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  attachStageDrag(
    stage,
    () => targetYaw,
    v => { targetYaw = THREE.MathUtils.clamp(v, -0.85, 0.85); },
    0.25,
    e => {
      const rect = stage.getBoundingClientRect();
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(root.children, true)[0];
      if (hit) {
        let obj = hit.object;
        while (obj && obj.userData.stationStep === undefined) obj = obj.parent;
        if (obj && obj.userData.stationStep !== undefined) selectModernStep(obj.userData.stationStep, true);
      }
    }
  );

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 1.25 ? 15.2 : 13.2;
    camera.updateProjectionMatrix();
  }

  function tick(now = 0) {
    frame = 0;
    if (!slide.classList.contains('active') || document.hidden) return;
    const dtMs = Math.min(now - lastTime || 16, 60);
    const dtSec = dtMs / 1000;
    lastTime = now;

    yaw = THREE.MathUtils.damp(yaw, targetYaw, 8, dtSec);
    root.rotation.y = yaw;

    if (isPlaying && !reduced.matches) {
      stepProgress += dtMs / stepDuration;
      if (stepProgress >= 1) {
        if (isAutoAll && currentStep < 4) {
          currentStep += 1;
          stepProgress = 0;
        } else if (isAutoAll && currentStep === 4) {
          currentStep = 0;
          stepProgress = 0;
        } else {
          stepProgress = 0;
        }
      }
      syncModernUI();
    }

    updateModernChoreography(stepProgress, now / 1000);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  function checkVisibility() {
    if (slide.classList.contains('active') && !document.hidden) {
      resize();
      syncModernUI();
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  syncModernUI();
  new ResizeObserver(resize).observe(stage);
  new MutationObserver(checkVisibility).observe(slide, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', checkVisibility);
  checkVisibility();
}

/* ==========================================================================
   SCENE 3: Slide 12 — Three.js 3D Real-Time GPS Benchmark Arena (Before vs After)
   ========================================================================== */
function initBenchmarkArenaScene() {
  const slide = document.getElementById('slide-12');
  const stage = document.getElementById('benchmark-3d-stage');
  if (!slide || !stage) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xffffff, 0);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  camera.position.set(0, 7.8, 13.8);
  camera.lookAt(0, 0.2, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x6c9080, 1.9));
  const sun = new THREE.DirectionalLight(0xfff8eb, 2.2);
  sun.position.set(-4, 12, 8);
  scene.add(sun);

  const root = new THREE.Group();
  scene.add(root);

  const mat = (color, rough = 0.38, emissive = 0x000000, eInt = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.06, emissive, emissiveIntensity: eInt });

  // Ground board
  const board = new THREE.Mesh(new RoundedBoxGeometry(12.4, 0.34, 6.4, 4, 0.16), mat(0xe3f2e9, 0.65));
  board.position.y = -0.22;
  root.add(board);

  // Two parallel highway lanes: Back lane (Z = -1.25: BEFORE 9.47s delay) & Front lane (Z = +1.35: AFTER 0.48s delay)
  for (const z of [-1.25, 1.35]) {
    const lane = new THREE.Mesh(new RoundedBoxGeometry(11.2, 0.1, 1.65, 2, 0.04), mat(0x3a524b, 0.7));
    lane.position.set(0, -0.02, z);
    root.add(lane);
    for (let x = -4.8; x <= 4.8; x += 1.2) {
      const dash = new THREE.Mesh(new RoundedBoxGeometry(0.55, 0.02, 0.08, 1, 0.01), mat(0xffffff, 0.3));
      dash.position.set(x, 0.04, z);
      root.add(dash);
    }
  }

  // Destination flags at X = +4.8 on both lanes
  for (const z of [-1.25, 1.35]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 12), mat(0x133c2e));
    pole.position.set(4.8, 0.7, z - 0.55);
    const flag = new THREE.Mesh(new RoundedBoxGeometry(0.55, 0.35, 0.06, 2, 0.02), mat(0x087f5b, 0.3, 0x087f5b, 0.3));
    flag.position.set(5.05, 1.2, z - 0.55);
    root.add(pole, flag);
  }

  function makeVehicle(colorHex) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.36, 0.64, 3, 0.08), mat(colorHex, 0.3));
    body.position.y = 0.24;
    const top = new THREE.Mesh(new RoundedBoxGeometry(0.58, 0.26, 0.54, 3, 0.06), mat(0xffffff, 0.25));
    top.position.set(-0.06, 0.5, 0);
    g.add(body, top);
    return g;
  }

  function makeCitizenPin(colorHex, emissiveHex) {
    const g = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), mat(colorHex, 0.2, emissiveHex, 0.45));
    head.position.y = 1.45;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.48, 16), mat(colorHex, 0.2, emissiveHex, 0.35));
    cone.position.y = 1.12;
    cone.rotation.x = Math.PI;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.58, 32),
      new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.06;
    g.add(head, cone, ring);
    return g;
  }

  // Lane 1 (Before): True Officer Car + Lagging Citizen Pin (Red/Amber) + Lag Bar
  const beforeCar = makeVehicle(0x648279);
  beforeCar.position.z = -1.25;
  const beforePin = makeCitizenPin(0xe0533c, 0xa62613);
  beforePin.position.z = -1.25;
  const beforeLagBar = new THREE.Mesh(
    new RoundedBoxGeometry(1, 0.08, 0.18, 2, 0.02),
    new THREE.MeshBasicMaterial({ color: 0xe0533c, transparent: true, opacity: 0.75 })
  );
  beforeLagBar.position.set(0, 0.85, -1.25);
  root.add(beforeCar, beforePin, beforeLagBar);

  // Lane 2 (After): True Officer Car + Synced Citizen Pin (Emerald)
  const afterCar = makeVehicle(0x087f5b);
  afterCar.position.z = 1.35;
  const afterPin = makeCitizenPin(0x12c483, 0x087f5b);
  afterPin.position.z = 1.35;
  root.add(afterCar, afterPin);

  const waypoints = [
    { id: 'all', label: 'เล่นต่อเนื่อง (Live Simulation)', beforeMs: 9467, afterMs: 475, before429: 39, distM: 1241.73, acc: '100%' },
    { id: 'WP1', label: 'WP1 (13.1120, 99.9420)', beforeMs: 7825, afterMs: 792, before429: 10, distM: 1241.76, acc: '99.998%', progress: 0.22 },
    { id: 'WP2', label: 'WP2 (13.1140, 99.9440)', beforeMs: 10014, afterMs: 620, before429: 10, distM: 931.32, acc: '99.997%', progress: 0.46 },
    { id: 'WP3', label: 'WP3 (13.1160, 99.9460)', beforeMs: 9923, afterMs: 342, before429: 10, distM: 620.88, acc: '99.997%', progress: 0.70 },
    { id: 'WP4', label: 'WP4 (13.1180, 99.9480)', beforeMs: 10105, afterMs: 146, before429: 9, distM: 310.44, acc: '99.997%', progress: 0.92 },
  ];

  let selectedWp = waypoints[0];
  let yaw = -0.12;
  let targetYaw = -0.12;
  let clock = 0;
  let lastTime = 0;
  let frame = 0;

  function updateHud(wp) {
    selectedWp = wp;
    const elBefore = document.getElementById('bench-hud-before');
    const elAfter = document.getElementById('bench-hud-after');
    const elSpeedup = document.getElementById('bench-hud-speedup');
    const el429 = document.getElementById('bench-hud-429');
    if (elBefore) elBefore.textContent = `${(wp.beforeMs / 1000).toFixed(2)} วิ (${wp.beforeMs} ms)`;
    if (elAfter) elAfter.textContent = `${(wp.afterMs / 1000).toFixed(2)} วิ (${wp.afterMs} ms)`;
    if (elSpeedup) elSpeedup.textContent = `เร็วขึ้น ${(wp.beforeMs / wp.afterMs).toFixed(1)} เท่า`;
    if (el429) el429.textContent = `จาก ${wp.before429} ครั้ง → เหลือ 0 ครั้ง`;
  }

  document.querySelectorAll('[data-bench-wp]').forEach(btn => {
    btn.addEventListener('click', () => {
      const wp = waypoints.find(w => w.id === btn.dataset.benchWp) || waypoints[0];
      document.querySelectorAll('[data-bench-wp]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      updateHud(wp);
    });
  });

  attachStageDrag(stage, () => targetYaw, v => { targetYaw = THREE.MathUtils.clamp(v, -0.95, 0.95); });

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 1.2 ? 15.8 : 13.5;
    camera.updateProjectionMatrix();
  }

  function tick(now = 0) {
    frame = 0;
    if (!slide.classList.contains('active') || document.hidden) return;
    const dt = Math.min((now - lastTime) / 1000 || 0.016, 0.05);
    lastTime = now;
    clock += dt;

    yaw = THREE.MathUtils.damp(yaw, targetYaw, 8, dt);
    root.rotation.y = yaw;

    const p = selectedWp.progress !== undefined ? selectedWp.progress : (clock * 0.14) % 1;
    const trueX = THREE.MathUtils.lerp(-4.5, 4.4, p);

    // Before lane: Citizen pin jumps only in coarse steps and lags behind by ~2.2 units (~94.7m)
    const steppedP = Math.max(0, Math.floor((p - 0.18) * 4) / 4);
    const beforeSeenX = THREE.MathUtils.lerp(-4.5, 4.4, steppedP);

    // After lane: Citizen pin smoothly tracks within ~0.12 units (~4.8m)
    const afterSeenX = THREE.MathUtils.lerp(-4.5, 4.4, Math.max(0, p - 0.015));

    beforeCar.position.x = trueX;
    afterCar.position.x = trueX;

    beforePin.position.x = beforeSeenX;
    afterPin.position.x = afterSeenX;

    const gap = Math.max(0.05, trueX - beforeSeenX);
    beforeLagBar.scale.x = gap;
    beforeLagBar.position.x = beforeSeenX + gap / 2;

    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  function checkVisibility() {
    if (slide.classList.contains('active') && !document.hidden) {
      resize();
      if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(tick); }
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  updateHud(waypoints[0]);
  new ResizeObserver(resize).observe(stage);
  new MutationObserver(checkVisibility).observe(slide, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', checkVisibility);
  checkVisibility();
}

function bootAll() {
  initPainpointScene();
  initFeatureHubScene();
  initBenchmarkArenaScene();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAll);
} else {
  bootAll();
}
