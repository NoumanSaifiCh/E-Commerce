
// handle login function //
function handleLogin() {
let username=document.getElementById("username").value;
let password=document.getElementById("password").value;

if (!username) {
  document.getElementById("sign-in-error").innerHTML =
    '<div class="alert alert-danger"><strong>Error: </strong>Please write a valid Username</div>';
  return;
}

if (!password) {
  document.getElementById("sign-in-error").innerHTML =
    '<div class="alert alert-danger"><strong>Error: </strong>Please write a Valid password</div>';
  return;
}

  fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((result)=>{
      console.log({result})
      localStorage.setItem("token", result.token)
    
      let token= localStorage.getItem("token")
    if (token==result.token){
      window.location.href="products.html"         // token check from local storage 
    }

    });
    

   
   
}


