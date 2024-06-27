import{getUserProfile} from "../../Data/user.js"

const adsBtn = document.querySelector(".js_ads_btn");
const feedbackBtn = document.querySelector(".js_feedback_btn");
const adsEl = document.querySelector(".dashboard_body_ads_container");
const feedbackEl = document.querySelector(".dashboard_body_feedbacks_container");
const dashboardHeadEl = document.querySelector(".js_dashboard_head");
const token = localStorage.getItem("access");

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

renderDashboardHead();
