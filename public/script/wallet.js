import { renderHeader } from "./script.js";
import { monitizeNumber, convertTwoDecimal } from "./utils/money.js";

const token = localStorage.getItem("access");



renderHeader();

async function getTotalBalance(){
  const response = await fetch("http://127.0.0.1:8000/api/user/wallet-total/",
  {
    method : "GET",
    headers : {
      "Authorization" : `Bearer ${token}`,
      "Content-Type" : "application/json",
    },
  });

  const data = await response.json();
  displayCurrency(data);
  console.log(data)

};

getTotalBalance();



function displayCurrency(data){
  const balanceContainer = document.querySelector(".js_all_balance");
  let html = 
  `
    <h2 class="Naira_balance js_naira_balance"><b>${convertTwoDecimal(data.total_naira)}</b></h2>
    <h2 class=" Pounds_balance no_view js_pounds_balance"><b>${convertTwoDecimal(data.total_pounds)}</b></h2>
  `;
  balanceContainer.innerHTML = html;

  const currencySelect = document.getElementById("currencySelect");
  const nairaBalanceEl = document.querySelector(".js_naira_balance");
  const poundsBalanceEl = document.querySelector(".js_pounds_balance");

  currencySelect.addEventListener("change", (e)=>{
    const selectedValue = e.target.value;
    if (selectedValue === "Naira"){
      nairaBalanceEl.classList.remove("no_view");
      poundsBalanceEl.classList.add("no_view");
  
    } else if (selectedValue === "Pounds"){
      nairaBalanceEl.classList.add("no_view");
      poundsBalanceEl.classList.remove("no_view");
   
    }
  
  })


}