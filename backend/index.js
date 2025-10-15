import express from "express"
import bodyparser from "body-parser"
import cors from "cors"
import authrouter from "./auth.js"
import productrouter from "./product.js"
import cartrouter from "./cart.js"
import orderrouter from "./order.js"
import deliveryrouter from "./delivery.js"

//connections :

//--express
export var app=express()
app.listen(4100)
app.use(cors())
app.use(bodyparser.json())
app.use("/auth",authrouter)
app.use("/product",productrouter)
app.use("/cart",cartrouter)
app.use("/order",orderrouter)
app.use("/delivery",deliveryrouter)


/*
                MAIN API FUNCTIONALITY:

             REQ   -->take payload from body(passes from fetch func fornt end as header)
                -->functions tasks
             RES   --> as status-codes & message*/
