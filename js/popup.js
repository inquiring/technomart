"use strict";

(function () {
  var popup = document.getElementById("feedback-popup");
  var overlay = document.querySelector(".popup-overlay");

  if (!popup || !overlay) {
    return;
  }

  var closeButton = popup.querySelector(".close");
  var firstField = popup.querySelector("input, textarea, button");
  var lastTrigger = null;
  var focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])";

  function getFocusableElements() {
    return Array.prototype.slice.call(popup.querySelectorAll(focusableSelector)).filter(function (element) {
      return element.offsetParent !== null;
    });
  }

  function openPopup(trigger) {
    lastTrigger = trigger || document.activeElement;
    popup.classList.add("popup--open");
    popup.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    overlay.classList.add("popup-overlay--show");
    document.body.classList.add("modal-open");

    if (firstField) {
      firstField.focus();
    }
  }

  function closePopup() {
    popup.classList.remove("popup--open");
    popup.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    overlay.classList.remove("popup-overlay--show");
    document.body.classList.remove("modal-open");

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[aria-controls='feedback-popup']");

    if (trigger && trigger.getAttribute("href") && trigger.getAttribute("href").indexOf("#feedback-popup") !== -1) {
      event.preventDefault();
      openPopup(trigger);
      return;
    }

    if (event.target === overlay || event.target === closeButton) {
      event.preventDefault();
      closePopup();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!popup.classList.contains("popup--open")) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closePopup();
      return;
    }

    if (event.key === "Tab") {
      var focusable = getFocusableElements();

      if (!focusable.length) {
        return;
      }

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (window.location.hash === "#feedback-popup") {
    openPopup(document.querySelector("[aria-controls='feedback-popup']"));
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }
})();
