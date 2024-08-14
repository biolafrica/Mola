import {loadBanks} from "../../Data/bank.js";
import { getUserProfile } from "../../Data/user.js";
import { renderHeader } from "./script.js";

const verifyEl = document.querySelector(".user_verification_left_container");
const verifyCont = document.querySelector(".user_verification_right_container");
const bankCont= document.querySelector(".bank_account_right_screen");
const emailBtn = document.querySelector(".js_email_manage");
const phoneBtn = document.querySelector(".js_phone_manage");
//const idBtn = document.querySelector(".js_id_manage");
//const addressBtn = document.querySelector(".js_address_manage");
const overlay = document.querySelector(".js_overlay");
const emailPhonePopup = document.querySelector(".email_phone_verify_container");
const phoneElOne = document.querySelector('.js_phone_1');
const phoneElTwo = document.querySelector(".js_phone_2");
const headingEl = document.querySelector(".js_phone_email_topic");
const emailElOne = document.querySelector('.js_email_1');
const emailElTwo = document.querySelector(".js_email_2");
const phoneCancelIcon = document.querySelector(".js_phone_popup_cancel");
const bankBtn = document.getElementById("bankBtn");
const bankHeading = document.querySelector(".popup_bank_type");
const bankPopupEl = document.querySelector(".bank_account_form_popup");
const popupSort = document.querySelector(".popup_sort");
const popupInput = document.querySelector(".popup_sort_input");
const popupBankCancel = document.querySelector(".popup_bank_cancel");
const popupIconCancel = document.querySelector(".popup_bank_cancel_icon");
const bankSubmitBtn = document.querySelector(".confirmBank");
const token = localStorage.getItem("access");
const successPopupEl = document.querySelector(".js_success_popup");
const accountNameEl = document.getElementById("bankName");
const bankNameEl = document.getElementById("bankerName");
const bankAccountNumberEl = document.getElementById("accountNo");
const bankSortCodeEl = document.getElementById("sortCode");
const bankTypeEl = document.querySelector(".js_popup_bank_type");
const checkEl = document.getElementById("bankCheckbox");
const smallBankBtn = document.querySelector(".small_bank_btn");
const smallVerifyBtn = document.querySelector(".small_verify_btn");

verifyEl.addEventListener("click", (e)=>{
  if(e.target === user_verification){
    bankCont.style.display = "none";
    verifyCont.style.display ="initial";

  } else if (e.target === user_account) {
    bankCont.style.display = "initial";
    verifyCont.style.display ="none"; 
  }
});



emailBtn.addEventListener("click", ()=>{
  overlay.style.display = "initial";
  emailPhonePopup.style.display = "initial";
  headingEl.innerHTML= "Email Verification"
  phoneElOne.style.display = "none";
  phoneElTwo.style.display = "none";
});

phoneBtn.addEventListener("click", ()=>{
  overlay.style.display = "initial";
  emailPhonePopup.style.display = "initial";
  headingEl.innerHTML= "Phone Number Verification";
  emailElOne.style.display = "none";
  emailElTwo.style.display = "none";

})

phoneCancelIcon.addEventListener("click", ()=>{
  overlay.style.display = "none";
  emailPhonePopup.style.display = "none";
  headingEl.innerHTML= "";
  emailElOne.style.display = "flex";
  emailElTwo.style.display = "initial";
  phoneElOne.style.display = "flex";
  phoneElTwo.style.display = "initial";
});

bankBtn.addEventListener('change', (e)=>{
  const selectedValue = e.target.value;
  
  if(selectedValue === "NGN_Account"){
    overlay.style.display = "initial";
    bankPopupEl.style.display = "initial";
    bankHeading.innerHTML = "NGN Bank Account";
    popupSort.style.display = "none";
    popupInput.style.display = "none";
    

  } else if (selectedValue === "GBP_Account"){
    overlay.style.display = "initial";
    bankPopupEl.style.display = "initial";
    bankHeading.innerHTML = "GBP Bank Account";
    popupSort.style.display = "initial";
    popupInput.style.display = "initial";
    

  }

});

popupBankCancel.addEventListener("click", ()=>{
  overlay.style.display = "none";
  bankPopupEl.style.display = "none";
  bankBtn.value = "Add_Bank";

})

popupIconCancel.addEventListener("click", ()=>{
  overlay.style.display = "none";
  bankPopupEl.style.display = "none";
  bankBtn.value = "Add_Bank";

})

async function renderUserDetails(){
  let detailsEl = document.querySelector(".js_user_details");
  let user = await getUserProfile(token);
  const date = new Date(user.registration_date);
  const options = {year: "numeric", month: "long"};
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  
  let html = 
  `
    <div class="user_image">
      <img style="width: 80px; height: 80px;" src="../public/images/3D Avatars.svg" alt="">
    </div>

    <div class="user_primary_details">
      <h4><b>${user.username}</b></h4>

      <div class="joined_container">
        <img class="light" src="../public/icons/Date range.svg" alt="">
        <h5 class="light">Joined ${formattedDate}</h5>
      </div>

      <div class="verification_container">
        <h5 class="light secondary" id="usernameLink">www.molaex.com/${user.username}</h5>
        <img src="../public/icons/Content copy.png" alt="copy icon" id="copyIcon" style="cursor:pointer;">
      </div>

    </div>

  `;
  detailsEl.innerHTML = html;

  document.getElementById("copyIcon").addEventListener("click", function(){
    const textToCopy = document.getElementById("usernameLink").innerText;

    navigator.clipboard.writeText(textToCopy).then(function(){
      alert("Text copied to clipboard:" + textToCopy);
    }).catch(function(err){
      console.error("could not copy text:", err);
    });
  });


}

async function renderProfile(){
  const profileEl = document.querySelector(".js_personal_information");
  let user = await getUserProfile(token);

  let html = 
  `
    <h3>Personal Information</h3>

    <div class="personal_information_name">
      <h4 class="secondary">Name</h4>
      <h4>${user.first_name} ${user.last_name}</h4>
    </div>
    
    <div class="personal_information_email">
      <h4 class="secondary">Email Address</h4>
      <h4>${user.email_address}</h4>
    </div>

    <div class="personal_information_phone">
      <h4 class="secondary">Phone Number</h4>
      <h4>${user.phone_number}</h4>
    </div>

    <div class="personal_information_country">
      <h4 class="secondary">Country</h4>
      <h4>${user.country}</h4>
    </div>
  `;

  profileEl.innerHTML = html;
};

async function verificationDetails(){
  const emailEl = document.querySelector(".js_email");
  const phoneEl = document.querySelector(".js_phone_number");
  const verificationEl = document.querySelector(".js_verification");
  const addressEl = document.querySelector(".js_proof_address");
  let user = await getUserProfile(token);
  let verifiedIcon = user.verification = true ? "Check Mark" : "Error";
  let email = user.email_address ||"Not Enabled";
  let phoneNumber = user.phone_number || "Not Enabled";

  
  let emailHTML = 
  `
    <img src="../public/icons/${verifiedIcon}.svg" alt="">
    <h6 class="light js_email">${email}</h6>
  `;
  
  let phoneHTML = 
  `
    <img src="../public/icons/${verifiedIcon}.svg" alt="">
    <h5 class="light">${phoneNumber}</h5>
  `;
  emailEl.innerHTML = emailHTML;
  phoneEl.innerHTML = phoneHTML;
 
}

async function renderBanks(token){
  let banklistEl = document.querySelector(".js_bank_account_list_container");

  let banks = [];
  let renderBankList = "";
  banks = await loadBanks(token);
 
  
  banks.forEach((bank)=>{
    let displaySortCode = bank.bank_type === "Naira" ? "no_sort_code" : "";
    let defaultBank = bank.is_default === true ? "../public/icons/Check Mark.svg" : "";
  
    let html = 
    `
      <div class="bank_account_list" id= "${bank.bank_id}">
    
        <div class="bank_account_list_head">
    
          <div class="bank_account_list_head_left">
            <h4>Account Type  <b>${bank.bank_type}</b></h4>
          </div>
    
          <div class="bank_account_list_head_right">
            <img class="js_one_bank_select" src="${defaultBank}" alt="">
            <img class="js_one_bank_edit" src="../public/icons/Mode edit.svg" alt="">
            <img class="js_one_bank_delete" id="${bank.bank_id}" src="../public/icons/Delete.svg" alt="">
          </div>
          
        </div>
    
        <div class="bank_account_list_body">
    
          <div class="bank_account_list_body_top">
    
            <div class="bank_name_profile">
              <h4 class="secondary">Name</h4>
              <h4>${bank.bank_account_name}</h4>
            </div>
    
            <div class="banker_name_profile">
              <h4 class="secondary">Bank</h4>
              <h4>${bank.bank_name}</h4>
            </div>
    
            <div class="bank_account_profile">
              <h4 class="secondary">Account Number</h4>
              <h4>${bank.bank_account_number}</h4>
            </div>
    
          </div>

          
          <div class="bank_sort_code_profile ${displaySortCode}">
            <h4 class="secondary">Sort Code</h4>
            <h4>${bank.bank_sort_code}</h4>
          </div>
        </div>
    
      </div>
    
    `;
  
    renderBankList += html;

  
  });
  
  banklistEl.innerHTML = renderBankList;

  document.querySelectorAll(".js_one_bank_delete").forEach((bankItem)=>{
    bankItem.addEventListener("click", (e)=>{
      let walletId = e.target.id;
      const token = localStorage.getItem("access");
      async function deleteWallet(){

        try {
          const response = await fetch(`http://127.0.0.1:8000/api/banks/${walletId}`, 
          {
            method: "DELETE",
            headers: {
              "Authorization" : `Bearer ${token}`,
              "Content-Type" : "application/json"
            }
          });
          if(response.ok){
            console.log(`Wallet with ID ${walletId} deleted successfully`);
            document.getElementById(`${walletId}`).remove();
            let html = 
            `
              <img src="./public/icons/Check Mark.svg" alt="">
              <h4>Bank deleted Successfully</h4>
            `;
            successPopupEl.innerHTML = html;
            successPopupEl.style.display = "flex";
            setTimeout(()=>{
              successPopupEl.style.display = "none";
            },3000);

          }else{
            const errorData = await response.json();
            console.error("Failed to delete wallet:", errorData);
          }
  
          
        } catch (error) {
          console.error("Error deleteing wallet:", error)
          
        }
        
      }
      deleteWallet();
    })
  })

};

renderBanks(token);
renderProfile();
renderUserDetails();
verificationDetails();
renderHeader();


bankSubmitBtn.addEventListener("click", async(e)=>{
  e.preventDefault();
  const bank_account_name = accountNameEl.value;
  const bank_name = bankNameEl.value;
  const bank_account_number = bankAccountNumberEl.value;
  const bank_sort_code = bankSortCodeEl.value;
  const bank_type = bankTypeEl.textContent;
  const bank_check = checkEl.checked ? true : false;
  const selectedBankType = bank_type === "GBP Bank Account" ? "Pounds" : "Naira";
  const sortCodeChoice = bank_type === "GBP Bank Account" ? bank_sort_code : 0;
 
  try {

    const response = await fetch("http://127.0.0.1:8000/api/banks/", {
      method : "POST",
      headers : {
        "Authorization" : `Bearer ${token}`,
        "Content-Type" : "application/json"
      },

      body : JSON.stringify({
        bank_type : selectedBankType,
        bank_name,
        bank_account_name,
        bank_account_number,
        bank_sort_code :sortCodeChoice,
        is_default: bank_check
      })
    
    });

    const data = await response.json();
    console.log(data);

    if(data.bank_id){
      overlay.style.display = "none";
      bankPopupEl.style.display = "none";
      bankBtn.value = "Add_Bank";
      renderBanks(token);
      accountNameEl.value = "";
      bankNameEl.value = "";
      bankAccountNumberEl.value = "";
      bankSortCodeEl.value = "";
      checkEl.value = "";
     
    }

  } catch(error){
    console.log(error);
  }


});

smallBankBtn.addEventListener("click", ()=>{
  bankCont.style.display = "initial";
  verifyCont.style.display ="none";
  smallBankBtn.classList.remove("text-btn");
  smallBankBtn.classList.add("filled-btn");
  smallVerifyBtn.classList.add("text-btn");
  smallVerifyBtn.classList.remove("filled-btn");
})

smallVerifyBtn.addEventListener("click", ()=>{
  bankCont.style.display = "none";
  verifyCont.style.display ="initial";
  smallBankBtn.classList.remove("filled-btn");
  smallBankBtn.classList.add("text-btn");
  smallVerifyBtn.classList.add("filled-btn");
  smallVerifyBtn.classList.remove("text-btn");
  
})

console.log(await getUserProfile(token));
console.log(await loadBanks(token));
