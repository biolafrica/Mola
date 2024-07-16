export const calculateTotalOrder = (orderItem)=>{
  let totalOrder = orderItem.user.buy_order + orderItem.user.sell_order;
  return totalOrder;

};


export const calculateCompleteOrder = (orderItem, totalOrder)=>{
  let completedOrder = (((orderItem.user.buy_order + orderItem.user.sell_order)/totalOrder) * 100).toFixed(0);
  return completedOrder;

}

export const calculateOrderTotal = (data)=>{
  let totalOrder = data.seller.buy_order + data.seller.sell_order;
  return totalOrder;
};

export const calculateOrderCompletion = (data, totalOrder)=>{
  let completedOrder = (((data.seller.buy_order + data.seller.sell_order)/totalOrder) * 100).toFixed(0);
  return completedOrder;

};



