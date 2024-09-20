import {checkUser} from "../../Data/user.js";
import { renderHeader } from "./script.js";
import { AuthenticateUser } from "../../Data/user.js";
import { verified, verifyType } from "./utils/verification.js";
import { monitizeNumber, convertNaira, convertPounds } from "./utils/money.js";
import { calculateCompleteOrder, calculateTotalOrder } from "./utils/metrics.js";
import{popupDisplayHTML} from"./utils/popup.js";

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
const token = localStorage.getItem("access");
const landingPageEl = document.querySelector(".js_landing_page");
const ngnEl = document.querySelector(".js_ngn_el");
const gbpEl = document.querySelector(".js_gbp_el");
const poundsInputEl = document.querySelector(".js_filter_gbp");
const nairaInputEl = document.querySelector(".js_filter_ng");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");


const socket = new WebSocket('ws://127.0.0.1:8000/order/');
socket.onopen = function (){
  console.log("websocket connection established");
};

nairaBtn.addEventListener("click", ()=>{
  nairaBtn.classList.remove("text-btn");
  nairaBtn.classList.add("filled-btn");
  poundBtn.classList.remove("filled-btn");
  poundBtn.classList.add("text-btn");
  poundEl.style.display = "none";
  nairaEl.style.display = "grid";
  poundsInputEl.classList.remove("no_view");
  nairaInputEl.classList.add("no_view");
  loadPage()

});

poundBtn.addEventListener("click", ()=>{
  nairaBtn.classList.remove("filled-btn");
  nairaBtn.classList.add("text-btn");
  poundBtn.classList.remove("text-btn");
  poundBtn.classList.add("filled-btn");
  nairaEl.style.display = "none";
  poundEl.style.display = "grid";
  poundsInputEl.classList.add("no_view");
  nairaInputEl.classList.remove("no_view");
  
  loadPage();  
});

howBuyBtn.addEventListener("click", ()=>{
  howBuyBtn.classList.remove("outlined-btn");
  howBuyBtn.classList.add("filled-btn");
  howSellBtn.classList.remove("active_btn");
  howSellBtn.classList.add("outlined-btn");
  orderSellEl.style.display = "none";
  sellSellEl.style.display = "none";
  paymentSellEl.style.display ='none';
  orderBuyEl.style.display = "initial";
  sellBuyEl.style.display = "initial" ;
  paymentBuyEl.style.display ="initial";

});

howSellBtn.addEventListener("click", ()=>{
  howSellBtn.classList.remove("outlined-btn");
  howSellBtn.classList.add("filled-btn");
  howBuyBtn.classList.remove("active_btn");
  howBuyBtn.classList.add("outlined-btn");
  orderSellEl.style.display = "initial";
  sellSellEl.style.display = "initial";
  paymentSellEl.style.display ='initial';
  orderBuyEl.style.display = "none";
  sellBuyEl.style.display = "none" ;
  paymentBuyEl.style.display ="none";

});

document.querySelectorAll(".faq_icon").forEach((iconContainer)=>{
  const expandIcon = iconContainer.querySelector(".expand");
  const collapseIcon = iconContainer.querySelector(".collapse");
  const textContainer = iconContainer.parentElement.querySelector("h6");

  const toggleContent = ()=>{
    textContainer.classList.toggle("no_view");
    expandIcon.classList.toggle("no_view");
    collapseIcon.classList.toggle("no_view");
  }

  expandIcon.addEventListener("click", toggleContent);
  collapseIcon.addEventListener("click", toggleContent);
})

let newData = [];
renderHeader();
let currentPageNaira = 1;
let currentPagePounds = 1;
const itemsPerPage = 3;
renderLandingPage();
loadPage();

async function loadPage(){
  try {
    const response = await fetch("http://127.0.0.1:8000/api/all-ads");
    const data = await response.json();
    filteredNairaAds(data);
    filteredPoundsAds(data);
    newData = data;
  } catch (error) {
    console.log("Error fetching ads:", error);
  }

}; 

let searchPounds = document.querySelector(".js_gb_amount_form");
searchPounds.addEventListener("input", (e)=>{
  const inputValue = parseFloat(e.target.value.trim());
  let nairaOrder = nairaAds(newData);
  console.log(inputValue);

  if(isNaN(inputValue) || inputValue === 0){
    loadPage();
    
  }else{

    const filteredAds = nairaOrder.filter((ads)=>{
      const minimumLimit = Math.ceil(parseFloat(ads.minimum_limit));
      console.log(minimumLimit);
      return minimumLimit <= inputValue;
    
    });
    console.log(filteredAds);
    if(filteredAds.length === 0){
      empty(ngnEl);
    }else{
      displayAvailableNGNAds(filteredAds);
    } 
  }

});

let searchNaira = document.querySelector(".js_ng_amount_form");
searchNaira.addEventListener("input", (e)=>{
  const inputValue = parseFloat(e.target.value.trim());
  let poundOrder = poundsAds(newData);
  console.log(inputValue);

  if(isNaN(inputValue) || inputValue === 0){
    loadPage();
    
  }else{

    const filteredAds = poundOrder.filter((ads)=>{
      const minimumLimit = Math.ceil(parseFloat(ads.minimum_limit));
      console.log(minimumLimit);
      return minimumLimit <= inputValue;
    
    });
    console.log(filteredAds);
    if(filteredAds.length === 0){
      empty(gbpEl);
    }else{
      displayAvailableGBPOrder(filteredAds);
    } 
  }

});

function empty(ngnEl){
  let html = 
  `
    <div class="empty_container">
      <img src="./public/icons/Hourglass empty.svg" alt="">
      <h4>No Ads</h4>
    </div>

  `;
  ngnEl.innerHTML = html;
}

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
    <h2><b>Peer-to-Peer Currency Exchange with <Span style="color: #2970ff;">Zero Fees</span></b></h2>
    <h3>Purchase any currency at your preferred exchange rates</h3>
    ${authenticatedUserContent}

  `;
  landingPageEl.innerHTML = html;

}

// filter data from the backend for naira and pounds
function filteredNairaAds(ads){
  let nairaAds = ads.filter(ad =>ad.type === "Naira");
  renderNairaAds(nairaAds);
  
};

function filteredPoundsAds(ads){
  let poundsAds = ads.filter(ad =>ad.type === "Pounds");
  renderPoundsAds(poundsAds);

}

//Render ads for both naira and pounds

function renderNairaAds(data){
  const start = (currentPageNaira - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);
  let nairaHTML = "";
  let buttonCurrency = "BUY NGN";


  paginatedData.forEach((orderItem)=>{
   let html = generateAdsHTML(orderItem, buttonCurrency);
    nairaHTML += html;
  });

  ngnEl.innerHTML = nairaHTML;
  renderPagination(data.length, "Naira");

  document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
    btn.addEventListener("click", async(e)=>{

      const isAuthenticated = await AuthenticateUser(token);
      if(!isAuthenticated){
        return;
      }
    
      overlay.style.display = "initial";
      moreEl.style.display = "flex";
      let adId = e.target.id;
      const adType = e.target.textContent;
      console.log(adId, adType)

      if(adType === "BUY NGN"){
        const currencyType = adType === "BUY NGN" ? "£" : "&#8358;";
        const currencyTypeLetter = adType === "BUY NGN" ? "NGN" : "GBP";
        const currencyTypeLetterP = adType === "BUY NGN" ? "GBP" : "NGN";

        let matchingAds = {};
        data.forEach((adItem)=>{
          if (adItem.ad_id === adId){
            matchingAds = adItem;
          }

        });
        console.log(matchingAds)

        generateMoreDetailsHTML(matchingAds,currencyType, currencyTypeLetter, currencyTypeLetterP);
        cancelPopup();
        covertInputtedCurrency(convertNaira,matchingAds);
        document.querySelector(".js_buy_order_btn").addEventListener("click", async()=>{
          sendOrderCreationRequest(adId,matchingAds)

        })
       

      }  
        
    })

  })


}

function renderPoundsAds(data){
  const start = (currentPagePounds - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);
  let poundsHTML = "";
  let buttonCurrency = "BUY GBP";

  paginatedData.forEach((orderItem)=>{
    let html = generateAdsHTML(orderItem, buttonCurrency);
    poundsHTML += html;
  });

  gbpEl.innerHTML = poundsHTML;
  renderPagination(data.length, "Pounds");

  document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
    btn.addEventListener("click", async(e)=>{

      const isAuthenticated = await AuthenticateUser(token);
      if(!isAuthenticated){
        return;
      }
    
      overlay.style.display = "initial";
      moreEl.style.display = "flex";
      let adId = e.target.id;
      const adType = e.target.textContent;
      console.log(adId, adType)

      if(adType === "BUY GBP"){
        const currencyType = adType === "BUY NGN" ? "£" : "&#8358;";
        const currencyTypeLetter = adType === "BUY NGN" ? "NGN" : "GBP";
        const currencyTypeLetterP = adType === "BUY NGN" ? "GBP" : "NGN";

        let matchingAds = {};
        data.forEach((adItem)=>{
          if (adItem.ad_id === adId){
            matchingAds = adItem;
          }

        });
        console.log(matchingAds)

        generateMoreDetailsHTML(matchingAds,currencyType, currencyTypeLetter, currencyTypeLetterP);
        cancelPopup();
        covertInputtedCurrency(convertPounds, matchingAds);
        document.querySelector(".js_buy_order_btn").addEventListener("click", async()=>{
          sendOrderCreationRequest(adId,matchingAds)

        })
       

      }  
        
    })

  })

}

//Generate HTML

function generateAdsHTML(orderItem, buttonCurrency){

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

        <a class="seller_container_image" href="../../views/dashboard.html" target="_blank">
          <img src="./public/avatar/${dp}.svg" alt="">
        </a>

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
        <h4>${orderItem.rate}</h4>NGN
      </div>

      <div class="Amount_available_container big">
        <h5 class="small_title secondary light">Available:</h5>
        <h6 class="light">&#8358;${orderItem.amount}</h6>
      </div>

      <div class="Limit_container big">
        <h5 class="small_title secondary light">Limit:</h5>
        <h6 class="light">£${orderItem.minimum_limit} - £${orderItem.maximum_limit}</h6>
      </div>

      <div class="Buy_container big">
        <button class="filled-btn js_buy_dash_btn" id="${orderItem.ad_id}"><h6 id="${orderItem.ad_id}">${buttonCurrency}</h6></button>
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
          <h3>${orderItem.rate}</h3>NGN
        </div>

        <div class="Amount_available_container">
          <h5 class="small_title secondary light">Available:</h5>
          <h5 class="light">&#8358;${orderItem.amount}</h5>
        </div>

        <div class="Limit_container">
          <h5 class="small_title secondary light">Limit:</h5>
          <h5 class="light">£${orderItem.minimum_limit} - £${orderItem.maximum_limit}</h5>
        </div>

      </div>

      <div class="right_row">

        <div class="Buy_container">
          <button class="filled-btn js_buy_dash_btn" id="${orderItem.ad_id}"><h5 id="${orderItem.ad_id}">${buttonCurrency}</h5></button>
        </div>

      </div>
      
    </div>


  `;

  return html;

}

function generateMoreDetailsHTML(matchingAds,currencyType, currencyTypeLetter, currencyTypeLetterP){

  const totalOrder = matchingAds.user.buy_order + matchingAds.user.sell_order;
  let dp = matchingAds.user.display_picture === "http://example.com/path/to/display_picture.jpg" ? "avatar_1" : matchingAds.user.display_picture;

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
            <h4>${matchingAds.user.username}</h4>
            <img src="${verified}" alt="">
          </div>

          <div class="more_info_popup_text_down">
            <h4 class="secondary">${calculateTotalOrder(matchingAds)} orders | ${calculateCompleteOrder(matchingAds,totalOrder)}% completion</h4>
          </div>
        </div>

      </div>

      <div class="more_info_popup_left_middle">

        <div class="more_info_popup_verification">
          <h4 class="secondary">Verification level</h4>
          <h4>${verifyType(matchingAds)}</h4>
        </div>

        <div class="more_info_popup_time_limit">
          <h4 class="secondary">Payment Time Limit</h4>
          <h4>${matchingAds.time_limit} minutes</h4>
        </div>

        <div class="more_info_popup_amount">
          <h4 class="secondary">Available Amount</h4>
          <h4>${monitizeNumber(matchingAds.amount)} ${currencyTypeLetter}</h4>
        </div>

      </div>
      
      <div class="more_info_popup_left_bottom">
        <h4>Seller's Terms(Read Carefully)</h4>
        <h4 class="secondary">${matchingAds.exchange_terms}</h4>
      </div>
    </div>

    <div class="more_info_popup_right">
      <h4>Rate: <b>${(matchingAds.rate)} NGN</b></h4>

      <form action="">

        <Label><h4>I want to pay:</h4></Label>
        <div class="input_money js_input_money" style="margin-bottom: 0px;width: 100%;">
          <input type="number" placeholder="0.00" class="js_send_amount" style="outline: none;">
          <h4>${currencyTypeLetterP}</h4>
        </div>
        <h5 class="light js_limit_value" style="margin-bottom: 35px;">Limits ${currencyType}${matchingAds.minimum_limit} - ${currencyType}${matchingAds.maximum_limit}</h5>

        <Label><h4>I will receive:</h4></Label>
        <div class="input_money" style="width: 100%;">
          <input type="text" placeholder="0.00" readonly class="js_receive_amount">
          <h4>${currencyTypeLetter}</h4>
        </div>
        
      </form>

      <div class="more_info_popup_button">
        <button class="outlined-btn" id="cancelBtn"><h5>Cancel</h5></button>
        <a><button style="width: 100%;" class="filled-btn js_buy_order_btn" id="${matchingAds.ad_id}"><h5>Buy ${currencyTypeLetter}</h5></button></a>
      </div>

      
    </div>

  `;
  moreEl.innerHTML = html;
}

// Render pagination
function renderPagination(totalItems, type){
  const totalPages = Math.ceil(totalItems/itemsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++){
    paginationHTML += 
    `
    <div class="page ${i === (type === "Pounds" ?  currentPagePounds :currentPageNaira) ? "filled_page" : "page"}" data-page="${i}">
    <h5 class="light">${i}</h5>
    </div>

    `;
  }
  const paginationContainer = type === "Pounds" ?
  document.querySelector(".buyGBP .pagination_no"):
  document.querySelector(".buyNGN .pagination_no");

  paginationContainer.innerHTML = paginationHTML;
  addPaginationEventListeners(type);
}

function addPaginationEventListeners(type){
  document.querySelectorAll(type === "Pounds" ? ".buyGBP .pagination_no .page" :".buyNGN .pagination_no .page").forEach((pageEl)=>{
    pageEl.addEventListener("click", (e)=>{
      if(type === "Pounds"){
        currentPagePounds = parseInt(e.target.closest(".page").dataset.page);
        filteredPoundsAds(newData);
      }else{
        currentPageNaira = parseInt(e.target.closest(".page").dataset.page);
        filteredNairaAds(newData);
      }
    
    });
  });

  const prevBtn = type === "Pounds" ? document.querySelector(".buyGBP #prevPages") : document.querySelector(".buyNGN #prevPages");

  const nextBtn = type === "Pounds" ? document.querySelector(".buyGBP #nextPages") : document.querySelector(".buyNGN #nextPages");

  prevBtn.addEventListener("click", ()=>{
    if(type === "Pounds" && currentPagePounds > 1){
      currentPagePounds--;
      filteredPoundsAds(newData);
    }else if (type === "Naira" && currentPageNaira > 1){
      currentPageNaira--;
      filteredNairaAds(newData);
    }
  });

  nextBtn.addEventListener("click", ()=>{
    const totalPages = Math.ceil((type === "Pounds" ? newData.filter(ads = ads.type.toLowerCase() === "pounds"): newData).length / itemsPerPage);
    if(type === "Pounds" && currentPagePounds < totalPages){
      currentPagePounds++;
      filteredPoundsAds(newData);
    }else if (type === "Naira" && currentPageNaira < totalPages){
      currentPageNaira++;
      filteredNairaAds(newData);
    }
  });
}

function cancelPopup(){
  const cancelBtn = document.getElementById("cancelBtn");
  cancelBtn.addEventListener("click", ()=>{
    overlay.style.display = "none";
    moreEl.style.display = "none";
  });

}

function covertInputtedCurrency(convertPounds, matchingAds){
  const payEl = document.querySelector(".js_send_amount");
  const receiveEl = document.querySelector(".js_receive_amount");
  const payInput = document.querySelector(".js_input_money");
  const limitEl = document.querySelector(".js_limit_value");

  payEl.addEventListener("input", (e)=>{

    const inputValue = (Number(e.target.value));

    if(inputValue === 0){
      payInput.classList.remove("js_input_money_color");
      limitEl.classList.remove("js_limit_value_color");
    }else if(inputValue < matchingAds.minimum_limit || inputValue > matchingAds.maximum_limit){
      payInput.classList.add("js_input_money_color");
      limitEl.classList.add("js_limit_value_color");
    }else{
      payInput.classList.remove("js_input_money_color");
      limitEl.classList.remove("js_limit_value_color");
    }
    
    const convertedValue = convertPounds(inputValue, matchingAds)
    receiveEl.value = convertedValue;
  });

}

function sendOrderCreationRequest(adId,matchingAds){
  const payEl = document.querySelector(".js_send_amount");
  const ads = adId;
  const adsDetails = matchingAds;
  const selected_amount = Math.floor(payEl.value);

  const request ={
    action : "create_order",
    token : `Bearer ${token}`,
    ads_id : matchingAds.ad_id,
    selected_amount,
  }
  
  socket.send(JSON.stringify(request));
  
  socket.onmessage = function(e){
    const data = JSON.parse(e.data);
    console.log("Message for server:", data);
  
    if(data.status === "Order created successfully"){
    window.location.href = `../../../views/order.html?orderId=${data.order.order_id}`
  
    } else if(data.error === "You must complete or cancel your pending order before creating a new one."){
      let value = 'Kindly complete your pending order'
      popupDisplayHTML(value);
      
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
}