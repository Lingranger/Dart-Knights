document.getElementById("logout-button").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  localStorage.removeItem("userLoggedIn");
  sessionStorage.removeItem("userSessionLogged");
  window.location.href = "advertisement.html";
});
