const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
 getCampaigns,
 getCampaign,
 previewCampaign,
 createAndSend,
 deleteCampaign,
} = require("../controllers/campaign.controller");

router.get("/test",(req,res)=>{
 res.send("working");
});

router.use(protect);

router.get("/",getCampaigns);
router.get("/:id",getCampaign);
router.post("/preview",previewCampaign);
router.post("/",createAndSend);
router.delete("/:id",deleteCampaign);

module.exports = router;