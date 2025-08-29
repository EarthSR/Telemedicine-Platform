# Telemedicine Platform — Quickstart

ระบบตัวอย่าง Telemedicine: Backend (Express/Node.js) + MySQL + Frontend (React/Vite) พร้อม Swagger และ Postman

---

## Requirements
- Node.js 18+
- MySQL 8+
- (Optional) Redis สำหรับ IP block

---

## 0) เตรียมฐานข้อมูล (ต้องทำก่อนรันระบบ)
นำไฟล์ `telemedicinedb.sql` ใน floder db ไปติดตั้งให้เรียบร้อย

```bash
# สร้างฐานข้อมูล
mysql -u root -p -e "CREATE DATABASE telemedicinedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# นำเข้า schema + seed
mysql -u root -p telemedicinedb < telemedicinedb.sql

### 📂 Report/README.md
```markdown
# Project Documentation
## 📑 Iac-mysql
- [Iac-mysql](Infrastructure.md)  
## 📑 Reports
- [Incident Report](incident-report.md)  
- [Summary Report](summary-report.md)  
