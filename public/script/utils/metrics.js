export const calculateTotalOrder = (matchingUser)=>{
  let totalOrder = matchingUser.buyOrder + matchingUser.sellOrder + matchingUser.cancelledOrder;
  return totalOrder;

};

export const calculateCompleteOrder = (matchingUser, totalOrder)=>{
  let completedOrder = (((matchingUser.buyOrder + matchingUser.sellOrder)/totalOrder) * 100).toFixed(0);
  return completedOrder;

}



