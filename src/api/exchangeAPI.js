export const fetchRates = async (quote) => {
  const resp = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY}/latest/${quote}`)
  return resp.json();
};