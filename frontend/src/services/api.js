// src/services/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://time-saver.onrender.com",
  // withCredentials: true, // ⬅️ required for session-based auth
});

export default instance;
