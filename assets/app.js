(function () {
  var key = "night-commando-clone-theme";
  var body = document.body;
  var button = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    body.classList.toggle("dark", theme === "dark");
  }

  var stored = localStorage.getItem(key);
  applyTheme(stored || "light");

  if (button) {
    button.addEventListener("click", function () {
      var next = body.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem(key, next);
      applyTheme(next);
    });
  }
})();
