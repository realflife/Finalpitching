/* Aggregate-only snapshot. No respondent records. See SOURCES.md for definitions. */
window.PhetpriSurvey = Object.freeze({
  source: {
    title: 'แบบสำรวจความต้องการ ระบบแจ้งปัญหาและติดตามสถานะการดำเนินงานของชุมชน (Phetpri)',
    spreadsheetId: '1OY1mHT5f5fpsN2FUOFdRldUvvzuzLopXlE6qRJ8IQ1M',
    sheet: 'Form Responses 1',
    sheetId: 1699099524,
    range: 'A1:M139',
    accessed: '2026-10-07',
    period: '27 ก.ค.–13 ส.ค. 2569',
    responses: 38,
    grain: 'หนึ่งแถวคำตอบ ไม่ใช่จำนวนบุคคลที่ยืนยันตัวตนแล้ว'
  },
  quality: { exactDuplicateRows: 0, missingTracking: 2, students: 29, residents: 23, passingRegularly: 15, optionalComments: 9, substantiveComments: 0, identifiedUniqueRespondents: false },
  demographics: {
    age: [ ['ต่ำกว่า 18 ปี', 2], ['18–25 ปี', 29], ['26–35 ปี', 4], ['36–50 ปี', 2], ['50 ปีขึ้นไป', 1] ],
    occupation: [ ['นักเรียน/นักศึกษา', 29], ['ข้าราชการ', 3], ['อื่น ๆ', 3], ['พนักงานบริษัท', 1], ['ธุรกิจส่วนตัว', 1], ['ประชาชนทั่วไป', 1] ]
  },
  channels: [
    { label: 'ไม่เคยแจ้ง / ปล่อยผ่าน', count: 23 },
    { label: 'โทรศัพท์สายด่วน', count: 7 },
    { label: 'โซเชียลมีเดีย', count: 6 },
    { label: 'ผู้นำชุมชน', count: 6 },
    { label: 'เดินทางไปหน่วยงาน', count: 4 }
  ],
  problems: [
    { label: 'ไม่มีอัปเดตความคืบหน้า', count: 19 },
    { label: 'เดินทาง / เวลาไม่สะดวก', count: 14 },
    { label: 'ติดต่อหน่วยงานยาก', count: 14 },
    { label: 'ขั้นตอน / เอกสารยุ่งยาก', count: 14 },
    { label: 'อธิบายพิกัดยาก', count: 3 }
  ],
  tracking: { hard: 17, impossible: 17, convenient: 2, missing: 2, valid: 36 },
  necessity: { distribution: [0, 1, 2, 10, 25], high: 35, sum: 173, valid: 38, scaleMaximum: 5 },
  features: [
    { label: 'แจ้งเตือนสถานะ', count: 30 },
    { label: 'ภาพและพิกัด GPS', count: 26 },
    { label: 'แผนที่สรุปปัญหา', count: 16 },
    { label: 'ผู้ช่วย AI', count: 15 },
    { label: 'Dashboard สาธารณะ', count: 15 }
  ],
  categories: [
    { label: 'ถนน / ทางเท้า', count: 36 },
    { label: 'ไฟส่องทาง / ไฟฟ้า', count: 30 },
    { label: 'ขยะ / ความสะอาด', count: 25 },
    { label: 'ท่อระบายน้ำ / น้ำท่วม', count: 17 },
    { label: 'ต้นไม้ / พื้นที่สาธารณะ', count: 5 }
  ]
});
