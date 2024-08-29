export function popupDisplayHTML(value){
  const successPopupEl = document.querySelector(".js_success_popup");
  let html = 
  `
    <h5 class="light">${value}</h5>
  `;
  successPopupEl.innerHTML = html;
  successPopupEl.style.display = "flex";
  setTimeout(()=>{
    successPopupEl.style.display = "none";
  },3000);

}