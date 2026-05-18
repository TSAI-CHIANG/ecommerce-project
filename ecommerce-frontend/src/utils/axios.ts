// src/utils/axios.ts
import axios from "axios";

// 設定全域 axios 攔截器
//網站裡發出的每一個 API 請求，在出發去後端之前，都必須先經過這段程式碼的檢查。
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("ecommerce-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
