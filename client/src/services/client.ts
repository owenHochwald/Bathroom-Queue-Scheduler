import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
const baseUrl = process.env.BASE_URL;


export const client = axios.create({
    baseURL : baseUrl,
    headers : {
        'Content-Type': 'application/json'
    }
})

