const express=require("express");

const router=express.Router();

const {

adminLogin,
verifyAdminOTP

}=
require("../controllers/admin.controller");


router.post(
"/login",
adminLogin
);

router.post(
"/verify-otp",
verifyAdminOTP
);
router.get("/test",(req,res)=>{
res.send("ADMIN WORKING");
});
module.exports=router;