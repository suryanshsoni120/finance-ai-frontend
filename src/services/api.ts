import axios from "axios";
import { authInterceptor } from "./authInterceptor";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

API.interceptors.request.use(authInterceptor);

export default API;