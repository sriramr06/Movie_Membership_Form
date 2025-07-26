document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginForm = document.querySelector('.form-box.login form');
  const registerForm = document.querySelector('.form-box.register form');
  const container = document.querySelector('.container');
  const registerLink = document.querySelector('.register-link');
  const loginLink = document.querySelector('.login-link');
  const planSelect = document.getElementById('planSelect');
  const planCost = document.getElementById('planCost');
  const clearButton = document.getElementById('clearButton');
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  const popupClose = document.querySelector('.popup-close');
  const popupButtons = document.getElementById('popup-buttons');
  const confirmBtn = document.querySelector('.confirm-btn');
  const cancelBtn = document.querySelector('.cancel-btn');

  // Mobile Responsive Functions
  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function adjustRegisterFormLayout() {
    const innerRegister = document.querySelector('.inner-register');
    if (isMobileView()) {
      innerRegister.style.flexDirection = 'column';
      document.querySelectorAll('.panel').forEach((panel) => {
        panel.style.width = '100%';
      });
    } else {
      innerRegister.style.flexDirection = 'row';
      document.querySelectorAll('.panel').forEach((panel) => {
        panel.style.width = '48%';
      });
    }
  }

  function updateContainerHeight() {
    const container = document.querySelector('.container');
    if (isMobileView() && container.classList.contains('active')) {
      const registerForm = document.querySelector('.form-box.register');
      const height = registerForm.scrollHeight + 40;
      container.style.height = `${height}px`;
    }
  }

  // Plan prices
  const planPrices = {
    basic: '₹299/month',
    premium: '₹599/month',
    elite: '₹899/month',
    family: '₹1199/month',
  };

  // Form Toggle with Mobile Support
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.add('active');
    setTimeout(updateContainerHeight, 10);
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.remove('active');
    container.style.height = '';
    if (isMobileView()) {
      container.style.height = '540px';
    }
  });

  // Plan Selection Handler
  planSelect.addEventListener('change', function () {
    const selectedPlan = this.value;
    if (planPrices[selectedPlan]) {
      planCost.textContent = planPrices[selectedPlan];
      hideError(this);
    } else {
      planCost.textContent = '';
      showError(this, 'Please select a plan');
    }
  });

  // Password Toggle Functionality
  function setupPasswordToggle(passwordId, toggleId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleIcon = document.getElementById(toggleId);

    toggleIcon.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.innerHTML = '<ion-icon name="eye"></ion-icon>';
      } else {
        passwordInput.type = 'password';
        toggleIcon.innerHTML = '<ion-icon name="eye-off"></ion-icon>';
      }
    });
  }

  setupPasswordToggle('loginPassword', 'toggleLoginPassword');
  setupPasswordToggle('registerPassword', 'toggleRegisterPassword');
  setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');

  // Clear Form Functionality
  clearButton.addEventListener('click', function () {
    showConfirmationPopup('Are you sure you want to clear the form?', () => {
      registerForm.reset();
      planCost.textContent = '';

      const errorMessages = registerForm.querySelectorAll('.error-message');
      errorMessages.forEach((error) => {
        error.textContent = '';
        error.style.display = 'none';
      });

      const inputBoxes = registerForm.querySelectorAll('.input-box');
      inputBoxes.forEach((box) => {
        box.classList.remove('error');
      });
    });
  });

  // Popup System
  function showPopup(message, type = 'success') {
    popup.className = 'popup ' + type;
    popupMessage.textContent = message;
    popupButtons.style.display = 'none';
    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000);
  }

  function showConfirmationPopup(message, confirmCallback) {
    popup.className = 'popup warning';
    popupMessage.textContent = message;
    popupButtons.style.display = 'flex';
    popup.classList.add('show');

    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));

    const newConfirmBtn = document.querySelector('.confirm-btn');
    const newCancelBtn = document.querySelector('.cancel-btn');

    newConfirmBtn.addEventListener('click', () => {
      popup.classList.remove('show');
      confirmCallback();
    });

    newCancelBtn.addEventListener('click', () => {
      popup.classList.remove('show');
    });
  }

  popupClose.addEventListener('click', () => {
    popup.classList.remove('show');
  });

  // Validation Functions
  function isValidEmail(email) {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  function isValidMobile(mobile) {
    return /^\d{10}$/.test(mobile);
  }

  function isValidPassword(password) {
    return password.length >= 8;
  }

  function isValidName(name) {
    return name.trim().length > 0;
  }

  function isValidDateOfBirth(dob) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(dob)) return false;

    const parts = dob.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return false;
    }

    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - month;

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age--;
    }

    return age >= 10 && age <= 120;
  }

  // Error Handling
  function showError(inputElement, message) {
    const errorElement = document.getElementById(`${inputElement.id}Error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      inputElement.parentElement.classList.add('error');
    }
  }

  function hideError(inputElement) {
    const errorElement = document.getElementById(`${inputElement.id}Error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
      inputElement.parentElement.classList.remove('error');
    }
  }

  function validateField(inputElement, validationFn, errorMessage) {
    const value = inputElement.value.trim();
    if (!value) {
      showError(inputElement, 'This field is required');
      return false;
    }
    if (validationFn && !validationFn(value)) {
      showError(inputElement, errorMessage);
      return false;
    }
    hideError(inputElement);
    return true;
  }

  // Field Validation Setup
  function setupFieldValidation(form) {
    const inputs = form.querySelectorAll('input, select');

    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.required) {
          validateField(input);
        }
      });

      input.addEventListener('input', () => {
        if (input.value.trim()) {
          if (input.id === 'mobile') {
            validateField(
              input,
              isValidMobile,
              'Mobile number must be 10 digits'
            );
          } else if (
            input.id === 'loginEmail' ||
            input.id === 'registerEmail'
          ) {
            validateField(
              input,
              isValidEmail,
              'Please enter a valid email address'
            );
          } else if (
            input.id === 'loginPassword' ||
            input.id === 'registerPassword'
          ) {
            validateField(
              input,
              isValidPassword,
              'Password must be at least 8 characters'
            );
          } else if (input.id === 'firstName' || input.id === 'lastName') {
            validateField(input, isValidName, 'This field is required');
          } else if (input.id === 'dob') {
            validateField(
              input,
              isValidDateOfBirth,
              'Please enter a valid date of birth (DD-MM-YYYY)'
            );
          } else if (input.id === 'confirmPassword') {
            const password = document.getElementById('registerPassword');
            if (input.value !== password.value) {
              showError(input, 'Passwords do not match');
            } else {
              hideError(input);
            }
          } else if (input.required) {
            validateField(input);
          }
        } else {
          hideError(input);
        }
      });
    });
  }

  // Special Field Handlers
  document.getElementById('mobile').addEventListener('input', function (e) {
    const mobile = e.target;
    mobile.value = mobile.value.replace(/\D/g, '').substring(0, 10);
    if (mobile.value.length > 0) {
      validateField(mobile, isValidMobile, 'Mobile number must be 10 digits');
    } else {
      hideError(mobile);
    }
  });

  document
    .getElementById('registerPassword')
    .addEventListener('input', function () {
      const confirmPassword = document.getElementById('confirmPassword');
      if (confirmPassword.value) {
        if (confirmPassword.value !== this.value) {
          showError(confirmPassword, 'Passwords do not match');
        } else {
          hideError(confirmPassword);
        }
      }
    });

  document
    .getElementById('confirmPassword')
    .addEventListener('input', function () {
      const password = document.getElementById('registerPassword');
      if (this.value !== password.value) {
        showError(this, 'Passwords do not match');
      } else {
        hideError(this);
      }
    });

  document.getElementById('dob').addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 8) input = input.substr(0, 8);

    let formatted = '';
    for (let i = 0; i < input.length; i++) {
      if (i === 2 || i === 4) formatted += '-';
      formatted += input[i];
    }

    e.target.value = formatted;
    if (formatted.length > 0) {
      validateField(
        e.target,
        isValidDateOfBirth,
        'Please enter a valid date of birth (DD-MM-YYYY)'
      );
    } else {
      hideError(e.target);
    }
  });

  // Initialize Validation
  setupFieldValidation(loginForm);
  setupFieldValidation(registerForm);

  // Form Submissions
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    let isValid = true;
    if (
      !validateField(email, isValidEmail, 'Please enter a valid email address')
    ) {
      isValid = false;
    }
    if (
      !validateField(
        password,
        isValidPassword,
        'Password must be at least 8 characters'
      )
    ) {
      isValid = false;
    }

    if (isValid) {
      showPopup('Login successful!');
      loginForm.reset();
    }
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('registerEmail');
    const dob = document.getElementById('dob');
    const mobile = document.getElementById('mobile');
    const plan = document.getElementById('planSelect');
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    let isValid = true;
    if (!validateField(firstName, isValidName, 'First name is required'))
      isValid = false;
    if (!validateField(lastName, isValidName, 'Last name is required'))
      isValid = false;
    if (
      !validateField(email, isValidEmail, 'Please enter a valid email address')
    )
      isValid = false;
    if (
      !validateField(
        dob,
        isValidDateOfBirth,
        'Please enter a valid date of birth (DD-MM-YYYY)'
      )
    )
      isValid = false;
    if (
      !validateField(mobile, isValidMobile, 'Mobile number must be 10 digits')
    )
      isValid = false;
    if (!validateField(plan, (value) => value !== '', 'Please select a plan'))
      isValid = false;
    if (
      !validateField(
        password,
        isValidPassword,
        'Password must be at least 8 characters'
      )
    )
      isValid = false;

    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, 'Passwords do not match');
      isValid = false;
    } else if (!confirmPassword.value) {
      showError(confirmPassword, 'Please confirm your password');
      isValid = false;
    } else {
      hideError(confirmPassword);
    }

    if (isValid) {
      showPopup('Registration successful!');
      registerForm.reset();
      container.classList.remove('active');
      container.style.height = '';
      planCost.textContent = '';
    }
  });

  // Initialize Mobile Layout
  adjustRegisterFormLayout();
  window.addEventListener('resize', () => {
    adjustRegisterFormLayout();
    updateContainerHeight();
  });
});
