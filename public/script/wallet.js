const subMenuEl = document.querySelector(".js_sub_menu");
const hamburgerBtn = document.querySelector(".js_hamburger");
const cancelBtn = document.querySelector(".js_close");

hamburgerBtn.addEventListener("click", ()=>{
  subMenuEl.style.display = "initial";
  hamburgerBtn.style.display = "none";
  cancelBtn.style.display = "initial";
})

cancelBtn.addEventListener("click", ()=>{
  subMenuEl.style.display = "none";
  hamburgerBtn.style.display = "initial";
  cancelBtn.style.display = "none";

})