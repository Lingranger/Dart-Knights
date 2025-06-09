document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      // Simple fake signup logic (no real backend)
      alert('Account created successfully!');
      window.location.href = 'login.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      // Fake login logic (for demo only)
      if (email && password) {
        window.location.href = 'Players.html'; // redirect after fake login
      } else {
        alert('Please enter valid login credentials.');
      }
    });
  }
});
