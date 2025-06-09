document.addEventListener('DOMContentLoaded', () => {
  // Login Logic
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      if (email === storedEmail && password === storedPassword) {
        window.location.href = 'players.html'; // or index.html
      } else {
        alert('Invalid email or password.');
      }
    });
  }

  // Signup Logic
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      // Save to localStorage (simulate registration)
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);

      alert('Signup successful! Redirecting to login...');
      window.location.href = 'login.html';
    });
  }
});
