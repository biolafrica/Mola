const nairaBtn = document.querySelector(".js-buy-ngn");
const poundBtn = document.querySelector(".js_buy_gbp");
const nairaEl = document.querySelector(".js_buy_el");
const poundEl = document.querySelector(".js_sell_el");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");
const cancelBtn = document.querySelector(".js_cancel_btn");
const howSellBtn = document.querySelector(".js_how_sell");
const howBuyBtn = document.querySelector(".js_how_buy");
const orderBuyEl = document.querySelector(".js_place_order_buy");
const sellBuyEl = document.querySelector(".js_pay_seller_buy");
const paymentBuyEl = document.querySelector(".js_receive_payment_buy");
const orderSellEl = document.querySelector(".js_place_order_sell");
const sellSellEl = document.querySelector(".js_pay_seller_sell");
const paymentSellEl = document.querySelector(".js_receive_payment_sell");
const buyBtn = document.querySelector(".Js_buy_order_btn");
const adsEl = document.querySelector(".dashboard_body_ads_container");
const feedbackEl = document.querySelector(".dashboard_body_feedbacks_container");

document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
  btn.addEventListener("click", ()=>{
    overlay.style.display = "initial";
    moreEl.style.display = "flex";

  })

});

cancelBtn.addEventListener("click", ()=>{
  overlay.style.display = "none";
  moreEl.style.display = "none";
   
});

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

document.querySelectorAll(".js_buy_btn").forEach((btn)=>{
  btn.addEventListener("click", ()=>{
    overlay.style.display = "initial";
    moreEl.style.display = "flex";

  })

});


howBuyBtn.addEventListener("click", ()=>{
  howBuyBtn.classList.remove("inactive-btn");
  howBuyBtn.classList.add("filled-btn");
  howSellBtn.classList.remove("active_btn");
  howSellBtn.classList.add("inactive-btn");
  orderSellEl.style.display = "none";
  sellSellEl.style.display = "none";
  paymentSellEl.style.display ='none';
  orderBuyEl.style.display = "initial";
  sellBuyEl.style.display = "initial" ;
  paymentBuyEl.style.display ="initial";

});


howSellBtn.addEventListener("click", ()=>{
  howSellBtn.classList.remove("inactive-btn");
  howSellBtn.classList.add("filled-btn");
  howBuyBtn.classList.remove("active_btn");
  howBuyBtn.classList.add("inactive-btn");
  orderSellEl.style.display = "initial";
  sellSellEl.style.display = "initial";
  paymentSellEl.style.display ='initial';
  orderBuyEl.style.display = "none";
  sellBuyEl.style.display = "none" ;
  paymentBuyEl.style.display ="none";

})
