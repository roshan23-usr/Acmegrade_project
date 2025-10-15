import jwt from "jsonwebtoken";
import express from "express";
import { dbconnection } from "./dbconnection.js";

var router=express.Router()
export default router;

export const secretkey = "ecommerce";

//functionality of express
router.post("/signup", (req, res) => {
    console.log("body-parser=", req.body);

    //taking values
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        res.status(400).json({ message: "input missing", error: true });
        return
    };


    //database query
    const dbquery = "insert into user_details(username,password,role) values(?,?,?)";
    const dbvalues = [username, password, role];

    dbconnection.query(dbquery, dbvalues, (err, dbresult) => {
        if (err) {
            res.status(401).json({ error: true, message: "something DB-issue" });
            return;
        }

        res.status(201).json({ error: false, message: "SIGN UP SUCCESSFULL" });
    });


});
router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: true, message: "missing input" });
        return;
    }

    const dbquery = "select * from user_details where username=? and password=?";
    const dbvalues = [username, password];
    dbconnection.query(dbquery, dbvalues, (err, dbresult) => {
        if (err) {
            res.status(500).json({ error: true, message: "issue in database" });
            return;
        }

        if (dbresult.length === 0) {
            res.status(401).json({ error:true, message: "NO MATCH FOUND" });
        } else {
            const payload = {
                userid:dbresult[0].userid,
                username: dbresult[0].username,
                password: dbresult[0].password,
                role: dbresult[0].role
            };

            const jwttoken = jwt.sign(payload, secretkey, { expiresIn: "0.5h" });
            res.status(200).json({ error: false, message: "MATCH FOUND- LOGIN SUCCESS", token: jwttoken ,userinfo:payload});
            console.log(dbresult[0]);
            console.log("JWT-TOKEN=", jwttoken);
        }

    });


});


//verification of token

// authguard-higher order func-- verify the token and allows to move to next function 

export function authguard(req,res,next){
    const token=req.headers.authorization;
     if(token){

        jwt.verify(token,secretkey,(err,decodedpayload)=>{

            if(err){
                res.json({error:true,message:"TOKEN INVALID"})
                return
            }
            req.user=decodedpayload;
            next()
        })
     }else{
        res.json({error:true,message:"404 TOKEN NOT FOUND"})
     }
}

//vendorguard-higher order func --> vaildates on vendor can fetch the url

export function vendorguard(req,res,next){
    if(req.user.role!="vendor"){
        res.status(403).json({errror:true,message:"NO ACCESS TO CUSTOMER"})
        return
    }
    next()
}
