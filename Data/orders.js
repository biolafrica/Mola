export let order = JSON.parse(localStorage.getItem("order")) || [];

export function addOrder(data, product){
  order = [];
  order.push(data);
  order.push(product);
  saveToStorage();

}

function saveToStorage(){
  localStorage.setItem("order", JSON.stringify(order));

}