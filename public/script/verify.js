import {loadBanks} from "../../Data/bank.js";

const verifyEl = document.querySelector(".user_verification_left_container");
const verifyCont = document.querySelector(".user_verification_right_container");
const bankCont= document.querySelector(".bank_account_right_screen");
const emailBtn = document.querySelector(".js_email_manage");
const phoneBtn = document.querySelector(".js_phone_manage");
const idBtn = document.querySelector(".js_id_manage");
const addressBtn = document.querySelector(".js_address_manage");
const diligenceBtn = document.querySelector(".js_diligence_manage");
const overlay = document.querySelector(".js_overlay");
const emailPhonePopup = document.querySelector(".email_phone_verify_container");
const diligencePopup = document.querySelector(".due_diligence_popup");
const phoneElOne = document.querySelector('.js_phone_1');
const phoneElTwo = document.querySelector(".js_phone_2");
const headingEl = document.querySelector(".js_phone_email_topic");
const emailElOne = document.querySelector('.js_email_1');
const emailElTwo = document.querySelector(".js_email_2");
const cancelIcon = document.querySelector(".js_popup_cancel");
const phoneCancelIcon = document.querySelector(".js_phone_popup_cancel");
const bankBtn = document.getElementById("bankBtn");
const bankHeading = document.querySelector(".popup_bank_type");
const bankPopupEl = document.querySelector(".bank_account_form_popup");
const popupSort = document.querySelector(".popup_sort");
const popupInput = document.querySelector(".popup_sort_input");
const popupBankCancel = document.querySelector(".popup_bank_cancel");
const popupIconCancel = document.querySelector(".popup_bank_cancel_icon");
const bankSubmitBtn = document.querySelector(".confirmBank");

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

diligenceBtn.addEventListener("click", ()=>{
  overlay.style.display = "initial";
  diligencePopup.style.display = "initial";

})

cancelIcon.addEventListener("click", ()=>{
  overlay.style.display = "none";
  diligencePopup.style.display = "none";

});

phoneCancelIcon.addEventListener("click", ()=>{
  overlay.style.display = "none";
  emailPhonePopup.style.display = "none";
  headingEl.innerHTML= "";
  emailElOne.style.display = "flex";
  emailElTwo.style.display = "initial";
  phoneElOne.style.display = "flex";
  phoneElTwo.style.display = "initial";
})

bankBtn.addEventListener('change', (e)=>{
  const selectedValue = e.target.value;
  console.log(selectedValue);

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

async function renderBanks(token){
  let banklistEl = document.querySelector(".js_bank_account_list_container");

  let banks = [];
  let renderBankList = "";
  banks = await loadBanks(token);
 
  
  banks.forEach((bank)=>{
    let displaySortCode = bank.bank_type === "NGN" ? "no_sort_code" : "";
  
    let html = 
    `
      <div class="bank_account_list" id= "${bank.bank_id}">
    
        <div class="bank_account_list_head">
    
          <div class="bank_account_list_head_left">
            <h4>Account Type  <b>${bank.bank_type}</b></h4>
          </div>
    
          <div class="bank_account_list_head_right">
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

const token = localStorage.getItem("access");
renderBanks(token);

bankSubmitBtn.addEventListener("click", async(e)=>{
  e.preventDefault();
  const bank_account_name = (document.getElementById("bankName")).value;
  const bank_name = (document.getElementById("bankerName")).value;
  const bank_account_number = (document.getElementById("accountNo")).value;
  const bank_sort_code = (document.getElementById("sortCode")).value;
  const bank_type = (document.querySelector(".js_popup_bank_type")).textContent;
  const token = localStorage.getItem("access");
  const selectedBankType = bank_type === "GBP Bank Account" ? "GBP" : "NGN";
  const sortCodeChoice = bank_type === "GBP Bank Account" ? bank_sort_code : 0;
  console.log(token);
  console.log(bank_account_name, bank_name, bank_account_number, bank_sort_code, bank_type, selectedBankType, sortCodeChoice)
 
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
      })
    
    });
    const data = await response.json();
    console.log(data);

    if(data.bank_id){
      overlay.style.display = "none";
      bankPopupEl.style.display = "none";
      bankBtn.value = "Add_Bank";
    }

    
  } catch (error) {
    console.log(error);
    
  }


})
