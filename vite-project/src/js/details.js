import RelysiaSDK from 'relysia';
import { redirectToLoginPage, setupSignOutButton } from "./assets.js";
const relysia = new RelysiaSDK();

import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

// Reference to the "user response" collection
const hexValuesCollection = collection(db, 'hex-values');
const hexAndSwapIdCollection = collection(db, 'HexAndSwapID');

// addNewUser();

// Dom Elements
const detailContainer = document.querySelector("#js-detail__container");
const errorContainer = document.querySelector("#js-error-container");
const loadingIndicator = document.querySelector(".loading-indicator");  
const p = document.querySelector("#send__response--js")
const inspectBtn = document.querySelector("#js-ispect-btn"); 

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
const url = `https://api.relysia.com/v1/token/${id}`;

// NOTE: Deletes local storage and rederects to login. 
setupSignOutButton();

// NOTE: FetchTicketDetails() calls fetchTickets() which in turn calls createHtml().  
fetchTicketDetails();

// Fetching most of the ticket details. 
async function fetchTicketDetails() {
  try {
    const response = await fetch(url);
    const details = await response.json();

    console.log("fetchTicketDetails() var-details", details);
    //Calls fetchTickets to fetch the serial number for use in DOM. (createHtml is called inside fetchTickets)
    fetchTickets(details)

  } catch (error) {
    console.log("Error MSG:", error);
    errorContainer.innerHTML = ("error:", error);
  }
};

//Same fetch as in index.js. The loop is different i need token serial number.  
async function fetchTickets(details) {
  try {
      loadingIndicator.classList.add("show"); // Show the loading indicator
      const url = "https://api.relysia.com/v2/balance";
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "authToken": localStorage.getItem("token"),
          },
      });
      const data = await response.json();
      const tickets = data.data.coins;

      //NOTE: looping response object. 
      for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i];            
          if (!ticket.splitable && !ticket.balance && ticket.tokenId === id) {  //NOTE: Only loop none-splitteble tokens and the token with the same ID. 

            // Calling createHTML() after getting serial number and token details.  
            createHtml(details, ticket);
          }
      }
      } catch (error) {
          console.error("Error fetching balance", error);
          errorContainer.innerHTML = ("error", error);

      } finally {
          loadingIndicator.classList.remove("show"); // NOTE: Hide the loading indicator
    }
};

// Render HTML to the DOM
function createHtml(details, ticket) {
  
    //   titleElement.innerHTML = details.data.name
      document.title = details.data.name + ' | Ticket List';
    
        detailContainer.innerHTML += `

        <form class="is-hidden" id="js-list-for-sale__form" action="">

        <button id="js-button--exit" class="button button--exit">Exit</button>

        <label for="js-bsv-amount">BSV Amout</label>
        <input type="number" id="js-bsv-amount">

        <label for="js-serial-nr">Serial Nummber</label>
        <input type="number" id="js-serial-nr">

        <button id="js-makeOffer-btn" class="button button--make-offer">Make an offer</button> <br>
        <button id = "js-ispect-btn" class="button button--inspect-offer" >Inspect offer</button>
      </form>

        <div id="js-card__description" class = "card__description">
          <div class ="card-description__wrap">
            <h4>${details.data.name}</h4>
            <div class="details-description--label"><label for="">Event description</label></div>
            <div  class="details-description"><p>${details.data.description}</p></div>
            <div class="details-description--label"><label for="">Legal terms</label></div>
            <div class="details-description"><p>${details.data.properties.legal.terms}</p></div>
            <div class="details-description--label"><label for="">Issuer</label></div>
            <div class="details-description"><p>${details.data.properties.issuer.organisation}</p></div>
            <div class="details-description--label"><label for="">Owned Tickets</label></div>
            <div class="details-description"><p>${ticket.sn.length} of ${details.data.total_supply}</p></div>
            <div class="align-button"><button id="listForSaleBtn" class="button button--list-for-sale">List For Sale</button></div>
            <div class="details-description"></div>
            </div>
            
            <div class="details-description details-description--whatsonchain"><p><a href="https://whatsonchain.com/tx/${details.data.contract_txs}">Whatsonchain.com</a></p></div>
            <button class="button button--show-send-form" id="js-show-send-form">Send Ticket</button>
            <div class="send__container">
                <form class="send-to-paymail__form" action="">
                    <label for="js-address">Send To Paymail:</label>
                    <input placeholder="12088@relysia.com" type="text" id="js-address">

                    <div class="btn__container">
                      <div class="send-btn--child">
                          <input type="button" id="send__btn" class="button button--send" value="Send"></input>
                          <p id="send__response--js"></p>
                      </div>
                    </div>
                </form>
            </div>  
        </div>          
            `;
            

            const sendContainer = document.querySelector('.send__container')
            const showSendForm = document.querySelector("#js-show-send-form");

            showSendForm.addEventListener("click", () => {
                sendContainer.classList.toggle("is-hidden");
            });

            const serialNumberArray = ticket.sn;
            const randomIndex = Math.floor(Math.random() * serialNumberArray.length);
            const serialNumber = serialNumberArray[randomIndex];



            const sendBtn = document.querySelector('#send__btn');
            const address = document.querySelector('#js-address');

            sendBtn.addEventListener('click', () => {
                sendToken(address, serialNumber);
            })

            console.log("createHtml()--sn",serialNumberArray)
            console.log("createHtml()--sn",serialNumber)

            
            
            const listForSaleBtnElement = document.querySelector('#listForSaleBtn');
            const listForSaleElement = document.querySelector('#js-list-for-sale__form')
            const cardDescriptionElement = document.querySelector("#js-card__description")
            
            listForSaleBtnElement.addEventListener('click', ()  => {
              cardDescriptionElement.classList.add("is-invisible");
              listForSaleElement.classList.remove("is-hidden")
              if (cardDescriptionElement.classList.contains("is-invisible")) {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });
              }
            })
            
            const exitButton = document.querySelector("#js-button--exit")
            exitButton.addEventListener("click", () => {
              event.preventDefault();
              cardDescriptionElement.classList.remove("is-invisible");
              listForSaleElement.classList.add("is-hidden")
            })

            const makeOfferBtn = document.querySelector("#js-makeOffer-btn");
            makeOfferBtn.addEventListener('click', () => {
              event.preventDefault();
              createOffer();
            });
};

//NOTE: Send functionality
const sendToken = async function (address, serialNumber) {

    console.log("sendToken()--sn",serialNumber)
    console.log("sendToken()--address",address.value)

    const data = {
      "dataArray": [{
        "to": address.value,
        "sn": serialNumber, 
        "tokenId": id,
        "amount": 1,
      }]
    };
    const headers = {
      "Content-Type": "application/json",
      "authToken": localStorage.getItem("token")
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    };
    
  
    try {
      const response = await fetch("https://api.relysia.com/v1/send", options);
      const json = await response.json();
      const data = json.data;
      console.log("json", json)
      console.log("Data",data)
    
    } catch (error) {
      console.error("error", data)
      p.innerHTML = JSON.stringify(data.msg, null, "<br/>");
      return error.message;
    }
};

console.log("id :", id )

//Create an offer that lists on the echange page.
// let createOffer = async function () {
//   try {
//     const config = {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', "authToken": localStorage.getItem("token") },
//       body: JSON.stringify({
//         "dataArray": [
//           {
//             "tokenId": id,
//             "sn": 5,
//             "amount": 1,
//             "wantedAmount": 0.0001,
//             "type": "BSV"
//           }
//         ]
//       })
//     };
//     const response = await fetch('https://api.relysia.com/v1/offer', config);
//     const data = await response.json();
//     const hex = data.data.contents[0];
//     console.log("data: ", data);
//     console.log("hex: ", hex);


//     // Insert data into Firestore
//     const addHexToFirebase = async () => {
//       try {
//         const hexObject = JSON.parse(`{"hex": "${hex}"}`);;
//         const docRef = await addDoc(hexValuesCollection, hexObject);
//         console.log('Document written with ID: ', docRef.id);
//       } catch (e) {
//         console.error('Error adding document: ', e);
//       }
//     };
    
//     addHexToFirebase();
//     return hex

//     } catch (error) {
//       console.log(error);
//       return error.message;
//     }
// };

//Create an offer that lists on the echange page. try exchange endpoint
let createOffer = async function () {
  try {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authToken": localStorage.getItem("token") 
      },
      body: JSON.stringify({
          "dataArray": [
            {
              "tokenId": "faa1a4e103d3ab9f050a48991e03040290dac01e-YE",
              "sn": 50,
              "amount": 1e-8,
              "type": "BSV",
              "payment": [
                {
                  "to": "14tw3sEyubapmzStR1BcmxnfGYXs9jAdFi",
                  "amount": 1e-8
                }
              ]
            }
          ]
      })
    };
    const response = await fetch('https://api.relysia.com/v1/exchangeOffer', config);
    const data = await response.json();
    const hex = data.data.contents[0].swapOfferHex;
    const swapId = data.data.contents[0].swapId;
    console.log("data: ", data);
    console.log("swapId: ", swapId);
    console.log("hex: ", hex);


    // Insert data into Firestore
    const addHexToFirebase = async () => {
      try {
        const hexObject = JSON.parse(`{"hex": "${hex}"}`);;
        const swapIdObject = JSON.parse(`{"Swap-ID": "${swapId}"}`);;
        const docRef = await addDoc(hexAndSwapIdCollection, swapIdObject, hexObject);
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    };
    addHexToFirebase();
    return hex

    } catch (error) {
      console.log(error);
      return error.message;
    }
};


const hexDataArray = [
  {
    swapHex:
    "0100000001795b669b4b6be5881185386e5d862ac073bfcea573652409183a715fb1e11d10000000006b483045022100be8285cbf421170f4210eecf53dc00c5a087de8fec75d7e9c3d4f305bfdca8d6022043a76b7e8f0c9acec614a1b39b6129becf4f5f46fdc3523ec01cfcddbd5978c4c3210305f951df78086dc1a94c709f3c3ca3dd9562e6e01d47552d9b4985abcf256d8dffffffff0110270000000000001976a914ee6b25c9c9ecb9bb48c368d9494ccfe83c8ee2f988ac00000000"
  }
];



// inspectAtomicSwapOffer(dataArray);

// const addHexToFirebase = async () => {
//   try {
//     const docRef = await addDoc(usersRef, newUser);
//     console.log('Document written with ID: ', docRef.id);
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
// };

// addHexToFirebase();

// async function inspectAtomicSwapOffer (swapHex) {
//     try {
//       const response = await fetch('https://api.relysia.com/v1/inspect', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           "authToken": localStorage.getItem("token")
//         },
//         body: dataArray[{}] JSON.stringify [{
//           "swapHex": "0100000001795b669b4b6be5881185386e5d862ac073bfcea573652409183a715fb1e11d10000000006b483045022100be8285cbf421170f4210eecf53dc00c5a087de8fec75d7e9c3d4f305bfdca8d6022043a76b7e8f0c9acec614a1b39b6129becf4f5f46fdc3523ec01cfcddbd5978c4c3210305f951df78086dc1a94c709f3c3ca3dd9562e6e01d47552d9b4985abcf256d8dffffffff0110270000000000001976a914ee6b25c9c9ecb9bb48c368d9494ccfe83c8ee2f988ac00000000",
//       }]
//       });
  
//       const data = await response.json();
  
//       console.log(data);
  
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
  
//   inspectAtomicSwapOffer();
// inspectBtn.addEventListener('click', (event) => {
//   event.preventDefault();
//   // inspect offer();
// });




// "0100000001795b669b4b6be5881185386e5d862ac073bfcea573652409183a715fb1e11d10000000006b483045022100be8285cbf421170f4210eecf53dc00c5a087de8fec75d7e9c3d4f305bfdca8d6022043a76b7e8f0c9acec614a1b39b6129becf4f5f46fdc3523ec01cfcddbd5978c4c3210305f951df78086dc1a94c709f3c3ca3dd9562e6e01d47552d9b4985abcf256d8dffffffff0110270000000000001976a914ee6b25c9c9ecb9bb48c368d9494ccfe83c8ee2f988ac00000000"

