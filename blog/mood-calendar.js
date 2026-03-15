(function initMoodCalendar() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const moodColors = {
    1: "#5a1e1e",
    2: "#a14f3b",
    3: "#d2c59a",
    4: "#78a36c",
    5: "#2f7d4d"
  };

  const calendarRoot = document.getElementById("moodCalendar");
  if (!calendarRoot) return;

  const data = window.moodData || {};

  const monthLabel = calendarRoot.querySelector("[data-month-label]");
  const yearLabel = calendarRoot.querySelector("[data-year-label]");
  const grid = calendarRoot.querySelector("[data-mood-grid]");
  const prevButton = calendarRoot.querySelector("[data-nav='prev']");
  const nextButton = calendarRoot.querySelector("[data-nav='next']");

  let currentView = new Date();
  currentView = new Date(currentView.getFullYear(), currentView.getMonth(), 1);

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function renderMonth() {
    const year = currentView.getFullYear();
    const month = currentView.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthLabel.textContent = monthNames[month];
    yearLabel.textContent = String(year);
    grid.innerHTML = "";

    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = `${year}-${pad(month + 1)}-${pad(day)}`;
      const mood = data[key];
      const cell = document.createElement("div");
      cell.className = "mood-cell";

      if (moodColors[mood]) {
        cell.style.backgroundColor = moodColors[mood];
        cell.dataset.mood = String(mood);
      }

      const tooltipDate = `${monthNames[month]} ${day}`;
      cell.title = mood
        ? `${tooltipDate}\nMood: ${mood}`
        : `${tooltipDate}\nMood: none`;

      grid.appendChild(cell);
    }
  }

  prevButton.addEventListener("click", function onPrevClick() {
    currentView = new Date(currentView.getFullYear(), currentView.getMonth() - 1, 1);
    renderMonth();
  });

  nextButton.addEventListener("click", function onNextClick() {
    currentView = new Date(currentView.getFullYear(), currentView.getMonth() + 1, 1);
    renderMonth();
  });

  renderMonth();
})();
