import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log("URL da API sendo usada:", baseURL);

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
