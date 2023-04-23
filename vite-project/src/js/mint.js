// API DOCS: https://api.relysia.com/docs/static/index.html
// SDK DOCS: https://docs.relysia.com/getting-started/setup

import RelysiaSDK from 'relysia';
import { redirectToLoginPage, setupSignOutButton, toggleHamburgerMenu, getUserDetails } from "./assets.js";
const relysia = new RelysiaSDK();

redirectToLoginPage()
toggleHamburgerMenu()
setupSignOutButton()
// getUserDetails() 

const serviceIdElement = document.querySelector('#serviceId');
const protocolElement = document.querySelector('#protocol');
const nameElement = document.querySelector('#name');
const protocolIdElement = document.querySelector('#protocolId');
const symbolElement = document.querySelector('#symbol');
const descriptionElement = document.querySelector('#description');
const imageElement = document.querySelector('#image');
const tokenSupplyElement = document.querySelector('#tokenSupply');
const decimalsElement = document.querySelector('#decimals');
const satsPerTokenElement = document.querySelector('#satsPerToken');
const splitableElement = document.querySelector('#splitable');
const legalTermsElement = document.querySelector('#terms');
const licenceIdElement = document.querySelector('#licenceId');
const issuerOrganisationElement = document.querySelector('#organisation');
const issuerLegalFormElement = document.querySelector('#legalForm');
const governingLawElement = document.querySelector('#governingLaw');
const issuerCountryElement = document.querySelector('#issuerCountry');
const jurisdictionElement = document.querySelector('#jurisdiction');
const issuerEmailElement = document.querySelector('#issuerEmail');
const schemaIdElement = document.querySelector('#schemaId');
const websiteElement = document.querySelector('#website');
const metaLegalTermsElement = document.querySelector('#metaLegalTerms');
const mediaURIElement = document.querySelector('#mediaURI');
const mediaTypeElement = document.querySelector('#mediaType');
const mediaAltURIElement = document.querySelector('#mediaAltURI');
const issueButton = document.querySelector('#issue-button')



// async function fetchWallets() {
//   try {
//     const url = new URL('https://api.relysia.com/v1/wallets');
//     // url.search = new URLSearchParams(parameters).toString();

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'authToken' : localStorage.getItem('token'),
//         'Content-Type': 'application/json'
//       }
//     });
//     const data = await response.json();
//     console.log('fetchwallets()--data', data)

//     if (!response.ok) {
//       throw new Error(`Failed to retrieve wallets: ${response.statusText}`);
//     }

//     return data;
//   } catch (error) {
//     console.error('Error retrieving wallets: ', error);
//     throw error;
//   }
// }

issueButton.addEventListener('click', (event) => {
  event.preventDefault();
  createToken();
})

async function createToken() {
  const url = 'https://api.relysia.com/v1/issue';
  const authToken = localStorage.getItem("token");
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authToken': authToken,
      'accept': '*/*'
    },
    body: JSON.stringify({
      "name": nameElement.value,
      "protocolId": "STAS",
      "symbol": symbolElement.value,
      "description": descriptionElement.value,
      "image": "https://upload.wikimedia.org/wikipedia/en/9/95/Test_image.jpg",
      "tokenSupply": tokenSupplyElement.value,
      "decimals": 0,
      "satsPerToken": 1,
      "properties": {
        "legal": {
          "terms": "STAS, Inc. retains all rights to the token script.  Use is subject to terms at https://stastoken.com/license.",
          "licenceId": "stastoken.com"
        },
        "issuer": {
          "organisation": "Vaionex Corp.",
          "legalForm": "Limited",
          "governingLaw": "US",
          "issuerCountry": "US",
          "jurisdiction": "US",
          "email": "info@vaionex.com"
        },
        "meta": {
          "schemaId": "STAS1.0",
          "website": "vaionex.com",
          "legal": {
            "terms": "Your token terms and description."
          },
          "media": [
            {
              "URI": "string",
              "type": "string",
              "altURI": "string"
            }
          ]
        }
      },
      "splitable": false,
      "data": []
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

