const weatherMessages = [
  "calm",
  "light packet drift",
  "clear signals",
  "soft static in the distance",
  "low orbit interference"
];

function setInternetWeather() {
  const weatherNode = document.querySelector("#internet-weather");
  if (!weatherNode) return;

  const randomIndex = Math.floor(Math.random() * weatherMessages.length);
  weatherNode.textContent = weatherMessages[randomIndex];
}

function setLastUpdated() {
  const updatedNode = document.querySelector("#last-updated");
  if (!updatedNode) return;

  updatedNode.textContent = document.lastModified;
}

function typeText(target, text, speed = 36) {
  let index = 0;
  target.textContent = "";

  const timer = setInterval(() => {
    target.textContent += text.charAt(index);
    index += 1;

    if (index >= text.length) {
      clearInterval(timer);
    }
  }, speed);
}

function startTypingEffect() {
  const targets = document.querySelectorAll(".type-target");
  targets.forEach((target) => {
    const text = target.getAttribute("data-text") || target.textContent;
    typeText(target, text);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setInternetWeather();
  setLastUpdated();
  startTypingEffect();
});
