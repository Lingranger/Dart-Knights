document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Signup successful!');
      // Simulate saving user data and redirect to login
      window.location.href = 'login.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Login successful!');
      // Simulate login success and redirect to Players.html
      window.location.href = 'Players.html';
    });
  }
});
