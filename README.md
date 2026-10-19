# 🔁 Reverse Tutor

**ให้ AI สอบคุณกลับ เรื่องโค้ดที่ AI เขียนให้** แล้วสอนเฉพาะส่วนที่คุณยังไม่เข้าใจ

*Flip the roles: the AI quizzes you on the code it wrote, then teaches only the gaps.*

[ภาษาไทย](#ภาษาไทย) · [English](#english)

---

## ภาษาไทย

### ปัญหา
ทุกวันนี้เราให้ AI เขียนโค้ดได้เร็วมาก แต่หลายครั้งเราได้แค่ **โค้ด** โดยไม่ได้ **ความเข้าใจ** ไปด้วย (หรือที่เรียกว่า *vibe coding*) พอโค้ดพังตอนตีสอง ก็แก้เองไม่เป็น

### วิธีแก้
Reverse Tutor สลับบทบาทกัน ให้ AI เป็นคนถาม และคุณเป็นคนอธิบาย

1. **เลือกโค้ด:** ใช้โค้ดที่ Claude เพิ่งเขียน ไฟล์ที่คุณระบุ หรือ `git diff` ก็ได้
2. **ถามทีละข้อ:** ไล่ระดับจากอธิบาย → ทำนายผลลัพธ์ → ไล่โฟลว์ → ทำไมถึงออกแบบแบบนี้ → หาบั๊ก → ลองแก้ไข
3. **ให้คะแนนอย่างตรงไปตรงมา:** ✅ / 🟡 / ❌ / ❓ ถ้าตอบผิดจะได้ **hint ก่อน** ถ้ายังไม่ได้อีกค่อยสอนแบบสั้นๆ โดยอิงโค้ดของคุณเอง
4. **สรุปเป็น report card:** บอกว่าเข้าใจเรื่องไหนแล้ว เรื่องไหนยังอ่อน พร้อมแบบฝึกหัดให้ลองทำเองโดยไม่ใช้ AI

ตอบตามภาษาที่คุณพิมพ์มา แต่ศัพท์เทคนิคยังคงเป็นภาษาอังกฤษ ดู [ตัวอย่างการใช้งานจริง](examples/sample-session.md)

### ติดตั้ง

**Claude Code (plugin):**
```
/plugin marketplace add tankun1928/reverse-tutor
/plugin install reverse-tutor@reverse-tutor
```

**ติดตั้งเองแบบ manual:** คัดลอกโฟลเดอร์ `skills/reverse-tutor/` ไปไว้ที่ `~/.claude/skills/reverse-tutor/`

**Claude.ai / Claude app:** อัปโหลด `skills/reverse-tutor/SKILL.md` ที่หน้า Settings → Capabilities → Skills

### วิธีใช้
พิมพ์ว่า `สอบฉันหน่อย`, `quiz me on this`, `ทดสอบความเข้าใจโค้ดนี้` หรือ `/reverse-tutor`
skill นี้ **ทำงานเมื่อคุณสั่งเท่านั้น** จะไม่เด้งขึ้นมาเองระหว่างที่คุณกำลังทำงาน

ลองกับโค้ดตัวอย่างได้เลย: `quiz me on examples/demo/cart.js`

---

## English

### The problem
AI writes code fast, but you often walk away with the **code** and not the **understanding** (*vibe coding*). Then it breaks at 2am and you can't fix it yourself.

### How it works
Reverse Tutor flips the roles: the AI asks, you explain.

1. **Pick the code:** whatever Claude just wrote, a file you name, or your `git diff`.
2. **One question at a time**, climbing a ladder: explain → predict → trace → why → spot-the-bug → modify.
3. **Honest grading:** ✅ / 🟡 / ❌ / ❓. You get a **hint first**; if you're still stuck, a short lesson tied to *your* code.
4. **Report card:** what you own, what's shaky, and small practice tasks to do *without* AI.

It replies in whatever language you write in. See a [sample session](examples/sample-session.md) (in Thai).

### Install

**Claude Code (plugin):**
```
/plugin marketplace add tankun1928/reverse-tutor
/plugin install reverse-tutor@reverse-tutor
```

**Manual:** copy `skills/reverse-tutor/` to `~/.claude/skills/reverse-tutor/`.

**Claude.ai / Claude app:** upload `skills/reverse-tutor/SKILL.md` under Settings → Capabilities → Skills.

### Usage
Say `quiz me`, `test me on this code`, `do I actually understand this?`, or `/reverse-tutor`. It only runs when asked; it never interrupts your flow.

Try it on the demo: `quiz me on examples/demo/cart.js`

### Why it works
Recalling and explaining is how understanding forms (the *testing effect*), and it exposes the exact gaps, so teaching targets those instead of re-explaining everything.

## License
MIT
