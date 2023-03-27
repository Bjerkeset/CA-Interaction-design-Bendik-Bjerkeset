import RelysiaSDK from 'relysia';
import { redirectToLoginPage, setupSignOutButton } from "./assets.js";
const relysia = new RelysiaSDK();

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

            // console.log("createHtml()--sn",serialNumberArray)
            // console.log("createHtml()--sn",serialNumber)

            
            
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
let createOffer = async () => {
  try {
    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "authToken": localStorage.getItem("token") },
      body: JSON.stringify({
        "dataArray": [
          {
            "tokenId": id,
            "sn": 15,
            "amount": 1,
            "wantedAmount": 0.0001,
            "type": "BSV"
          }
        ]
      })
    };
    const response = await fetch('https://api.relysia.com/v1/offer', config);
    const data = await response.json();
    const hex = data.data.contents
    console.log("data: ", data)
    console.log("hex: ", hex)
  
  } catch (error) {
    console.log(error);
    return error.message;
  }
  };

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

  // inspect offer();
  inspectAtomicSwapOffer('swap hex here');
});
  

