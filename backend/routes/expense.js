const express = require("express");

const router = express.Router();

const exprenseController = require("../controllers/expense");
const Authenticate = require("../middleware/auth");




router.post("/",Authenticate, exprenseController.postExpense);
router.get("/",Authenticate, exprenseController.getExpenses);
router.delete("/:id",Authenticate, exprenseController.deleteExpense);


module.exports = router;