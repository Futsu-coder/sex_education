const flashcards = [
  {
    statement: 'React ถูกพัฒนาโดย Meta (Facebook)',
    answer: 'yes',
    explanation: 'React พัฒนาโดยทีมของ Facebook/Meta',
  },
  {
    statement: 'JSX เป็นภาษาโปรแกรมที่แยกต่างหากจาก JavaScript',
    answer: 'no',
    explanation: 'JSX เป็นส่วนขยาย syntax ของ JavaScript',
  },
  {
    statement: 'Props ใน React เปลี่ยนค่าได้ภายใน Component ลูก',
    answer: 'no',
    explanation: 'Props อ่านได้อย่างเดียว (read-only) การเปลี่ยนค่าใช้ State',
  },
  {
    statement: 'Virtual DOM ทำให้ React อัปเดต UI ได้อย่างมีประสิทธิภาพ',
    answer: 'yes',
    explanation: 'Virtual DOM ช่วยลดการทำงานกับ DOM จริงที่ไม่จำเป็น',
  },
  {
    statement: 'useState เป็น Hook สำหรับจัดการ side effects',
    answer: 'no',
    explanation: 'useState ใช้จัดการ state ส่วน useEffect ใช้จัดการ side effects',
  },
];

export default flashcards;
