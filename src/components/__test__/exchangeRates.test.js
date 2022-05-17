import React from 'react';
import ExchangeRates from '../exchangeRates';
import {render, fireEvent, getByTestId} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";



test("header renders with correct text ", () => {
  const componentFX = render(<ExchangeRates/>);
  const headerEl = componentFX.getByTestId("header")
  
  expect(headerEl.textContent).toBe("World of Exchange Rates")
})

test("input has inital value of an empty string", () => {
  const componentFX = render(<ExchangeRates/>);
  const inputEl = componentFX.getByTestId("base-search")

  expect(inputEl.value).toBe("")
})

test("input has a placeholder with the correct text", () => {
  const componentFX = render(<ExchangeRates/>);
  const inputEl = componentFX.getByTestId("base-search")
  expect(inputEl).toHaveAttribute("placeholder","Search Base Currency....")
})

// test("Input can be changed to GBP", () => {
//   const componentFX = render(<ExchangeRates/>)
//   const inputEl = componentFX.getByTestId("base-search")

//   fireEvent.change(inputEl, {
//     target: {
//       value: "GBP" 
//     }
//   })
//   expect(inputEl.value).toBe("GBP")
// })

test("Exchange Rate graph exists", () => {
  // will add to
})