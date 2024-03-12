const express = require("express");

const router = express.Router();

const exprenseController = require("../controllers/expense");




router.post("/", exprenseController.postExpense);
router.get("/", exprenseController.getExpenses);
router.delete("/:id", exprenseController.deleteExpense);


module.exports = router;