// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature } = require("../controllers/Payment")
const { auth, isInstructor, isStudent, isAdmin, isStudents } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudents, capturePayment)
router.post("/verifySignature", verifySignature)

module.exports = router