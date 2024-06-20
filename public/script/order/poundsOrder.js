import {orders, matchOrder} from "../../../Data/order.js";
import{users,matchUser} from "../../../Data/user.js";
import {verified, verifyType} from "../utils/verification.js";
import {calculateTotalOrder, calculateCompleteOrder} from "../utils/metrics.js";
import {formatCurrency} from "../utils/money.js";


const gbpEl = document.querySelector(".js_gbp_el");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");



export const displayAvailableGBPOrder =(orders)=>{
  let displayGBP = "";

  // display available order dynamically
  orders.forEach((orderItem)=>{
    let totalOrder = 0;
    let completedOrder = 0;
    let matchingUser = matchUser(orderItem);
    
    totalOrder = matchingUser.buyOrder + matchingUser.sellOrder + matchingUser.cancelledOrder;
    completedOrder = (((matchingUser.buyOrder + matchingUser.sellOrder)/totalOrder) * 100).toFixed(0);
  
    let verified = matchingUser.advanceVerification === true ? "./public/icons/Verified.svg" : "";


    if (orderItem.type === "GBP"){
      let hmlt = `
      <div class="row_head">

        <div class="seller_container big">

          <div class="seller_container_image">
            <img src="./public/avatar/${matchingUser.dp}.svg" alt="">
          </div>

          <div class="seller_container_user">

            <div class="seller_container_username">
              <a href="./views/dashboard.html" target="_blank"><h5>${matchingUser.username}</h5></a>
              <img src="${verified}" alt="">
            </div>

            <div class="seller_container_metrics">
              <h5 class="light">${totalOrder} Orders | ${completedOrder}%</h5>
            </div>

          </div>

        </div>

        <div class="rate_container big">
          <h5 class="small_title secondary light">Rate:</h5>
          <h3>${formatCurrency(orderItem.rate)}</h3>NGN
        </div>

        <div class="Amount_available_container big">
          <h5 class="small_title secondary light">Available:</h5>
          <h5 class="light">£${formatCurrency(orderItem.amount)}</h5>
        </div>

        <div class="Limit_container big">
          <h5 class="small_title secondary light">Limit:</h5>
          <h5 class="light">&#8358;${formatCurrency(orderItem.minimumOrder)} - &#8358;${formatCurrency(orderItem.maximumOrder)}</h5>
        </div>

        <div class="Buy_container big">
          <button class="filled-btn js_buy_dash_btn" id="${orderItem.id}"><h5 id="${orderItem.id}">BUY GBP</h5></button>
        </div>

        <!--for small and medium screen responsivenes-->
        <div class="left_row">
          <div class="seller_container">

            <div class="seller_container_image">
              <img src="./public/avatar/${matchingUser.dp}.svg" alt="">
            </div>

            <div class="seller_container_user">

              <div class="seller_container_username">
                <a href="./views/dashboard.html" target="_blank"><h5>${matchingUser.username}</h5></a>
                <img src="${verified}" alt="">
              </div>

              <div class="seller_container_metrics">
                <h5 class="light">${totalOrder} Orders | ${completedOrder}%</h5>
              </div>

            </div>

          </div>

          <div class="rate_container">
            <h5 class="small_title secondary light">Rate:</h5>
            <h3>${formatCurrency(orderItem.rate)}</h3>NGN
          </div>

          <div class="Amount_available_container">
            <h5 class="small_title secondary light">Available:</h5>
            <h5 class="light">£${formatCurrency(orderItem.amount)}</h5>
          </div>

          <div class="Limit_container">
            <h5 class="small_title secondary light">Limit:</h5>
            <h5 class="light">&#8358;${formatCurrency(orderItem.minimumOrder)} - &#8358;${formatCurrency(orderItem.maximumOrder)}</h5>
          </div>

        </div>

        <div class="right_row">

          <div class="Buy_container">
            <button class="filled-btn js_buy_dash_btn" id="${orderItem.id}"><h5 id="${orderItem.id}">BUY GBP</h5></button>
          </div>

        </div>
      
      </div>
      
      `;
      displayGBP += hmlt;

    }
    
  });

  gbpEl.innerHTML = displayGBP;

  document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
      overlay.style.display = "initial";
      moreEl.style.display = "flex";
      let orderId = e.target.id;
      const orderType = e.target.textContent;
      
      const currencyType = orderType === "BUY NGN" ? "£" : "&#8358;";
      const currencyTypeLetter = orderType === "BUY NGN" ? "NGN" : "GBP";
      const currencyTypeLetterP = orderType === "BUY NGN" ? "GBP" : "NGN";
      
      const matchingOrder = matchOrder(orderId);
      const matchingUser = matchUser(matchingOrder);
      const totalOrder = matchingUser.buyOrder + matchingUser.sellOrder + matchingUser.cancelledOrder;
    
      //display more content
      let html = 
      `
        <div class="more_info_popup_left">
          <div class="more_info_popup_left_top">

            <div class="more_info_popup_image">
              <img src="./public/avatar/${matchingUser.dp}.svg" alt="">
            </div>

            <div class="more_info_popup_text">

              <div class="more_info_popup_text_up">
                <h4>${matchingUser.username}</h4>
                <img src="${verified(matchingUser)}" alt="">
              </div>

              <div class="more_info_popup_text_down">
                <h4 class="secondary">${calculateTotalOrder(matchingUser)} orders | ${calculateCompleteOrder(matchingUser,totalOrder)}% completion</h4>
              </div>
            </div>

          </div>

          <div class="more_info_popup_left_middle">

            <div class="more_info_popup_verification">
              <h4 class="secondary">Verification level</h4>
              <h4>${verifyType(matchingUser)}</h4>
            </div>

            <div class="more_info_popup_time_limit">
              <h4 class="secondary">Payment Time Limit</h4>
              <h4>15 minutes</h4>
            </div>

            <div class="more_info_popup_amount">
              <h4 class="secondary">Available Amount</h4>
              <h4>${formatCurrency(matchingOrder.amount)} ${currencyTypeLetter}</h4>
            </div>

          </div>
          
          <div class="more_info_popup_left_bottom">
            <h4>Seller's Terms(Read Carefully)</h4>
            <h4 class="secondary">${matchingOrder.exchangeTerms}</h4>
          </div>
        </div>

        <div class="more_info_popup_right">
          <h4>Rate: <b>${formatCurrency(matchingOrder.rate)} NGN</b></h4>

          <form action="">

            <Label><h4>I want to pay:</h4></Label>
            <div class="input_money js_input_money" style="margin-bottom: 0px;width: 100%;">
              <input type="number" placeholder="0.00" class="js_send_amount" style="outline: none;">
              <h4>${currencyTypeLetterP}</h4>
            </div>
            <h5 class="light js_limit_value" style="margin-bottom: 35px;">Limits ${currencyType}${formatCurrency(matchingOrder.minimumOrder)} - ${currencyType}${formatCurrency(matchingOrder.maximumOrder)}</h5>

            <Label><h4>I will receive:</h4></Label>
            <div class="input_money" style="width: 100%;">
              <input type="text" placeholder="0.00" readonly class="js_receive_amount">
              <h4>${currencyTypeLetter}</h4>
            </div>
            
          </form>

          <div class="more_info_popup_button">
            <button class="outlined-btn" id="cancelBtn"><h5>Cancel</h5></button>
            <a href="./views/order.html"><button style="width: 100%;" class="filled-btn Js_buy_order_btn"><h5>Buy ${currencyTypeLetter}</h5></button></a>
          </div>

          
        </div>

      `;
      moreEl.innerHTML = html;

      // cancel popup button
      const cancelBtn = document.getElementById("cancelBtn");
      cancelBtn.addEventListener("click", ()=>{
        overlay.style.display = "none";
        moreEl.style.display = "none";
      });

      const payEl = document.querySelector(".js_send_amount");
      const receiveEl = document.querySelector(".js_receive_amount");
      const payInput = document.querySelector(".js_input_money");
      const limitEl = document.querySelector(".js_limit_value");

      //coversation input 
      payEl.addEventListener("input", (e)=>{

        const inputValue = (Number(e.target.value)) * 100;

        if(inputValue < matchingOrder.minimumOrder && inputValue > 0){
          payInput.classList.add("js_input_money_color");
          limitEl.classList.add("js_limit_value_color");
        } else if(inputValue === 0){
          payInput.classList.remove("js_input_money_color");
          limitEl.classList.remove("js_limit_value_color");
        }else{
          payInput.classList.remove("js_input_money_color");
          limitEl.classList.remove("js_limit_value_color");
        }
        console.log(inputValue);

        const convertedValue = inputValue / matchingOrder.rate;
        const converts = parseFloat(convertedValue.toFixed(2));
        receiveEl.value = converts;
      });
      
    });

   
  });

};

