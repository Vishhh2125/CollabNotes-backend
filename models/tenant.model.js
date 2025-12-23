import mongoose from "mongoose";



const tenantSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
        trim:true 
    },
    plan:{
        type:String,
        enum:["free","pro",],
        default:"free"
    }
},{
    timestamps:true
})



const Tenant = mongoose.model("Tenant",tenantSchema);


export default Tenant;