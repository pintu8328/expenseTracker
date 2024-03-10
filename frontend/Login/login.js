document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", register);
  });
  
  function register(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    axios
      .post("http://localhost:4000/user/login", {
        email: email,
        password: password,
      })
      .then((result) => {
        console.log(result);
        if (result.status == 200) {
          console.log(result.data);
        } 
      })
      .catch((err) => console.log(err));
  }
  

  