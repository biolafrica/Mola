import {getUserProfile} from "../../Data/user.js";
import { renderHeader } from "./script.js";
import { popupDisplayHTML } from "./utils/popup.js";

const avatarEditBtn = document.querySelector(".js_avatar_btn");
const usernameEditBtn = document.querySelector(".js_username_btn");
const passwordEditBtn = document.querySelector(".js_password_btn");
const avatarEl = document.querySelector(".edit_avatar_container");
const usernameEl = document.querySelector(".edit_username_container");
const passwordEl = document.querySelector(".change_password_container");
const overlay = document.querySelector(".js_overlay");
const passwordCancelBtn = document.querySelector(".password_cancel_btn");
const avatarCancelBtn = document.querySelector(".avatar_cancel_btn");
const usernameCancelBtn = document.querySelector(".username_cancel_btn");
const userNameEl = document.querySelector(".js_profile_username");
const userDPEl = document.querySelector(".js_profile_avatar");
const successPopupEl = document.querySelector(".js_success_popup");
const token = localStorage.getItem("access");


renderProfileDetails();
console.log(await getUserProfile(token))

avatarEditBtn.addEventListener("click", ()=>{
  overlay.style.display = "initial";
  avatarEl.style.display = "initial";


});

avatarCancelBtn.addEventListener("click", ()=>{
  overlay.style.display = "none";
  avatarEl.style.display = "none";

});

usernameEditBtn.addEventListener('click', ()=>{
  overlay.style.display = "initial";
  usernameEl.style.display = "initial";

});

usernameCancelBtn.addEventListener("click", ()=>{
  overlay.style.display = "none";
  usernameEl.style.display = "none";
  
});

passwordEditBtn.addEventListener("click", ()=>{
  overlay.style.display = "initial";
  passwordEl.style.display = "initial";
});

passwordCancelBtn.addEventListener("click", ()=>{
  overlay.style.display = "none";
  passwordEl.style.display = "none";
  
})

document.querySelectorAll(".js_iconCancel").forEach((icon)=>{
  icon.addEventListener("click", ()=>{
    overlay.style.display = "none";
    avatarEl.style.display = "none";
    usernameEl.style.display = "none";
    passwordEl.style.display = "none";

  })

})

document.querySelectorAll(".js_enable_btn").forEach((btn)=>{
  btn.addEventListener("click", ()=>{
    if (btn.textContent === "Enable"){
      btn.classList.remove("filled-btn");
      btn.classList.add("inactive-btn");
      btn.innerHTML = "<h5>Enabled</5>";
      console.log("name")



    } else if(btn.textContent === "Enabled"){
      btn.classList.remove("inactive-btn");
      btn.classList.add("filled-btn");
      btn.innerHTML = "<h5>Enable</h5>";

    }
  })

});

async function renderProfileDetails(){
 const user = await getUserProfile(token);
 const dp =  user.display_picture === "http://example.com/path/to/display_picture.jpg" ? "avatar_10" : user.display_picture;

 let userNameHTML = 
  `
    <h4>${user.username}</h4>
  `;

 let userDPHTML = 
  `
    <img src="../public/avatar/${dp}.svg" alt="">
  `;

  userNameEl.innerHTML = userNameHTML;
  userDPEl.innerHTML =userDPHTML;
}

function changePassword(){
  const submitBtn = document.querySelector(".js_submit_btn");
  const oldPasswordError = document.querySelector(".js_old_password_error");
  const newPasswordError = document.querySelector(".js_new_password_error");
  const confirmPasswordError = document.querySelector(".js_confirm_password_error");

 
  submitBtn.addEventListener("click", async(e)=>{
    e.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmPassword").value;
    console.log(oldPassword, newPassword, confirmNewPassword)

    if(newPassword !== confirmNewPassword){
      newPasswordError.innerHTML = "Password does not match";
      confirmPasswordError.innerHTML = "Password does not match";

    }else{

      try {
        const response = await fetch ("http://127.0.0.1:8000/api/user/change-password/", {
          method : "PATCH",
          headers : {
            "Authorization" : `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body : JSON.stringify({
            old_password :oldPassword,
            new_password : confirmNewPassword,
          })
        });

        const data = await response.json();
        if(response.ok){
          overlay.style.display = "none";
          passwordEl.style.display = "none";
          let value = "Password Changed Succesfully";
          popupDisplayHTML(value);
        }else {
          oldPasswordError.innerHTML = data.old_password[0];
          console.log(data.old_password[0]);

        }
        
      } catch (error) {
        console.log(error);
        
      }
    }


  })
}

function changeUsername(){
  const submitBtn = document.querySelector(".js_username_submit");
  const usernameError = document.querySelector(".js_username_error_text");

  submitBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    const username = document.getElementById("username").value;
    console.log(username);

    try {
      const response = await fetch ("http://127.0.0.1:8000/api/user/", {
        method : "PATCH",
        headers : {
          "Authorization" : `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body : JSON.stringify({
          username
        })
      });

      const data = await response.json();
      console.log(data);
      if(response.ok){
        overlay.style.display = "none";
        usernameEl.style.display = "none";
        renderProfileDetails();
        let value = "username changed Succesfully";
        popupDisplayHTML(value);

      }
      
    } catch (error) {
      console.log(error);
      
    }

  })
}

function changeDP(){
  let selectedAvatar = document.getElementById("selectedAvatar");
  const icon = document.querySelectorAll(".avatar_icon");
  const submitBtn = document.querySelector(".js_avatar_submit");

  icon.forEach((iconItem)=>{
    iconItem.addEventListener("click", (e)=>{
      icon.forEach(icon => icon.classList.remove("border"));
      iconItem.classList.add("border");
      selectedAvatar.value = iconItem.id;
  
    })
    

  })

  submitBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    let avatar = document.getElementById("selectedAvatar").value;
    try {
      const response = await fetch ("http://127.0.0.1:8000/api/user/", {
        method : "PATCH",
        headers : {
          "Authorization" : `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body : JSON.stringify({
          display_picture : avatar,
        })
      });

      const data = await response.json();
      console.log(data);
      if(response.ok){
        overlay.style.display = "none";
        avatarEl.style.display = "none";
        renderProfileDetails();
        let value = "dp changed successfully";
        popupDisplayHTML(value)
      }

    } catch (error) {
      console.log(error);
    }
  })
  
}


changePassword();
changeUsername();
changeDP();
renderHeader();