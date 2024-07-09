import{order} from "../../Data/orders.js";
import{calculateTotalOrder,calculateCompleteOrder} from "../../public/script/utils/metrics.js";
import{monitizeNumber} from "../../public/script/utils/money.js";
import{verified} from "../../public/script/utils/verification.js";
import{getUserProfile} from "../../Data/user.js";

const timeEl = document.querySelector(".js_order_timer");
const orderPageEl = document.querySelector(".order_page_container");
const token = localStorage.getItem("access");
const popupEl = document.querySelector(".js_payment_confirm_popup");
const overlay = document.querySelector(".js_overlay");
const buyerCancelPopup = document.querySelector(".js_buyer_cancel_popup");
const sellerCancelPopup = document.querySelector(".js_seller_cancel_popup");
const cancelCancelledSellerBtn = document.querySelector(".js_cancel_cancelled_seller");
const confirmCancelledSellerBtn = document.querySelector(".js_cancel_confirm_seller");
const cancelCancelledBuyerBtn = document.querySelector(".js_cancel_cancelled_buyer");
const confirmCancelledBuyerBtn = document.querySelector(".js_cancel_confirm_buyer");


let timeLeft = 900;
let intervalId;

console.log(order);

async function renderPage(){
  let user = await getUserProfile(token);
  console.log(user);
  let selectedOrder = order[0];
  let selectedAds = order[1];
  let totalOrder = calculateTotalOrder(selectedAds);
  let date = convertDateAndTime(selectedOrder.date_and_time);

  if(user.username === selectedAds.user.username){
    let sellerBtnStateChange = selectedOrder.buyer_confirmed === false ? "inactive-btn" : "filled-btn";
    let sellerTimerStateChange = selectedOrder.buyer_confirmed === false ? '' : "no_display" ;
    let sellerTimerHeaderStateChange = selectedOrder.buyer_confirmed === false && selectedOrder.status === "pending" ? "Buyer will pay within:" :
                                      selectedOrder.buyer_confirmed === true && selectedOrder.status === "pending" ? "Confirm payment from the buyer":
                                      selectedOrder.buyer_confirmed === true && selectedOrder.status === "completed" ? `Successfully sold &#8358;${monitizeNumber(selectedOrder.selected_amount)}`:
                                      selectedOrder.buyer_confirmed === true && selectedOrder.status === "cancelled" ? "This order was cancelled": "";
    let sellerSentStateChange = selectedOrder.buyer_confirmed === false ? "I received" : "I am receiving";
    let sellerReceiveStateChange = selectedOrder.status === "completed" ? "I am sending" : "I sent";
    let sellerOrderStatusChange = selectedOrder.buyer_confirmed === false && selectedOrder.status === "pending" ? "ORDER INITIATED" :
                                  selectedOrder.buyer_confirmed === true && selectedOrder.status === "pending" ? "VERIFY PAYMENT" :
                                  selectedOrder.buyer_confirmed === true && selectedOrder.status === "completed" ? "ORDER COMPLETED" :
                                  selectedOrder.buyer_confirmed === false && selectedOrder.status === "cancelled" ? "ORDER CANCELLED" :"";
    let sellerTransferStatusChange = selectedOrder.buyer_confirmed === false ? "confirm" : "I received";
    let sellerCancelledChange = selectedOrder.status === "cancelled" ? "no_display" : "";


    let sellerHTML = 
    `
      <div class="order_head">
        <div class="order_head_left">
          <h3>${sellerTimerHeaderStateChange} 
            <span><b class="js_order_timer ${sellerTimerStateChange}">${selectedAds.time_limit} : 00</b></span>
          </h3>
        </div>

        <div class="order_head_right">

          <h4 style="color:var(--Secondary-Text-light)">
            Order ID: 
            <span style="color:var(--Text-light)">
              ${selectedOrder.order_id}
            </span>
          </h4>

          <h4 style="color:var(--Secondary-Text-light)">
            Time created: 
            <span style="color:var(--Text-light)">
              ${date}
            </span>
          </h4>

        </div>
      </div>

      <div class="orders_container">
        <div class="order_bodys_container">

          <div class="order_body_container">

            <div class="order_body">

              <div class="order_details">

                <div class="order_details_head">
                  <h4><b>${sellerOrderStatusChange}</b></h4>
                  <h4 style="color:var(--Secondary-Text-light)">Confirming your transaction details delow</h4>
                </div>

                <div class="order_details_body">
                  <div class="order_sent">
                    <h4 style="color:var(--Secondary-Text-light)">${sellerSentStateChange}</h4>
                    <h4><b>£${monitizeNumber(selectedOrder.receiving_amount)}</b></h4>
                  </div>

                  <div class="order_price">
                    <h4 style="color:var(--Secondary-Text-light)">Rate</h4>
                    <h4><b>£${monitizeNumber(selectedAds.rate)}</b></h4>
                  </div>
                  
                  <div class="order_received">
                    <h4 style="color:var(--Secondary-Text-light)">${sellerReceiveStateChange}</h4>
                    <h4><b>&#8358;${monitizeNumber(selectedOrder.selected_amount)}</b></h4>
                  </div>
                </div>
              </div>

              <div class="order_terms_details">

                <h4><b>
                  TRANSACTION TERMS
                </b></h4>

                <h4 style="color:var(--Secondary-Text-light)">
                  ${selectedAds.exchange_terms}
                </h4>
              
              </div>

              <div class="order_payment_details ${sellerCancelledChange}">

                <div class="order_payment_details_head">
                  <h4><b>PAYMENT INFORMATION</b></h4>
                  <h4 style="color:var(--Secondary-Text-light)">${sellerTransferStatusChange} <b style="color:var(--Text-light)">£${monitizeNumber(selectedOrder.selected_amount)}</b> the account details below;</h4>
                </div>

                <div class="order_payment_details_body">

                  <div class="order_payment_details_body_up">
                    <div class="account_name">
                      <h4 style="color:var(--Secondary-Text-light)">Name</h4>
                      <h4>${selectedOrder.default_bank.bank_account_name}</h4>
                    </div>
                    <div class="bank">
                      <h4 style="color:var(--Secondary-Text-light)">Bank Name</h4>
                      <h4>${selectedOrder.default_bank.bank_name}</h4>
                    </div>

                  </div>

                  <div class="order_payment_details_body_down">
                    <div class="account_number">
                      <h4 style="color:var(--Secondary-Text-light)">Account Number</h4>
                      <h4>${selectedOrder.default_bank.bank_account_number}</h4>
                    </div>
                    <div class="sort_code">
                      <h4 style="color:var(--Secondary-Text-light)">Sort Code</h4>
                      <h4>${selectedOrder.default_bank.bank_sort_code}</h4>
                    </div>
                    
                  </div>
                
                </div>


              </div>

              <div class="order_payment_status ${sellerCancelledChange}">

                <div class="order_payment_status_head">
                  <h4><b>PAYMENT UPDATE</b></h4>
                  <h4 style="color:var(--Secondary-Text-light)">Click on "Received" to notify the buyer after confirmation</h4>
                </div>

                <div class="order_payment_status_body">
                  
                  <button class="inactive-btn js_received">
                    <h5>Received</h5>
                  </button>

                  <button class="text-btn seller_js_cancelled">
                    <h5>Cancel Order</h5>
                  </button>

                </div>
              </div>

            </div>

          </div>

          <div class="user_term_container">

            <div class="user_terms">

              <div class="user_term_head">
                <div class="user_term_image">
                  <img src="../public/avatar/avatar_1.svg" alt="">
                </div>

                <div class="user_term_user">

                  <div class="user_term_username">
                    <h4>${selectedAds.user.username}</h4>
                    <img src="${verified(selectedAds)}" alt="">
                  </div>

                  <div class="user_term_metrics">
                    <h5 style="color:var(--Secondary-Text-light)">${calculateTotalOrder(selectedAds)} Orders | ${calculateCompleteOrder(selectedAds, totalOrder)}%</h5>
                  </div>

                </div>

              </div>

              <div class="user_term_body">
                <h4>Terms(Please Read Carefully)</h4>
                <h4 style="color:var(--Secondary-Text-light);">${selectedAds.exchange_terms}</h4>
              </div>
            </div>

          </div>

        </div>

      </div>

    `;

    orderPageEl.innerHTML = sellerHTML;
    const receivedBtn = document.querySelector(".js_received");
    const sellerCancelledBtn = document.querySelector(".seller_js_cancelled");
    receivedBtn.addEventListener("click", ()=>{
      renderReceivePaymentPopup (selectedAds, selectedOrder);
      overlay.style.display = "initial";
      popupEl.style.display = "initial";

    })

    sellerCancelledBtn.addEventListener("click", ()=>{
      overlay.style.display = "initial";
      sellerCancelPopup.style.display = "initial";
    })

  }else{
    let buyerBtnStateChange = selectedOrder.buyer_confirmed === false ? "filled-btn" : "inactive-btn";
    let timerStateChange = selectedOrder.buyer_confirmed === false ? '' : "no_display" ;
    let timerHeaderStateChange = selectedOrder.buyer_confirmed === false && selectedOrder.status === "pending" ? "Pay seller within:" :
                                selectedOrder.buyer_confirmed === true && selectedOrder.status === "pending" ? "Wait for seller to confirm payment":
                                selectedOrder.buyer_confirmed === true && selectedOrder.status === "completed" ? `Successfully received &#8358;${monitizeNumber(selectedOrder.selected_amount)}`:
                                selectedOrder.buyer_confirmed === true && selectedOrder.status === "cancelled" ? "This order was cancelled": "";
    let sentStateChange = selectedOrder.buyer_confirmed === false ? "I am sending" : "I sent";
    let receiveStateChange = selectedOrder.status === "completed" ? "I received" : "I am receiving";
    let orderStatusChange = selectedOrder.buyer_confirmed === false && selectedOrder.status === "pending" ? "ORDER CREATED" :
                            selectedOrder.buyer_confirmed === true && selectedOrder.status === "pending" ? "PENDING CONFIRMATION" :
                            selectedOrder.buyer_confirmed === true && selectedOrder.status === "completed" ? "ORDER COMPLETED" :
                            selectedOrder.buyer_confirmed === false && selectedOrder.status === "cancelled" ? "ORDER CANCELLED" :"";
    let transferStatusChange = selectedOrder.buyer_confirmed === false ? "Transfer" : "I transferred";
    let cancelledChange = selectedOrder.status === "cancelled" ? "no_display" : "";

    let html = 
    `
      <div class="order_head">
        <div class="order_head_left">
          <h3>${timerHeaderStateChange} 
            <span><b class="js_order_timer ${timerStateChange}">${selectedAds.time_limit} : 00</b></span>
          </h3>
        </div>

        <div class="order_head_right">

          <h4 style="color:var(--Secondary-Text-light)">
            Order ID: 
            <span style="color:var(--Text-light)">
              ${selectedOrder.order_id}
            </span>
          </h4>

          <h4 style="color:var(--Secondary-Text-light)">
            Time created: 
            <span style="color:var(--Text-light)">
              ${date}
            </span>
          </h4>

        </div>
      </div>

      <div class="orders_container">
        <div class="order_bodys_container">

          <div class="order_body_container">

            <div class="order_body">

              <div class="order_details">

                <div class="order_details_head">
                  <h4><b>${orderStatusChange}</b></h4>
                  <h4 style="color:var(--Secondary-Text-light)">Transaction details;</h4>
                </div>

                <div class="order_details_body">
                  <div class="order_sent">
                    <h4 style="color:var(--Secondary-Text-light)">${sentStateChange}</h4>
                    <h4><b>£${monitizeNumber(selectedOrder.selected_amount)}</b></h4>
                  </div>

                  <div class="order_price">
                    <h4 style="color:var(--Secondary-Text-light)">Price</h4>
                    <h4><b>£${monitizeNumber(selectedAds.rate)}</b></h4>
                  </div>
                  
                  <div class="order_received">
                    <h4 style="color:var(--Secondary-Text-light)">${receiveStateChange}</h4>
                    <h4><b>&#8358;${monitizeNumber(selectedOrder.receiving_amount)}</b></h4>
                  </div>
                </div>
              </div>

              <div class="order_terms_details">

                <h4><b>
                  TRANSACTION TERMS
                </b></h4>

                <h4 style="color:var(--Secondary-Text-light)">
                  ${selectedAds.exchange_terms}
                </h4>
              
              </div>

              <div class="order_payment_details ${cancelledChange}">

                <div class="order_payment_details_head">
                  <h4><b>PAYMENT INFORMATION</b></h4>
                  <h4 style="color:var(--Secondary-Text-light)">${transferStatusChange} <b style="color:var(--Text-light)">£${monitizeNumber(selectedOrder.selected_amount)}</b> the account details below;</h4>
                </div>

                <div class="order_payment_details_body">

                  <div class="order_payment_details_body_up">
                    <div class="account_name">
                      <h4 style="color:var(--Secondary-Text-light)">Name</h4>
                      <h4>${selectedAds.selected_bank.bank_account_name}</h4>
                    </div>
                    <div class="bank">
                      <h4 style="color:var(--Secondary-Text-light)">Bank Name</h4>
                      <h4>${selectedAds.selected_bank.bank_name}</h4>
                    </div>

                  </div>

                  <div class="order_payment_details_body_down">
                    <div class="account_number">
                      <h4 style="color:var(--Secondary-Text-light)">Account Number</h4>
                      <h4>${selectedAds.selected_bank.bank_account_number}</h4>
                    </div>
                    <div class="sort_code">
                      <h4 style="color:var(--Secondary-Text-light)">Sort Code</h4>
                      <h4>${selectedAds.selected_bank.bank_sort_code}</h4>
                    </div>
                    
                  </div>
                
                </div>


              </div>

              <div class="order_payment_status ${cancelledChange}">

                <div class="order_payment_status_head">
                  <h4><b>PAYMENT UPDATE</b></h4>
                  <h4 style="color:var(--Secondary-Text-light)">Click on "Transferred" to notify the seller after payment</h4>
                </div>

                <div class="order_payment_status_body">
                  
                  <button class="${buyerBtnStateChange} js_transferred">
                    <h5>Transferred</h5>
                  </button>

                  <button class="text-btn buyer_js_cancelled">
                    <h5>Cancel Order</h5>
                  </button>

                </div>
              </div>

            </div>

          </div>

          <div class="user_term_container">

            <div class="user_terms">

              <div class="user_term_head">
                <div class="user_term_image">
                  <img src="../public/avatar/avatar_1.svg" alt="">
                </div>

                <div class="user_term_user">

                  <div class="user_term_username">
                    <h4>${selectedAds.user.username}</h4>
                    <img src="${verified(selectedAds)}" alt="">
                  </div>

                  <div class="user_term_metrics">
                    <h5 style="color:var(--Secondary-Text-light)">${calculateTotalOrder(selectedAds)} Orders | ${calculateCompleteOrder(selectedAds, totalOrder)}% completion</h5>
                  </div>

                </div>

              </div>

              <div class="user_term_body">
                <h4>Terms(Please Read Carefully)</h4>
                <h4 style="color:var(--Secondary-Text-light);">${selectedAds.exchange_terms}</h4>
              </div>
            </div>

          </div>

        </div>

      </div>


    `;

    orderPageEl.innerHTML = html;
    const transferredBtn = document.querySelector(".js_transferred");
    const cancelledBtn = document.querySelector(".buyer_js_cancelled");
    transferredBtn.addEventListener("click", ()=>{
      // stop timer
      renderMadePaymentPopup (selectedAds, selectedOrder);
      overlay.style.display = "initial";
      popupEl.style.display = "initial";
      
    })

    cancelledBtn.addEventListener("click", ()=>{
      overlay.style.display = "initial";
      buyerCancelPopup.style.display = "initial";
    })


  }
}
renderPage();

function renderMadePaymentPopup (ads, order){
  let html = 
  `
    <div class="payment_confirmation_popup_heading">
      <h4>Payment Confirmation</h4>
      <img src="../public/icons/Close small.svg" alt="">
    </div>

    <div class="payment_confirmation_popup_body">
      <h4>Please confirm that you transferred £${order.selected_amount} to the bank account below;</h4>

      <div class="payment_confirmation_popup_bank">

        <div class="payment_confirmation_popup_bank_head">
          <h4>ACCOUNT DETAILS</h4>
        </div>

        <div class="payment_confirmation_popup_bank_body">

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Name</h4>
            <h4>${ads.selected_bank.bank_account_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Bank Name</h4>
            <h4>${ads.selected_bank.bank_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${ads.selected_bank.bank_account_number}</h4>
            <h4>0121615892</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${ads.selected_bank.bank_sort_code}</h4>
            <h4>01-02-03</h4>
          </div>

        </div>

      </div>

      <div class="payment_confirmation_popup_bank_confirm">
        <div class="payment_checkbox_container">
          <input type="checkbox" id="paymentCheckbox">
          <label for="paymentCheckbox">
            <h4>I have made the payment</h4>
          </label>
        </div>
      </div>

      <div class="payment_confirmation_popup_bank_button">
        <button class="inactive-btn js_buyer_cancel_btn"><h5>Cancel</h5></button>
        <button class="filled-btn js_buyer_confirm_btn"><h5>Confirm Payment</h5></button>
      </div>

    </div>
  `;
  popupEl.innerHTML = html;
  const cancelBtn = document.querySelector(".js_buyer_cancel_btn");
  const confirmBtn = document.querySelector(".js_buyer_confirm_btn");
  const selectedAds = ads.ad_id;
  const selecetedAmount = ads.amount;

  cancelBtn.addEventListener("click", ()=>{
    overlay.style.display = "none";
    popupEl.style.display = "none";
  })

  confirmBtn.addEventListener("click", async()=>{
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${order.order_id}/confirm-payment/`, {
        method : "PUT",
        headers : {
          "Authorization" : `Bearer ${token}`,
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          ads: selectedAds,
          selected_ammount : selecetedAmount
        }) 

      });

      const data = await response.json();
      console.log(data);
      if(data.status){
        overlay.style.display = "none";
        popupEl.style.display = "none";
        

      }
      
    } catch (error) {
      console.log(error)
      
    }

  })

}

function renderReceivePaymentPopup (ads, order){
  let html = 
  `
    <div class="payment_confirmation_popup_heading">
      <h4>Payment Received</h4>
      <img src="../public/icons/Close small.svg" alt="">
    </div>

    <div class="payment_confirmation_popup_body">
      <h4>Please confirm that you received £${order.selected_amount} from the bank account below;</h4>

      <div class="payment_confirmation_popup_bank">

        <div class="payment_confirmation_popup_bank_head">
          <h4>ACCOUNT DETAILS</h4>
        </div>

        <div class="payment_confirmation_popup_bank_body">

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Name</h4>
            <h4>${ads.selected_bank.bank_account_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Bank Name</h4>
            <h4>${ads.selected_bank.bank_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${ads.selected_bank.bank_account_number}</h4>
            <h4>0121615892</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${ads.selected_bank.bank_sort_code}</h4>
            <h4>01-02-03</h4>
          </div>

        </div>

      </div>

      <div class="payment_confirmation_popup_bank_confirm">
        <div class="payment_checkbox_container">
          <input type="checkbox" id="paymentCheckbox">
          <label for="paymentCheckbox">
            <h4>I have made the payment</h4>
          </label>
        </div>
      </div>

      <div class="payment_confirmation_popup_bank_button">
        <button class="inactive-btn js_buyer_cancel_btn"><h5>Cancel</h5></button>
        <button class="filled-btn js_buyer_confirm_btn"><h5>Confirm Payment</h5></button>
      </div>

    </div>
  `;
  popupEl.innerHTML = html;
  const cancelBtn = document.querySelector(".js_buyer_cancel_btn");
  const confirmBtn = document.querySelector(".js_buyer_confirm_btn");

  cancelBtn.addEventListener("click", ()=>{
    overlay.style.display = "none";
    popupEl.style.display = "none";
  });

  confirmBtn.addEventListener("click", ()=>{
    console.log("taye");

  })

}

function convertDateAndTime(value){
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String (date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}

cancelCancelledSellerBtn.addEventListener("click", ()=>{
  overlay.style.display = "none";
  sellerCancelPopup.style.display = "none";

})

cancelCancelledBuyerBtn.addEventListener("click", ()=>{
  overlay.style.display = "none";
  buyerCancelPopup.style.display = "none";

})

function pad(value){
  return value > 9 ? value : "0" + value;
}

function renderTimer(){
  intervalId = setInterval(()=>{
    let min = Math.round(timeLeft / 60);
    let sec = timeLeft % 60;
  
    timeEl.innerHTML = `${pad(min)} : ${pad(sec)}`;
    timeLeft --
  }, 1000);

}
//renderTimer();

function timeReset (){
  clearInterval(intervalId);
  timeLeft = 900;
  min = Math.round(timeLeft/60);
  sec = timeLeft % 60;
  timeEl.innerHTML = `${pad(min)} : ${pad(sec)}`;

}
