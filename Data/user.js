export const users = [{
  id: "user_1",
  dp: "avatar_1",
  username: "biolafrica",
  buyOrder: 5,
  sellOrder: 8,
  cancelledOrder: 0,
  basicVerification: true,
  advanceVerification:false,
},
{
  id: "user_2",
  dp: "avatar_3",
  username: "susu",
  buyOrder: 33,
  sellOrder: 22,
  cancelledOrder: 0,
  basicVerification: true,
  advanceVerification:true,

},
{
  id: "user_2",
  dp: "avatar_4",
  username: "asake",
  buyOrder: 65,
  sellOrder: 2,
  cancelledOrder: 1,
  basicVerification: false,
  advanceVerification:false,
},
{
  id: "user_3",
  dp: "avatar_2",
  username: "baddo",
  buyOrder: 45,
  sellOrder: 88,
  cancelledOrder: 0,
  basicVerification: false,
  advanceVerification:false,
},
{
  id: "user_4",
  dp: "avatar_5",
  username: "Ajibike",
  buyOrder: 52,
  sellOrder: 28,
  cancelledOrder: 5,
  basicVerification: true,
  advanceVerification:true,
},{
  id: "user_5",
  dp: "avatar_6",
  username: "Mr.Money",
  buyOrder: 15,
  sellOrder: 80,
  cancelledOrder: 0,
  basicVerification: true,
  advanceVerification:false,
},
{
  id: "user_6",
  dp: "avatar_7",
  username: "Ruger",
  buyOrder: 5,
  sellOrder: 80,
  cancelledOrder: 4,
  basicVerification: true,
  advanceVerification:true,
},
{
  id: "user_7",
  dp: "avatar_8",
  username: "Drey",
  buyOrder: 60,
  sellOrder: 8,
  cancelledOrder: 7,
  basicVerification: true,
  advanceVerification:true,
}];

export const matchUser = (orderItem)=>{
  let matchingUser = {};
  users.forEach((user)=>{
    if(orderItem.userId === user.id){
      matchingUser = user;
    }

  })

  return matchingUser;
}