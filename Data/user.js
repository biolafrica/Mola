export const users = [{
  id: "user_1",
  dp: "avatar_1",
  username: "Biolafrica",
  buyOrder: 5,
  sellOrder: 8,
  cancelledOrder: 0,
  basicVerification: true,
  advanceVerification:false,
},
{
  id: "user_2",
  dp: "avatar_3",
  username: "Susu",
  buyOrder: 33,
  sellOrder: 22,
  cancelledOrder: 0,
  basicVerification: true,
  advanceVerification:true,

},
{
  id: "user_2",
  dp: "avatar_4",
  username: "Asake",
  buyOrder: 65,
  sellOrder: 2,
  cancelledOrder: 1,
  basicVerification: false,
  advanceVerification:false,
},
{
  id: "user_3",
  dp: "avatar_2",
  username: "Baddo",
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

export async function getUserProfile(token){
  try {
    const response = await fetch("http://127.0.0.1:8000/api/user/", {
      method : "GET",
      headers : {"Authorization" : `Bearer ${token}`}
    });

    const data = await response.json();
    if(response.ok){
      return data;
    } else {
      console.error("Failed to load user profile", data);
      return null;
    }  
    
  } catch (error) {
    console.error("Error fetching user profile", error);
    return null;
  }

}

export async function AuthenticateUser(token){
  if(!token){
    location.assign("../../../views/login.html");
    return false;
  }
  const userProfile = await getUserProfile(token);
  if(!userProfile){
    location.assign("../../../views/login.html");
    return false;
  }

  return true;
}

export async function checkUser(token, value, valueI){
  if(!token){
    return false;
  }
  const userProfile = await getUserProfile(token);
  if(!userProfile){
    return false;
  }
  return true;
  

}