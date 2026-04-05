import { Routes, Route, Navigate } from "react-router-dom";
import UploadDocument from "./pages/UploadDocument";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";

import AboutUs from "./pages/AboutUs";
import LegalPages from "./pages/LegalPages";
import ContactUs from "./pages/ContactUs";
import Careers from "./pages/Careers";
import BlogResources from "./pages/BlogResources";
import StoreAuth from "./pages/auth/StoreAuth";
import AdminLogin from "./pages/auth/AdminLogin";
import StoreDashboard from "./pages/store/StoreDashboard";
import SuperAdmin from "./pages/admin/AdminDashboard";
import Landing from "./pages/Landing";
import Forgot from "./Forgot";

export default function App(){

return(
   

   <Routes>

     <Route element={<Layout/>}>
       <Route path="/" element={<Landing />} />
       <Route path="/about" element={<AboutUs />} />
       <Route path="/contact" element={<ContactUs />} />
       <Route path="/legal/:type" element={<LegalPages />} />
       <Route path="/careers" element={<Careers />} />
       <Route path="/resources" element={<BlogResources />} />
     </Route>

     <Route path="/login" element={<StoreAuth />} />
     <Route path="/forgot" element={<Forgot />} />
     <Route path="/dashboard" element={<StoreDashboard />} />

     <Route path="/admin" element={<AdminLogin />} />
     <Route 
  path="/admin-dashboard"element={localStorage.getItem("role")==="superadmin"? <SuperAdmin/>: <Navigate to="/admin"/>} 
/>

     <Route path="*" element={<Navigate to="/" />} />

   </Routes>


);

}