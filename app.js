const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./utils/database");
const helmet = require("helmet");
const app = express();
const PORT = 3000;

const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const paymentRouter = require("./routes/payment");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");


//Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

//Routes
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/payment", paymentRouter);
app.use("/premium", premiumRouter);
app.use("/password", passwordRouter);



//relations

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordRequests = require("./models/ForgotPasswordRequests");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port ", PORT);
    });
  })
  .catch((errr) => console.log(errr));
