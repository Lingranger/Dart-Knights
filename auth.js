document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      // Store user data locally (insecure, for demo only)
      localStorage.setItem('user', JSON.stringify({ email, password }));
      alert('Account created! Please login.');
      window.location.href = 'login.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser && email === storedUser.email && password === storedUser.password) {
        window.location.href = 'Players.html'; // Redirect after login
      } else {
        alert('Invalid email or password.');
      }
    });
  }
});
