import RelysiaSDK from 'relysia';
import { redirectToLoginPage, setupSignOutButton, toggleHamburgerMenu, getUserDetails } from "./assets.js";
// import { pay } from 'relysia/src/validator.js';
const relysia = new RelysiaSDK();

// NOTE: Calling rederect function after fetching the API. 
setTimeout(() => {
  redirectToLoginPage();
}, 4000);

// NOTE: Deletes local storage and rederects to login. 
setupSignOutButton();

//NOTE: Fetching authtoken and storing in local storage. 
fetchAuthToken();

// NOTE: toggleHamburgerMenu();
toggleHamburgerMenu();

// NOTE: Fetches user details form an imported function at assets.js.
getUserDetails();

// NOTE: etches wallets and address formats. Toggles wallets and stores them in local storage. 
fetchAndStoreWalletId();

// NOTE: Get containers from the DOM and store value in variables. 
const listContainer = document.querySelector('#js-list-container');
const loadingIndicator = document.querySelector("#js-loading-indicator");  
const errorContainer = document.querySelector("#js-error-container");
const searchInput = document.querySelector('#search-input');

let authToken = "";


async function fetchAndStoreWalletId() {
  try {
    const response = await fetch('https://api.relysia.com/v1/wallets', {
      headers: {
        "authToken": localStorage.getItem("token")
      }
    });
    const data = await response.json();
    // Log the number of wallets
    const wallets = data.data.wallets;
    // console.log("fetchAndStoreWalletId() data: ",data)
    // console.log('Number of wallets:', wallets);

    // Create a list of wallet names with click event listeners
    const walletList = document.querySelector('#wallet-list');
    for (let i = 0; i < wallets.length; i++) {
      const walletItem = document.createElement('li');
      const walletId = wallets[i].walletID
      walletItem.textContent = `Wallet ${i+1}`;
      // console.log("wallet ID:", walletId);

      //Fetches the Paymail and displays it in the Dom.
      const paymail = await getAddressFormats(walletId);
      walletItem.innerHTML = paymail
      // console.log('Paymail:', paymail);

      // Outlines the selected wallet.
      if (localStorage.getItem('walletID') === walletId) {
        walletItem.classList.add('is-selected');
      }

      walletItem.addEventListener('click', () => {
        localStorage.setItem('walletID', wallets[i].walletID);
        location.reload();
        console.log('Wallet ID stored in local storage:', wallets[i].walletID);
      });
      walletList.appendChild(walletItem);
    }
  } catch (error) {
    console.error('Error fetching wallet ID:', error);
  }
}

// Fetch the paymail, and call it inside of fetchAndStoreWalletId(). 
async function getAddressFormats(walletId) {
  const url = 'https://api.relysia.com/v1/address';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'walletID': walletId,
        'authToken': localStorage.getItem('token')
      }
    });
    const data = await response.json();
    const paymail = data.data.paymail;
    return paymail

  } catch (error) {
    console.error(`Fetch error: ${error}`);
  }
}
      
// NOTE: Fetching the auth token using loggin details. 
export async function fetchAuthToken() {
  try {
    //NOTE: Loggin detail from local storage or defult values.  
    const response = await relysia.auth({ email: localStorage.getItem("email"), password: localStorage.getItem("password") });

    const token = response.token
    authToken = token; 
    localStorage.setItem("token", authToken);
    // console.log("token", response.token);

    // const walletIdOne = '00000000-0000-0000-0000-000000000000';
    // const walletIdTwo = '1e0a7cb3-4a12-4b7f-bdd0-ea936c99902a';
    const walletID = localStorage.getItem("walletID")
    fetchTickets(walletID);
    return token;
    
  } catch (error) {
    console.error("Error fetching auth token:", error);
    errorContainer.innerHTML = ("error", error);
    return null;
  }
}

// NOTE: fetching list. 
async function fetchTickets(walletID) {
  try {
      loadingIndicator.classList.add("show"); // Show the loading indicator
      const url = "https://api.relysia.com/v2/balance";
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "authToken": localStorage.getItem("token"),
              "walletID": walletID
          },
      });
      const data = await response.json();
      
      const tickets = data.data.coins;
      // console.log("fetchtickets()",data)
      
      //NOTE: looping response object. 
      for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i];            

          if (!ticket.splitable && !ticket.balance) {  // Only loop none-splitteble tokens (NTF's). 
            listContainer.innerHTML += renderTickets(ticket);
          }
      }

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        const sn = ticket.sn;
      }

      } catch (error) {
          console.error("Error fetching balance", error);
          errorContainer.innerHTML = ("error", error);

      } finally {
          loadingIndicator.classList.remove("show"); // NOTE: Hide the loading indicator
    }
}
      
function renderTickets(ticket) {
    if (ticket.name && ticket.symbol && ticket.supply) {  // NOTE: Check for required properties
      return `
            <div class="card__container"> 
              <a href="/details.html?id=${ticket.tokenId}">
              <div class="card__details card">                                                                                                                                                                    
                <div class="card__detail card__name"><h2 class= "name">${ticket.name}</h2></div>                                                                                                                                                                                                                                                                                                          
                <div class="card__detail card__symbol"><p>Sym: ${ticket.symbol}</p></div>                                                                                                                                                                                                                                                                                                   
                <div class="card__detail card__protocole"><p> ${ticket.protocol} Token</p></div>                                                                                                                                                                                                                                                                                                   
                <p class="card__detail card__supply">${ticket.sn.length} / ${ticket.supply}</p>
                <button class="button button--view-details">View Ticket</button>
                </div>                                                                                                                                                                                                                                                                                                          
              </div>
              </a>
            </div>
              `;
    } else {
      return undefined;
    }
};

searchInput.addEventListener('input', function () {
  const searchTerm = searchInput.value.toLowerCase().trim(); 
  filterTickets(searchTerm);
});

// NOTE: Search function
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  filteredTickets = tickets.filter(ticket => ticket.name.toLowerCase().includes(searchTerm) || ticket.symbol.toLowerCase().includes(searchTerm));
  renderFilteredTickets();
}

function filterTickets(searchTerm) {
  const tickets = document.querySelectorAll('.card');
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    const name = ticket.querySelector('.name').textContent.toLowerCase(); 

    if (name.includes(searchTerm)) {
      ticket.style.display = '';
    } else {
      ticket.style.display = 'none'; 
    }
  }
}
      
      

