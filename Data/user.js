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