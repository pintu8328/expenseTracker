const express = require('express');
const app = express();
const sequelize = require('./utils/database');
const userRouter = require('./routes/user')
const expenseRouter = require('./routes/expense')
const paymentRouter = require('./routes/payment');
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());


app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/payment", paymentRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync().then(() => {
    app.listen(4000, () => {
        console.log("Listening on port 4000");
    });
}).catch(err => {
    console.log(err);
});
