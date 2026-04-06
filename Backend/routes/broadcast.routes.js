const express=
require("express");

const router=
express.Router();

const auth=
require("../middleware/auth.middleware.js");

const tenant=
require("../middleware/tenant");

const ctrl=
require("../controllers/broadcast.controller.js");

router.post(

"/send",

auth,

tenant,

ctrl.broadcast

);

module.exports=
router;