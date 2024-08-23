import { checkUser } from "../../Data/user.js";


const token = localStorage.getItem("access");


export async function renderHeader(){
  let valueI = 
  `
    <a class="order_header_container" href="/views/history.html" >
      <div class="notification">1</div>
      <img src="../public/icons/Article.png" alt="order icon">
      <h5 class="order_name">Order</h5>
    </a>

    <div class="hamburger js_hamburger">
      <img src="../public/icons/Menu.png" alt="menu icon">
    </div>

    <div class="close js_close">
      <img src="../public/icons/Close.png" alt="close icon">
    </div>

  `;

  let value = 
  ` <div class="landing_new_user_container">
      <a href="./views/login.html">
        <button class="text-btn"><h5>Log In</h5></button>
      </a>

      <a href="./views/register.html">
        <button class="filled-btn"><h5>Register</h5></button>
      </a>
    </div>
  `;

  let valueII = 
  `
    <div class="profile_header_container">

      <h5>Profile</h5>
      <img src="../public/icons/Keyboard arrow down.png" alt="arrow down icon">

      <div class="profile_tooltip">

        <div class="profile_tooltip_header"> 
          <h5 style="padding-left: 20px;">Biolafrica</h5>
          <div class="profile_verification_details">
            <img src="../public/icons/Verified user.svg" alt="">
            <h5 class="light">Intermediate Level Verified</h5>
          </div>
        </div>
        
        <div class="profile_tooltip_body">

          <a class="profile_tooltip_body_nav" href="/views/wallet.html">
            <img src="../public/icons/Wallet.png" alt="">
            <h4>Wallet</h4>
          </a>

          <a class="profile_tooltip_body_nav" href="/views/verify.html">
            <img src="../public/icons/Manage accounts.svg" alt="">
            <h4>Account</h4>
          </a>
          
          <a class="profile_tooltip_body_nav" href="/views/settings.html">
            <img src="../public/icons/Settings.svg" alt="">
            <h4>Settings</h4>
          </a>

        </div>

        <div class="profile_tooltip_footer" >
          <a class="profile_tooltip_footer_nav" href="/views/login.html">
            <img class="secondary" src="../public/icons/Logout.svg" alt="">
            <h4>Logout</h4>
          </a>

        </div>
      </div>

    </div>

    <div class="ad_container">
      <h5>Ads</h5>
      <img src="../public/icons/Keyboard arrow down.png" alt="arrow down icon">

      <div class="more_tooltip">

        <a class="more_tooltip_nav" href="/views/postadd.html">
          <img src="../public/icons/add ads.png" alt="">
          <h4>Post Ads</h4>
        </a>

        <a class="more_tooltip_nav" href="/views/ads.html">
          <img src="../public/icons/ads List.png" alt="">
          <h4>My Ads</h4>
        </a>

      </div>

    </div>
  `;

  const headerRightEl = document.querySelector(".js_header_right");
  const headerMiddleEl = document.querySelector(".js_header_middle");
  let headerContent = await checkUser(token);
  let authenticatedheaderContent = headerContent === false ? value : valueI;
  let authenticatedheaderMiddleContent = headerContent === false ? "" : valueII;
  headerRightEl .innerHTML = authenticatedheaderContent;
  headerMiddleEl.innerHTML = authenticatedheaderMiddleContent;

  const subMenuEl = document.querySelector(".js_sub_menu");
  const hamburgerBtn = document.querySelector(".js_hamburger");
  const cancelBtn = document.querySelector(".js_close");

  hamburgerBtn.addEventListener("click", ()=>{
    subMenuEl.style.display = "initial";
    hamburgerBtn.style.display = "none";
    cancelBtn.style.display = "initial";
    
  });


  cancelBtn.addEventListener("click", ()=>{
    subMenuEl.style.display = "none";
    hamburgerBtn.style.display = "initial";
    cancelBtn.style.display = "none";

  });

  window.addEventListener("resize", ()=>{
    const screenWidth = window.innerWidth;
    if(screenWidth > 992){
      subMenuEl.style.display = "none";
      hamburgerBtn.style.display = "none";
      cancelBtn.style.display = "none";

    }else if( subMenuEl.style.display === "initial"){
      hamburgerBtn.style.display = "none";

    }else{
      hamburgerBtn.style.display = "block";

    }

  })



}