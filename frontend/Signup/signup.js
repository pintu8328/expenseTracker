document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", register);
  });
  
  function register() {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    axios
      .post("http://localhost:4000/user/register", {
        name: name,
        email: email,
        password: password,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
  