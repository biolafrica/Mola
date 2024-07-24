import{getUserProfile} from "../../Data/user.js";
import{monitizeNumber, convertNaira, convertPounds} from "../script/utils/money.js";
import { calculateTotalOrder, calculateCompleteOrder } from "./utils/metrics.js";
import { verifyType, verified } from "./utils/verification.js";
import {AuthenticateUser} from "../../Data/user.js";

const adsBtn = document.querySelector(".js_ads_btn");
const feedbackBtn = document.querySelector(".js_feedback_btn");
const adsEl = document.querySelector(".dashboard_body_ads_container");
const feedbackEl = document.querySelector(".dashboard_body_feedbacks_container");
const overlay = document.querySelector(".js_overlay");
const moreEl = document.querySelector(".js_more_info_popup");
const dashboardHeadEl = document.querySelector(".js_dashboard_head");
const adsListEl = document.querySelector(".js_row_head_body");
const token = localStorage.getItem("access");
const paginationNoEl = document.querySelector("#paginationNo");
const prevPagesEl = document.querySelector("#prevPages");
const nextPagesEl = document.querySelector("#nextPages");


let currentPage = 1;
const itemsPerPage = 3;
let adsData = [];
console.log(await getUserProfile(token));

adsBtn.addEventListener("click", ()=>{
  adsBtn.classList.remove("text-btn");
  adsBtn.classList.add("filled-btn");
  feedbackBtn.classList.remove("filled-btn");
  feedbackBtn.classList.add("text-btn");
  adsEl.style.display = "initial";
  feedbackEl.style.display= "none";

});

feedbackBtn.addEventListener("click", ()=>{
  feedbackBtn.classList.remove("text-btn");
  feedbackBtn.classList.add("filled-btn");
  adsBtn.classList.remove("filled-btn");
  adsBtn.classList.add("text-btn");
  adsEl.style.display = "none";
  feedbackEl.style.display= "initial";

});


async function renderDashboardHead(){
  const user = await getUserProfile(token);
  let verifiedStatus = user.verification === true ? "Advance Verification" : "Basic Verification";
  let totalOrder = user.sell_order + user.buy_order + user.cancelled_order;
  let successful = user.sell_order + user.buy_order;
  let completion = ((successful / totalOrder) * 100).toFixed(2);
  let formattedCompletion = successful === 0 || totalOrder === 0 ? "100" : completion;
  let totalFeedback = user.positive_feedback + user.negative_feedback;
  const date = new Date(user.registration_date);
  const options = {year: "numeric", month: "long"};
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  let html = 
  `
  <div class="dashboard_head_top js_dashboard_head_top">
    <div class="dashboard_head_top_dp">
      <img src="../public/avatar/avatar_13.svg" alt="">
    </div>

    <div class="dashboard_head_top_text">
      <h3>${user.username}</h3>

      <div class="dashboard_head_top_text_middle">
        <img src="../public/icons/Date range.svg" alt="">
        <h4>Joined ${formattedDate}</h4>
      </div>

      <div class="dashboard_head_top_text_bottom">
        <h4>${verifiedStatus}</h4>
        <img src="../public/icons/Check Mark.svg" alt="">
      </div>
    </div>
  </div>

  <div class="dasboard_head_bottom js_dasboard_head_bottom">

    <div class="dasboard_head_bottom_top">

      <div class="dasboard_head_bottom_top_left">
        <div class="all_trades_container">
          <h4 class="secondary">All Trades</h4>
          <div class="all_tardes_metrics">
            <h2 class="dashboard_metrics_big">${totalOrder}</h2>
            <h4 class="dashboard_metrics_small">${totalOrder}</h4>
            <h4>Buy <b>${user.buy_order}</b> | Sell <b>${user.sell_order}</b></h4>
          </div>
        </div>

        <div class="completion_rate_container">
          <h4 class="secondary">Completion Rate</h4>
          <div class="completion_rate_metrics">
            <h2 class="dashboard_metrics_big">${formattedCompletion}%</h2>
            <h4 class="dashboard_metrics_small">${formattedCompletion}%</h4>
          </div>

        </div>
      </div>

      <div class="dasboard_head_bottom_top_right">
        <div class="positive_feedbacks_container">
          <h4 class="secondary">Feedbacks</h4>
          <div class="all_feedbacks_metrics">
            <h2 class="dashboard_metrics_big">${totalFeedback}</h2>
            <h4 class="dashboard_metrics_small">${totalFeedback}</h4>
            <h4>Positive <b>${user.positive_feedback}</b> | Negative <b>${user.negative_feedback}</b></h4>
          </div>

        </div>

      </div>

    </div>

  </div>
  `;
  dashboardHeadEl.innerHTML = html;

}

async function getAllAds(){
  try {
    const response = await fetch("http://127.0.0.1:8000/api/ads", {
      method : "GET",
      headers : {
        'Authorization' : `Bearer ${token}`,
        "Content-Type" : "application/json"
      }
    });
  
    const data = await response.json();
    console.log(data);
    adsData = data;
    renderAds(data);
  
    
  } catch (error) {
    console.log(error);
    
  }
  
}

getAllAds();

function renderAds(data){
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);

  let adsHTML = "";

  paginatedData.forEach((dataItem)=>{

    if(dataItem.status === "active"){
      const type =  dataItem.type === "Pounds" ? "GBP" : "NGN";
      const amountCurrency = dataItem.type === "Pounds" ? "£" : "&#8358;";
      const limitCurrency = dataItem.type === "Pounds" ? "&#8358;" : "£";

      adsHTML += 
      `
        <div class="row_head">
          
          <div class="seller_container big">
            <div class="seller_container_image seller_dashboard">
              <img src="../public/icons/Flag circle.svg" alt="">
              <h4><b>${type}</b></h4>
            </div>
          </div>

          <div class="rate_container big">
            <h5 class="small_title secondary">Rate:</h5>
            <h4>${monitizeNumber(dataItem.rate)}</h4>NGN
          </div>

          <div class="Amount_available_container big">
            <h5 class="small_title secondary">Available:</h5>
            <h6>${amountCurrency}${monitizeNumber(dataItem.amount)}</h6>
          </div>

          <div class="Limit_container big">
            <h5 class="small_title secondary">Limit:</h5>
            <h6>${limitCurrency}${monitizeNumber(dataItem.minimum_limit)} - ${limitCurrency}${monitizeNumber(dataItem.maximum_limit)}</h6>
          </div>

          <div class="Buy_container big">
            <button class="filled-btn js_buy_dash_btn" id="${dataItem.ad_id}"><h6 id="${dataItem.ad_id}">BUY ${type}</h6></button>
          </div>

          <!--for small and medium screen responsivenes-->
          <div class="left_row">
            <div class="seller_container">

              <div class="seller_container_image seller_dashboard">
                <img src="../public/icons/Flag circle.svg" alt="">
                <h4><b>${type}</b></h4>
              </div>

            </div>

            <div class="rate_container">
              <h5 class="small_title secondary">Rate:</h5>
              <h3>${monitizeNumber(dataItem.rate)}</h3>NGN
            </div>

            <div class="Amount_available_container">
              <h5 class="small_title secondary">Available:</h5>
              <h5>${amountCurrency}${monitizeNumber(dataItem.amount)}</h5>
            </div>

            <div class="Limit_container">
              <h5 class="small_title secondary">Limit:</h>
              <h5>${limitCurrency}${monitizeNumber(dataItem.minimum_limit)} - ${limitCurrency}${monitizeNumber(dataItem.maximum_limit)} GBP</h5>
            </div>

          </div>

          <div class="right_row">

            <div class="Buy_container">
              <button class="filled-btn js_buy_dash_btn" id="${dataItem.ad_id}"><h5 id="${dataItem.ad_id}">BUY ${type}</h5></button>
            </div>

          </div>
          
        </div>

      `;

    };
    adsListEl.innerHTML = adsHTML;
    renderPagination(data.length);

    document.querySelectorAll(".js_buy_dash_btn").forEach((btn)=>{
      btn.addEventListener("click", async(e)=>{
        const isAuthenticated = await AuthenticateUser(token);
        if(!isAuthenticated){
          return;
        };
        overlay.style.display = "initial";
        moreEl.style.display = "flex";
        const orderId = e.target.id;
        const orderType = e.target.textContent;

        let matchingAds = {};
        data.forEach((dataItem)=>{
          if (dataItem.ad_id === orderId){
            matchingAds = dataItem;
          }

        });
        
        const totalOrder = matchingAds.user.buy_order + matchingAds.user.sell_order;
        let dp = matchingAds.user.display_picture === "http://example.com/path/to/display_picture.jpg" ? "avatar_1" : "avatar_8";
        const limitCurrency = orderType === "BUY NGN" ? "£" : "&#8358;";
        const payCurrency = orderType === "BUY NGN" ? "GBP" : "NGN";
        const receiveCurrency = orderType === "BUY NGN" ? "NGN" : "GBP";
    

        moreEl.innerHTML = 
        `
          <div class="more_info_popup_left">
            <div class="more_info_popup_left_top">
  
              <div class="more_info_popup_image">
                <img src="../public/avatar/${dp}.svg" alt="">
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
                <h4>${monitizeNumber(matchingAds.amount)} ${receiveCurrency}</h4>
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
                <h4>${payCurrency}</h4>
              </div>
              <h5 class="light js_limit_value" style="margin-bottom: 35px;">Limits ${limitCurrency}${matchingAds.minimum_limit} - ${limitCurrency}${matchingAds.maximum_limit}</h5>
  
              <Label><h4>I will receive:</h4></Label>
              <div class="input_money" style="width: 100%;">
                <input type="text" placeholder="0.00" readonly class="js_receive_amount">
                <h4>${receiveCurrency}</h4>
              </div>
              
            </form>
  
            <div class="more_info_popup_button">
              <button class="outlined-btn" id="cancelBtn"><h5>Cancel</h5></button>
              <a><button style="width: 100%;" class="filled-btn js_buy_order_btn" id="${matchingAds.ad_id}"><h5>Buy ${receiveCurrency}</h5></button></a>
            </div>
  
            
          </div>
  
        `;

        const cancelBtn = document.getElementById("cancelBtn");
        cancelBtn.addEventListener("click", ()=>{
          overlay.style.display = "none";
          moreEl.style.display = "none";
        });

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

          let convertedValue = orderType === "BUY NGN" ? convertNaira(inputValue,matchingAds) : convertPounds(inputValue,matchingAds);
         
          receiveEl.value = convertedValue;
  
        });

        document.querySelector(".js_buy_order_btn").addEventListener("click", async()=>{
          const ads = orderId;
          const adsDetails = matchingAds;
          const selected_amount = payEl.value;
          const errorMessageEl = document.querySelector(".js_error_popup");
  
          try {
            const response = await fetch("http://127.0.0.1:8000/api/orders/", {
              method : "POST",
              headers : {
                "Authorization" : `Bearer ${token}`,
                "content-Type" : "application/json",
              },
  
              body : JSON.stringify({ads_id:matchingAds.ad_id, selected_amount})
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
              window.location.href = `../../views/order.html?orderId=${data.order_id}`;
            }
            
          } catch (error) {
            console.log(error);
            
          };
          
        })
      
      });


      
    })

  })

}

function renderPagination(totalItems){
  const totalPages = Math.ceil(totalItems/itemsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++){
    paginationHTML += 
    `
    <div class="page ${i === currentPage ? "filled_page" : ""}" data-page="${i}">
    <h5 class="light">${i}</h5>
    </div>

    `;
  }
  paginationNoEl.innerHTML = paginationHTML;
  addPaginationEventListeners();
};

function addPaginationEventListeners(){
  document.querySelectorAll(".pagination_no .page").forEach((pageEl)=>{
    pageEl.addEventListener("click", (e)=>{
      currentPage = parseInt(e.target.closest(".page").dataset.page);
      renderAds(adsData);
    });
  });

  prevPagesEl.addEventListener("click", ()=>{
    if(currentPage > 1){
      currentPage--;
      renderAds(adsData);
    }
  });

  nextPagesEl.addEventListener("click", ()=>{
    const totalPages = Math.ceil(adsData.length / itemsPerPage);
    if(currentPage < totalPages){
      currentPage++;
      renderAds(adsData);
    }
  });
}


renderDashboardHead();
