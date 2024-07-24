import{getUserProfile} from "../../Data/user.js";
import{monitizeNumber} from "../script/utils/money.js";

const adsBtn = document.querySelector(".js_ads_btn");
const feedbackBtn = document.querySelector(".js_feedback_btn");
const adsEl = document.querySelector(".dashboard_body_ads_container");
const feedbackEl = document.querySelector(".dashboard_body_feedbacks_container");
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
            <h4 class="small_title secondary">Rate:</h4>
            <h3>${monitizeNumber(dataItem.rate)}</h3>NGN
          </div>

          <div class="Amount_available_container big">
            <h4 class="small_title secondary">Available:</h4>
            <h4>${amountCurrency}${monitizeNumber(dataItem.amount)}</h4>
          </div>

          <div class="Limit_container big">
            <h4 class="small_title secondary">Limit:</h4>
            <h4>${limitCurrency}${monitizeNumber(dataItem.minimum_limit)} - ${limitCurrency}${monitizeNumber(dataItem.maximum_limit)}</h4>
          </div>

          <div class="Buy_container big">
            <button class="filled-btn js_buy_dash_btn"><h5>BUY ${type}</h5></button>
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
              <h4 class="small_title secondary">Rate:</h4>
              <h3>${monitizeNumber(dataItem.rate)}</h3>NGN
            </div>

            <div class="Amount_available_container">
              <h4 class="small_title secondary">Available:</h4>
              <h4>${amountCurrency}${monitizeNumber(dataItem.amount)}</h4>
            </div>

            <div class="Limit_container">
              <h4 class="small_title secondary">Limit:</h4>
              <h4>${limitCurrency}${monitizeNumber(dataItem.minimum_limit)} - ${limitCurrency}${monitizeNumber(dataItem.maximum_limit)} GBP</h4>
            </div>

          </div>

          <div class="right_row">

            <div class="Buy_container">
              <button class="filled-btn js_buy_dash_btn"><h5>BUY ${type}</h5></button>
            </div>

          </div>
          
        </div>

      `;

    };
    adsListEl.innerHTML = adsHTML;
    renderPagination(data.length);
  });



};

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



renderFeedback();
renderDashboardHead();
