document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expenseForm");
    const expensesList = document.getElementById("expenses");
    const token = JSON.parse(localStorage.getItem("token")).token;
  
    expenseForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const amount = document.getElementById("amount").value;
      const description = document.getElementById("description").value;
      const category = document.getElementById("category").value;
  
      if (amount && description && category) {
        const expense = {
          amount: amount,
          description: description,
          category: category,
        };
       console.log(expense)
        axios
          .post("http://localhost:4000/expense", expense,
          {
            headers: { Authorization: token },
          }
          )
          .then(function (response) {
            displayExpenses();
          })
          .catch(function (error) {
            console.log(error);
          });
  
        // Clear form fields
        expenseForm.reset();
  
        // Display expenses
        displayExpenses();
      } else {
        alert("Please fill in all fields.");
      }
    });
  
    // Display expenses
    function displayExpenses() {
      expensesList.innerHTML = "";
      
  
      axios
        .get(
          "http://localhost:4000/expense",
          {
            headers: { Authorization: token },
          }
          )
        .then(function (response) {
          let data = response.data;
         console.log("dataaaaa",data)
         
      
  
         
          data.forEach(function (expense, index) {
            const li = document.createElement("li");
            li.className = "list-group-item";
            const deleteButton = document.createElement("button");
            deleteButton.className = "deleteButton";
            deleteButton.textContent = "Delete";
            li.innerHTML = `<span>${expense.amount} - ${expense.description} (${expense.category})</span>`;
           
            li.append(deleteButton);
            // deleteButton.addEventListener("click", (e) => {
            //   deleteExpense(index);
            // });
            expensesList.appendChild(li);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  
    
    displayExpenses()
  });

  document.getElementById("buy-button").onclick = async function (e) {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token")).token;
    const result = await axios.post(
      "http://localhost:4000/payment/createOrder",
      null,
      {
        headers: { Authorization: token },
      }
    );
    var options = {
      key: result.data.key_id,
      order_id: result.data.order.id,
      handler: async function (response) {
        await axios.post(
          "http://localhost:4000/payment/updateOrder",
          {
            order_id: result.data.order.id,
            payment_id: response.razorpay_payment_id,
            status: "SUCCESS",
          },
          {
            headers: { Authorization: token },
          }
        );
        showPremiumUser();
        localStorage.setItem(
          "token",
          JSON.stringify({
            token: JSON.parse(localStorage.getItem("token")).token,
            ispremium: true,
          })
        );
        alert("You are premium User Now");
      },
    };
  
    var razorpayObject = new Razorpay(options);
    razorpayObject.on("payment.failed", async function (response) {
      await axios.post(
        "http://localhost:3000/payment/updateOrder",
        {
          order_id: result.data.order.id,
          payment_id: response.razorpay_payment_id,
          status: "FAILED",
        },
        {
          headers: { Authorization: token },
        }
      );
      alert("This step of Payment Failed");
    });
    razorpayObject.open();
  };
  