const form = document.getElementById("loginForm");
form.addEventListener("submit", async(e)=>{
  e.preventDefault();
  let email_address= form.email.value;
  let password = form.password.value;

  try {
    response = await fetch("http://127.0.0.1:8000/api/login/", {
      method : "POST",
      headers : {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address,
        password
      })
    });
    const data = await response.json();
    console.log(data); 

    if(data.access && data.refresh){
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      location.assign("../index.html");
    }
    
  } catch (error) {
    console.log(error);
    
  }

})