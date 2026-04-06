import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const API = axios.create({
   baseURL: normalizedBaseUrl
});

API.interceptors.request.use((req)=>{

  const token = localStorage.getItem("token")?.trim();
  const storeId = localStorage.getItem("storeId");

  if(token){
    req.headers.Authorization = `Bearer ${token}`;
  }

  if(storeId){
    req.headers.storeId = storeId;
  }

  return req;

});

export const getCustomers = ()=>{
  return API.get("/customers");
};

export const getCampaigns = ()=>{
 return API.get("/campaigns");
};

export default API;