import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api"
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