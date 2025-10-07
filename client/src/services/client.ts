import axios from "axios";

const baseUrl = "http://localhost:8080/api"

export const client = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});