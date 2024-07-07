export let order = JSON.parse(localStorage.getItem("order")) || {};

export function addOrder(data){
  order = data;
  saveToStorage();

}

function saveToStorage(){
  localStorage.setItem("order", JSON.stringify(order));

}