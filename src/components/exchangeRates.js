
import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { fetchRates } from '../api/exchangeAPI';
import '../App.css'


function ExchangeRates() {

  const [rates, setRates] = useState(null) // initially set our exchange rates data structure to null
  const [quoteCurrency, setQuoteCurrency] = useState("USD")
  const [rateSearchResult, setRateSearchResult] = useState(null) // this is what the search bar with display once we update searchBase
  const [searchBase, setSearchBase] = useState('')


  

  useEffect(() => {
    // this useEffect is to fetch the data after rendering
    let componentIsMounted = true;
    const getExchange = (quoteCurrency) => {
      fetchRates(quoteCurrency).then(data => {
        // console.log(data)
        if (componentIsMounted){
        setRates(data.conversion_rates)
          if(data.base_code !== 'USD'){
        setQuoteCurrency(data.base_code) 
        // we only change the quote currency state if it is not USD
          }
        
        }
        
      }).catch(err => {
        console.log(err)
      })
    }
    

   

    getExchange(quoteCurrency);

    const intervalFetch = setInterval(getExchange, 1000 * 60 * 30)
    // fetches data from the API every 30 minutes 

    return () => {
      clearInterval(intervalFetch)
      // removes previous data
      componentIsMounted = false
    }
  }, [])

  const onBaseSearch = (e) => {
    setSearchBase(e.target.value)
    // without this function, anything you type in the search bar will not display
  }

  const searchedRate = (rate, searchBase) => {

    const searched_rate = {} // use a hash data structure to store our curreny and currency_value as key, pair values

    for (const [currency, currency_value] of Object.entries(rates)){
      if(currency.toUpperCase().includes(searchBase.toUpperCase())){searched_rate[currency]= currency_value}
      // checks if we have the base pair for what the user typed
    }
    return searched_rate
  }

  useEffect(()=> {
    if(searchBase.trim().length !== 0){
      const search_result = searchedRate(rates, searchBase)
      setRateSearchResult(search_result)
    }
    else {
      setRateSearchResult(rates)
    }
  }, [searchBase, rates])
  

  let componentIsMounted = true
  const getNewQuote = (quoteCurrency) => {
    fetchRates(quoteCurrency).then(data => {
      // console.log(data)
      if (componentIsMounted){
      setRates(data.conversion_rates)
        if(data.base_code !== 'USD'){
      setQuoteCurrency(data.base_code) 
        }
      
      }
      
    }).catch(err => {
      console.log(err)
    })
  }

  const changeQuote = (event) => {
    const new_quote = event.target.value
    getNewQuote(new_quote)
  }


  useEffect(()=> {
    // this useEffect is just for the data visualistion using D3.js

    const data = []
    let x_value = 1
    // graphs have an x and y plane, since we do not have anything for x. X_value can essentually be thought of as an ID each currency. each currency will have its own ID
    let maximum_exchange_rate = 1 // only show exchange rate values of the graph that wil be less than this value

    for(const currency in rates){
      if(rates[currency] < maximum_exchange_rate){
      data.push([x_value,rates[currency], currency])
      x_value += 1

    }}


    if (data.length > 0 ){
      // this condition is here because for the first two responses that we get after rendering are [] because the initial state is null. So we ignore them using this

      // container
      const width = 1000, height = 1000, spacing = 120
      const svg = d3.select('body').append("svg")
      .attr("width", width).attr("height", height).style("background", "pink")
      .append("g").attr("transform", `translate(${spacing/2},${spacing/2})`);

      //scaling
      const xScale = d3.scaleLinear()
      .domain([d3.min(data, function(d){return d[0] - 1}), d3.max(data,
        function(d){return d[0] + 1})])
      .range([0, width - spacing]);

      const yScale = d3.scaleLinear()
      .domain([0,d3.max(data, function(d){return d[1]+ 1})])
      .range([height - spacing, 0]);

      //Axis

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
      svg.append("g").attr("transform", `translate(0, ${height-spacing})`).call(xAxis);
      svg.append("g").call(yAxis);

      //data points
      const dots = svg.append("g").selectAll("dot").data(data)

      dots.enter().append("circle").attr("cx", function(d){
        return xScale(d[0])
      })
      .attr("cy", function(d){ return yScale(d[1])} )
      .attr("r", 5)
      .style("fill", "red")




    }
    
    // keeps track of changes in rates so data can be updated
  }, [rates])

 




  return (
    <div className="App background ">
     <h1 data-testid='header'>World of Exchange Rates</h1>

      <h6 className='text-muted font-weight-bold'>Change Quote Currency using the  button below</h6>
      <select data-testid = 'quote' onChange={changeQuote} className='form-select  '>
      {rates ? Object.keys(rates).map(key => (<option data-testid='quote-select' key={key}>{key}</option>)) : 'N/A'}
      </select>


      <input data-testid= 'base-search' placeholder='Search Base Currency....' value={searchBase} onChange={onBaseSearch} className='input-group input-group-lg'></input><br/>




      <ul  data-testid = 'list-group'className="list-group ">
      {rateSearchResult ? Object.keys(rateSearchResult).map(key => (<li data-testid='list-group-view' className="list-group-item-success outline bo" key={key}> {key} / {quoteCurrency}: {rateSearchResult[key]} </li>)) : []}
      
      </ul>

      
      
      
      
      
    </div>
  );
}

export default ExchangeRates;
