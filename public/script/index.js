import {orders, poundsOrder, nairaOrder}  from "../../Data/order.js";
import { formatCurrency } from "./utils.js";
import {displayAvailableNGNOrder} from "./order/nairaOrder.js";
import {displayAvailableGBPOrder} from "./order/poundsOrder.js";
import { checkUser,getUserProfile } from "../../Data/user.js";

const nairaBtn = document.querySelector(".js-buy-ngn");
const poundBtn = document.querySelector(".js_buy_gbp");
const nairaEl = document.querySelector(".js_buy_el");
const poundEl = document.querySelector(".js_sell_el");
const howSellBtn = document.querySelector(".js_how_sell");
const howBuyBtn = document.querySelector(".js_how_buy");
const orderBuyEl = document.querySelector(".js_place_order_buy");
const sellBuyEl = document.querySelector(".js_pay_seller_buy");
const paymentBuyEl = document.querySelector(".js_receive_payment_buy");
const orderSellEl = document.querySelector(".js_place_order_sell");
const sellSellEl = document.querySelector(".js_pay_seller_sell");
const paymentSellEl = document.querySelector(".js_receive_payment_sell");
const buyBtn = document.querySelector(".Js_buy_order_btn");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");
const token = localStorage.getItem("access");
const landingPageEl = document.querySelector(".js_landing_page");
const headerRightEl = document.querySelector(".js_header_right");



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

});


displayAvailableGBPOrder(poundsOrder);
displayAvailableNGNOrder(nairaOrder);

//search amount
const form = document.querySelector(".js_amount_form");
form.addEventListener("input", (e)=>{
  const inputValue = e.target.value;
  let matchingOrders =[];
  orders.forEach((orderItem)=>{
    if(orderItem.minimumOrder <= (inputValue * 100)){
      matchingOrders.push(orderItem)
    }
  });
  displayAvailableGBPOrder(matchingOrders);
  displayAvailableNGNOrder(matchingOrders);

  if(inputValue === ""){
    displayAvailableGBPOrder(orders);
    displayAvailableNGNOrder(orders);
  }

});

async function renderLandingPage(){

  let value = 
  `
  <div class="landing_new_user_container">
    <a href="./views/login.html">
      <button class="text-btn"><h5>Log In</h5></button>
    </a>

    <a href="./views/register.html">
      <button class="filled-btn"><h5>Register</h5></button>
    </a>
  </div>
  `;

  let valueI = "";
  let userContent = await checkUser(token);
  let authenticatedUserContent = userContent === false ? value : valueI;
  
  let html =
  `
    <h2><b>Peer-to-Peer Currency Exchange with Zero Fees</b></h2>
    <h3>Purchase any currency at your preferred exchange rates</h3>
    ${authenticatedUserContent}

  `;
  landingPageEl.innerHTML = html;

}
renderLandingPage();

async function renderHeader(){
  let valueI = 
  `
    <a class="order_container" href="./views/history.html">
      <img src="./public/icons/Receipt long.svg" alt="">
      <h5>My Orders</h5>
    </a>

    <div class="profile_container">
      <img src="./public/icons/Account circle.svg" alt="">
      <h5 class="profile_none">My profile</h5>

      <div class="profile_tooltip">

        <div class="profile_tooltip_header"> 
          <h5 style="padding-left: 20px;">Biolafrica</h5>
          <div class="profile_verification_details">
            <img src="./public/icons/Verified user.svg" alt="">
            <h5 class="light">Intermediate Level Verified</h5>
          </div>
        </div>
        
        <div class="profile_tooltip_body">

          <a class="profile_tooltip_body_nav" href="./views/dashboard.html">
            <img src="./public/icons/Dashboard.svg" alt="">
            <h4>Dashboard</h4>
          </a>

          <a class="profile_tooltip_body_nav" href="./views/verify.html">
            <img src="./public/icons/Manage accounts.svg" alt="">
            <h4>Account</h4>
          </a>
          
          <a class="profile_tooltip_body_nav" href="./views/settings.html">
            <img src="./public/icons/Settings.svg" alt="">
            <h4>Settings</h4>
          </a>

        </div>

        <div class="profile_tooltip_footer" >
          <a class="profile_tooltip_footer_nav" href="./views/login.html">
            <img class="secondary" src="./public/icons/Logout.svg" alt="">
            <h4>Logout</h4>
          </a>

        </div>
      </div>
    </div>

    <div class="more_container">
      <img src="./public/icons/Pending.svg" alt="">
      <h5 class="more_none">More</h5>
      <img src="./public/icons/Arrow drop down.svg" alt="">

      <div class="more_tooltip">

        <a class="more_tooltip_nav" href="./views/postadd.html">
          <img src="./public/icons/Playlist add.svg" alt="">
          <h4>Post New Ads</h4>
        </a>

        <a class="more_tooltip_nav" href="./views/ads.html">
          <img src="./public/icons/Format list bulleted.svg" alt="">
          <h4>My Ads</h4>
        </a>

      </div>
    </div>
  `;

  let value = 
  ` <div class="landing_new_user_container">
      <a href="./views/login.html">
        <button class="text-btn"><h5>Log In</h5></button>
      </a>

      <a href="./views/register.html">
        <button class="filled-btn"><h5>Register</h5></button>
      </a>
    </div>
  `

  let headerContent = await checkUser(token)
  let authenticatedheaderContent = headerContent === false ? value : valueI;
  headerRightEl .innerHTML = authenticatedheaderContent;


}

renderHeader();

/*const displayAvailableOrder =(orders)=>{

  let displayNGN = "";
  let displayGBP = "";

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

    } else if (orderItem.type === "GBP"){
      let hmlt = `
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
          <h5 class="light">£${formatCurrency(orderItem.amount)}</h5>
        </div>

        <div class="Limit_container big">
          <h5 class="small_title secondary light">Limit:</h5>
          <h5 class="light">&#8358;${formatCurrency(orderItem.minimumOrder)} - &#8358;${formatCurrency(orderItem.maximumOrder)}</h5>
        </div>

        <div class="Buy_container big">
          <button class="filled-btn js_buy_dash_btn"><h5>BUY GBP</h5></button>
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
            <h5 class="light">£${formatCurrency(orderItem.amount)}</h5>
          </div>

          <div class="Limit_container">
            <h5 class="small_title secondary light">Limit:</h5>
            <h5 class="light">&#8358;${formatCurrency(orderItem.minimumOrder)} - &#8358;${formatCurrency(orderItem.maximumOrder)}</h5>
          </div>

        </div>

        <div class="right_row">

          <div class="Buy_container">
            <button class="filled-btn js_buy_dash_btn"><h5>BUY GBP</h5></button>
          </div>

        </div>
      
      </div>
      
      `;
      displayGBP += hmlt;

    }
    

  });

  ngnEl.innerHTML = displayNGN;
  gbpEl.innerHTML = displayGBP;

  document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
    btn.addEventListener("click", ()=>{
      overlay.style.display = "initial";
      moreEl.style.display = "flex";
    })
  
  });

};

displayAvailableOrder(orders);

//search amount
const form = document.querySelector(".js_amount_form");
form.addEventListener("input", (e)=>{
  const inputValue = e.target.value;
  let matchingOrders =[];
  orders.forEach((orderItem)=>{
    if(orderItem.minimumOrder <= (inputValue * 100)){
      matchingOrders.push(orderItem)
    }

  });

  displayAvailableOrder(matchingOrders);
  let noAds = 
  `<div class="no_ads">
    <img src="./public/icons/no_ads.svg" alt="">
    <h5><b>No Ads</b></h5>
  </div>`;

  matchingOrders.forEach((order)=>{
    if(!(order.type).includes("NGN")){
      ngnEl.innerHTML = noAds;

    }else if(!(order.type).includes("GBP")){
      gbpEl.innerHTML = noAds;
    }else {}
  })

}); */

