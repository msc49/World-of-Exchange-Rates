export const fetchRates = async (quote) => {
  const resp = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY}/latest/${quote}`)
  return resp.json();
};

// our function to fetch the data from the API using our environmental variable and returning the response as a JSON
// you can use axios for this but I decided to use fetch and shall let you know why