/* Report §1.6, grouped for presentation. Not a production-stack audit. */
window.PhetpriToolCatalog = Object.freeze({
  data: { label: 'ระบบหลังบ้านและฐานข้อมูล (Back-end & Database)', description: 'ระบบหลังบ้านสำหรับจัดเก็บและจัดการข้อมูลเรื่องร้องเรียนและผู้ใช้', extra: 'SQL สำหรับจัดการข้อมูล / Django Development Server สำหรับพัฒนา', tools: [
    ['Python','python.png'],['Django','django.png'],['MySQL','mysql.png'],['phpMyAdmin','phpmyadmin.png']
  ] },
  screen: { label: 'ระบบหน้าบ้าน (Front-end)', description: 'สร้างหน้าจอ แสดงพิกัด และสรุปสถิติบนระบบหน้าบ้าน', extra: 'แผนที่และกราฟช่วยให้เห็นข้อมูลในพื้นที่', tools: [
    ['Vue.js','vue.png'],['Tailwind CSS','tailwind.svg'],['Leaflet','leaflet.png'],['ApexCharts','apexcharts.png']
  ] },
  service: { label: 'บริการและ AI (Services & AI)', description: 'บริการสำหรับเก็บภาพ ป้องกันบอท ส่งอีเมล และช่วยตอบคำถามด้วย AI', extra: 'Gemini เป็นผู้ช่วยหลัก / Groq เป็นบริการสำรองตามรายงาน', tools: [
    ['Cloudflare R2','r2.png'],['Turnstile','turnstile.png'],['Resend','resend.png'],['Gemini','gemini.png'],['Groq','groq.png']
  ] },
  dev: { label: 'เครื่องมือและโครงสร้างพื้นฐาน (Tools & Infrastructure)', description: 'เครื่องมือและโครงสร้างพื้นฐานสำหรับเขียนโค้ด ออกแบบหน้าจอ และจัดทำรายงาน', extra: 'Ubuntu 22.04.5 / Python 3.10.12 ตามรายงาน', tools: [
    ['Ubuntu','ubuntu.svg'],['VS Code','vscode.png'],['Docker','docker.svg'],['WPS Office','wps.png'],['Google Stitch','stitch.png']
  ] }
});
