const timeEl = document.querySelector(".js_order_timer");
const transferredBtn = document.querySelector(".js_transferred");
const cancelledBtn = document.querySelector(".js_cancelled")
let timeLeft = 900;
let intervalId;

function pad(value){
  return value > 9 ? value : "0" + value;
}

function renderTimer(){
  intervalId = setInterval(()=>{
    let min = Math.round(timeLeft / 60);
    let sec = timeLeft % 60;
  
    timeEl.innerHTML = `${pad(min)} : ${pad(sec)}`;
    timeLeft --
  }, 1000);

}
renderTimer();

transferredBtn.addEventListener("click", (()=>{
  timeReset();
 

}));



function timeReset (){
  clearInterval(intervalId);
  timeLeft = 900;
  min = Math.round(timeLeft/60);
  sec = timeLeft % 60;
  timeEl.innerHTML = `${pad(min)} : ${pad(sec)}`;

}