// API DOCS: https://api.relysia.com/docs/static/index.html
// SDK DOCS: https://docs.relysia.com/getting-started/setup

import { db } from "./firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

const contentContainer = document.querySelector('#js-response-container')
// Reference to the "users" collection
const usersRef = collection(db, 'User-Response');

// Fetch values from firebase database. 
// onSnapshot(collection(db, "hex-values"), (snapshot) => {
//   const fetchedValues = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
  
//   for (let i = 0; i < fetchedValues.length; i++) {
//     const fetchedValue = fetchedValues[i];
//     const hexValue = fetchedValue.hex;
//     // console.log("db hex:", hexValue)
//     inspectAtomicSwapOffer(hexValue);
//   }

//   async function inspectAtomicSwapOffer(hexValue) {
//     //Runs function only of hex value is defined and is over 100 characters.
//     if (hexValue && hexValue.length > 100) {

//     try {
//       const response = await fetch('https://api.relysia.com/v1/inspect', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           "authToken": localStorage.getItem("token")
//         },
//         body: JSON.stringify({
//           "dataArray": [
//             {
//               "swapHex": hexValue
//             }
//           ]
//         })
//       });
  
//       const data = await response.json();
//       const offerDetails = data.data.offerDetails[0];
//       console.log(offerDetails)
//       console.log("data:", data);

//       //Create HTML
//       contentContainer.innerHTML += `
//       <div class="card__description">
//       <div class="card-description__wrap">
//       <div class="details-description details-description--name"><p>${offerDetails.tokenName}</p></div>
//       <div class="details-description details-description--symbol"><p>${offerDetails.symbol}</p></div>
//       <div class="details-description details-description--description"><p>${offerDetails.tokenDescription}</p></div>
//       <div class="details-description details-description--owner"><p>Owner: ${offerDetails.tokenOwnerAddress}</p></div>
//       <div class="details-description details-description--token-sats"><p>Embedded Satoshis: ${offerDetails.tokenSatoshis}</p></div>
//       <div class="details-description details-description--contract-id"><p>Contract ID: ${offerDetails.contractTxid}</p></div>
//       <div class="details-description details-description--price"><p>Price: ${offerDetails.wantedSatoshis} Sats</p></div>
//       <div class=""><button id="js-accept-offer-button" class="button button--accept-offer">Accept Offer</button></div>
//           </div>
//           </div>
//           `;

//       // Accept swap offer
//       async function acceptSwapOffer(hexValue) {
//         try {
//           const response = await fetch('https://api.relysia.com/v1/swap', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'walletID': localStorage.getItem("walletID"),
//               "authToken": localStorage.getItem("token")
//             },
//             body: JSON.stringify({
//               "dataArray": [
//                 {
//                   "swapHex": hexValue
//                 }
//               ]
//             })
//           });
      
//           const data = await response.json();
//           console.log(data);
      
//         } catch (error) {
//           console.error('Error:', error);
//         }
//       }
    
//     // Runs accept swap offer function on click.
//     const acceptButton = document.querySelector('#js-accept-offer-button')      
//     acceptButton.addEventListener('click', function() {
//       acceptSwapOffer(hexValue);
//     })    
      
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }  
//   };
  
// });


// Fetch values from firebase database. Try 2 with exchange endpoint
onSnapshot(collection(db, "hex-values"), (snapshot) => {
  const fetchedValues = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  
  for (let i = 0; i < fetchedValues.length; i++) {
    const fetchedValue = fetchedValues[i];
    const hexValue = fetchedValue.hex;
    // console.log("db hex:", hexValue)
    inspectAtomicSwapOffer(hexValue);
  }

  async function inspectAtomicSwapOffer(hexValue) {
    //Runs function only of hex value is defined and is over 100 characters.
    if (hexValue && hexValue.length > 100) {

    try {
      const response = await fetch('https://api.relysia.com/v1/inspect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "authToken": localStorage.getItem("token")
        },
        body: JSON.stringify({
          "dataArray": [
            {
              "swapHex": hexValue
            }
          ]
        })
      });
  
      const data = await response.json();
      const offerDetails = data.data.offerDetails[0];
      console.log(offerDetails)
      console.log("data:", data);

      //Create HTML
      contentContainer.innerHTML += `
      <div class="card__description">
      <div class="card-description__wrap">
      <div class="details-description details-description--name"><p>${offerDetails.tokenName}</p></div>
      <div class="details-description details-description--symbol"><p>${offerDetails.symbol}</p></div>
      <div class="details-description details-description--description"><p>${offerDetails.tokenDescription}</p></div>
      <div class="details-description details-description--owner"><p>Owner: ${offerDetails.tokenOwnerAddress}</p></div>
      <div class="details-description details-description--token-sats"><p>Embedded Satoshis: ${offerDetails.tokenSatoshis}</p></div>
      <div class="details-description details-description--contract-id"><p>Contract ID: ${offerDetails.contractTxid}</p></div>
      <div class="details-description details-description--price"><p>Price: ${offerDetails.wantedSatoshis} Sats</p></div>
      <div class=""><button id="js-accept-offer-button" class="button button--accept-offer">Accept Offer</button></div>
          </div>
          </div>
          `;

      // Accept swap offer
      async function acceptSwapOffer(hexValue) {
        try {
          const response = await fetch('https://api.relysia.com/v1/swap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'walletID': localStorage.getItem("walletID"),
              "authToken": localStorage.getItem("token")
            },
            body: JSON.stringify({
              "dataArray": [
                {
                  "swapHex": hexValue
                }
              ]
            })
          });
      
          const data = await response.json();
          console.log(data);
      
        } catch (error) {
          console.error('Error:', error);
        }
      }
    
    // Runs accept swap offer function on click.
    const acceptButton = document.querySelector('#js-accept-offer-button')      
    acceptButton.addEventListener('click', function() {
      acceptSwapOffer(hexValue);
    })    
      
    } catch (error) {
      console.error('Error:', error);
    }
  }  
  };
  
});
