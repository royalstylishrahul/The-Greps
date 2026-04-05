import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
   <div style={{minHeight:"100vh", display:"flex", flexDirection:"column"}}>

  <Header/>

  <main style={{flex:1}}>
    <Outlet/>
  </main>

  <Footer/>

</div>
  );
};

export default Layout;