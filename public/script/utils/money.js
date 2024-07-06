export const formatCurrency =(price)=>{
  return ((Math.round(price)/100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}

export const convertCurrency = (price)=>{
  return (Math.round(price)/100).toFixed(2);
}

export const monitizeNumber=(price)=>{
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}