import {orders,} from "../../../Data/order.js";
import {formatCurrency} from "../utils.js";

const ngnEl = document.querySelector(".js_ngn_el");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");

export const displayAvailableNGNOrder =(orders)=>{
  let displayNGN = "";

  // display available order dynamically
  orders.forEach((orderItem)=>{
    if(orderItem.type === "NGN"){
      let html = `
        <div class="row_head">

          <div class="seller_container big">

            <div class="seller_container_image">
              <img src="./public/avatar/${orderItem.dp}.svg" alt="">
            </div>

            <div class="seller_container_user">

              <div class="seller_container_username">
                <a href="./views/dashboard.html" target="_blank"><h5>${orderItem.username}</h5></a>
                <img src="./public/icons/Verified.svg" alt="">
              </div>

              <div class="seller_container_metrics">
                <h5 class="light">128 Orders | 100%</h5>
              </div>

            </div>

          </div>

          <div class="rate_container big">
            <h5 class="small_title secondary light">Rate:</h5>
            <h3>${formatCurrency(orderItem.rate)}</h3>NGN
          </div>

          <div class="Amount_available_container big">
            <h5 class="small_title secondary light">Available:</h5>
            <h5 class="light">&#8358;${formatCurrency(orderItem.amount)}</h5>
          </div>

          <div class="Limit_container big">
            <h5 class="small_title secondary light">Limit:</h5>
            <h5 class="light">£${formatCurrency(orderItem.minimumOrder)} - £${formatCurrency(orderItem.maximumOrder)}</h5>
          </div>

          <div class="Buy_container big">
            <button class="filled-btn js_buy_dash_btn"><h5>BUY NGN</h5></button>
          </div>

          <!--for small and medium screen responsivenes-->
          <div class="left_row">
            <div class="seller_container">

              <div class="seller_container_image">
                <img src="./public/avatar/${orderItem.dp}.svg" alt="">
              </div>

              <div class="seller_container_user">

                <div class="seller_container_username">
                  <a href="./views/dashboard.html" target="_blank"><h5>${orderItem.username}</h5></a>
                  <img src="./public/icons/Verified.svg" alt="">
                </div>

                <div class="seller_container_metrics">
                  <h5 class="light">128 Orders | 100%</h5>
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
              <h5 class="light">£${formatCurrency(orderItem.minimumOrder)} - £${formatCurrency(orderItem.maximumOrder)}</h5>
            </div>

          </div>

          <div class="right_row">

            <div class="Buy_container">
              <button class="filled-btn js_buy_dash_btn"><h5>BUY NGN</h5></button>
            </div>

          </div>
          
        </div>

      
      `;
      displayNGN += html;

    };
  });

  ngnEl.innerHTML = displayNGN;

  document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
    btn.addEventListener("click", ()=>{
      overlay.style.display = "initial";
      moreEl.style.display = "flex";
    })
  
  });

};