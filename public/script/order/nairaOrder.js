import {nairaMatchOrder,} from "../../../Data/orders.js";
import {formatCurrency} from "../utils.js";
import{matchUser} from "../../../Data/user.js";
import {verified, verifyType} from "../utils/verification.js";
import {calculateTotalOrder, calculateCompleteOrder} from "../utils/metrics.js";
import {AuthenticateUser} from "../../../Data/user.js";

const ngnEl = document.querySelector(".js_ngn_el");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");
const paginationNumbersEl = document.getElementById("paginationNo");
const prevPageEl = document.getElementById("prevPages");
const nextPageEl = document.getElementById("nextPages");
const token = localStorage.getItem("access");

export const displayAvailableNGNOrder =(nairaOrder)=>{
  let displayNGN = "";
  const nairaOrdersPerPage = 3;
  let nairaCurrentPage = 1;

  function renderNairaOrder(page){
    displayNGN = "";
    let startIndex = (page - 1) * nairaOrdersPerPage;
    let endIndex = startIndex + nairaOrdersPerPage;
    let paginatedNairaOrders = nairaOrder.slice(startIndex, endIndex);

    // display available order dynamically
    paginatedNairaOrders.forEach((orderItem)=>{
      let totalOrder = 0;
      let completedOrder = 0;
      
      totalOrder = orderItem.user.buy_order + orderItem.user.sell_order;
      completedOrder = (((orderItem.user.buy_order + orderItem.user.sell_order)/totalOrder) * 100).toFixed(0);
      let zeroCompletedOrder = completedOrder === 0 ? "100%" : completedOrder;
      let dp = orderItem.user.display_picture === "http://example.com/path/to/display_picture.jpg" ? "avatar_1" : orderItem.user.display_picture;



      let verified = orderItem.verification === true ? "./public/icons/Verified.svg" : "";

      
      let html = `
        <div class="row_head">

          <div class="seller_container big">

            <div class="seller_container_image">
              <img src="./public/avatar/${dp}.svg" alt="">
            </div>

            <div class="seller_container_user">

              <div class="seller_container_username">
                <a href="./views/dashboard.html" target="_blank"><h6><b>${orderItem.user.username}</b></h6></a>
                <img src="${verified}" alt=""></img>
              </div>

              <div class="seller_container_metrics">
                <h6 class="light">${(totalOrder)} Orders | ${zeroCompletedOrder}%</h6>
              </div>

            </div>

          </div>

          <div class="rate_container big">
            <h5 class="small_title secondary light">Rate:</h5>
            <h4>${formatCurrency(orderItem.rate)}</h4>NGN
          </div>

          <div class="Amount_available_container big">
            <h5 class="small_title secondary light">Available:</h5>
            <h6 class="light">&#8358;${formatCurrency(orderItem.amount)}</h6>
          </div>

          <div class="Limit_container big">
            <h5 class="small_title secondary light">Limit:</h5>
            <h6 class="light">£${formatCurrency(orderItem.minimum_limit)} - £${formatCurrency(orderItem.maximum_limit)}</h6>
          </div>

          <div class="Buy_container big">
            <button class="filled-btn js_buy_dash_btn" id="${orderItem.ad_id}"><h6 id="${orderItem.ad_id}">BUY NGN</h6></button>
          </div>

          <!--for small and medium screen responsivenes-->
          <div class="left_row">
            <div class="seller_container">

              <div class="seller_container_image">
                <img src="./public/avatar/${dp}.svg" alt="">
              </div>

              <div class="seller_container_user">

                <div class="seller_container_username">
                  <a href="./views/dashboard.html" target="_blank"><h5>${orderItem.user.username}</h5></a>
                  <img src="${verified}" alt="">
                </div>

                <div class="seller_container_metrics">
                  <h5 class="light">${totalOrder} Orders | ${zeroCompletedOrder}%</h5>
                </div>

              </div>

            </div>

            <div class="rate_container">
              <h5 class="small_title secondary light">Rate:</h5>
              <h3>${formatCurrency(orderItem.rate)}</h3>NGN
            </div>

            <div class="Amount_available_container">
              <h5 class="small_title secondary light">Available:</h5>
              <h5 class="light">&#8358;${formatCurrency(orderItem.amount)}</h5>
            </div>

            <div class="Limit_container">
              <h5 class="small_title secondary light">Limit:</h5>
              <h5 class="light">£${formatCurrency(orderItem.minimum_limit)} - £${formatCurrency(orderItem.maximum_limit)}</h5>
            </div>

          </div>

          <div class="right_row">

            <div class="Buy_container">
              <button class="filled-btn js_buy_dash_btn" id="${orderItem.ad_id}"><h5 id="${orderItem.ad_id}">BUY NGN</h5></button>
            </div>

          </div>
          
        </div>

      
      `;
      displayNGN += html;

      
    });

    ngnEl.innerHTML = displayNGN;
    renderNairaPaginationNumbers();

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

        if(orderType === "BUY NGN"){
          const currencyType = orderType === "BUY NGN" ? "£" : "&#8358;";
          const currencyTypeLetter = orderType === "BUY NGN" ? "NGN" : "GBP";
          const currencyTypeLetterP = orderType === "BUY NGN" ? "GBP" : "NGN";
          
          const matchingOrder = nairaMatchOrder(orderId);
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
            
            const convertedValue = inputValue * matchingOrder.rate;
            const converts = parseFloat((convertedValue.toFixed(2))/100);
            receiveEl.value = formatCurrency(converts);
    
          });
        }
      
      })
    
    });

  }

  function renderNairaPaginationNumbers(){
    paginationNumbersEl.innerHTML = "";
    let totalPages = Math.ceil(nairaOrder.length / nairaOrdersPerPage);

    for(let i=1; i <=totalPages; i++){
      let nairaPageDiv = document.createElement("div");
      let nairaPageStyle = i === nairaCurrentPage ? "filled_page_n" : "page_n";
      nairaPageDiv.className = `${nairaPageStyle}`;
      nairaPageDiv.innerHTML = `<h5 class="light">${i}</h5>`;
      nairaPageDiv.addEventListener("click", ()=>{
        nairaCurrentPage = i;
        renderNairaOrder(nairaCurrentPage);

      })
      paginationNumbersEl.appendChild(nairaPageDiv);
    }

    prevPageEl.style.visibility = nairaCurrentPage === 1 ? "hidden" : "visible";
    nextPageEl.style.visibility = nairaCurrentPage === totalPages ? "hidden" : "visible";
  };

  prevPageEl.addEventListener("click", ()=>{
    if(nairaCurrentPage > 1){
      nairaCurrentPage--;
      renderNairaOrder(nairaCurrentPage);
    }
  });

  nextPageEl.addEventListener("click", ()=>{
    let totalPages = Math.ceil(nairaOrder.length / nairaOrdersPerPage);
    if(nairaCurrentPage < totalPages){
      nairaCurrentPage++;
      renderNairaOrder(nairaCurrentPage);
    }
  });

  renderNairaOrder(nairaCurrentPage);


};