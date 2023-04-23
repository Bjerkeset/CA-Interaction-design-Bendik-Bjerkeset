// Redirects the user if not logged in. 
export function redirectToLoginPage() {
    const authToken = localStorage.getItem("token");
  
    if (!authToken) {
      window.location.href = "login.html";
    }
}

//Clears the local storage and redirects user to login page 
export function setupSignOutButton() {
const signOutButton = document.getElementById("sign-out-button");

    if (signOutButton) {
        signOutButton.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
        });
    };
};

//Expands menu when clicked. 
export function toggleHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navbarList = document.querySelector('.navbar__list-ul');
    hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('is-active');
    navbarList.classList.toggle('is-active');
});

};

//Get User data. 
export async function getUserDetails() {
    try {
      const response = await fetch('https://api.relysia.com/v1/user', {
        headers: {
            "authToken": localStorage.getItem("token"),
        }
      });
      const data = await response.json();
      console.log("getUserDetails(), User data: ",data)
      return data;
    } catch (error) {
      console.error(error);
    }
  }

