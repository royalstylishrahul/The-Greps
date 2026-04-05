const express=require("express");

const router=express.Router();

const {

createStore,
getProfile,
updateProfile

}=require("../controllers/store.controller");

const {
protect
}=require("../middleware/auth.middleware");

const {
upload
}=require("../middleware/upload");


// CREATE
router.post(
"/create",
createStore
);


// PROFILE GET
router.get(
"/profile",
protect,
getProfile
);


// PROFILE UPDATE
router.put(
"/profile",
protect,
upload.single("logo"),
updateProfile
);


module.exports=router;