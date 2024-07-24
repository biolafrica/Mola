import{getUserProfile} from "../../Data/user.js";
import {convertDateAndTime} from "../../Data/time.js";
import{monitizeNumber} from "../script/utils/money.js";

const adsListEl = document.querySelector(".js_history_table");
const currencyFilterEl = document.querySelector(".ads_currency_filter select");
const statusFilterEl = document.querySelector(".ads_status_filter select");
const token = localStorage.getItem("access");
const paginationNoEl = document.querySelector("#paginationNo");
const prevPagesEl = document.querySelector("#prevPages");
const nextPagesEl = document.querySelector("#nextPages");

let adsData = [];
let currentPage = 1;
const itemsPerPage = 3;
console.log(await getUserProfile(token));

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
    renderPage(data);
    
  } catch (error) {
    console.log(error);
    
  }
  
}

getAllAds();

function renderPage(data){
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);

  let adsHTML = "";

  paginatedData.forEach((dataItem)=>{
    const type = dataItem.type === "Pounds" ? "GBP" : "NGN";
    const sold = dataItem.amount - dataItem.remaining_amount;
    adsHTML += 
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
            <h6>N${monitizeNumber(dataItem.remaining_amount)}</h6> 
          </div>

          <div class="Title"> 
            <h6 class="title_name">Remaining Amount</h6> 
            <h6>N${monitizeNumber(sold)}</h6> 
          </div>

        </div>

        <div class="rate_column">

          <div class="Title">
            <h6 class="title_s_name">Rate</h6> 
            <h6>N${monitizeNumber(dataItem.rate)}</h6> 
          </div>

          <div class="Title"> 
            <h6 class="title_name">Limit</h6> 
            <h6>£${monitizeNumber(dataItem.minimum_limit)} - £${monitizeNumber(dataItem.maximum_limit)}</h6> 
          </div>

        </div>

        <div class="time_column">
          <div class="Title">
            <h6 class="title_s_name">Time Created</h6> 
            <h6>${convertDateAndTime(dataItem.date)}</h6> 
          </div>

          <div class="Title"> 
            <h6 class="title_name">Time Edited</h6> 
            <h6>${convertDateAndTime(dataItem.date)}</h6> 
          </div>
        </div>

        <div class="status_ads_column">
          <div class="Title"> 
            <h6 class="title_name">Status</h6> 
            <h6>${dataItem.status}</h6> 
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
    
  });

  adsListEl.innerHTML = adsHTML;
  renderPagination(data.length);

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
}

function addPaginationEventListeners(){
  document.querySelectorAll(".pagination_no .page").forEach((pageEl)=>{
    pageEl.addEventListener("click", (e)=>{
      currentPage = parseInt(e.target.closest(".page").dataset.page);
      filterAds();
    });
  });

  prevPagesEl.addEventListener("click", ()=>{
    if(currentPage > 1){
      currentPage--;
      filterAds();
    }
  });

  nextPagesEl.addEventListener("click", ()=>{
    const totalPages = Math.ceil(adsData.length / itemsPerPage);
    if(currentPage < totalPages){
      currentPage++;
      filterAds();
    }
  });
}

currencyFilterEl.addEventListener("change", filterAds);
statusFilterEl.addEventListener("change", filterAds);

function filterAds(){
  const currencyValue = currencyFilterEl.value;
  const statusValue = statusFilterEl.value;

  const filteredAds = adsData.filter(ad =>{
    const matchesCurrency = currencyValue === "all" || ad.type === currencyValue;
    const matchesStatus = statusValue === "all" || ad.status.toLowerCase() === statusValue.toLowerCase();
    return matchesCurrency && matchesStatus;
  });

  renderPage(filteredAds);
}
