import { v4 as uuidV4 } from "uuid"
import Joi from "joi"

const usersStorage = new Map()
let i

const readAllUsers = (req, res) => {
  try {
    const usersObject = Object.fromEntries(usersStorage)
    res.status(200).json(usersObject)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const readSingeleUser = (req, res) => {
  try {
    const { id } = req.params
    const usersObject = Object.fromEntries(usersStorage)

    // for (const usersKey in usersObject) {
    //   if (usersKey === id) {
    //     const singleUser = usersObject[usersKey]
    //     return res.status(200).json(singleUser)
    //   }
    // }

    // OR
    // convert the param(a string), into a number because
    // the key is stored as a number
    const usersKey = Number(id)

    if (usersStorage.has(usersKey)) {
      const singleUser = usersStorage.get(usersKey)
      return res.status(200).json(singleUser)
    }

    return res.status(404).json({
      message: "User not found",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const createUser = (req, res) => {
  try {
    const userId = uuidV4()
    const { name, email, age } = req.body 
    const usersKey = usersStorage.size + 1

    const schema = Joi.object({
      name: Joi.string().min(3).max(20).trim().required(),
      email: Joi.string()
        .email()
        .trim()
        .required(),
      age: Joi.number().positive().required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    usersStorage.set(usersKey, {
      id: userId,
      name: name,
      email: email,
      age: age,
    })

    //convert the map into an object in order to send it as a response
    const usersObject = Object.fromEntries(usersStorage)

    res.status(201).json({
      message: "User created successfully",
      users: usersObject,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const updateUser = (req, res) => {
  try {
    const { id } = req.params
    const { name, email, age } = req.body
    const updatedData = {}
    if (name != null) updatedData.name = name
    if (email != null) updatedData.email = email
    if (age != null) updatedData.age = age

    if (name) {
      const nameSchema = Joi.string().min(3).max(20).trim()
      const { error } = nameSchema.validate(name)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
    }

    if (email) {
      const emailSchema = Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
      const { error } = emailSchema.validate(email)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
    }

    if (age) {
      const ageSchema = Joi.number().positive()
      const { error } = ageSchema.validate(age)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }
    }

    const usersKey = Number(id)

    if (usersStorage.has(usersKey)) {
      let userToUpdate = usersStorage.get(usersKey)
      const updatedUser = { ...userToUpdate, ...updatedData }

      usersStorage.set(usersKey, updatedUser)
      const usersObject = Object.fromEntries(usersStorage)

      return res.status(200).json({
        message: "User updated successfully",
        updatedUser: updatedUser,
        users: usersObject,
      })
    }

    return res.status(404).json({
      message: "User not found",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const deleteSingleUser = (req, res) => {
  try {
    const { id } = req.params
    const usersKey = Number(id)

    if (usersStorage.has(usersKey)) {
      usersStorage.delete(usersKey)
      const usersObject = Object.fromEntries(usersStorage)
      return res.status(200).json({
        message: "User deleted successfully",
        users: usersObject,
      })
    }

    return res.status(404).json({
      message: "User not found",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

const deleteAllUsers = (req, res) => {
  try {
    usersStorage.clear()
    const usersObject = Object.fromEntries(usersStorage)

    res.status(200).json({
      message: "Users deleted successfully",
      users: usersObject,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export {
  readSingeleUser,
  readAllUsers,
  createUser,
  updateUser,
  deleteSingleUser,
  deleteAllUsers,
}
