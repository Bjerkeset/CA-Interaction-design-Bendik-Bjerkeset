import RelysiaSDK from 'relysia';
import { redirectToLoginPage, setupSignOutButton } from "./assets.js";
const relysia = new RelysiaSDK();

// NOTE: Get DOM elements from the DOM
const formElement = document.querySelector('#form__js');
const nameElement = document.querySelector('#name__js');
const subjectElement = document.querySelector("#subject__js")
const addressElement = document.querySelector("#address__js")
const nameMessageContainerElement = document.querySelector('#message-container__js--name');
const messageContainerElement = document.querySelector("#message-container")
const subjectMessageContainerElement = document.querySelector('#message-container__js--subject');
const addressMessageContainerElement = document.querySelector('#message-container__js--address');
const successMessage = document.querySelector(".successMessage__js");
const resetButton = document.querySelector('button[type="reset"]');
const submitButton = formElement.querySelector('button[type="submit"]');
const validationContainer = document.querySelectorAll(".validation__container")

// NOTE: Deletes local storage and rederects to login. 
setupSignOutButton();

function validateForm(event) {
  event.preventDefault();
  const nameInput = nameElement.value;
  const nameRegex = /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/; // NOTE: Must be min 2 words with min 2 characters divided by min 1 space.
  const isValidName = nameRegex.test(nameInput);
  
  const subjectInput = subjectElement.value;
  const subjectRegex = /^.{10,}$/ // NOTE: String of with minimum length of 10.
  const isValidSubject = subjectRegex.test(subjectInput)
  
  const addressInput = addressElement.value;
  const addressRegex = /^.{25,}$/ // NOTE: String of with minimum length of 25.
  const isValidAddress = addressRegex.test(addressInput)
  
  // NOTE: NOT IN USE: Stores email and password for use as parameters in fetchAuthToken()
    //   localStorage.setItem("email", emailElement.value);
    //   localStorage.setItem("password", passwordElement.value)      
  
  if (!isValidName) {
    nameMessageContainerElement.textContent = "Please enter a valid name";
    nameMessageContainerElement.classList.add("error");
    return false
  } 
  if (!isValidSubject) {
    subjectMessageContainerElement.textContent = "Please enter a valid subject";
    subjectMessageContainerElement.classList.add("error");
    return false
  }
  if (!isValidAddress) {
    addressMessageContainerElement.textContent = "Please enter a valid address";
    addressMessageContainerElement.classList.add("error");
    return false
  }
  else {
    // NOTE: Disables the submit button
    submitButton.disabled = true;
    console.log("submit disabled")
    return true;
  }
}

formElement.addEventListener("submit", function(event) {
  const isFormValid = validateForm(event) === true;

  if (isFormValid) {
    successMessage.textContent = "Success!!";
  }
  return false;
});


// NOTE: Removes success message and enables submit button
resetButton.addEventListener("click", function() {
  successMessage.textContent = "";
  submitButton.disabled = false; 
  
// NOTE: Removes error message and error class
  for (let i = 0; i < validationContainer.length; i++) {
    validationContainer[i].innerHTML = "";
    validationContainer[i].classList.remove("error");
}
});

//Removes error class and changes HTML content.  
function removeErrorClass(event) {
    const validationContainer = event.target.nextElementSibling;
    validationContainer.classList.remove("error");
    validationContainer.innerHTML = "";
  }
  
  nameElement.addEventListener("click", removeErrorClass);
  subjectElement.addEventListener("click", removeErrorClass);
  addressElement.addEventListener("click", removeErrorClass);
