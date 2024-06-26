const currencySelect = document.getElementById("ads_select_type");
const amountCurrency = document.querySelector(".js_amount_currency");
const maxOrderCurrency = document.querySelector(".max_order_currency");
const minOrderCurrency = document.querySelector(".min_order_currency");
const bankOptionBtn = document.querySelector(".select_bank_option");
const overlay = document.querySelector(".js_overlay");
const bankOptionEl = document.querySelector(".bank_option_popup");
const paymentCancel = document.querySelector(".payment_cancel");
const form = document.querySelector(".js_post_ad_form");
const token = localStorage.getItem('access');

bankOptionBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  overlay.style.display = "initial";
  bankOptionEl.style.display = "initial";
  

});

paymentCancel.addEventListener("click", ()=>{
  overlay.style.display = "none";
  bankOptionEl.style.display = "none";

});

form.addEventListener("submit", async(e)=>{
  e.preventDefault();
  let nameType = form.adsSelectType.value === 'NGN' ? "Naira" : "Pounds";
  let type = nameType;
  let amount = form.amountInput.value;
  let maximum_limit = form.maxOrderInput.value;
  let minimum_limit = form.minOrderInput.value;
  let time_limit = form.payTimeLimit.value;
  let exchange_terms = form.exchangeTerm.value;

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
        exchange_terms
      })
    });
    const data = await response.json();
    console.log(data);
    
  } catch (error) {
    console.log(error);

  }
  


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