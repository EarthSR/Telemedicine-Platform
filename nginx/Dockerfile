# ---------- Build frontend ----------
FROM node:20-alpine AS web-build
WORKDIR /app

# ติดตั้ง deps จาก telemed-web
COPY telemed-web/package*.json ./
RUN npm ci

# คัดลอกซอร์สและ build
COPY telemed-web/ ./
RUN npm run build

# ---------- Nginx serve ----------
FROM nginx:1.27-alpine

# คอนฟิก nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ build ไปยัง docroot
COPY --from=web-build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
