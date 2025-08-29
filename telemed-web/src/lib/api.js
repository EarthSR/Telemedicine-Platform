// src/lib/api.js
import axios from "axios";

// ป้องกันปัญหา localhost: ใช้ค่า .env ของ Vite ถ้ามี ไม่งั้นใช้ /api (relative)
// รองรับได้ทั้งรูปแบบ absolute (http://ip:port/api) และ relative (/api หรือ api)
function normalizeBase(value) {
  if (!value) return "/api";
  const v = String(value).trim();
  if (/^https?:\/\//i.test(v)) return v.replace(/\/+$/, ""); // absolute URL
  return `/${v.replace(/^\/+/, "").replace(/\/+$/, "")}`;     // relative path
}

const BASE = normalizeBase(import.meta?.env?.VITE_API_URL);

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

// attach token + handle FormData content-type
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = "Bearer " + token;
      }
    } catch { /* noop */ }

    // ถ้าเป็น FormData ปล่อยให้ browser ใส่ boundary เอง
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// normalize backend error + เก็บ response เดิมไว้ด้วย
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const resp = err?.response;
    if (resp) {
      const payload = resp.data;
      const message =
        payload?.error?.message ||
        payload?.message ||
        (typeof payload === "string" ? payload : "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");

      // แนบฟิลด์ normalize ลงบน err เดิม เพื่อให้ ex.response ยังใช้งานได้
      err.status = resp.status;
      err.message = message;
      err.payload = payload;

      return Promise.reject(err);
    }
    return Promise.reject({ status: 0, message: err?.message || "Network error", raw: err });
  }
);

export default api;
