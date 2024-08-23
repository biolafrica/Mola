export const formatCurrency =(price)=>{
  return ((Math.round(price)/100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}

export const convertCurrency = (price)=>{
  return (Math.round(price)/100).toFixed(2);
}

export const monitizeNumber=(price)=>{
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const convertTwoDecimal=(price)=>{
  return ((Math.round(price)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}

export function convertNaira(inputValue, matchingAds){
  const convertedValue = inputValue * matchingAds.rate;
  const converts = parseFloat((convertedValue.toFixed(2)));
  return converts
};

export function convertPounds(inputValue, matchingAds){
  const convertedValue = (inputValue * 100) / (matchingAds.rate * 100);
  const converts = parseFloat(convertedValue.toFixed(2));
  return converts;
};