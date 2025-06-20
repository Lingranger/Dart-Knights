document.getElementById("logout-button").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("userLoggedIn");
  sessionStorage.removeItem("userSessionLogged");
  window.location.href = "advertisement.html";
});
