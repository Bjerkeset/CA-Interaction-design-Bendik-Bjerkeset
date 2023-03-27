// API DOCS: https://api.relysia.com/docs/static/index.html
// SDK DOCS: https://docs.relysia.com/getting-started/setup

import RelysiaSDK from 'relysia';
import { redirectToLoginPage, setupSignOutButton, toggleHamburgerMenu } from "./assets.js";


const relysia = new RelysiaSDK();
// const postButton = document.querySelector("#js-post-btn");
const message = document.querySelector("#js-message");
const p = document.querySelector("#js-response-container");
const loadingIndicator = document.querySelector("#js-loading-indicator");
// const bsvAmount = document.querySelector("#js-bsv-amount");
const makeOfferBtn = document.querySelector("#js-makeOffer-btn");
const inspectBtn = document.querySelector("#js-ispect-btn"); 

//Get Token ID from queryString
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
console.log(id)

// NOTE: Deletes local storage and rederects to login. 
setupSignOutButton();

// let createOffer = async () => {
// try {
//   const config = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', "authToken": localStorage.getItem("token") },
//     body: JSON.stringify({
//       "dataArray": [
//         {
//           "tokenId": id,
//           "sn": 50,
//           "amount": 1,
//           "wantedAmount": 0.0001,
//           "type": "BSV"
//         }
//       ]
//     })
//   };
//   const response = await fetch('https://api.relysia.com/v1/offer', config);
//   const data = await response.json();
//   const hex = data.data.contents
//   console.log("data: ", data)
//   console.log("hex: ", hex)

// } catch (error) {
//   console.log(error);
//   return error.message;
// }
// };

async function inspectAtomicSwapOffer(swapHex) {
  try {
    const response = await fetch('https://api.relysia.com/v1/inspect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ swapHex })
    });

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error('Error:', error);
  }
}

inspectBtn.addEventListener('click', () => {
  event.preventDefault();
  // viewOffer();
  inspectAtomicSwapOffer('your_swap_hex_here');

});


// makeOfferBtn.addEventListener('click', () => {
//   event.preventDefault();
//   createOffer();
// });
