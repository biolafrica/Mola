const token = localStorage.getItem("access");

async function getAllAds(){
  const response = await fetch("http://127.0.0.1:8000/api/all-ads", {
    method : "GET",
    headers : {
      'Authorization' : `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log(data);
}

getAllAds();