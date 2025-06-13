const mongoose  = require("mongoose");
const Schema=mongoose.Schema;

const registerschema=new Schema({
    username:String,
    email:String,
    password:String,
    license: String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});

const register=mongoose.model("user",registerschema);

module.exports=register;

