export const verified=(matchingUser)=>{
  let verifyIcon = matchingUser.advanceVerification === true ? "./public/icons/Verified.svg" : "";

  return verifyIcon;

} 

export const verifyType=(matchingUser)=>{
  let verifyName = matchingUser.advanceVerification === true && matchingUser.basicVerification === true ? "Advance Verification" : "Basic Verification";

  return verifyName;

} 
