const express = require("express")
const { contactUsController } = require("../controllers/ContactUS")
const router = express.Router()


router.post("/contact", contactUsController)

module.exports = router