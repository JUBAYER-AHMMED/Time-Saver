// src/services/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // ⬅️ required for session-based auth
});

export default instance;
