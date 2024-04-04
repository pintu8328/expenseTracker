document.getElementById("forgotForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log("id-------------",id)
    axios
      .post(`http://localhost:3000/password/resetpassword/${id}`, {
        password
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  });
