document.addEventListener("DOMContentLoaded", function () {
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  var pillarCards = Array.prototype.slice.call(document.querySelectorAll("[data-pillar-card]"));
  var signalButtons = Array.prototype.slice.call(document.querySelectorAll("[data-signal-target]"));
  var taskList = document.querySelector("[data-task-list]");
  var flexTask = document.querySelector("[data-flex-task]");
  var rescheduleButton = document.querySelector("[data-reschedule-btn]");
  var widgetStatus = document.querySelector("[data-widget-status]");

  function setDecodedState() {
    body.classList.add("is-decoded");
    body.classList.remove("is-decoding");
  }

  if (prefersReduced) {
    setDecodedState();
  } else {
    body.classList.add("is-decoding");
    window.setTimeout(setDecodedState, 900);
  }

  function setActivePillar(targetId, shouldScroll) {
    var target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    pillarCards.forEach(function (card) {
      card.classList.toggle("is-active", card.id === targetId);
    });

    signalButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-signal-target") === targetId);
      button.setAttribute("aria-current", button.getAttribute("data-signal-target") === targetId ? "true" : "false");
    });

    if (shouldScroll) {
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
    }
  }

  signalButtons.forEach(function (button) {
    var targetId = button.getAttribute("data-signal-target");
    if (!targetId) {
      return;
    }

    button.addEventListener("pointerenter", function () {
      setActivePillar(targetId, false);
    });

    button.addEventListener("focus", function () {
      setActivePillar(targetId, false);
    });

    button.addEventListener("click", function () {
      setActivePillar(targetId, true);
    });
  });

  if (pillarCards.length > 0) {
    setActivePillar(pillarCards[0].id, false);
  }

  if (taskList && flexTask && rescheduleButton && widgetStatus) {
    var taskTime = flexTask.querySelector("[data-task-time]");
    var originalState = {
      day: flexTask.getAttribute("data-original-day"),
      time: flexTask.getAttribute("data-original-time"),
      label: "Essay outline",
      status: "The planner keeps the day stable until a new constraint appears.",
      button: "Reschedule flex task",
      isShifted: false,
    };
    var shiftedState = {
      day: flexTask.getAttribute("data-rescheduled-day"),
      time: flexTask.getAttribute("data-rescheduled-time"),
      label: "Moved later",
      status: "Essay outline moved to Wednesday evening so the earlier work stays intact.",
      button: "Restore original slot",
      isShifted: true,
    };
    var isShifted = false;

    function renderTaskState() {
      var state = isShifted ? shiftedState : originalState;
      flexTask.classList.toggle("is-shifted", isShifted);
      flexTask.setAttribute("data-current-day", state.day);
      taskTime.textContent = state.time;
      flexTask.setAttribute("aria-label", state.label + ", " + state.day + " " + state.time);
      widgetStatus.textContent = state.status;
      rescheduleButton.textContent = state.button;

      if (isShifted) {
        taskList.appendChild(flexTask);
      } else {
        taskList.insertBefore(flexTask, taskList.children[1]);
      }
    }

    rescheduleButton.addEventListener("click", function () {
      isShifted = !isShifted;
      renderTaskState();
      flexTask.classList.add("pulse");
      window.setTimeout(function () {
        flexTask.classList.remove("pulse");
      }, prefersReduced ? 0 : 500);
    });
  }
});
