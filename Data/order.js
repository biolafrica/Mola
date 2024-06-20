export let poundsOrder = [];
export let nairaOrder = [];

class Order {
  id;
  rate;
  amount;
  minimumOrder;
  maximumOrder;
  exchangeTerms;
  type;
  userId;

  constructor(orderItem){
    this.id = orderItem.id;
    this.rate = orderItem.rate;
    this.amount = orderItem.amount;
    this.minimumOrder = orderItem.minimumOrder;
    this.maximumOrder = orderItem.maximumOrder;
    this.exchangeTerms= orderItem.exchangeTerms;
    this.type= orderItem.type;
    this.userId = orderItem.userId;
  }

}


export const orders = [{
  id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  rate: 190000,
  amount: 20000000,
  minimumOrder: 3000,
  maximumOrder: 10500,
  type: "NGN",
  exchangeTerms: "Kindly make sure you made the transfer before the time countdown is almot over",
  userId: "user_1",
},
{
  id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  rate: 191000,
  amount: 50000000,
  minimumOrder: 10000,
  maximumOrder: 16000,
  type: "NGN",
  exchangeTerms: "No fake transfer please",
  userId: "user_2",
},
{
  id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
  rate: 190500,
  amount: 5000000,
  minimumOrder: 500,
  maximumOrder: 2000,
  type: "NGN",
  exchangeTerms: "",
  userId: "user_3",
},
{
  id: "54e0eccd-8f36-462b-b68a-8182611d9add",
  rate: 190000,
  amount: 9000000,
  minimumOrder: 2000,
  maximumOrder: 1000,
  type: "NGN",
  exchangeTerms: "Kindly drop a feedback after successful purchase, Thank you",
  userId: "user_4",
},
{
  id: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
  rate: 198000,
  amount: 10000,
  minimumOrder: 5000000,
  maximumOrder: 7000000,
  type: "GBP",
  exchangeTerms: "kindly transfer from your direct account with your full name as description",
  userId: "user_5",
},
{
  id: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
  rate: 198500,
  amount: 50000,
  minimumOrder: 10000000,
  maximumOrder: 20000000,
  type: "GBP",
  exchangeTerms: "kindly make sure you transferred from your direct account ",
  userId: "user_6",
},
{
  id: "dd82ca78-a18b-4e2a-9250-31e67412f98d",
  rate: 199000,
  amount: 20000,
  minimumOrder: 15000000,
  maximumOrder: 20000000,
  type: "GBP",
  exchangeTerms: "please transfer the exact ammount to avoid transaction delay ",
  userId: "user_7",
},
{
  id: "77919bbe-0e56-475b-adde-4f24dfed3a04",
  rate: 199000,
  amount: 5000,
  minimumOrder: 500000,
  maximumOrder: 7000000,
  type: "GBP",
  exchangeTerms: "",
  userId: "user_4",
}];

orders.forEach((orderItem)=>{
  if(orderItem.type === "NGN"){
    nairaOrder.push(orderItem);

  } else if (orderItem.type === "GBP"){
    poundsOrder.push(orderItem)

  }

})

poundsOrder.map((poundsOrderItem)=>{
  return new Order(poundsOrderItem);
})

nairaOrder.map((nairaOrderItem)=>{
  return new Order (nairaOrderItem);
})



export const poundsMatchOrder = (orderId)=>{
  let matchingOrder = {};
  poundsOrder.forEach((orderItem)=>{
    if(orderId === orderItem.id){
      matchingOrder = orderItem;
    }

  })

  return matchingOrder;
}

export const nairaMatchOrder = (orderId)=>{
  let matchingOrder = {};
  nairaOrder.forEach((orderItem)=>{
    if(orderId === orderItem.id){
      matchingOrder = orderItem;
    }

  })

  return matchingOrder;
}


