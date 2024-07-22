import{getUserProfile} from "../../Data/user.js";
import {convertDateAndTime} from "../../Data/time.js";

const adsListEl = document.querySelector(".js_history_table");
const token = localStorage.getItem("access");
console.log(await getUserProfile(token));


async function getAllAds(){
  const response = await fetch("http://127.0.0.1:8000/api/ads", {
    method : "GET",
    headers : {
      'Authorization' : `Bearer ${token}`,
      "Content-Type" : "application/json"
    }
  });

  const data = await response.json();
  console.log(data);
}

getAllAds();

function renderPage(data){
  data.forEach((dataItem)=>{
    const type = dataItem.type === "Pounds" ? "GBP" : "NGN";
    const sold = dataItem.amount - dataItem.remaining_amount;
    let html = 
    `
      <a class="ads_table_body" href="./adsdetails.html">
      
        <div class="ads_column">

          <div class="Title">
            <h6><b>Sell(${type})</b></h6> 
            <h6>${dataItem.ad_id}</h6> 
          </div>

        </div>

        <div class="amount_column">

          <div class="Title">
            <h6 class="title_s_name">Amount Available</h6> 
            <h6>N${dataItem.remaining_amount}</h6> 
          </div>

          <div class="Title"> 
            <h6 class="title_name">Remaining Amount</h6> 
            <h6>N${sold}</h6> 
          </div>

        </div>

        <div class="rate_column">

          <div class="Title">
            <h6 class="title_s_name">Rate</h6> 
            <h6>N${dataItem.rate}</h6> 
          </div>

          <div class="Title"> 
            <h6 class="title_name">Limit</h6> 
            <h6>£${dataItem.minimum_limit} - £${dataItem.maximum_limit}</h6> 
          </div>

        </div>

        <div class="time_column">
          <div class="Title">
            <h6 class="title_s_name">Time Created</h6> 
            <h6>2024-05-21 | 04:41</h6> 
          </div>

          <div class="Title"> 
            <h6 class="title_name">Time Edited</h6> 
            <h6>2024-05-21 | 04:41</h6> 
          </div>
        </div>

        <div class="status_ads_column">
          <div class="Title"> 
            <h6 class="title_name">Status</h6> 
            <h6>Active</h6> 
          </div>
        </div>

        <div class="action_column">
          <div class="Title"> 
            <h4 class="title_name">Action</h4>  
            <div>
              <img src="../public/icons/Remove red eye.svg" alt="">
              <img src="../public/icons/Mode edit.svg" alt="">
              <img src="../public/icons/Close small.svg" alt="">
            </div>
          </div>
        </div>

      </a>                                                       
    `;

  })

}