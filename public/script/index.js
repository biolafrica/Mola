import {displayAvailableNGNOrder} from "./order/nairaOrder.js";
import {displayAvailableGBPOrder} from "./order/poundsOrder.js";
import {checkUser} from "../../Data/user.js";
import { renderHeader } from "./script.js";

const nairaBtn = document.querySelector(".js-buy-ngn");
const poundBtn = document.querySelector(".js_buy_gbp");
const nairaEl = document.querySelector(".js_buy_el");
const poundEl = document.querySelector(".js_sell_el");
const howSellBtn = document.querySelector(".js_how_sell");
const howBuyBtn = document.querySelector(".js_how_buy");
const orderBuyEl = document.querySelector(".js_place_order_buy");
const sellBuyEl = document.querySelector(".js_pay_seller_buy");
const paymentBuyEl = document.querySelector(".js_receive_payment_buy");
const orderSellEl = document.querySelector(".js_place_order_sell");
const sellSellEl = document.querySelector(".js_pay_seller_sell");
const paymentSellEl = document.querySelector(".js_receive_payment_sell");
const token = localStorage.getItem("access");
const landingPageEl = document.querySelector(".js_landing_page");



nairaBtn.addEventListener("click", ()=>{
  nairaBtn.classList.remove("text-btn");
  nairaBtn.classList.add("filled-btn");
  poundBtn.classList.remove("filled-btn");
  poundBtn.classList.add("text-btn");
  poundEl.style.display = "none";
  nairaEl.style.display = "initial";
  
});

poundBtn.addEventListener("click", ()=>{
  nairaBtn.classList.remove("filled-btn");
  nairaBtn.classList.add("text-btn");
  poundBtn.classList.remove("text-btn");
  poundBtn.classList.add("filled-btn");
  nairaEl.style.display = "none";
  poundEl.style.display = "initial";  
});

howBuyBtn.addEventListener("click", ()=>{
  howBuyBtn.classList.remove("outlined-btn");
  howBuyBtn.classList.add("filled-btn");
  howSellBtn.classList.remove("active_btn");
  howSellBtn.classList.add("outlined-btn");
  orderSellEl.style.display = "none";
  sellSellEl.style.display = "none";
  paymentSellEl.style.display ='none';
  orderBuyEl.style.display = "initial";
  sellBuyEl.style.display = "initial" ;
  paymentBuyEl.style.display ="initial";

});

howSellBtn.addEventListener("click", ()=>{
  howSellBtn.classList.remove("outlined-btn");
  howSellBtn.classList.add("filled-btn");
  howBuyBtn.classList.remove("active_btn");
  howBuyBtn.classList.add("outlined-btn");
  orderSellEl.style.display = "initial";
  sellSellEl.style.display = "initial";
  paymentSellEl.style.display ='initial';
  orderBuyEl.style.display = "none";
  sellBuyEl.style.display = "none" ;
  paymentBuyEl.style.display ="none";

});

let poundsOrder = [];
let nairaOrder = [];

async function loadPage(){
  try {
    const response = await fetch("http://127.0.0.1:8000/api/all-ads");
    const data = await response.json();
    console.log(data);
    processOrders(data);

    displayAvailableGBPOrder(poundsOrder);
    displayAvailableNGNOrder(nairaOrder);
    
    
  } catch (error) {
    console.log("Error fetching ads:", error);
    
  }

} 

loadPage();
function processOrders(orders){
  orders.forEach((orderItem)=>{
    if(orderItem.type === "Naira"){
      nairaOrder.push(orderItem);
    }else if(orderItem.type === "Pounds"){
      poundsOrder.push(orderItem);
    }

  });
}

//search amount
const form = document.querySelector(".js_amount_form");
form.addEventListener("input", (e)=>{
  const inputValue = e.target.value;
  let matchingOrders =[];
  orders.forEach((orderItem)=>{
    if(orderItem.minimumOrder <= (inputValue * 100)){
      matchingOrders.push(orderItem)
    }
  });
  displayAvailableGBPOrder(matchingOrders);
  displayAvailableNGNOrder(matchingOrders);

  if(inputValue === ""){
    displayAvailableGBPOrder(orders);
    displayAvailableNGNOrder(orders);
  }

});

async function renderLandingPage(){

  let value = 
  `
  <div class="landing_new_user_container">
    <a href="./views/login.html">
      <button class="text-btn"><h5>Log In</h5></button>
    </a>

    <a href="./views/register.html">
      <button class="filled-btn"><h5>Register</h5></button>
    </a>
  </div>
  `;

  let valueI = "";
  let userContent = await checkUser(token);
  let authenticatedUserContent = userContent === false ? value : valueI;
  
  let html =
  `
    <h2><b>Peer-to-Peer Currency Exchange with Zero Fees</b></h2>
    <h3>Purchase any currency at your preferred exchange rates</h3>
    ${authenticatedUserContent}

  `;
  landingPageEl.innerHTML = html;

}
renderLandingPage();

renderHeader();