export  const handleInput =()=>{

  const form = document.getElementById('inputFormz');

  form.addEventListener('focusin', function () {
    form.classList.add('input_money-focus');
  });

  form.addEventListener('focusout', function () {
    form.classList.remove('input_money-focus');
  });

}

export const handleMultipleInput =()=>{
  document.querySelectorAll('#inputFormz').forEach((formEl)=>{
    formEl.addEventListener("focusin", ()=>{
      formEl.classList.add("input_money-focus");

    })

    formEl.addEventListener("focusout", ()=>{
      formEl.classList.remove("input_money-focus")

    })

  })

}