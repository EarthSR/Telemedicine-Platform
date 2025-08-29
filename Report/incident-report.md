# Incident Report

## Incident 1
- **Incident ID**: INC-2025-001  
- **Description**: MySQL container ไม่สามารถ start ได้ในขั้นตอน `docker compose up`  
- **Time Detected**: 29 ส.ค. 2025 เวลา 13:14  
- **Root Cause**: ตั้งค่า `--lower_case_table_names=1` ใน MySQL 8.0 ซึ่งขัดกับ Data Dictionary เดิมที่สร้างด้วยค่า default (`0`) → container crash และ unhealthy  
- **Resolution**: แก้ config โดยเอา `--lower_case_table_names` ออกไป (ใช้ค่า default) แล้ว restart container → MySQL start ได้ปกติ  
- **Preventive Action**:  
  - หลีกเลี่ยงการปรับ `lower_case_table_names` หลังจาก DB ถูก init แล้ว  
  - ถ้าจำเป็นต้องใช้ → ควรกำหนดตั้งแต่เริ่ม init DB (ก่อนสร้าง data dictionary)  
  
---

## Incident 2
- **Incident ID**: INC-2025-002  
- **Description**: Healthcheck ของ API (`/api/health`) ล้มเหลวใน CI/CD pipeline  
- **Time Detected**: 29 ส.ค. 2025 เวลา 15:45  
- **Root Cause**: Healthcheck script เรียก `http://127.0.0.1/api/health` แต่ API container ยังไม่ ready ในเวลาที่กำหนด → ได้ HTTP code `000`  
- **Resolution**: เพิ่ม retry loop (รอและลองใหม่ 10 ครั้ง) ใน pipeline step healthcheck → API มีเวลา warm-up → check ผ่าน  
- **Preventive Action**:  
  - ตั้งค่า `depends_on.condition: service_healthy` ใน docker-compose  
  - เพิ่ม readiness probe ที่ API เองให้ตอบเมื่อพร้อม  

---

## Incident 3
- **Incident ID**: INC-2025-003  
- **Description**: Frontend เรียก API ไม่ได้ (Network Error) เมื่อเข้าผ่าน IP server  
- **Time Detected**: 29 ส.ค. 2025 เวลา 17:20  
- **Root Cause**: โค้ด frontend (`src/lib/api.js`) เขียน `http://localhost/api` → เมื่อเปิดจาก browser client จริง มันชี้ไป localhost ของ client ไม่ใช่ server  
- **Resolution**: แก้โค้ดเป็น `const BASE = \`${window.location.origin}/api\`;` เพื่อให้เรียก API ผ่าน domain/IP ของ server โดยตรง → แก้ปัญหาได้  
- **Preventive Action**:  
  - ใช้ environment variable (`VITE_API_URL`) สำหรับตั้งค่า base URL  
  - แยก config dev (localhost) และ prod (server IP/domain) ชัดเจน  

---
