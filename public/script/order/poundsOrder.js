import {verified, verifyType} from "../utils/verification.js";
import {calculateTotalOrder, calculateCompleteOrder} from "../utils/metrics.js";
import {monitizeNumber} from "../utils/money.js";
import{AuthenticateUser} from "../../../Data/user.js";
import{addOrder} from "../../../Data/orders.js";


const gbpEl = document.querySelector(".js_gbp_el");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");
const paginationNumbersEl = document.getElementById("paginationNumbers");
const prevPageEl = document.getElementById("prevPage");
const nextPageEl = document.getElementById("nextPage");
const token = localStorage.getItem("access");



export const displayAvailableGBPOrder = (poundsOrder)=>{
  let displayGBP = "";
  const ordersPerPage = 3;
  let currentPage = 1;

  function renderOrders(page){
    displayGBP = "";
    let startIndex = (page - 1) * ordersPerPage;
    let endIndex = startIndex + ordersPerPage;
    let paginatedOrders = poundsOrder.slice(startIndex, endIndex);

    // display available order dynamically
    paginatedOrders.forEach((orderItem)=>{
      let totalOrder = 0;
      let completedOrder = 0;
      
      totalOrder = orderItem.user.buy_order + orderItem.user.sell_order;
      completedOrder = (((orderItem.user.buy_order + orderItem.user.sell_order)/totalOrder) * 100).toFixed(0);
      let zeroCompletedOrder = completedOrder === 0 ? "100%" : completedOrder;
      let dp = orderItem.user.display_picture === "http://example.com/path/to/display_picture.jpg" ? "avatar_1" : orderItem.user.display_picture;

      let hmlt = `
      <div class="row_head">

        <div class="seller_container big">

          <div class="seller_container_image">
            <img src="./public/avatar/${dp}.svg" alt="">
          </div>

          <div class="seller_container_user">

            <div class="seller_container_username">
              <a href="./views/dashboard.html" target="_blank"><h6><b>${orderItem.user.username}</b></h6></a>
              <img src="${verified}" alt="">
            </div>

            <div class="seller_container_metrics">
              <h6 class="light">${totalOrder} Orders | ${zeroCompletedOrder}%</h6>
            </div>

          </div>

        </div>

        <div class="rate_container big">
          <h5 class="small_title secondary light">Rate:</h5>
          <h4>${orderItem.rate}</h4>NGN
        </div>

        <div class="Amount_available_container big">
          <h5 class="small_title secondary light">Available:</h5>
          <h6 class="light">£${orderItem.amount}</h6>
        </div>

        <div class="Limit_container big">
          <h5 class="small_title secondary light">Limit:</h5>
          <h6 class="light">&#8358;${orderItem.minimum_limit} - &#8358;${orderItem.maximum_limit}</h6>
        </div>

        <div class="Buy_container big">
          <button class="filled-btn js_buy_dash_btn" id="${orderItem.ad_id}"><h6 id="${orderItem.ad_id}">BUY GBP</h6></button>
        </div>

        <!--for small and medium screen responsivenes-->
        <div class="left_row">
          <div class="seller_container">

            <div class="seller_container_image">
              <img src="./public/avatar/${orderItem.dp}.svg" alt="">
            </div>

            <div class="seller_container_user">

              <div class="seller_container_username">
                <a href="./views/dashboard.html" target="_blank"><h5>${orderItem.user.username}</h5></a>
                <img src="${verified}" alt="">
              </div>

              <div class="seller_container_metrics">
                <h5 class="light">${totalOrder} Orders | ${zeroCompletedOrder}% completion</h5>
              </div>

            </div>

          </div>

          <div class="rate_container">
            <h5 class="small_title secondary light">Rate:</h5>
            <h3>${orderItem.rate}</h3>NGN
          </div>

          <div class="Amount_available_container">
            <h5 class="small_title secondary light">Available:</h5>
            <h5 class="light">£${orderItem.amount}</h5>
          </div>

          <div class="Limit_container">
            <h5 class="small_title secondary light">Limit:</h5>
            <h5 class="light">&#8358;${orderItem.minimum_limit} - &#8358;${orderItem.maximum_limit}</h5>
          </div>

        </div>

        <div class="right_row">

          <div class="Buy_container">
            <button class="filled-btn js_buy_dash_btn" id="${orderItem.ad_id}"><h5 id="${orderItem.ad_id}">BUY GBP</h5></button>
          </div>

        </div>
      
      </div>
      
      `;
      displayGBP += hmlt;

      
    });

    gbpEl.innerHTML = displayGBP;
    renderPaginationNumbers();
  
    document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
      btn.addEventListener("click", async(e)=>{
        const isAuthenticated = await AuthenticateUser(token);
        if(!isAuthenticated){
          return;
        }
      
        overlay.style.display = "initial";
        moreEl.style.display = "flex";
        let orderId = e.target.id;
        const orderType = e.target.textContent;

        if(orderType === "BUY GBP"){
          const currencyType = orderType === "BUY NGN" ? "£" : "&#8358;";
          const currencyTypeLetter = orderType === "BUY NGN" ? "NGN" : "GBP";
          const currencyTypeLetterP = orderType === "BUY NGN" ? "GBP" : "NGN";

          let matchingOrder = {};
          poundsOrder.forEach((orderItem)=>{
            if (orderItem.ad_id === orderId){
              matchingOrder = orderItem;
            }

          }) 
         
          const totalOrder = matchingOrder.user.buy_order + matchingOrder.user.sell_order;
          let dp = matchingOrder.user.display_picture === "http://example.com/path/to/display_picture.jpg" ? "avatar_1" : matchingOrder.user.display_picture;
        
          //display more content
          let html = 
          `
            <div class="more_info_popup_left">
              <div class="more_info_popup_left_top">
    
                <div class="more_info_popup_image">
                  <img src="./public/avatar/${dp}.svg" alt="">
                </div>
    
                <div class="more_info_popup_text">
    
                  <div class="more_info_popup_text_up">
                    <h4>${matchingOrder.user.username}</h4>
                    <img src="${verified}" alt="">
                  </div>
    
                  <div class="more_info_popup_text_down">
                    <h4 class="secondary">${calculateTotalOrder(matchingOrder)} orders | ${calculateCompleteOrder(matchingOrder,totalOrder)}% completion</h4>
                  </div>
                </div>
    
              </div>
    
              <div class="more_info_popup_left_middle">
    
                <div class="more_info_popup_verification">
                  <h4 class="secondary">Verification level</h4>
                  <h4>${verifyType(matchingOrder)}</h4>
                </div>
    
                <div class="more_info_popup_time_limit">
                  <h4 class="secondary">Payment Time Limit</h4>
                  <h4>${matchingOrder.time_limit} minutes</h4>
                </div>
    
                <div class="more_info_popup_amount">
                  <h4 class="secondary">Available Amount</h4>
                  <h4>${monitizeNumber(matchingOrder.amount)} ${currencyTypeLetter}</h4>
                </div>
    
              </div>
              
              <div class="more_info_popup_left_bottom">
                <h4>Seller's Terms(Read Carefully)</h4>
                <h4 class="secondary">${matchingOrder.exchange_terms}</h4>
              </div>
            </div>
    
            <div class="more_info_popup_right">
              <h4>Rate: <b>${matchingOrder.rate} NGN</b></h4>
    
              <form action="">
    
                <Label><h4>I want to pay:</h4></Label>
                <div class="input_money js_input_money" style="margin-bottom: 0px;width: 100%;">
                  <input type="number" placeholder="0.00" class="js_send_amount" style="outline: none;">
                  <h4>${currencyTypeLetterP}</h4>
                </div>
                <h5 class="light js_limit_value" style="margin-bottom: 35px;">Limits ${currencyType}${matchingOrder.minimum_limit} - ${currencyType}${matchingOrder.maximum_limit}</h5>
    
                <Label><h4>I will receive:</h4></Label>
                <div class="input_money" style="width: 100%;">
                  <input type="text" placeholder="0.00" readonly class="js_receive_amount">
                  <h4>${currencyTypeLetter}</h4>
                </div>
                
              </form>
    
              <div class="more_info_popup_button">
                <button class="outlined-btn" id="cancelBtn"><h5>Cancel</h5></button>
                <a href="./views/order.html"><button style="width: 100%;" class="filled-btn js_buy_order_btn"><h5>Buy ${currencyTypeLetter}</h5></button></a>
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
            
            const convertedValue = inputValue / (matchingOrder.rate * 100);
            const converts = parseFloat(convertedValue.toFixed(2));
            receiveEl.value = converts;
          });

          document.querySelector(".js_buy_order_btn").addEventListener("click", async()=>{
            const ads = orderId;
            const adsDetails = matchingOrder;
            const selected_amount = payEl.value;
            const errorMessageEl = document.querySelector(".js_error_popup");
            console.log(ads, selected_amount);

            try {
              const response = await fetch("http://127.0.0.1:8000/api/orders/", {
                method : "POST",
                headers : {
                  "Authorization" : `Bearer ${token}`,
                  "content-Type" : "application/json",
                },

                body : JSON.stringify({ads,selected_amount,})
              })
              const data = await response.json();
              if(data[0] === "You must completed or cancel your pending order before creating a new one."){
                let html =
                `
                  <img src="./public/icons/Cancel.svg" alt="">
                  <h4>Kindly complete your pending order</h4>
                `;
                errorMessageEl.innerHTML = html;
                errorMessageEl.style.display = "flex";
                setTimeout(()=>{
                  errorMessageEl.style.display = "none";
                },3000);
               
              }else{
                addOrder(data,adsDetails);
                window.location.href = "../../../views/order.html";

              }
              
            } catch (error) {
              console.log(error);
              
            };
            
            window.location.href = "../../../views/order.html";


          })
          

        }

      });

    
    });

  }

  function renderPaginationNumbers(){
    paginationNumbersEl.innerHTML = "";
    let totalPages = Math.ceil(poundsOrder.length / ordersPerPage);

    for(let i=1; i <= totalPages ; i++){
      let pageDiv = document.createElement("div");
      let pageStyle = i === currentPage ? "filled_page" : "page";
      pageDiv.className = `${pageStyle}`;
      pageDiv.innerHTML = `<h5 class="light">${i}</h5>`;
      pageDiv.addEventListener("click", ()=>{
        currentPage = i;
        renderOrders(currentPage);
      });
      paginationNumbersEl.appendChild(pageDiv); 
    }

    prevPageEl.style.visibility = currentPage === 1 ? "hidden" : "visible";
    nextPageEl.style.visibility = currentPage === totalPages ? "hidden" : "visible";
  }

  prevPageEl.addEventListener("click", ()=>{
    if(currentPage > 1){
      currentPage--;
      renderOrders(currentPage);
    }
  })

  nextPageEl.addEventListener("click", ()=>{
    let totalPages = Math.ceil(poundsOrder.length / ordersPerPage);
    if(currentPage < totalPages){
      currentPage++;
      renderOrders(currentPage);
    }
  })

  renderOrders(currentPage);
 

};