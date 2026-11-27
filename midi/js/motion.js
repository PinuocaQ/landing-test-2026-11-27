(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".toggle");
  var links = document.querySelectorAll(".nav-links a");
  var lineA = document.querySelector(".line-a");
  var lineB = document.querySelector(".line-b");

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    if (lineA && lineB) {
      if (open) {
        lineA.setAttribute("d", "M7 7l10 10");
        lineB.setAttribute("d", "M17 7L7 17");
      } else {
        lineA.setAttribute("d", "M5 8h14");
        lineB.setAttribute("d", "M5 16h14");
      }
    }
    if (open) {
      var cap = 400;
      var step = Math.min(60, cap / Math.max(links.length, 1));
      links.forEach(function (a, i) {
        a.classList.remove("is-shown");
        window.setTimeout(function () { a.classList.add("is-shown"); }, reduce ? 0 : i * step);
      });
    } else {
      links.forEach(function (a) { a.classList.remove("is-shown"); });
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  links.forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  var reveals = document.querySelectorAll(".reveal");
  if (reduce) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  var host = document.getElementById("tagline-text");
  if (host) {
    var raw = host.getAttribute("data-words") || host.getAttribute("data-text") || "";
    var words = raw.split("|").map(function (w) { return w.trim(); }).filter(Boolean);
    host.textContent = "";
    words.forEach(function (w) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      host.appendChild(span);
    });
    var wordEls = host.querySelectorAll(".word");
    function turnOn() {
      if (host.getAttribute("data-done") === "1") return;
      host.setAttribute("data-done", "1");
      if (reduce) {
        wordEls.forEach(function (w) { w.classList.add("is-on"); });
        return;
      }
      wordEls.forEach(function (w, i) {
        window.setTimeout(function () { w.classList.add("is-on"); }, i * 220);
      });
    }
    if (reduce) {
      turnOn();
    } else if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          turnOn();
          tio.disconnect();
        });
      }, { threshold: 0.4 });
      tio.observe(host.closest(".tagline") || host);
    } else {
      turnOn();
    }
  }
})();
