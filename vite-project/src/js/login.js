// NOTE: Get DOM elements from the DOM
const formElement = document.querySelector('#form__js');
const emailElement = document.querySelector('#email__js');
const passwordElement = document.querySelector('#password__js');
const nameMessageContainerElement = document.querySelector('#message-container__js--name');
const messageContainerElement = document.querySelector("#message-container")
const emailMessageContainerElement = document.querySelector('#message-container__js--email');
const passwordMessageContainerElement = document.querySelector('#message-container__js--password');
const successMessage = document.querySelector(".validation__container--success");
const resetButton = document.querySelector('button[type="reset"]');
const submitButton = formElement.querySelector('button[type="submit"]');
const validationContainer = document.querySelectorAll(".validation__container")

function validateForm(event) {
  event.preventDefault();
  
  const emailInput = emailElement.value;
//   const emailRegex = /^bb\.bjerk@gmail\.com$/i // NOTE: Must match (upper or lowercase).
  const emailRegex = /^(bruce@hotmail\.com|bb\.bjerk@gmail\.com)$/ // NOTE: Must match (upper or lowercase).
  const isValidEmail = emailRegex.test(emailInput)

  const passwordInput = passwordElement.value;
  const passwordRegex =  /^(?:@TKeb2qQ6uU8|relysia)$/ // NOTE: Must match exactly
//   const passwordRegex = /^@TKeb2qQ6uU8$/ // NOTE: Must match exactly
  const isValidPassword = passwordRegex.test(passwordInput)  

  if (!isValidEmail) {
    emailMessageContainerElement.textContent = "Please enter a valid email";
    emailMessageContainerElement.classList.add("error");
  }
  if (!isValidPassword) {
    passwordMessageContainerElement.textContent = "Please enter a valid Password";
    passwordMessageContainerElement.classList.add("error");
  }

  else {
    // NOTE: Disables the submit button
    submitButton.disabled = true;
    return true;
  }
}

formElement.addEventListener("submit", function(event) {
  const isFormValid = validateForm(event);
  event.preventDefault();

  if (isFormValid) {
    // successMessage.textContent = "Success!!";
    successMessage.classList.remove('is-hidden');
    successMessage.classList.add('fade-in');
      // NOTE: NOT IN USE: Stores email and password for use as parameters in fetchAuthToken()
      localStorage.setItem("email", emailElement.value);
      localStorage.setItem("password", passwordElement.value)

    setTimeout(() => {
    window.location.href = 'index.html';
    console.log("redirect")
  }, 1000);
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

emailElement.addEventListener("click", removeErrorClass);
passwordElement.addEventListener("click", removeErrorClass);