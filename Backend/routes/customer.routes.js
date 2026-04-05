const crypto = require("crypto");
const { protect } = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();
const Customer = require("../models/customer.model");
const multer = require("multer");
const upload = multer();


/* CREATE CUSTOMER */

router.post("/", protect, upload.any(), async (req,res)=>{

console.log("====== CUSTOMER CREATE DEBUG ======");
console.log("BODY:", JSON.stringify(req.body,null,2));
console.log("NAME:", req.body.name);
console.log("WHATSAPP:", req.body.whatsapp);
console.log("===================================");

try{

const customer = new Customer({
name: (req.body?.name || "").trim(),
whatsapp: (req.body?.whatsapp || "").trim(),
email: (req.body?.email || "").trim(),
address: (req.body?.address || "").trim(),
location: (req.body?.location || "").trim(),
gender: req.body?.gender || "",
category: req.body?.category || "",
lastPurchaseDate: req.body?.lastPurchaseDate || null,
customFields: req.body?.customFields || {},
store: req.store._id
});

await customer.save();

res.json({

message:"Customer added",

customer

});

}catch(error){

console.log("CREATE CUSTOMER ERROR:",error);   // ADD THIS

res.status(500).json({

message:error.message,
stack:error.stack

});

}

});


/* GET CUSTOMERS (search + filter + pagination) */

router.get("/", protect, async (req,res)=>{

    try{

        const {search,category,status,page=1,limit=10} = req.query;

      let query={
  store:req.store.id
};

        if(search){
            query.name={$regex:search,$options:"i"};
        }

        if(category){
            query.category=category;
        }

        if(status){
            query.status=status;
        }

        const customers = await Customer.find(query)

        .sort({created_at:-1})

        .limit(Number(limit))

        .skip((page-1)*limit);

        const total = await Customer.countDocuments(query);

        res.json({

            total,

            page:Number(page),

            pages:Math.ceil(total/limit),

            data:customers

        });

    }catch(error){
        res.status(500).json(error);
    }

});


/* UPDATE CUSTOMER */

router.put("/:id", protect, upload.any(), async (req,res)=>{

    try{

       const customer = await Customer.findOneAndUpdate(
{
_id:req.params.id,
store:req.store.id
},
req.body,
{new:true}
);

        res.json({

            message:"Customer updated",

            customer

        });

    }catch(error){
        res.status(500).json(error);
    }

});


/* DELETE CUSTOMER */

router.delete("/:id", protect, async (req,res)=>{

try{

const deleted = await Customer.findOneAndDelete({
_id:req.params.id,
store:req.store.id
});

if(!deleted){
return res.status(404).json({
message:"Customer not found"
});
}

res.json({
success:true,
message:"Customer deleted"
});

}catch(error){

res.status(500).json({
message:error.message
});

}

});

/* UPDATE STATUS */

router.patch("/:id/status", protect, async (req,res)=>{

    try{

        const customer = await Customer.findOneAndUpdate(
{
_id:req.params.id,
store:req.store.id
},
{status:req.body.status},
{new:true}
);

        res.json({

            message:"Status updated",

            customer

        });

    }catch(error){
        res.status(500).json(error);
    }

});


/* ADD NOTE */

router.post("/custom-fields", protect, async (req, res) => {
try{

const field = new CustomField({

store: req.store.id,

name: req.body.name,

type: req.body.type,

options: req.body.options || [],

required: req.body.required || false,

qrToken:
req.body.type==="fileQR"
? crypto.randomBytes(12).toString("hex")
: undefined

});

await field.save();

res.json({

success:true,

field

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

});

/* ADD FOLLOWUP */

router.post("/:id/followup", protect, async (req,res)=>{

    try{

        const customer = await Customer.findOne({
_id:req.params.id,
store:req.store.id
});
if(!customer){
return res.status(404).json({
message:"Customer not found"
});
}

        customer.followups.push({

            date:req.body.date,

            note:req.body.note

        });

        await customer.save();

        res.json({

            message:"Followup added",

            customer

        });

    }catch(error){
        res.status(500).json(error);
    }

});

const CustomField = require("../models/CustomField");

router.get("/custom-fields", protect, async (req,res)=>{
try{

const fields = await CustomField.find({
store:req.store.id,
}).sort({createdAt:1});

res.json(fields);

}catch(err){

res.status(500).json({message:err.message});

}
});
router.put("/custom-fields/:id", protect, async (req,res)=>{

try{

const field = await CustomField.findByIdAndUpdate(
req.params.id,
{ name:req.body.name },
{ new:true }
);

res.json({
success:true,
field
});

}catch(err){

res.status(500).json({
success:false,
message:"Update failed"
});

}

});
router.delete("/custom-fields/:id", protect, async (req,res)=>{

try{

await CustomField.findByIdAndDelete(
req.params.id
);

res.json({
success:true,
message:"Field deleted"
});

}catch(err){

res.status(500).json({
success:false,
message:"Delete failed"
});

}

});
module.exports = router;