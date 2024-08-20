import{getUserProfile} from "../../Data/user.js";
import{monitizeNumber} from "../script/utils/money.js";
import {convertDateAndTime} from "../../Data/time.js";
import { renderHeader } from "./script.js";

const token = localStorage.getItem("access");
const statusBtns = document.querySelectorAll(".history_status_filter button");
const activeStatusBtns = document.querySelectorAll(".processing_status_filter button");
const orderTypeSelect = document.querySelector("#order-type");
const activeBtn = document.querySelector('.js_active_order');
const completedBtn = document.querySelector('.js_complete_order');
const activeEl = document.querySelector(".js_processing_order_container");
const completedEl = document.querySelector(".js_completed_order_container");

//buttons for active and completed orders
activeBtn.addEventListener("click", ()=>{
  activeBtn.classList.remove("ord_button");
  activeBtn.classList.add("line_button");
  completedBtn.classList.remove("line_button");
  completedBtn.classList.add("ord_button");
  activeBtn.classList.remove("secondary");
  completedBtn.classList.add("secondary");
  activeEl.style.display = "initial";
  completedEl.style.display = "none";
  
});

completedBtn.addEventListener("click", ()=>{
  completedBtn.classList.add("line_button");
  completedBtn.classList.remove("ord_button");
  activeBtn.classList.remove("line_button");
  activeBtn.classList.add("ord_button");
  completedBtn.classList.remove("secondary");
  activeBtn.classList.add("secondary");
  activeEl.style.display = "none";
  completedEl.style.display = "initial";
})



let ordersData = [];
let currentPagePending = 1;
let currentPageCompleted = 1;
const itemsPerPage = 3;
console.log(await getUserProfile(token));

// Fetch order from the backend 
async function renderOrder(){
  try {
    const response = await fetch ("http://127.0.0.1:8000/api/all-orders/", 
    {
      method : 'GET',
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type" : "application/json"
      }
    });
    const data = await response.json();
    ordersData = data;
    filterPendingOrders(()=> true);
    filterCompletedOrders();
    console.log(data)
    
  } catch (error) {
    console.log(error);
    
  }
}

renderOrder();

// filter completed order base on selected status and type
async function filterCompletedOrders(){
  const user = await getUserProfile(token);
  const selectedStatusEl = document.querySelector(".history_status_filter .filled-btn h6");
  const selectedStatus = selectedStatusEl ? selectedStatusEl.textContent.toLowerCase(): "all";
  const selectedType = orderTypeSelect.value;
  

  const filteredOrders = ordersData.filter(order => {
    let type = user.username === order.seller.username ? "sell" : "buy";
    const matchesStatus = selectedStatus === "all" || order.status.toLowerCase() === selectedStatus;
    const matchesType = selectedType === "all" || type.toLowerCase()=== selectedType;
    return matchesStatus && matchesType;
  })
  renderCompletedOrder(filteredOrders);
};

function filterPendingOrders(condition){
  const filteredOrders = ordersData.filter(order => {
    return order.status.toLowerCase() === "pending" && condition(order);
  });
  renderPendingOrder(filteredOrders);
}


// buttons event listener for filtering
statusBtns.forEach((button)=>{
  button.addEventListener("click", (e)=>{
    statusBtns.forEach((btn) =>{ 
      btn.classList.remove("filled-btn");
      btn.classList.add("text-btn");
    
    });
    button.classList.remove("text-btn");
    button.classList.add("filled-btn");
    filterCompletedOrders()
  });
});

activeStatusBtns.forEach((button)=>{
  button.addEventListener("click", (e)=>{
    activeStatusBtns.forEach((btn) =>{ 
      btn.classList.remove("filled-btn");
      btn.classList.add("text-btn");
    
    });
    button.classList.remove("text-btn");
    button.classList.add("filled-btn");

    if (button.textContent === "All"){
      filterPendingOrders(()=> true);
    }else if (button.textContent === "Unpaid"){
      filterPendingOrders(order => !order.buyer_confirmed);
    }else{
      filterPendingOrders(order => order.buyer_confirmed);
    }
  });
});

orderTypeSelect.addEventListener("change", filterCompletedOrders);


// render order data to the page dynamically 
async function renderCompletedOrder(ordersData){
  const user = await getUserProfile(token);
  const start = (currentPageCompleted - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = ordersData.slice(start, end);

  let orderHTML = '';
  if(paginatedData.length === 0){
    let html = 
    `
      <div class="empty_container">
        <img src="../public/icons/Hourglass empty.svg" alt="">
        <h4>No order</h4>
      </div>

    `;
    document.querySelector(".js_completed_table").innerHTML = html;
  }else{

    paginatedData.forEach((dataItem)=>{
      orderHTML = generateOrderHTML(dataItem, user,orderHTML);
    
    });
  
    document.querySelector(".js_completed_table").innerHTML = orderHTML;
  }
};

async function renderPendingOrder(ordersData){
  const user = await getUserProfile(token);
  const start = (currentPagePending - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = ordersData.slice(start, end);

  let orderHTML = '';
  if(paginatedData.length === 0){
    let html = 
    `
      <div class="empty_container">
        <img src="../public/icons/Hourglass empty.svg" alt="">
        <h4>No pending order</h4>
      </div>

    `;
    document.querySelector(".js_pending_table").innerHTML = html;
    renderPagination(ordersData.length, 'pending');
   
  }else{

    paginatedData.forEach((dataItem)=>{
      orderHTML = generateOrderHTML(dataItem, user,orderHTML);
    });
    document.querySelector(".js_pending_table").innerHTML = orderHTML;
    renderPagination(ordersData.length, 'pending');
  }
}

// render pagination
function renderPagination(totalItems, type){
  const totalPages = Math.ceil(totalItems/itemsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++){
    paginationHTML += 
    `
    <div class="page ${i === (type === "pending" ?  currentPagePending :currentPageCompleted) ? "filled_page" : "page"}" data-page="${i}">
    <h5 class="light">${i}</h5>
    </div>

    `;
  }
  const paginationContainer = type === "pending" ?
  document.querySelector(".processing_order_container .pagination_no"):
  document.querySelector(".completed_order_container .pagination_no");

  paginationContainer.innerHTML = paginationHTML;
  addPaginationEventListeners(type);
}

function addPaginationEventListeners(type){
  document.querySelectorAll(type === "pending" ? ".processing_order_container .pagination_no .page" :".completed_order_container .pagination_no .page").forEach((pageEl)=>{
    pageEl.addEventListener("click", (e)=>{
      if(type === "pending"){
        currentPagePending = parseInt(e.target.closest(".page").dataset.page);
        filterPendingOrders(()=> true);
      }else{
        currentPageCompleted = parseInt(e.target.closest(".page").dataset.page);
        filterCompletedOrders();
      }
    
    });
  });

  const prevBtn = type === "pending" ? document.querySelector(".processing_order_container #prevPages") : document.querySelector(".completed_order_container #prevPages");

  const nextBtn = type === "pending" ? document.querySelector(".processing_order_container #nextPages") : document.querySelector(".completed_order_container #nextPages");

  prevBtn.addEventListener("click", ()=>{
    if(type === "pending" && currentPagePending > 1){
      currentPagePending--;
      filterPendingOrders(()=> true);
    }else if (type === "completed" && currentPageCompleted > 1){
      currentPageCompleted--;
      filterCompletedOrders
    }
  });

  nextBtn.addEventListener("click", ()=>{
    const totalPages = Math.ceil((type === "pending" ? ordersData.filter(order = order.status.toLowerCase() === "pending"): ordersData).length / itemsPerPage);
    if(type === "pending" && currentPagePending < totalPages){
      currentPagePending++;
      filterPendingOrders(()=> true);
    }else if (type === "completed" && currentPageCompleted < totalPages){
      currentPageCompleted++;
      filterCompletedOrders();
    }
  });
}

function generateOrderHTML(dataItem, user,orderHTML){
  const type = dataItem.ads.type === "Pounds" ? 'GBP' : "NGN";
  const time = convertDateAndTime(dataItem.date_and_time);
  const sentValue = user.username === dataItem.seller.username ? dataItem.selected_amount : dataItem.receiving_amount;

  const receivedValue = user.username === dataItem.seller.username ? dataItem.receiving_amount : dataItem.selected_amount;

  const counterpart = user.username === dataItem.seller.username ? dataItem.buyer.username : dataItem.seller.username;

  const sentCurrency =
    dataItem.ads.type === "Pounds" && user.username !== dataItem.seller.username ? "&#8358;":
    dataItem.ads.type === "Pounds" && user.username === dataItem.seller.username ? "£":
    dataItem.ads.type === "Naira" && user.username !== dataItem.seller.username ? "£": "&#8358;";

  const receiveCurrency =
    dataItem.ads.type === "Pounds" && user.username !== dataItem.seller.username ? "£":
    dataItem.ads.type === "Pounds" && user.username === dataItem.seller.username ? "&#8358;":
    dataItem.ads.type === "Naira" && user.username !== dataItem.seller.username ? "&#8358;": "£";


  orderHTML += 
  `
    <a class="history_table_body" href="../../views/order.html?orderId=${dataItem.order_id}">

      <div class="date_column">

        <div class="Title">
          <h6><b>Buy(${type})</b></h6> 
          <h6>${time}</h6> 
        </div>

      </div>

      <div class="sent_column">

        <div class="Title">
          <h6 class="title_s_name">Sent</h6> 
          <h6 style="margin-bottom: 20px;">${sentCurrency}${monitizeNumber(sentValue)}</h6> 
        </div>

        <div class="Title"> 
          <h6 class="title_name">Rate</h6> 
          <h6>&#8358;${dataItem.ads.rate}</h6>
        </div>

      </div>

      <div class="receive_column">
        <div class="Title"> 
          <h6 class="title_name">Received</h6> 
          <h6>${receiveCurrency}${monitizeNumber(receivedValue)}</h6> 
        </div>
      </div>

      <div class="counterparty_column">
        <div class="Title"> 
          <h6 class="title_name">Counterparty</h6> 
          <h6><b>${counterpart}</b></h6> 
        </div>
      </div>

      <div class="status_column">
        <div class="Title"> 
          <h6 class="title_name">Status</h6> 
          <h6>${dataItem.status}</h6> 
        </div>
      </div>

      <div class="orderID_column">
        <div class="Title"> 
          <h6 class="title_name">Order ID</h6> 
          <h6>${dataItem.order_id}</h6> 
        </div>
      </div>

    </a>

  `;
  return orderHTML;

}

renderHeader();