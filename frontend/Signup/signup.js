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
    .post("http://localhost:3000/user/register", {
      name: name,
      email: email,
      password: password,
    })
    .then((result) => {
      //redirect to login page
      console.log(result);
      if (result.status == 200) {
        console.log(result.data);
        localStorage.setItem("token", result.data.token);
        window.location.href = "http://127.0.0.1:5500/frontend/Login/login.html";
      } else {
        const errorMessage = result.message;
        console.log(errorMessage);
      }
    })
    .catch((err) => console.log(err));
}
