import RelysiaSDK from 'relysia';
import { redirectToLoginPage, setupSignOutButton, toggleHamburgerMenu } from "./assets.js";
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

//NOTE: 
let authToken = "";


// NOTE: Get containers from the DOM and store value in variables. 
const listContainer = document.querySelector('#js-list-container');
const loadingIndicator = document.querySelector("#js-loading-indicator");  
const errorContainer = document.querySelector("#js-error-container");
const searchInput = document.querySelector('#search-input');
      
// NOTE: Fetching the auth token using loggin details. 
export async function fetchAuthToken() {
  try {
    //NOTE: Loggin detail from local storage or defult values.  
    const response = await relysia.auth({ email: localStorage.getItem("email"), password: localStorage.getItem("password") });

    const token = response.token
    authToken = token; 
    localStorage.setItem("token", authToken);
    // console.log("token", response.token)

    fetchTickets();
    return token;
    
  } catch (error) {
    console.error("Error fetching auth token:", error);
    errorContainer.innerHTML = ("error", error);
    return null;
  }
}
      
// NOTE: fetching list. 
async function fetchTickets() {
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
      console.log("fetchtickets()",data)
      
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
      
      

