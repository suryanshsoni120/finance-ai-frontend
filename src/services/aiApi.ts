import axios from "axios";
import { authInterceptor } from "./authInterceptor";

const AI_API = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL
});

AI_API.interceptors.request.use(authInterceptor);

export default AI_API;