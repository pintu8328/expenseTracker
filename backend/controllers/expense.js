const Expense = require('../models/expense');

exports.postExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;
            const expense = await req.user.createExpense({
            amount,
            description,
            category
        });
        res.status(201).send("Expense added");
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).send('Error adding expense');
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({where: { userId: req.user.id }});
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send('Error fetching expenses');
    }
};

exports.updateExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, description, category } = req.body;
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).send('Expense not found');
        }
        expense.amount = amount;
        expense.description = description;
        expense.category = category;
        await expense.save();
        res.status(200).send('Expense updated');
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).send('Error updating expense');
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).send('Expense not found');
        }
        await expense.destroy();
        res.status(200).send('Expense deleted');
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).send('Error deleting expense');
    }
};
