//always clone the git repo using https link
const express=require('express')
const app=express();
const mongoose=require('mongoose');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');
const Table=require('./table');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const otpGenerator = require('otp-generator');
const notifier = require('node-notifier');

const sendMailData=async (mailData)=>{
    const otpDigits=generateOtp();
    let mailTrasport=await nodemailer.createTransport({
        service:"gmail",
        auth:{
            // user:"tusharkumar0510@gmail.com",
            // pass:"ojfqliahgmxpkpwl"
            user:"tusharpathania07@gmail.com",
            pass:"mlocmszhsaxaapav"
        }
    })
    module.exports=mailData;
    let details={
        from:"tusharkumar0510@gmail.com",
        to:mailData,
        subject:"Mail for verification of chatset",
        text:`your otp is : ${otpDigits}`,
        html:`<p >Click Here to signup <a href="http://localhost:5000/login" style="border:1px solid black;color:white;background-color:blue;padding:5px">Signup here</a></p>`
    }
    mailTrasport.sendMail(details,(err)=>{
        if(err){
            console.log(`Error in sendmail :${err}`)
        }
        else{
            console.log("mail sent successfully")
        }
    })
}
// OPT sending
const generateOtp=()=>{
    const otp=otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: false });
    return otp;
}
//connecting to the database
mongoose.connect('mongodb://0.0.0.0:27017/restapi2').then(()=>{
    console.log("connected successfully");
}).catch((err)=>{
    console.log(`unable to connect due to error : ${err}`);
})

app.get('/',(req,res)=>{
    res.render('index')
})
app.post('/register',async (req,res)=>{
    let data1=req.body.pass;
    let data2=req.body.rpass;
    if(data1===data2){
        try{
            const securePass=await bcrypt.hash(data1,10);
            sendMailData(req.body.iemail)
            const submited=new Table({
                name:req.body.fname,
                email:req.body.iemail,
                phno:req.body.phno,
                address:req.body.address,
                password:securePass,
                rpassword:securePass
            })
            const done=await submited.save();
            console.log(submited);
            res.render('otpForm');
            // res.render('otpForm',{message:"Go to entered mail"});
            notifier.notify({
                title: 'Check Mail for verification',
                message: 'Welcome to ChatSet ! Enjoy you Day',
                sound: true,
                wait: true
              })
        }catch(err){
            console.log(err);
        }
    }
    else{
        console.log("Password is not matching"); 
    } 
})
app.get('/otpForm',(req,res)=>{
    res.render('otpForm');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

// v stands for verification
app.post('/login',async (req,res)=>{
    try{
        const vemail=req.body.iemail;
        const vphone=req.body.phno;
        const vpassword=req.body.pass;
        const userEmail=await Table.findOne({email:vemail})
        if(userEmail.phno==vphone){
            const checkedPass=await bcrypt.compare(vpassword,userEmail.password);
            if(checkedPass){
                res.render('Home')
            }
            else{
                res.send("Invalid Password")
            }
        }
        else{
            res.send("Invalide Phone No")
        }
    }
    catch(err){
        console.log(`Error in catch section :${err}`);
        res.send('<h1>Invalid User Information</h1>');
    }
})
app.get('/home',(req,res)=>{
    res.render('Home')
})

app.listen(5000,()=>{
    console.log("server is listening on port no : 5000");
})
