# 1. Infrastructure & Deployment Plan
## 1.1 อธิบายสถาปัตยกรรมระบบ
- ใช้ Server เครื่องเดียว (Ubuntu) สำหรับรันระบบทั้งหมด
- ใช้ **Docker + Docker Compose** สำหรับจัดการคอนเทนเนอร์ 
  - **Nginx (reverse proxy + SSL)**  
  - **Backend (Node.js/Express API)**  
  - **MySQL Database**  
- ใช้ **Terraform** สำหรับสร้าง EC2, Security Group, และจัดการโครงสร้างพื้นฐาน (IaC)
---
## 1.2 กำหนด CI/CD Pipeline Flow
- ใช้ **GitHub Actions** เป็นเครื่องมือ CI/CD  
- Pipeline Flow:  
  1. **Build** → สร้าง Docker image จากโค้ด  
  2. **Test** → รัน Unit Test / Lint  
  3. **Deploy** → เชื่อมต่อไปยัง Server ผ่าน SSH → สั่ง  
     ```bash
     docker compose pull && docker compose up -d
     ```  
- การอัปเดตโค้ดจึงเป็นแบบอัตโนมัติ ทุกครั้งที่ push branch `main`
---
## 1.3 ระบุ Environment (Prod)
- **Production:**  
  - ใช้ Server ขนาดกลาง (CPU 2 core, RAM 4 GB ขึ้นไป)
  - ใช้ Docker Volume เก็บข้อมูลถาวร (รวมทั้ง MySQL data volume) 
  - ใช้ `.env.prod` สำหรับเก็บค่า Config/Secrets ของ Production  
- โครงสร้างนี้ประหยัดและง่ายต่อการดูแล เหมาะกับระบบเริ่มต้น แต่มี **Single Point of Failure** (ถ้า Server มีปัญหา ระบบทั้งหมดจะล้ม)
---
## 1.4 อธิบาย Monitoring & Logging
- **Monitoring:**  
  - ใช้ Prometheus + Grafana รวบรวมและแสดงผล metrics (CPU, Memory, Container Health)  
  - ใช้ node_exporter และ cAdvisor เก็บข้อมูลระบบและ Docker container
- **Logging:**  
  - ใช้ **Loki + Promtail** จัดเก็บและค้นหา logs จาก container 
---
