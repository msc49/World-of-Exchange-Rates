
import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { fetchRates } from '../api/exchangeAPI';
import '../App.css'


function ExchangeRates() {

  const [rates, setRates] = useState(null)
  const [quoteCurrency, setQuoteCurrency] = useState("USD")
  const [rateSearchResult, setRateSearchResult] = useState(null)
  const [searchBase, setSearchBase] = useState('')


  

  useEffect(() => {
    let componentIsMounted = true;
    const getExchange = (quoteCurrency) => {
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
    

   

    getExchange(quoteCurrency);

    const intervalFetch = setInterval(getExchange, 1000 * 60 * 30)
    // fetches data every 30 minutes 

    return () => {
      clearInterval(intervalFetch)
      componentIsMounted = false
    }
  }, [])

  const onBaseSearch = (e) => {
    setSearchBase(e.target.value)
  }

  const searchedRate = (rate, searchBase) => {

    const searched_rate = {}

    for (const [currency, currency_value] of Object.entries(rates)){
      if(currency.toUpperCase().includes(searchBase.toUpperCase())){searched_rate[currency]= currency_value}
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

    const data = []
    let x_value = 1
    let maximum_exchange_rate = 1

    for(const currency in rates){
      if(rates[currency] < maximum_exchange_rate){
      data.push([x_value,rates[currency], currency])
      x_value += 1
    }}


    if (data.length > 0 ){

      // container
      const width = 600, height = 500, spacing = 120
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
    
    
  }, [rates])

 




  return (
    <div className="App background ">
     

      <h6 className='text-muted font-weight-bold'>Change Quote Currency using the  button below</h6>
      <select onChange={changeQuote} className='form-select  '>
      {rates ? Object.keys(rates).map(key => (<option key={key}>{key}</option>)) : 'N/A'}
      </select>


      <input placeholder='Search Base Currency....' value={searchBase} onChange={onBaseSearch} className='input-group input-group-lg'></input><br/>




      <ul className="list-group ">
      {rateSearchResult ? Object.keys(rateSearchResult).map(key => (<li className="list-group-item-success outline bo" key={key}> {key} / {quoteCurrency}: {rateSearchResult[key]} </li>)) : []}
      
      </ul>

      
      
      
      
      
    </div>
  );
}

export default ExchangeRates;
