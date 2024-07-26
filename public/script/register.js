const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const userName = document.getElementById("username");
const emailAddress = document.getElementById("emailAddress");
const passwordEl = document.getElementById("password");
const confirmPasswordEl = document.getElementById("confirmPassword");
const checkbox = document.getElementById("registerCheckbox");
const regBtn = document.querySelector(".js_register_btn");
const passwordText = document.querySelector(".password_sub_text");
const confirmPasswordText = document.querySelector(".confirmPassword_sub_text");
const firstNameText = document.querySelector(".first_name_sub_text");
const lastNameText = document.querySelector(".last_name_sub_text");
const emailAddressText = document.querySelector(".email_address_sub_text");
const userNameText = document.querySelector(".username_sub_text");
const successEl = document.querySelector(".js_success_popup");
const checkboxText = document.getElementById("checkbox_text");
const checkText = document.querySelector(".check_text");

regBtn.addEventListener("click", async(e)=>{
  e.preventDefault();
  const username = userName.value;
  const first_name = firstName.value;
  const last_name = lastName.value;
  const email_address = emailAddress.value;
  const password = passwordEl.value;
  const confirmPassword = confirmPasswordEl.value;

  if (password !== "" && password === confirmPassword){
    if(checkbox.checked){

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
            phone_number : 1534637821,
            country : "UK",
            display_picture : "http://example.com/path/to/display_picture.jpg",

          })
        });

        const data = await response.json();
        console.log(data)
        if(data.access && data.refresh){
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          location.assign("../index.html");
          setTimeout(()=>{
            successEl.style.display = "flex";
          }, 5000);

        }else{
          firstNameText.innerHTML = data.first_name || "";
          lastNameText.innerHTML = data.last_name || "";
          emailAddressText.innerHTML = data.email_address || "";
          userNameText.innerHTML = data.username || "";
        }
        
      } catch (error) {
        console.log(error);
      }

    }else{
      checkboxText.style.color = "red";
      checkText.style.color = "red";

      console.log("were");
    }  
    
  }else if (password !== confirmPassword){
    passwordText.innerHTML = "password doesn't match";
    confirmPasswordText.innerHTML = "password doesn't match";

  }else{
    passwordText.innerHTML = "password cannot be empty";
    confirmPasswordText.innerHTML = "password cannot be empty";

  }
 
})

