import{calculateOrderTotal,calculateOrderCompletion} from "../../public/script/utils/metrics.js";
import{monitizeNumber} from "../../public/script/utils/money.js";
import{verified} from "../../public/script/utils/verification.js";
import{getUserProfile} from "../../Data/user.js";
import{convertDateAndTimeSeconds} from "../../Data/time.js"

const socket = new WebSocket('ws://127.0.0.1:8000/order/');
socket.onopen = function (){
  console.log("websocket connection established");
};


socket.onmessage = function(e){
  const data = JSON.parse(e.data);
  console.log("Message for server:", data);

  if(data.status === "Payment confirmed"){
    renderOrder();
  } else{
    console.error("Error:", data.error)
  }
}

socket.onclose = function(e){
  if(e.wasClean){
    console.log(`connection closed cleanly, code=${e.code}, reason=${e.reason}`);
  } else {
    console.error ("connection died")
  }

}

socket.onerror = function(error){
  console.error(`websocket error : ${error.message}`);
}

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

const url = new URL(window.location.href);
const param =  url.searchParams.get("orderId");

async function renderOrder(){
  try {
    const response = await fetch (`http://127.0.0.1:8000/api/all-orders/${param}/`, {
      method : 'GET',
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type" : "application/json"
      }
    });
    const data = await response.json();
    renderPage(data);
    console.log(data);
    
  } catch (error) {
    console.log(error);
    
  }
};

renderOrder();

async function renderPage(data){
  let user = await getUserProfile(token);
  console.log(user);
  let totalOrder = calculateOrderTotal(data);
  let date = convertDateAndTimeSeconds(data.date_and_time);
  const time = data.ads.time_limit === 15 ? 900 : data.ads.time_limit === 30 ? 1800 : data.ads.time_limit === 45 ? 2700 : 3600;
  let timeLeft = time;
  let intervalId;
  
  if(user.username === data.seller.username){
    renderSellerHTML(data, totalOrder,date);

    const receivedBtn = document.querySelector(".js_received");
    const sellerCancelledBtn = document.querySelector(".seller_js_cancelled");
    receivedBtn.addEventListener("click", ()=>{
      renderReceivePaymentPopup (data);
      overlay.style.display = "initial";
      popupEl.style.display = "initial";

    })

    sellerCancelledBtn.addEventListener("click", ()=>{
      overlay.style.display = "initial";
      sellerCancelPopup.style.display = "initial";
    })


  }else{

    renderBuyerHTML (data,totalOrder,date);

    const transferredBtn = document.querySelector(".js_transferred");
    const cancelledBtn = document.querySelector(".buyer_js_cancelled");
    transferredBtn.addEventListener("click", ()=>{
      stopTimer (intervalId, time, timeEl, timeLeft);
      renderMadePaymentPopup (data);
      overlay.style.display = "initial";
      popupEl.style.display = "initial";
      
    });
    
    document.querySelector(".js_feedback_icon").addEventListener("click", (e)=>{

      let positiveBtn = document.querySelector(".js_positive");
      let negativeBtn = document.querySelector(".js_negative");
      let feedbackTypeInput = document.getElementById("feedbackType");
      
      if( e.target.id === "positiveBtn" || e.target.id === "positiveIcon" || e.target.id === "positiveText"){

        positiveBtn.classList.add("positive_effect");
        negativeBtn.classList.remove("negative_effect");
        feedbackTypeInput.value = "positive";
        
      }else if(e.target.id === "negativeBtn" || e.target.id === "negativeIcon" || e.target.id === "negativeText"){

        negativeBtn.classList.add("negative_effect");
        positiveBtn.classList.remove("positive_effect");
        feedbackTypeInput.value = "positive";

      }


    });

    document.getElementById("ratingForm").addEventListener("submit", async(e)=>{
      e.preventDefault();
      let feedbackType = document.getElementById("feedbackType").value;
      let feedbackText = document.getElementById("feedback").value;
      let order = data.order_id;
      let comments = feedbackText || 'No Comment';
      
      console.log(feedbackText, feedbackType);

    

      try {

        const response = await fetch("http://127.0.0.1:8000/api/orders/feedback/", {
          method : "POST",
          headers : { 
            "Authorization" : `Bearer ${token}`,
            "content-Type" : "application/json",
          },
          body : JSON.stringify({
            order,
            feedback_type : feedbackType,
            comments
          }),
        })

        const data = await response.json();
        if(response.ok){
          showFeedback(data.feedback_type, data.comments)
        }else{
          console.log(data);
        }

        
      } catch (error) {
        console.log(error)        
      }

    })

    cancelledBtn.addEventListener("click", ()=>{
      overlay.style.display = "initial";
      buyerCancelPopup.style.display = "initial";
    })

  }

  const timeEl = document.querySelector(".js_order_timer");

  const savedTimeLeft = localStorage.getItem("timeLeft");
  if(savedTimeLeft !== null){
    timeLeft = parseInt(savedTimeLeft, 10);
  }
  renderTimer(timeLeft,timeEl,intervalId);


}


function renderMadePaymentPopup (value){
  let html = 
  `
    <div class="payment_confirmation_popup_heading">
      <h4>Payment Confirmation</h4>
      <img src="../public/icons/Close small.svg" alt="">
    </div>

    <div class="payment_confirmation_popup_body">
      <h4>Please confirm that you transferred £${value.selected_amount} to the bank account below;</h4>

      <div class="payment_confirmation_popup_bank">

        <div class="payment_confirmation_popup_bank_head">
          <h4>ACCOUNT DETAILS</h4>
        </div>

        <div class="payment_confirmation_popup_bank_body">

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Name</h4>
            <h4>${value.seller.default_bank.bank_account_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Bank Name</h4>
            <h4>${value.seller.default_bank.bank_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${value.seller.default_bank.bank_account_number}</h4>
            <h4>0121615892</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${value.seller.default_bank.bank_sort_code}</h4>
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
  const selectedAds = value.order_id;
  const selectedAmount = value.selected_amount;

  cancelBtn.addEventListener("click", ()=>{
    overlay.style.display = "none";
    popupEl.style.display = "none";
  })

  confirmBtn.addEventListener("click", async()=>{

    const request ={
      "action" : "confirm_payment",
      "token" : `Bearer ${token}`,
      "order_id" : selectedAds,
    }

    socket.send(JSON.stringify(request));

    socket.onmessage = function(e){
      const data = JSON.parse(e.data);
      console.log("Message for server:", data);

      if(data.status === "Payment confirmed"){
        renderOrder();
        overlay.style.display = "none";
        popupEl.style.display = "none";
      } else{
        console.error("Error:", data.error)
      }
    }

    socket.onclose = function(e){
      if(e.wasClean){
        console.log(`connection closed cleanly, code=${e.code}, reason=${e.reason}`);
      } else {
        console.error ("connection died")
      }
    
    }
    
    socket.onerror = function(error){
      console.error(`websocket error : ${error.message}`);
    }
    
    /*try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${value.order_id}/confirm-payment/`, {
        method : "PUT",
        headers : {
          "Authorization" : `Bearer ${token}`,
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          ads: selectedAds,
          selected_amount : selectedAmount
        }) 

      });

      const data = await response.json();
      console.log(data);
      if(data.status){
        renderOrder();
        overlay.style.display = "none";
        popupEl.style.display = "none";
      
      }
      
    } catch (error) {
      console.log(error)
    }*/

  })

}

function renderReceivePaymentPopup (value){
  let html = 
  `
    <div class="payment_confirmation_popup_heading">
      <h4>Payment Received</h4>
      <img src="../public/icons/Close small.svg" alt="">
    </div>

    <div class="payment_confirmation_popup_body">
      <h4>Please confirm that you received £${value.selected_amount} from the bank account below;</h4>

      <div class="payment_confirmation_popup_bank">

        <div class="payment_confirmation_popup_bank_head">
          <h4>ACCOUNT DETAILS</h4>
        </div>

        <div class="payment_confirmation_popup_bank_body">

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Name</h4>
            <h4>${value.buyer.default_bank.bank_account_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">Bank Name</h4>
            <h4>${value.buyer.default_bank.bank_name}</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${value.buyer.default_bank.bank_account_number}</h4>
            <h4>0121615892</h4>
          </div>

          <div class="payment_confirmation_popup_bank_details">
            <h4 class="secondary">${value.buyer.default_bank.bank_sort_code}</h4>
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

  confirmBtn.addEventListener("click", async()=>{
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${value.order_id}/release/`, {
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

function renderTimer(timeLeft,timeEl,intervalId){
  intervalId = setInterval(()=>{
    let min = Math.round(timeLeft / 60);
    let sec = timeLeft % 60;
  
    timeEl.innerHTML = `${pad(min)} : ${pad(sec)}`;
    timeLeft --;

    localStorage.setItem("timeLeft", timeLeft);

    if(timeLeft <=0){
      clearInterval(intervalId);
      localStorage.removeItem("timeLeft");
      // cancel order;
    }
  }, 1000);

}

function stopTimer(intervalId, time, timeEl, timeLeft){
  clearInterval(intervalId);
  localStorage.removeItem("timeLeft");
  let min = Math.round(timeLeft/60);
  let sec = timeLeft % 60;
  timeEl.innerHTML = `${pad(min)} : ${pad(sec)}`;

}

function renderBuyerHTML(data,totalOrder,date){

  const buyerSendCurrency = data.ads.type === "Naira" ? '£' : "&#8358;";
  const buyerReceiveCurrency = data.ads.type === "Naira" ? "&#8358;" : "£";
  const buyerSortCodeDisplay = data.ads.type === 'Naira' ? "" : "no_view";
  const buyerTimerDisplay = data.buyer_confirmed === true ? "no_view" : "";

  const buyerBtnStateChange = data.buyer_confirmed === false ? "filled-btn" : "inactive-btn";
  const timerHeaderStateChange = data.buyer_confirmed === false && data.status === "pending" ? 
  "Pay seller within:" :
                              data.buyer_confirmed === true && data.status === "pending" ? "Wait for seller to confirm payment":
                              data.buyer_confirmed === true && data.status === "completed" ? `Successfully received ${buyerReceiveCurrency}${monitizeNumber(data.receiving_amount)}`:
                              data.buyer_confirmed === true && data.status === "cancelled" ? "This order was cancelled": "";
  const sentStateChange = data.buyer_confirmed === false ? "I am sending" : "I sent";
  const receiveStateChange = data.status === "completed" ? "I received" : "I am receiving";
  const orderStatusChange = data.buyer_confirmed === false && data.status === "pending" ? "ORDER CREATED" :
                          data.buyer_confirmed === true && data.status === "pending" ? "PENDING CONFIRMATION" :
                          data.buyer_confirmed === true && data.status === "completed" ? "ORDER COMPLETED" :
                          data.buyer_confirmed === false && data.status === "cancelled" ? "ORDER CANCELLED" :"";
  const transferStatusChange = data.buyer_confirmed === false ? "Transfer" : "I transferred";
  const cancelledChange = data.status === "cancelled" ? "no_display" : "";
  const completedChange = data.status === "completed" ? "" : "no_view";

  let html = 
  `
    <div class="order_head">
      <div class="order_head_left">
        <h3>${timerHeaderStateChange} 
          <span><b class="js_order_timer ${buyerTimerDisplay}"> </b></span>
        </h3>
      </div>

      <div class="order_head_right">

        <h4 style="color:var(--Secondary-Text-light)">
          Order ID: 
          <span style="color:var(--Text-light)">
            ${data.order_id}
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
                  <h4><b>${buyerSendCurrency}${monitizeNumber(data.selected_amount)}</b></h4>
                </div>

                <div class="order_price">
                  <h4 style="color:var(--Secondary-Text-light)">Price</h4>
                  <h4><b>&#8358;${monitizeNumber(data.ads.rate)}</b></h4>
                </div>
                
                <div class="order_received">
                  <h4 style="color:var(--Secondary-Text-light)">${receiveStateChange}</h4>
                  <h4><b>${buyerReceiveCurrency}${monitizeNumber(data.receiving_amount)}</b></h4>
                </div>
              </div>
            </div>

            <div class="order_terms_details">

              <h4><b>
                TRANSACTION TERMS
              </b></h4>

              <h4 style="color:var(--Secondary-Text-light)">
                ${data.ads.exchange_terms}
              </h4>
            
            </div>

            <div class="order_payment_details ${cancelledChange}">

              <div class="order_payment_details_head">
                <h4><b>PAYMENT INFORMATION</b></h4>
                <h4 style="color:var(--Secondary-Text-light)">${transferStatusChange} <b style="color:var(--Text-light)">${buyerSendCurrency}${monitizeNumber(data.selected_amount)}</b> to the account details below;</h4>
              </div>

              <div class="order_payment_details_body">

                <div class="order_payment_details_body_up">
                  <div class="account_name">
                    <h4 style="color:var(--Secondary-Text-light)">Name</h4>
                    <h4>${data.seller.default_bank.bank_account_name}</h4>
                  </div>
                  <div class="bank">
                    <h4 style="color:var(--Secondary-Text-light)">Bank Name</h4>
                    <h4>${data.seller.default_bank.bank_name}</h4>
                  </div>

                </div>

                <div class="order_payment_details_body_down">
                  <div class="account_number">
                    <h4 style="color:var(--Secondary-Text-light)">Account Number</h4>
                    <h4>${data.seller.default_bank.bank_account_number}</h4>
                  </div>
                  <div class="sort_code ${buyerSortCodeDisplay}">
                    <h4 style="color:var(--Secondary-Text-light)">Sort Code</h4>
                    <h4>${data.seller.default_bank.bank_sort_code}</h4>
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

            <div class="feedback_container ${completedChange} js_feedback_container">
              <h4><b>Rating</b></h4>
            
              <div class="feedback_icon js_feedback_icon">
                <button class="feedback_btn outlined-btn js_positive" id="positiveBtn">
                 <img src="../public/icons/Thumb up.svg" alt="thumb up icon" id="positiveIcon">
                 <h4 id="positiveText">Positive</h4>
                </button>

                <button class="feedback_btn outlined-btn js_negative" id="negativeBtn">
                 <img src="../public/icons/Thumb down.svg" alt="thumb down icon" id="negativeIcon">
                 <h4 id="negativeText">Negative</h4>
                </buttton>
              </div>

              <form action="" id="ratingForm">
                <label for="feedback">  <h4>How did you feel about the transaction</h4></label>
                <textarea name="" id="feedback" placeholder="please input how you feel about the transaction"></textarea>
                <input type="hidden" id="feedbackType" name="feedbackType" value="">

                <button class="filled-btn"><h4>Publish<h4></button>
              </form>
            </div>

            <div class="completed_rating no_view js_completed_rating">
              
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
                  <h4>${data.seller.username}</h4>
                  <img src="${verified(data.seller)}" alt="">
                </div>

                <div class="user_term_metrics">
                  <h5 style="color:var(--Secondary-Text-light)">${calculateOrderTotal(data)} Orders | ${calculateOrderCompletion(data,totalOrder)}% completion</h5>
                </div>

              </div>

            </div>

            <div class="user_term_body">
              <h4>Terms(Please Read Carefully)</h4>
              <h4 style="color:var(--Secondary-Text-light);">${data.ads.exchange_terms}</h4>
            </div>
          </div>

        </div>

      </div>

    </div>


  `;

  orderPageEl.innerHTML = html;
  fetchFeedback(data);

};

function renderSellerHTML(data,totalOrder,date){
  const sendCurrency = data.ads.type === "Naira" ? '&#8358;' : "£";
  const receiveCurrency = data.ads.type === "Naira" ? "£" : "&#8358;";
  const sortCodeDisplay = data.ads.type === 'Naira' ? "" : "no_display";
  const sellerBtnStateChange = data.buyer_confirmed === false ? "inactive-btn" : "filled-btn";
  const sellerTimerStateChange = data.buyer_confirmed === false ? '' : "no_display";
  const sellerTimerHeaderStateChange = data.buyer_confirmed === false && data.status === "pending" ? "Buyer will pay within:" :
                                    data.buyer_confirmed === true && data.status === "pending" ? "Confirm payment from the buyer":
                                    data.buyer_confirmed === true && data.status === "completed" ? `Successfully sold &#8358;${monitizeNumber(data.selected_amount)}`:
                                    data.buyer_confirmed === true && data.status === "cancelled" ? "This order was cancelled": "";

  const sellerSentStateChange = data.buyer_confirmed === false ? "I am receiving" : "I received";
  const sellerReceiveStateChange = data.status === "completed" ? "I sent" : "I am sending";
  const sellerOrderStatusChange = data.buyer_confirmed === false && data.status === "pending" ? "ORDER INITIATED" :
                                data.buyer_confirmed === true && data.status === "pending" ? "VERIFY PAYMENT" :
                                data.buyer_confirmed === true && data.status === "completed" ? "ORDER COMPLETED" :
                                data.buyer_confirmed === false && data.status === "cancelled" ? "ORDER CANCELLED" :"";
  const sellerTransferStatusChange = data.buyer_confirmed === false ? "confirm" : "I received";
  const sellerCancelledChange = data.status === "cancelled" ? "no_display" : "";

  let sellerHTML = 
  `
    <div class="order_head">
      <div class="order_head_left">
        <h3>${sellerTimerHeaderStateChange}</h3>
        <h3><b class="js_order_timer ${sellerTimerStateChange}"> </b></h3>
      </div>

      <div class="order_head_right">

        <h4 style="color:var(--Secondary-Text-light)">
          Order ID: 
          <span style="color:var(--Text-light)">
            ${data.order_id}
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
                <h4 style="color:var(--Secondary-Text-light)">Transaction details;</h4>
              </div>

              <div class="order_details_body">
                <div class="order_sent">
                  <h4 style="color:var(--Secondary-Text-light)">${sellerSentStateChange}</h4>
                  <h4><b>${receiveCurrency}${monitizeNumber(data.receiving_amount)}</b></h4>
                </div>

                <div class="order_price">
                  <h4 style="color:var(--Secondary-Text-light)">Rate</h4>
                  <h4><b>&#8358;${monitizeNumber(data.ads.rate)}</b></h4>
                </div>
                
                <div class="order_received">
                  <h4 style="color:var(--Secondary-Text-light)">${sellerReceiveStateChange}</h4>
                  <h4><b>${sendCurrency}${monitizeNumber(data.selected_amount)}</b></h4>
                </div>
              </div>
            </div>

            <div class="order_terms_details">

              <h4><b>
                TRANSACTION TERMS
              </b></h4>

              <h4 style="color:var(--Secondary-Text-light)">
                ${data.ads.exchange_terms}
              </h4>
            
            </div>

            <div class="order_payment_details ${sellerCancelledChange}">

              <div class="order_payment_details_head">
                <h4><b>PAYMENT INFORMATION</b></h4>
                <h4 style="color:var(--Secondary-Text-light)">${sellerTransferStatusChange} <b style="color:var(--Text-light)">${receiveCurrency}${monitizeNumber(data.receiving_amount)}</b> from the account details below;</h4>
              </div>

              <div class="order_payment_details_body">

                <div class="order_payment_details_body_up">
                  <div class="account_name">
                    <h4 style="color:var(--Secondary-Text-light)">Name</h4>
                    <h4>${data.buyer.default_bank.bank_account_name}</h4>
                  </div>
                  <div class="bank">
                    <h4 style="color:var(--Secondary-Text-light)">Bank Name</h4>
                    <h4>${data.buyer.default_bank.bank_name}</h4>
                  </div>

                </div>

                <div class="order_payment_details_body_down">
                  <div class="account_number">
                    <h4 style="color:var(--Secondary-Text-light)">Account Number</h4>
                    <h4>${data.buyer.default_bank.bank_account_number}</h4>
                  </div>
                  <div class="sort_code ${sortCodeDisplay}">
                    <h4 style="color:var(--Secondary-Text-light)">Sort Code</h4>
                    <h4>${data.buyer.default_bank.bank_sort_code}</h4>
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
                
                <button class="${sellerBtnStateChange} js_received">
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
                  <h4>${data.seller.username}</h4>
                  <img src="${verified(data.seller)}" alt="">
                </div>

                <div class="user_term_metrics">
                  <h5 style="color:var(--Secondary-Text-light)">${calculateOrderTotal(data)} Orders | ${calculateOrderCompletion(data, totalOrder)}%</h5>
                </div>

              </div>

            </div>

            <div class="user_term_body">
              <h4>Terms(Please Read Carefully)</h4>
              <h4 style="color:var(--Secondary-Text-light);">${data.ads.exchange_terms}</h4>
            </div>
          </div>

        </div>

      </div>

    </div>

  `;

  orderPageEl.innerHTML = sellerHTML;

}

function showFeedback(feedbackType, comments){
  const completedEl = document.querySelector(".js_completed_rating");
  const uncompletedEl = document.querySelector(".js_feedback_container");

  let type = data.feedback_type === "positive" ? "Thumb up" : "Thumb down";
  let html = 
  `
    <h4><b>My Feedback</b></h4>
    <div class="icon_comment">
      <img class="selected_feedback" src="../public/icons/${type}.svg" alt="">
      <h4 class="added_comment">${data.comments}</h4>
    </div>
  `;

  uncompletedEl.classList.add("no_view");
  completedEl.innerHTML = html;
  completedEl.classList.remove("no_view");

};

const fetchFeedback = async (value)=>{
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/seller/orders/${value.order_id}`, {
      headers : {
        "Authorization" : `Bearer ${token}`,
        "content-Type" : "application/json",
      }
    });
    const data = await response.json();
    if(response.ok && data.feedback_type){
      showFeedback(data.feedback_type, data.comments)
    }
    
  } catch (error) {
    console.error("Error fetching Feedback:", error)
    
  }
}
