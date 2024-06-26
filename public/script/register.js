const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const userName = document.getElementById("username");
const emailAddress = document.getElementById("emailAddress");
const passwordEl = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const checkbox = document.getElementById("registerCheckbox");
const regBtn = document.querySelector(".js_register_btn");

regBtn.addEventListener("click", async(e)=>{
  e.preventDefault();
  if(checkbox.checked){
    let username = userName.value;
    let first_name = firstName.value;
    let last_name = lastName.value;
    let email_address = emailAddress.value;
    let password = passwordEl.value;
    console.log(username, first_name, last_name, email_address, password);

    
    try {
      const response = await fetch ("http://127.0.0.1:8000/api/register/", {
        method : "POST",
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify({
          username,
          email_address,
          password,
          first_name,
          last_name,
          phone_number : 1234567821,
          country : "USA",
          display_picture : "http://example.com/path/to/display_picture.jpg",

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

  }else {
    
    console.log ("Agree to our terms and conditions");

  }

  

 
})

