document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Basic fake validation (you can improve this with localStorage or Firebase later)
      if (email === 'test@example.com' && password === 'password123') {
        window.location.href = 'Players.html'; // Redirect after login
      } else {
        alert('Invalid credentials. Try test@example.com / password123');
      }
    });
  }
});
