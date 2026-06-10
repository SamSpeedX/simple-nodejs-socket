import axios from "axios";

const base = process.env.BASE_URL;

const api = axios.create({
    baseURL: base,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

export default api;