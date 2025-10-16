import { Router } from "express"
import {
  readSingeleUser,
  readAllUsers,
  createUser,
  updateUser,
  deleteSingleUser,
  deleteAllUsers
} from "../controllers/user.js"

const router = Router()

router.get("/:id", readSingeleUser)

router.get("/", readAllUsers)

router.post("/", createUser)

router.patch("/:id", updateUser)

router.delete("/:id", deleteSingleUser)

router.delete("/", deleteAllUsers)

export default router
