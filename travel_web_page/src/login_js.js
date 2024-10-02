const signUpButton = document.getElementById('signUpOverlay');
const signInButton = document.getElementById('signInOverlay');
const container = document.getElementById('container');

// For demonstration, let's assume the correct email and password
const correctEmail = "";
const correctPassword = "";

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Function to validate and redirect
document.getElementById('signIn').addEventListener('click', () => {
    const emailInput = document.querySelector('.sign-in-container input[type="email"]');
    const passwordInput = document.querySelector('.sign-in-container input[type="password"]');

    const email = emailInput.value;
    const password = passwordInput.value;

    // Basic validation (you can replace this with more robust logic)
    if (email === correctEmail && password === correctPassword) {
        // Redirect to home.html
        window.location.href = 'home.html';
    } else {
        alert("Invalid email or password.");
    }
});
