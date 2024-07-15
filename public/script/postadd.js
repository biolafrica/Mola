import {monitizeNumber} from './utils/money.js';

const currencySelect = document.getElementById("adsSelectType");
const amountCurrency = document.querySelector(".js_amount_currency");
const maxOrderCurrency = document.querySelector(".max_order_currency");
const minOrderCurrency = document.querySelector(".min_order_currency");
const rate = document.querySelector(".min_order_currency");
const bankOptionBtn = document.querySelector(".select_bank_option");
const overlay = document.querySelector(".js_overlay");
const form = document.querySelector(".js_post_ad_form");
const token = localStorage.getItem('access');
const confirmAdsEl = document.querySelector(".js_ads_confirm_popup");

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

currencySelect.addEventListener("change", (e)=>{
  let selectedValue = e.target.value;
  if(selectedValue === "GBP"){
    amountCurrency.textContent = "GBP";
    maxOrderCurrency.textContent = "NGN";
    minOrderCurrency.textContent = "NGN";

  } else if(selectedValue === "NGN"){
    amountCurrency.textContent = "NGN";
    maxOrderCurrency.textContent = "GBP";
    minOrderCurrency.textContent = "GBP";

  }


});

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