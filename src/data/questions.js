const questions = [
  {
    questionText: 'React ถูกพัฒนาขึ้นโดยบริษัทใด?',
    answerOptions: [
      { answerText: 'Google', isCorrect: false },
      { answerText: 'Microsoft', isCorrect: false },
      { answerText: 'Meta (Facebook)', isCorrect: true },
      { answerText: 'Apple', isCorrect: false },
    ],
  },
  {
    questionText: 'Hook ใดที่ใช้สำหรับจัดการ state ใน Functional Component?',
    answerOptions: [
      { answerText: 'useEffect', isCorrect: false },
      { answerText: 'useState', isCorrect: true },
      { answerText: 'useReducer', isCorrect: false },
      { answerText: 'useContext', isCorrect: false },
    ],
  },
  {
    questionText: 'Virtual DOM ใน React คืออะไร?',
    answerOptions: [
      { answerText: 'DOM ที่อยู่ในกล่องความปลอดภัย', isCorrect: false },
      { answerText: 'การจำลอง DOM ในหน่วยความจำเพื่อปรับปรุงประสิทธิภาพ', isCorrect: true },
      { answerText: 'DOM สำรองที่แสดงเมื่อเว็บล่ม', isCorrect: false },
      { answerText: 'เครื่องมือตรวจสอบ DOM อัตโนมัติ', isCorrect: false },
    ],
  },
  {
    questionText: 'prop "key" ใช้ใน React สำหรับอะไร?',
    answerOptions: [
      { answerText: 'ตั้งค่ารหัสผ่านของ component', isCorrect: false },
      { answerText: 'เก็บค่า secret ของ component', isCorrect: false },
      { answerText: 'ช่วยให้ React ระบุ items ที่เปลี่ยนแปลงได้อย่างมีประสิทธิภาพ', isCorrect: true },
      { answerText: 'การันตีความปลอดภัยของข้อมูล', isCorrect: false },
    ],
  },
  {
    questionText: 'state ใน React จะต้องถูกจัดการโดยวิธีใดถึงจะ rerender ได้ถูกต้อง?',
    answerOptions: [
      { answerText: 'เปลี่ยนค่าตรง ๆ เช่น state = newValue', isCorrect: false },
      { answerText: 'ใช้ setState function จาก Hook useState', isCorrect: true },
      { answerText: 'เรียกใช้ delete กับ state', isCorrect: false },
      { answerText: 'ใช้ method .push() กับ state', isCorrect: false },
    ],
  },
];

export default questions;
