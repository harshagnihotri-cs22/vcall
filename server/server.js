const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const livekitRoutes = require("./routes/livekitRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/vcall")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/livekit", livekitRoutes)
app.use("/api/payments", paymentRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
