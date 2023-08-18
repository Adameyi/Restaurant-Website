import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

//Middleware
app.use(cors())
app.use(express.json())

//API 
app.use("/api/v1/restaurants", restaurants)

// * = wildcard, to catch-all or any route that hasn't been explicitly mentioned previously within the app
app.use("*", (req, res) => res.status(404).json({error:"not found"}))

export default app