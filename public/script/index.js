import {displayAvailableNGNAds} from "./order/nairaOrder.js";
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
const ngnEl = document.querySelector(".js_ngn_el");
const gbpEl = document.querySelector(".js_gbp_el");
const poundsInputEl = document.querySelector(".js_filter_gbp");
const nairaInputEl = document.querySelector(".js_filter_ng");


nairaBtn.addEventListener("click", ()=>{
  nairaBtn.classList.remove("text-btn");
  nairaBtn.classList.add("filled-btn");
  poundBtn.classList.remove("filled-btn");
  poundBtn.classList.add("text-btn");
  poundEl.style.display = "none";
  nairaEl.style.display = "grid";
  poundsInputEl.classList.remove("no_view");
  nairaInputEl.classList.add("no_view");
  loadPage()

});

poundBtn.addEventListener("click", ()=>{
  nairaBtn.classList.remove("filled-btn");
  nairaBtn.classList.add("text-btn");
  poundBtn.classList.remove("text-btn");
  poundBtn.classList.add("filled-btn");
  nairaEl.style.display = "none";
  poundEl.style.display = "grid";
  poundsInputEl.classList.add("no_view");
  nairaInputEl.classList.remove("no_view");
  
  loadPage();  
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


let newData = [];

async function loadPage(){
  try {
    const response = await fetch("http://127.0.0.1:8000/api/all-ads");
    const data = await response.json();
    console.log(data);
    let nairaOrder = nairaOrders(data);
    let poundsOrder = poundsOrders(data);
    newData = data;
    displayAvailableGBPOrder(poundsOrder);
    displayAvailableNGNAds(nairaOrder);
    console.log(nairaOrder)
    
    
  } catch (error) {
    console.log("Error fetching ads:", error);
    
  }

}; 

loadPage();
function nairaOrders(ads){
  return ads.filter(ad =>ad.type === "Naira");
};

function poundsOrders(ads){
  return ads.filter(ad =>ad.type === "Pounds");
};

/*search amount
document.querySelector(".js_gb_amount_form").addEventListener("input", (e)=>{
  const inputValue = e.target.value;
  console.log(inputValue);
  let matchingOrders =[];
  orders.forEach((orderItem)=>{
    if(orderItem.minimumOrder === (inputValue * 100)){
      matchingOrders.push(orderItem)
    }
  });
  displayAvailableGBPOrder(matchingOrders);
  displayAvailableNGNAds(matchingOrders);

  if(inputValue === ""){
    displayAvailableGBPOrder(orders);
    displayAvailableNGNAds(orders);
  }

});*/

let searchPounds = document.querySelector(".js_gb_amount_form");
searchPounds.addEventListener("input", (e)=>{
  const inputValue = parseFloat(e.target.value.trim());
  let nairaOrder = nairaOrders(newData);
  console.log(inputValue);

  if(isNaN(inputValue) || inputValue === 0){
    loadPage();
    
  }else{

    const filteredAds = nairaOrder.filter((ads)=>{
      const minimumLimit = Math.ceil(parseFloat(ads.minimum_limit));
      console.log(minimumLimit);
      return minimumLimit <= inputValue;
    
    });
    console.log(filteredAds);
    if(filteredAds.length === 0){
      empty(ngnEl);
    }else{
      displayAvailableNGNAds(filteredAds);
    } 
  }

});

let searchNaira = document.querySelector(".js_ng_amount_form");
searchNaira.addEventListener("input", (e)=>{
  const inputValue = parseFloat(e.target.value.trim());
  let poundOrder = poundsOrders(newData);
  console.log(inputValue);

  if(isNaN(inputValue) || inputValue === 0){
    loadPage();
    
  }else{

    const filteredAds = poundOrder.filter((ads)=>{
      const minimumLimit = Math.ceil(parseFloat(ads.minimum_limit));
      console.log(minimumLimit);
      return minimumLimit <= inputValue;
    
    });
    console.log(filteredAds);
    if(filteredAds.length === 0){
      empty(gbpEl);
    }else{
      displayAvailableGBPOrder(filteredAds);
    } 
  }

});


function empty (ngnEl){
  let html = 
  `
    <div class="empty_container">
      <img src="./public/icons/Hourglass empty.svg" alt="">
      <h4>No Ads</h4>
    </div>

  `;
  ngnEl.innerHTML = html;
}

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