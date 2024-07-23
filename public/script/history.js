import{getUserProfile} from "../../Data/user.js";
import{monitizeNumber} from "../script/utils/money.js";
import {convertDateAndTime} from "../../Data/time.js";

const token = localStorage.getItem("access");
const orderHistoryEl = document.querySelector(".js_history_table");
const statusBtns = document.querySelectorAll(".history_status_filter button");
const orderTypeSelect = document.querySelector("#order-type");

let ordersData = [];
console.log(await getUserProfile(token));

async function renderOrder(){
  try {
    const response = await fetch ("http://127.0.0.1:8000/api/seller/orders/", 
    {
      method : 'GET',
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type" : "application/json"
      }
    });
    const data = await response.json();
    ordersData = data;
    renderPage(data);
    console.log(data)
    
  } catch (error) {
    console.log(error);
    
  }
}

renderOrder();

async function filterOrders(){
  const user = await getUserProfile(token);
  const selectedStatusEl = document.querySelector(".history_status_filter .filled-btn h5");
  const selectedStatus = selectedStatusEl ? selectedStatusEl.textContent.toLowerCase(): "all";
  const selectedType = orderTypeSelect.value;
  

  const filteredOrders = ordersData.filter(order => {
    let type = user.username === order.seller.username ? "sell" : "buy";
    const matchesStatus = selectedStatus === "all" || order.status.toLowerCase() === selectedStatus;
    const matchesType = selectedType === "all" || type.toLowerCase()=== selectedType;
    return matchesStatus && matchesType;
  })
  renderPage(filteredOrders);
};

statusBtns.forEach((button)=>{
  button.addEventListener("click", (e)=>{
    statusBtns.forEach((btn) =>{ 
      btn.classList.remove("filled-btn");
      btn.classList.add("text-btn");
    
    });
    button.classList.remove("text-btn");
    button.classList.add("filled-btn");
    filterOrders();
  });
});

orderTypeSelect.addEventListener("change", filterOrders);

async function renderPage(data){
  const user = await getUserProfile(token);
  let orderHTML = '';

  data.forEach((dataItem)=>{
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


    let html = 
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
    orderHTML += html;
    
  });

  orderHistoryEl.innerHTML = orderHTML;


};