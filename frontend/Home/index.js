document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expenseForm");
    const expensesList = document.getElementById("expenses");
  
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
  
        axios
          .post("http://localhost:4000/expense", expense)
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
          "http://localhost:4000/expense" )
        .then(function (response) {
          let data = response.data;
  
         
      
  
         
          data.expenses.forEach(function (expense, index) {
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
  
    
   
  });