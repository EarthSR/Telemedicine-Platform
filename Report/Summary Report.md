## 1. Pipeline Summary
- **Pipeline Execution**:  
  - สำเร็จ: 3 ครั้ง  
  - ล้มเหลว: 2 ครั้ง (สาเหตุจาก `.env` ไม่ครบ และ healthcheck API fail)  
- ปัจจุบัน pipeline สามารถ build + deploy + run healthcheck ได้ครบถ้วน

---

## 2. System Reliability 
- **API Health Check**:  
  - เดิมล้มเหลวเพราะ API ยังไม่ ready → แก้ด้วย retry loop และ depends_on → ตอนนี้ผ่านแล้ว  
- **Frontend Connectivity**:  
  - เดิมเรียก `localhost/api` ทำให้ error → แก้ให้ใช้ `window.location.origin/api`  
- **Monitoring Setup**:  
  - Prometheus + Grafana + Alertmanager + Node Exporter + cAdvisor ติดตั้งสำเร็จ  
  - Metrics ที่เก็บได้: CPU, Memory, Container Health  
  - Alert Rule: แจ้งเตือนเมื่อ CPU > 80% และ แจ้งเตือนเมื่อ Memory > 80%

---

## 3. Risks & Recommendations
- **Risks Identified**:  
  - Secret / .env อาจขาดค่าอีกถ้าเพิ่ม service ใหม่  
  - ไม่มี load balancer (ตอนนี้ API run แค่ 1 instance) → เสี่ยง latency สูงถ้า load เยอะ  
  - Logging ยังใหม่ (เพิ่งเพิ่ม Loki + Promtail) → ควรทดสอบ query log ให้ครบ  

- **Recommendations**:  
  - เพิ่ม script validate `.env` ให้ครบทุก key ที่ต้องใช้ก่อน deploy  
  - พิจารณาเพิ่ม **replica** ของ `telemed-api` + ใช้ Nginx load balance  
  - ทำ load test (เช่น k6 หรือ JMeter) เพื่อวัดความทนทานของระบบ  
  - ปรับปรุง alert rule → ครอบคลุม disk, และ response time ของ API  
