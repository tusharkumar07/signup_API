const mongoose=require('mongoose');
const relation=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    phno:{type:Number,require:true},
    address:{type:String,require:true},
    password:{type:String,require:true},
    rpassword:{type:String,require:true}
})

const Table=new mongoose.model('Table',relation);
module.exports=Table;