import express from "express"
import { dbconnection } from "./dbconnection.js"
import { authguard, vendorguard } from "./auth.js"

var router=express.Router()
export default router

router.post("/add",authguard,vendorguard,(req,res)=>{

    console.log("BODY=",req.body)
    console.log("BODY=",req.user.userid)

    const {prdname,price,details}=req.body
    const ownerid=req.user.userid
   

    if(!prdname || !price || !details){
        res.status(404).json({error:true,message:"INPUT MISSING"})
        return
    }

    const dbquery = "insert into product(name,price,details,owner) values(?,?,?,?)"
    const dbvalues=[prdname,price,details,ownerid]
    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
             res.status(500).json({error:true,message:"DATABASE ERROR"})
             return
        }

        res.status(200).json({error:false,message:"product added"})
    })
})

router.get("/view",authguard,(req,res)=>{
    console.log(req.user.userid)
    //  dbquery="select * from product where owner=?"
    let dbquery="";
    if(req.user.role==="vendor"){

            dbquery="select * from product where owner=?"
    }else{
            dbquery="select * from product"

    }
    const dbvalues=[req.user.userid]
    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
            res.status(500).json({error:true,message:"DATABASE ERROR"})
            return
        }
        console.log(dbresult)
        res.status(200).json({error:false,message:"READY TO VIEW PRODUCTS",data:dbresult})
    })
})

router.post("/remove",authguard,vendorguard,(req,res)=>{

    const {Id}=req.body
    const dbquery="delete from product where id=?"
    const dbvalue=[Id]
    dbconnection.query(dbquery,dbvalue,(err,dbresult)=>{
        if(err){
            res.status(500).json({error:true,message:"db error"})
            return
        }
        res.status(200).json({error:false,message:"-deleted succesfully"})
    })
})

router.post("/edit",authguard,vendorguard,(req,res)=>{

    console.log("BODY=",req.body)
    console.log("BODY=",req.user.userid)

    const {prdname,price,details,id}=req.body
    const ownerid=req.user.userid
    const pid=req.headers.pid
   

    if(!prdname || !price || !details){
        res.status(404).json({error:true,message:"INPUT MISSING"})
        return
    }

    const dbquery = "UPDATE product SET name = ?, price = ?, details = ?, owner = ? WHERE id = ?"
    const dbvalues=[prdname,price,details,ownerid,pid]
    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
             res.status(500).json({error:true,message:"DATABASE ERROR"})
             return
        }

        res.status(200).json({error:false,message:"product edited done"})
    })
})