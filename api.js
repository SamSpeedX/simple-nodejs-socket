import axios from "axios";

const base = "http://localhost:8000/api";

const api = axios.create({
    baseURL: base,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

export default api;