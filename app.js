const http =require("http")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express();
mongoose.connect("mongodb://0.0.0.0:27017/sample",{useNewURLparser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connect with mongodb")
})



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())



//making product schema
const productschema = new mongoose.Schema({
    name:String,
    description:String,
    price:Number
})


const product = new mongoose.model("product",productschema)


//create product
app.post("/api/v1/product/new", async (req, res) => {
    try {
      const newProduct = await product.create(req.body);
      res.status(200).json({
        success: true,
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
  
//view products

app.get("/api/v1/products", async (req, res) => {
    try {
      const newProduct = await product.find();
      res.status(200).json({
        success: true,
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });


//update the product

app.put("/api/v1/product/:id", async (req, res) => {
  
    let newProduct = await product.findById(req.params.id);

    if(!newProduct){
      return res.status(500).json({
        success:false,
        message:" product not found"
      })
    }

    newProduct = await product.findByIdAndUpdate(req.params.id,req.body,{new:true,
    useFindAndModify:false,
     runValidators:true
    })
    res.status(200).json({
      success: true,
      product: newProduct,
    });
  
  
})


//delete the product
app.delete("/api/v1/product/:id", async (req, res) =>{

  const newProduct = await product.findById(req.params.id);

  if(!newProduct){
    return res.status(500).json({
      success:false,
      message:" product not found"
    })
  }
     await newProduct.deleteOne();
    res.status(200).json({
      sucess:true,
      message:"product is deleted sucessfully"
    })

})





app.listen(4000,()=>{
    console.log(" working is working http://localhost:4000")
})