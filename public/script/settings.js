import {getUserProfile} from "../../Data/user.js";

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
const token = localStorage.getItem("access");

renderProfileDetails();

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
 const dp =  user.display_picture === "http://example.com/path/to/display_picture.jpg" ? "avatar_10" : 'avatar_1';

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