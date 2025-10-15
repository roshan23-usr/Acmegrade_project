import express from "express"
import { dbconnection } from "./dbconnection.js"
import { authguard } from "./auth.js"

const router=express.Router()
export default router;

router.post("/add",authguard,(req,res)=>{

     const { fullname,number,mainaddr,state,pincode } = req.body;

    if (!fullname || !number || !mainaddr || !state || !pincode) {
        res.status(400).json({ message: "input missing", error: true });
        return
    };


    //database query
    const dbquery = "insert into delivery(userid,fullname,number,mainaddr,state,pincode) values(?,?,?,?,?,?)";
    const dbvalues = [req.user.userid,fullname,number,mainaddr,state,pincode];

    dbconnection.query(dbquery, dbvalues, (err, dbresult) => {
        if (err) {
            res.status(401).json({ error: true, message: "something DB-issue" });
            return;
        }

        res.status(201).json({ error: false, message: "Details filled" });
    });

})

router.get("/view",authguard,(req,res)=>{

    const userid=req.user.userid;
    const  dbquery="select * from delivery where userid=?"
    const  dbvalues=[userid]

    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
            res.status(500).json({error:true,message:"DB ERROR"})
            return
        }
        res.status(200).json({error:false,message:"delivery details here",data:dbresult})
    })
})

router.post("/edit",authguard,(req,res)=>{

    const { fullname,number,mainaddr,state,pincode } = req.body;
    const adrsid=req.headers.adrsid
   
if (!fullname || !number || !mainaddr || !state || !pincode) {
        res.status(400).json({ message: "input missing", error: true });
        return
    };


    const dbquery = "update delivery set userid=?,fullname=?,number=?,mainaddr=?,state=?,pincode=? where adrsid=?";
    const dbvalues = [req.user.userid,fullname,number,mainaddr,state,pincode,adrsid];
    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
             res.status(500).json({error:true,message:"DATABASE ERROR"})
             console.log(err)
             return
        }
        console.log(dbresult[0])
        res.status(200).json({error:false,message:"address edited done"})
    })
})
