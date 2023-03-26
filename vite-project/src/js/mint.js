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


// fetchWallets()
// issueNFT();


async function fetchWallets() {
  try {
    const url = new URL('https://api.relysia.com/v1/wallets');
    // url.search = new URLSearchParams(parameters).toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'authToken' : localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('fetchwallets()--data', data)

    if (!response.ok) {
      throw new Error(`Failed to retrieve wallets: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error retrieving wallets: ', error);
    throw error;
  }
}


// issueNFT()
async function issueNFT() {
    const endpoint = 'https://api.relysia.com/v1/issue';
    const parameters = {
      serviceId: '',
      protocol: '',
      data: [{
        "name": "Football Card 21",
        "protocolId": "STAS",
        "symbol": "FC21",
        "description": "A FC 21 season nft",
        "image": "https://firebasestorage.googleapis.com/v0/b/nftdev/o/nftTemp%2FWL1DdD?alt=media",
        "tokenSupply": 1,
        "decimals": 0,
        "satsPerToken": 1500,
        "splitable": false,
        "properties": {
          "legal": {
            "terms": "© 2020 TAAL TECHNOLOGIES SEZC\nALL RIGHTS RESERVED. ANY USE OF THIS SOFTWARE IS SUBJECT TO TERMS AND CONDITIONS OF LICENSE. USE OF THIS SOFTWARE WITHOUT LICENSE CONSTITUTES INFRINGEMENT OF INTELLECTUAL PROPERTY. FOR LICENSE DETAILS OF THE SOFTWARE, PLEASE REFER TO: www.taal.com/stas-token-license-agreement",
            "licenceId": "Vaionex"
          },
          "issuer": {
            "organisation": "vaionex corp.",
            "legalForm": "Limited",
            "governingLaw": "US",
            "issuerCountry": "US",
            "jurisdiction": "US",
            "email": "info@vaionex.com"
          },
          "meta": {
            "schemaId": "NFT1.0",
            "website": "https://football21.com",
            "legal": {
              "terms": "the terms of your nft"
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
      }],
    };
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authToken": localStorage.getItem("token"),
      },
      body: JSON.stringify(parameters),
    });
    
      const data = await response.json();
      console.log("issueNFT(), data: ", data)
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  }
  

  /// NEW TRY: 

async function issueStasToken(parameters) {
  const url = 'https://api.relysia.com/v1/issue';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authToken': localStorage.getItem('token')
    },
    body: JSON.stringify(parameters),
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log("issueStasToken()", data)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error issuing STAS token:', error);
    throw error;
  }
}
const parameters = {
  serviceId: 'optional',
  protocol: 'optional',
  data: {
    "name": "Football Card 21",
    "protocolId": "STAS",
    "symbol": "FC21",
    "description": "A FC 21 season nft",
    "image": "https://firebasestorage.googleapis.com/v0/b/nftdev/o/nftTemp%2FWL1DdD?alt=media",
    "tokenSupply": 1,
    "decimals": 0,
    "satsPerToken": 1500,
    "splitable": false,
    "properties": {
      "legal": {
        "terms": "© 2020 TAAL TECHNOLOGIES SEZC\nALL RIGHTS RESERVED. ANY USE OF THIS SOFTWARE IS SUBJECT TO TERMS AND CONDITIONS OF LICENSE. USE OF THIS SOFTWARE WITHOUT LICENSE CONSTITUTES INFRINGEMENT OF INTELLECTUAL PROPERTY. FOR LICENSE DETAILS OF THE SOFTWARE, PLEASE REFER TO: www.taal.com/stas-token-license-agreement",
        "licenceId": "Vaionex"
      },
      "issuer": {
        "organisation": "vaionex corp.",
        "legalForm": "Limited",
        "governingLaw": "US",
        "issuerCountry": "US",
        "jurisdiction": "US",
        "email": "info@vaionex.com"
      },
      "meta": {
        "schemaId": "NFT1.0",
        "website": "https://football21.com",
        "legal": {
          "terms": "the terms of your nft"
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
  },
};

const parametersInArray = {
  serviceId: 'optional',
  protocol: 'optional',
  data: [
    {
      "name": "Football Card 21",
      "protocolId": "STAS",
      "symbol": "FC21",
      "description": "A FC 21 season nft",
      "image": "https://firebasestorage.googleapis.com/v0/b/nftdev/o/nftTemp%2FWL1DdD?alt=media",
      "tokenSupply": 1,
      "decimals": 0,
      "satsPerToken": 1500,
      "splitable": false,
      "properties": {
        
        "legal": {
          "terms": "© 2020 TAAL TECHNOLOGIES SEZC\nALL RIGHTS RESERVED. ANY USE OF THIS SOFTWARE IS SUBJECT TO TERMS AND CONDITIONS OF LICENSE. USE OF THIS SOFTWARE WITHOUT LICENSE CONSTITUTES INFRINGEMENT OF INTELLECTUAL PROPERTY. FOR LICENSE DETAILS OF THE SOFTWARE, PLEASE REFER TO: www.taal.com/stas-token-license-agreement",
          "licenceId": "Vaionex"
        },
        "issuer": {
          "organisation": "vaionex corp.",
          "legalForm": "Limited",
          "governingLaw": "US",
          "issuerCountry": "US",
          "jurisdiction": "US",
          "email": "info@vaionex.com"
        },
        "meta": {
          "schemaId": "NFT1.0",
          "website": "https://football21.com",
          "legal": {
            "terms": "the terms of your nft"
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
    },
  ],
};

issueStasToken(parametersInArray)
  // .then((data) => {
  //   console.log('STAS token issued successfully:', data);
  // })
  // .catch((error) => {
  //   console.error('Error issuing STAS token:', error);
  // });
  
