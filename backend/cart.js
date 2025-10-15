import express from "express"
import { dbconnection } from "./dbconnection.js"
import { authguard } from "./auth.js"

const router = express.Router()

export default router;

router.post("/add",authguard,(req,res)=>{

    const {pid}=req.body;
    console.log(req.body)

    const dbquery="insert into cart(userid,pid) values(?,?)"
    const dbvalues=[req.user.userid,pid]

    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{

        if(err){
            res.status(500).json({error:true,message:"DB ISSUE"})
            return 
        }

        res.status(201).json({error:false,message:"SUCESSFULLY ADDED INTO CART"})
    })

})

router.get("/view",authguard,(req,res)=>{

    const dbquery="select * from cart join product on cart.pid = product.id where userid=?"
    const dbvalues=[req.user.userid]

    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
         if(err){
            res.status(500).json({error:true,message:"DATABASE ERROR"})
            return
        }
        console.log(dbresult)
        res.status(200).json({error:false,message:"CART PRODUCTS",data:dbresult})
    })

})

router.post("/remove",authguard,(req,res)=>{

    const {cartid}=req.body;

    const dbquery="delete from cart where cartid=?"
    const dbvalues=[cartid]

    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
            res.status(500).json({error:true,message:"DB ISSUE"})
            return
        }

        res.status(200).json({error:false,message:"removed from cart"})
    })
})