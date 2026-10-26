/* Concise paraphrases of Chapter 2 §2.2.4 and §2.4 only.
   Pages below use the printed page numbers (PDF index is five pages earlier).
   This is report content, not an audit of the current production stack. */
window.PhetpriToolDetails = Object.freeze({
  python: {
    name: 'Python', logo: 'python.png', category: 'ภาษาโปรแกรม',
    definition: 'ภาษาโปรแกรมระดับสูงที่อ่านและเขียนได้ง่าย ใช้พัฒนาเว็บ งานอัตโนมัติ และงานด้าน AI ได้',
    features: ['โครงสร้างคำสั่งเรียบง่าย รองรับการเขียนโปรแกรมเชิงวัตถุ', 'มีไลบรารีและ Framework ช่วยลดงานที่ต้องเขียนเอง'],
    role: 'ใช้เขียนการทำงานฝั่งเซิร์ฟเวอร์ร่วมกับ Django', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.2.4.1 / 2.4.3', pages: '38, 44–45'
  },
  django: {
    name: 'Django', logo: 'django.png', category: 'Web Framework',
    definition: 'Framework ภาษา Python สำหรับสร้างเว็บ โดยแยกงานข้อมูล หน้าจอ และการรับคำขอด้วยแนวคิด Model–Template–View (MTV)',
    features: ['ORM เชื่อมฐานข้อมูลผ่านโค้ด Python และ Migration จัดการโครงสร้างข้อมูล', 'มีระบบบัญชีผู้ใช้ ฟอร์มตรวจสอบข้อมูล และเครื่องมือด้านความปลอดภัย'],
    role: 'เป็นโครงสร้างหลักสำหรับรับเรื่อง จัดการผู้ใช้ และประมวลผลข้อมูล', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.2.4.2 / 2.4.4', pages: '38–39, 45'
  },
  mysql: {
    name: 'MySQL', logo: 'mysql.png', category: 'ฐานข้อมูลเชิงสัมพันธ์',
    definition: 'ระบบจัดการฐานข้อมูลที่เก็บข้อมูลเป็นตารางและเชื่อมความสัมพันธ์กัน โดยใช้ภาษา SQL จัดการและค้นหาข้อมูล',
    features: ['InnoDB รองรับธุรกรรมและ Foreign Key เพื่อรักษาความถูกต้องของข้อมูล', 'มี Index และระบบสิทธิ์ผู้ใช้สำหรับจัดการการเข้าถึงข้อมูล'],
    role: 'จัดเก็บข้อมูลผู้ใช้ เรื่องที่แจ้ง และสถานะที่เชื่อมโยงกัน', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.2.4.3 / 2.4.6', pages: '39–40, 45'
  },
  phpmyadmin: {
    name: 'phpMyAdmin', logo: 'phpmyadmin.png', category: 'เครื่องมือจัดการฐานข้อมูล',
    definition: 'เครื่องมือบนเว็บสำหรับจัดการ MySQL และ MariaDB ผ่านหน้าจอกราฟิก แทนการใช้คำสั่งเพียงอย่างเดียว',
    features: ['จัดการฐานข้อมูล ตาราง และผู้ใช้ผ่านเบราว์เซอร์', 'นำเข้า–ส่งออกข้อมูล และเรียกคำสั่ง SQL ได้'],
    role: 'ช่วยตรวจสอบและจัดการข้อมูลระหว่างพัฒนาระบบ', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.4.8', pages: '46'
  },
  sql: {
    name: 'SQL', logo: null, category: 'ภาษาจัดการข้อมูล',
    definition: 'ภาษามาตรฐานสำหรับกำหนดโครงสร้าง จัดการ และสืบค้นข้อมูลในฐานข้อมูลเชิงสัมพันธ์',
    features: ['สร้างตาราง เพิ่ม แก้ไข ลบ และค้นหาข้อมูล', 'JOIN เชื่อมข้อมูลหลายตาราง และสรุปผลด้วยฟังก์ชันรวม'],
    role: 'ใช้จัดการและสืบค้นข้อมูลที่จัดเก็บใน MySQL', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.2.4.3 / 2.4.7', pages: '40–41, 45'
  },
  'django-server': {
    name: 'Django Development Server', logo: 'django.png', category: 'เซิร์ฟเวอร์สำหรับพัฒนา',
    definition: 'เว็บเซิร์ฟเวอร์ขนาดเล็กที่มาพร้อม Django สำหรับทดลองและทดสอบระหว่างพัฒนา ไม่ใช่เซิร์ฟเวอร์สำหรับ Production',
    features: ['เริ่มได้ด้วยคำสั่ง python manage.py runserver', 'โหลดโค้ดใหม่อัตโนมัติ และแสดงข้อมูลข้อผิดพลาดสำหรับ Debug'],
    role: 'ทดลองการทำงานของเว็บไซต์บนเครื่องพัฒนาก่อนนำขึ้นเซิร์ฟเวอร์จริง', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.4.5', pages: '45'
  },
  vue: {
    name: 'Vue.js', logo: 'vue.png', category: 'Frontend Framework',
    definition: 'Framework JavaScript สำหรับสร้างส่วนติดต่อผู้ใช้ โดยหน้าจออัปเดตตามข้อมูลแบบ Reactive',
    features: ['เลือกใช้เสริมเฉพาะส่วนหรือพัฒนาเว็บแอปทั้งระบบได้', 'ช่วยเชื่อมข้อมูลกับหน้าจอโดยไม่จัดการ DOM ทุกจุดเอง'],
    role: 'เป็นเครื่องมือพัฒนาหน้าจอที่รายงานระบุไว้', roleBasis: 'ตามรายงาน',
    section: '2.4.11 / 2.4.18', pages: '47, 49'
  },
  tailwind: {
    name: 'Tailwind CSS', logo: 'tailwind.svg', category: 'การจัดรูปแบบหน้าจอ',
    definition: 'Framework CSS แบบ Utility-First ใช้คลาสย่อยสำหรับสี ระยะห่าง และตัวอักษรมาประกอบเป็นหน้าจอที่ต้องการ',
    features: ['จัดรูปแบบใน HTML ได้โดยใช้คลาสเฉพาะหน้าที่', 'ตัดคลาสที่ไม่ได้ใช้ออกในขั้นตอน Build เพื่อช่วยลดขนาด CSS'],
    role: 'จัดรูปแบบเว็บไซต์ทั้งฝั่งผู้ใช้และผู้ดูแลให้มีดีไซน์สอดคล้องกัน', roleBasis: 'ตามรายงาน',
    section: '2.4.19', pages: '50'
  },
  leaflet: {
    name: 'Leaflet.js', logo: 'leaflet.png', category: 'แผนที่เชิงโต้ตอบ',
    definition: 'ไลบรารี JavaScript สำหรับสร้างแผนที่ที่ผู้ใช้เลื่อน ซูม และดูข้อมูลบนแผนที่ได้',
    features: ['ใช้ร่วมกับแผนที่ฐาน เช่น OpenStreetMap และหมุดตำแหน่ง', 'รองรับ GeoJSON และปลั๊กอินสำหรับขยายความสามารถ'],
    role: 'แสดงตำแหน่งปัญหาและขอบเขตตำบล เพื่อเห็นการกระจายของเรื่องในพื้นที่', roleBasis: 'ตามรายงาน',
    section: '2.4.14', pages: '48'
  },
  apexcharts: {
    name: 'ApexCharts', logo: 'apexcharts.png', category: 'กราฟและ Dashboard',
    definition: 'ไลบรารี JavaScript สำหรับสร้างกราฟและแผนภูมิเชิงโต้ตอบ โดยแสดงผลด้วย SVG',
    features: ['สร้างกราฟแท่ง กราฟเส้น กราฟวงกลม และรูปแบบอื่นได้', 'ปรับแต่งและอัปเดตข้อมูลผ่าน JavaScript โดยไม่โหลดหน้าใหม่'],
    role: 'สรุปจำนวนเรื่อง ประเภทปัญหา สถานะ และแนวโน้มใน Dashboard', roleBasis: 'ตามรายงาน',
    section: '2.4.15', pages: '48'
  },
  r2: {
    name: 'Cloudflare R2', logo: 'r2.png', category: 'พื้นที่เก็บไฟล์',
    definition: 'บริการ Object Storage สำหรับจัดเก็บไฟล์ โดยเชื่อมต่อผ่าน API ที่เข้ากันได้กับมาตรฐาน S3',
    features: ['อัปโหลดและเรียกใช้ไฟล์ผ่านการเชื่อมต่อจากแอป', 'แยกการจัดเก็บสื่อออกจากพื้นที่บนเซิร์ฟเวอร์หลัก'],
    role: 'เก็บรูปภาพที่ผู้ใช้อัปโหลดในระบบแจ้งปัญหา และเรียกดูผ่าน URL', roleBasis: 'ตามรายงาน',
    section: '2.4.12', pages: '47'
  },
  turnstile: {
    name: 'Cloudflare Turnstile', logo: 'turnstile.png', category: 'การป้องกันบอท',
    definition: 'เครื่องมือตรวจสอบการใช้งานเพื่อช่วยแยกผู้ใช้จริงจากบอท แทน CAPTCHA แบบแก้ปริศนา',
    features: ['ตรวจสอบสัญญาณการใช้งานเพื่อลดการรบกวนผู้ใช้', 'ช่วยลดสแปมและการส่งคำขออัตโนมัติในแบบฟอร์ม'],
    role: 'ช่วยป้องกันการส่งข้อมูลสแปมเข้าสู่ระบบแจ้งปัญหา', roleBasis: 'ตามรายงาน',
    section: '2.4.13', pages: '47–48'
  },
  resend: {
    name: 'Resend', logo: 'resend.png', category: 'บริการส่งอีเมล',
    definition: 'บริการ Email API สำหรับให้โปรแกรมส่งอีเมลเชิงระบบ เช่น อีเมลยืนยันและแจ้งเตือน',
    features: ['เชื่อมต่อผ่าน REST API หรือ SDK', 'ติดตามสถานะการส่งและรับเหตุการณ์ผ่าน Webhook ได้'],
    role: 'ส่งอีเมลสถานะเรื่อง การยืนยันตัวตน และการรีเซ็ตรหัสผ่าน', roleBasis: 'ตามรายงาน',
    section: '2.4.20', pages: '50'
  },
  gemini: {
    name: 'Google Gemini API', logo: 'gemini.png', category: 'บริการปัญญาประดิษฐ์',
    definition: 'API สำหรับเรียกใช้แบบจำลอง AI ของ Google เพื่อประมวลผลข้อมูลและสร้างคำตอบ โดยไม่ต้องฝึกหรือดูแลแบบจำลองเอง',
    features: ['รองรับงานตอบคำถาม สรุปข้อมูล และบทสนทนา', 'รองรับข้อมูลหลายรูปแบบตามความสามารถของแบบจำลอง'],
    role: 'เป็นบริการหลักของแชทบอทสำหรับตอบคำถามและแนะนำผู้ใช้ตามรายงาน', roleBasis: 'ตามรายงาน',
    section: '2.4.16', pages: '48–49'
  },
  groq: {
    name: 'Groq API', logo: 'groq.png', category: 'บริการ AI สำรอง',
    definition: 'บริการประมวลผลแบบจำลอง AI ผ่าน GroqCloud API โดยใช้หน่วยประมวลผล LPU ที่ออกแบบสำหรับงานแบบจำลองภาษา',
    features: ['ให้แอปเรียกใช้แบบจำลองผ่าน API', 'รองรับรูปแบบการเชื่อมต่อที่เข้ากันได้กับ OpenAI'],
    role: 'เป็น Fallback ของแชทบอทเมื่อบริการหลัก Gemini ใช้งานไม่ได้', roleBasis: 'ตามรายงาน',
    section: '2.4.17', pages: '49'
  },
  ubuntu: {
    name: 'Ubuntu', logo: 'ubuntu.svg', category: 'ระบบปฏิบัติการ',
    definition: 'ระบบปฏิบัติการโอเพนซอร์สบน Linux โดยรุ่น LTS เน้นการสนับสนุนระยะยาว',
    features: ['จัดการแพ็กเกจด้วย APT และ Snap', 'รองรับเครื่องมือพัฒนา Cloud และ Container'],
    role: 'เป็นสภาพแวดล้อมพัฒนาที่รายงานระบุรุ่น Ubuntu 22.04.5 LTS', roleBasis: 'ตามรายการในรายงาน',
    section: '2.4.1', pages: '43–44'
  },
  vscode: {
    name: 'Visual Studio Code', logo: 'vscode.png', category: 'เครื่องมือเขียนโค้ด',
    definition: 'โปรแกรมแก้ไขโค้ดจาก Microsoft ที่รองรับหลายภาษาและเพิ่มความสามารถผ่าน Extension ได้',
    features: ['IntelliSense ช่วยแนะนำโค้ด พร้อม Terminal ในตัว', 'มีเครื่องมือ Debug และรองรับ Git'],
    role: 'ใช้เขียน แก้ไข และตรวจสอบโค้ดของโครงงาน', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.4.2', pages: '44'
  },
  docker: {
    name: 'Docker', logo: 'docker.svg', category: 'สภาพแวดล้อมแบบ Container',
    definition: 'แพลตฟอร์มสำหรับแพ็กและรันแอปใน Container โดยใช้ Kernel ร่วมกับระบบปฏิบัติการหลัก',
    features: ['ใช้ Dockerfile สร้าง Image สำหรับรัน Container', 'Docker Compose ใช้ไฟล์ YAML กำหนดและรันบริการหลาย Container ร่วมกัน'],
    role: 'ใช้กับสภาพแวดล้อมฐานข้อมูลระหว่างพัฒนาตามรายการเครื่องมือบทที่ 1', roleBasis: 'รายงานบทที่ 1 §1.6',
    section: '2.2.4 / 2.4.9', pages: '41, 46'
  },
  wps: {
    name: 'WPS Office / WPS Writer', logo: 'wps.png', category: 'เครื่องมือจัดทำเอกสาร',
    definition: 'ชุดโปรแกรมสำนักงาน โดย WPS Writer ใช้สร้างและจัดรูปแบบเอกสารข้อความ',
    features: ['จัดรูปแบบข้อความ ใส่ภาพ ตาราง และสร้างสารบัญ', 'รองรับเอกสาร Word และส่งออกเป็น PDF'],
    role: 'ใช้จัดทำรูปเล่มและเอกสารรายงานของโครงงาน', roleBasis: 'สรุปการใช้งานจากรายการเครื่องมือ',
    section: '2.4.10', pages: '46–47'
  },
  stitch: {
    name: 'Google Stitch', logo: 'stitch.png', category: 'เครื่องมือออกแบบด้วย AI',
    definition: 'เครื่องมือจาก Google Labs ที่ช่วยแปลงคำอธิบายหรือภาพร่างเป็นแนวคิดหน้าจอ UI และโค้ดหน้าบ้านเบื้องต้น',
    features: ['ช่วยสร้างตัวเลือกหน้าจอจากคำสั่งหรือภาพร่าง', 'นำแนวคิดไปปรับรายละเอียดและพัฒนาเป็นหน้าเว็บจริงต่อได้'],
    role: 'ช่วยร่าง Wireframe ในช่วงเริ่มต้น ก่อนพัฒนาหน้าจอจริง', roleBasis: 'ตามรายงาน',
    section: '2.4.18', pages: '49'
  }
});
