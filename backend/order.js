import express from "express"
import { dbconnection } from "./dbconnection.js"
import { authguard } from "./auth.js"

const router = express.Router()

export default router;

router.post("/add",authguard,(req,res)=>{

    

    const userid=req.user.userid;
    const dbquery ="insert into orders(cartid,pid,userid) select cartid,pid,userid from cart where userid=?"
    const dbvalues=[userid]



    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
            res.status(500).json({error:true,message:"DB ERROR"})
            return
        }

        if(dbresult.affectedRows===0){
            res.status(404).json({error:true,message:"NO ITEMS IN CART"})
            return
        }else{

        res.status(200).json({error:false,message:"ORDER PLACED SUCCESSFULLY"})
        }


    })
})

router.get("/view",authguard,(req,res)=>{

    const userid=req.user.userid;
    const  dbquery="select * from orders join product on orders.pid = product.id where userid=?"
    const  dbvalues=[userid]

    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
            res.status(500).json({error:true,message:"DB ERROR"})
            return
        }
        res.status(200).json({error:false,message:"orders ready",data:dbresult})
    })
})

router.post("/cancel",authguard,(req,res)=>{

    const {orderid}=req.body;

    const dbquery="delete from orders where orderid=?"
    const dbvalues=[orderid]

    dbconnection.query(dbquery,dbvalues,(err,dbresult)=>{
        if(err){
            res.status(500).json({error:true,message:"DB ISSUE"})
            return
        }

        res.status(200).json({error:false,message:"order cancelled!"})
    })
})


