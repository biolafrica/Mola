import {monitizeNumber, convertTwoDecimal} from './utils/money.js';
import { renderHeader } from './script.js';
import {handleMultipleInput} from './utils/input.js';

const rate = document.querySelector(".min_order_currency");
const bankOptionBtn = document.querySelector(".select_bank_option");
const overlay = document.querySelector(".js_overlay");
const token = localStorage.getItem('access');
const confirmAdsEl = document.querySelector(".js_ads_confirm_popup");

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
  renderInput(data);

};
getTotalBalance();




function renderAdsConfirmation(type,amount,maximum_limit,minimum_limit,time_limit,rate,exchange_terms){
  let bankType = type === "Naira" ? "Pounds" :  "Naira";
  let amountCurrency = type === "Naira" ? "&#8358;" : "£";
  let limitCurrency = type === "Naira" ? "£" : "&#8358;";

  let html = 
  `
    <div class="ads_confirm_popup_head">
      <h4><b>Confirm Post</b></h4>
      <img class="ads_confirm_cancel" src="../public/icons/Close small.svg" alt="">
    </div>

    <div class="important_info">
      <img src="../public/icons/Error.svg" alt="">
      After publishing the SELL ads, ${amountCurrency}${monitizeNumber(amount)} in your wallet will be frozen.
    </div>

    <div class="ads_confirm_popup_body">

      <div class="ads_popup_column">
        <h4 class="secondary">Currency</h4>
        <h4><b>${type}</b></h4>
      </div>

      <div class="ads_popup_column">
        <h4 class="secondary">Amount</h4>
        <h4><b>${amountCurrency}${monitizeNumber(amount)}</b></h4>
      </div>

      <div class="ads_popup_column">
        <h4 class="secondary">Rate</h4>
        <h4><b>&#8358;${monitizeNumber(rate)}</b></h4>
      </div>

      <div class="ads_popup_column">
        <h4 class="secondary">Max Limit</h4>
        <h4><b>${limitCurrency}${monitizeNumber(maximum_limit)}</b></h4>
      </div>

      <div class="ads_popup_column">
        <h4 class="secondary">Min Limit</h4>
        <h4><b>${limitCurrency}${monitizeNumber(minimum_limit)}</b></h4>
      </div>

      <div class="ads_popup_column">
        <h4 class="secondary">Time Limit</h4>
        <h4><b>${time_limit} mins</b></h4>
      </div>

    </div>

    <div class="important_info">
      <img src="../public/icons/Error.svg" alt="">
      Your default ${bankType} bank will be displayed to the buyer.
    </div>

    <div class="ads_confirm_button">
      <button class="outlined-btn js_cancel_ads_btn">Cancel</button>
      <button class="filled-btn js_confirm_ads_btn">Confirm Post</button>
    </div>

  `;
  confirmAdsEl.innerHTML = html;
  document.querySelector(".js_confirm_ads_btn").addEventListener("click", async()=>{

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ads/", {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${token}`,
          "content-Type" : "application/json"
        },
        body : JSON.stringify({
          type,
          amount: `${amount}.0`,
          maximum_limit : `${maximum_limit}.0`,
          minimum_limit : `${minimum_limit}.0`,
          time_limit,
          exchange_terms,
          rate
        })
      });
      const data = await response.json();
      if(data){
        window.location.href = '../../views/ads.html';
      }
      console.log(data);
      
    } catch (error) {
      console.log(error);
  
    }


  })

  document.querySelector(".js_cancel_ads_btn").addEventListener("click", ()=>{
    overlay.style.display = "none";
    confirmAdsEl.style.display = "none";

  });

  document.querySelector(".ads_confirm_cancel").addEventListener("click", ()=>{
    overlay.style.display = "none";
    confirmAdsEl.style.display = "none";
  })


}

function renderInput(data){
  let formEl = document.querySelector(".js_post_ads_form");

  let html = 
  `
    <form action="" class="post_ad_form js_post_ad_form">
        
      <label for="adsSelectType"><h4>I want to sell:</h4></label>
      <select name="" id="adsSelectType">
        <option value="NGN">NGN</option>
        <option value="GBP">GBP</option>
      </select>

      <label for="amountInput"><h4>Total Amount:</h4></label>
      <div style="margin-bottom: 0;" class="input_money" id="inputFormz">
        <input type="number" placeholder="0.00" id="amountInput" required>
        <h4 class="js_amount_currency">NGN</h4>
      </div>
      <h5 style="margin-bottom: 35px;" class="amount_balance">Balance: &#8358;${convertTwoDecimal(data.total_naira)}</h5>
      
      <label for="rateInput"><h4>Rate:</h4></label>
      <div style="margin-bottom: 0;" class="input_money" id="inputFormz">
        <input type="number" placeholder="0.00" id="rateInput">
        <h4>NGN</h4>
      </div>
      <h5 style="margin-bottom: 35px;">Your rate should be between N1,900.00 - 1,919.00</h5>

      <label for="minOrderInput"><h4>Max Order Limit:</h4></label>
      <div class="input_money" id= "inputFormz">
        <input type="number" placeholder="0.00" id="maxOrderInput" required >
        <h4 class="max_order_currency">GBP</h4>
      </div>

      <label for="maxOrderInput"><h4>Min Order limit:</h4></label>
      <div class="input_money" id="inputFormz">
        <input type="number" placeholder="0.00" id="minOrderInput" required>
        <h4 class="min_order_currency">GBP</h4>
      </div>

      <label for="payTimeLimit"><h4>Pay Time Limit:</h4></label>
      <select name="" id="payTimeLimit">
        <option value="15">15 mins</option>
        <option value="30">30 mins</option>
        <option value="45">45 mins</option>
      </select>

      <label for="exchangeTerm"><h4>Exchange Terms:</h4></label>
      <textarea name="" id="exchangeTerm" placeholder="Enter extra infromation for your buyer" required></textarea>

      <button class="filled-btn "><h5>Submit</h5></button>

    </form>
  `;

  formEl.innerHTML = html;

  const form = document.querySelector(".js_post_ad_form");
  const currencySelect = document.getElementById("adsSelectType");
  const amountCurrency = document.querySelector(".js_amount_currency");
  const maxOrderCurrency = document.querySelector(".max_order_currency");
  const minOrderCurrency = document.querySelector(".min_order_currency");

  handleMultipleInput();

  form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    let nameType = form.adsSelectType.value === 'NGN' ? "Naira" : "Pounds";
    let type = nameType;
    let amount = form.amountInput.value;
    let maximum_limit = form.maxOrderInput.value;
    let minimum_limit = form.minOrderInput.value;
    let time_limit = form.payTimeLimit.value;
    let exchange_terms = form.exchangeTerm.value;
    let rate = form.rateInput.value;
  
    renderAdsConfirmation(type,amount,maximum_limit,minimum_limit,time_limit,rate,exchange_terms);
    overlay.style.display = "initial";
    confirmAdsEl.style.display = "flex";
  
  
  });
  
  currencySelect.addEventListener("change", async(e)=>{
    let selectedValue = e.target.value;
    let balanceInput = document.querySelector(".amount_balance");
  
    if(selectedValue === "GBP"){
      amountCurrency.textContent = "GBP";
      maxOrderCurrency.textContent = "NGN";
      minOrderCurrency.textContent = "NGN";
      balanceInput.innerHTML = `Balance £${convertTwoDecimal(data.total_pounds)}`;
  
    } else if(selectedValue === "NGN"){
      amountCurrency.textContent = "NGN";
      maxOrderCurrency.textContent = "GBP";
      minOrderCurrency.textContent = "GBP";
      balanceInput.innerHTML = `Balance &#8358;${convertTwoDecimal(data.total_naira)}`;
  
    }
  
  
  });

}