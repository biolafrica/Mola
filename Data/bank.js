export async function loadBanks(token){
  try {
    const response = await fetch("http://127.0.0.1:8000/api/banks/", {
      method : "GET",
      headers : {
        "Authorization" : `Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.ok){
      return data;
    } else {
      console.error("Failed to load banks", data);
      return [];
    }
    return data;
    
    
  } catch (error) {
    console.error("Error fetching banks", error);
    return [];
    
  }
 
}