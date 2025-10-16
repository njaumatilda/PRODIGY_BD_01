import "dotenv/config"
import express from "express"

import usersRoutes from "./routes/user.js"

const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.use("/users", usersRoutes)

app.listen(PORT, () => {
  console.log(`[server]: App listening on port: ${PORT}`)
})
