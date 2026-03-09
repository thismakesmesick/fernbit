const weatherMessages = [
  "calm",
  "light packet drift",
  "clear signals",
  "soft static in the distance",
  "low orbit interference"
];

/* ---------------- INTERNET WEATHER ---------------- */

function setInternetWeather() {
  const weatherNode = document.querySelector("#internet-weather");
  if (!weatherNode) return;

  const randomIndex = Math.floor(Math.random() * weatherMessages.length);
  weatherNode.textContent = weatherMessages[randomIndex];
}

/* ---------------- LAST UPDATED ---------------- */

function setLastUpdated() {
  const updatedNode = document.querySelector("#last-updated");
  if (!updatedNode) return;

  updatedNode.textContent = document.lastModified;
}

/* ---------------- TYPE EFFECT ---------------- */

function typeText(target, text, speed = 36) {
  let index = 0;
  target.textContent = "";

  const timer = setInterval(() => {
    target.textContent += text.charAt(index);
    index += 1;

    if (index >= text.length) clearInterval(timer);
  }, speed);
}

function startTypingEffect() {
  const targets = document.querySelectorAll(".type-target");

  targets.forEach((target) => {
    const text = target.getAttribute("data-text") || target.textContent;
    typeText(target, text);
  });
}

/* ---------------- REAL ASCII ANIMALS ---------------- */

const animals = [

` /\\_/\\
( o.o )
 > ^ <`,

` /\\_/\\
(=^.^=)
 (")(")`,

` /\\_/\\
( -.- )
 > ^ <`,

` /\\_/\\
( •.• )
 (   )`,

` /\\_/\\
(='.'=)
 (")(")`,

` (\\_/)
 ( •_•)
 / >🍪`,

` /\\_/\\
( o.o )
(  =  )`,

`  /\\_/\\
 ( o.o )
  > ^ <`
];

/* ---------------- SIDE ASCII ---------------- */

function setSideAscii() {

  const left = document.querySelector("#ascii-left");
  const right = document.querySelector("#ascii-right");

  if (!left || !right) return;

  const leftAnimal = animals[Math.floor(Math.random() * animals.length)];
  const rightAnimal = animals[Math.floor(Math.random() * animals.length)];

  left.textContent = leftAnimal;
  right.textContent = rightAnimal;
}

/* ---------------- TERMINAL ---------------- */

function runCommand(cmd) {

  const output = document.querySelector("#terminal-output");

  const line = document.createElement("p");
  line.textContent = "> " + cmd;
  output.appendChild(line);

  if (cmd === "help") {

    output.innerHTML += `
    <p>available commands:</p>
    <p>now</p>
    <p>transmission</p>
    <p>dashboard</p>
    <p>plane</p>
    <p>help</p>
    `;

  }

  else if (cmd === "transmission") {

    window.location.href = "transmissions.html";

  }

  else if (cmd === "now") {

    output.innerHTML += `<p>building fernbit</p>`;

  }

  else if (cmd === "dashboard") {

    output.innerHTML += `<p>dashboard not yet installed</p>`;

  }

  else if (cmd === "plane") {

    launchPlane();

  }

  else {

    output.innerHTML += `<p>unknown command</p>`;

  }

  output.scrollTop = output.scrollHeight;
}

/* ---------------- TERMINAL INPUT ---------------- */

function setupTerminal() {

  const input = document.querySelector("#terminal-input");

  if (!input) return;

  input.addEventListener("keydown", function(e){

    if (e.key === "Enter") {

      const cmd = input.value.trim().toLowerCase();
      input.value = "";

      runCommand(cmd);

    }

  });

}

/* ---------------- PAPER PLANE ---------------- */

function createPlane() {

  const plane = document.createElement("div");

  plane.textContent = "✈";
  plane.id = "paper-plane";

  plane.style.position = "fixed";
  plane.style.bottom = "40px";
  plane.style.left = "40px";
  plane.style.fontSize = "20px";
  plane.style.cursor = "pointer";

  document.body.appendChild(plane);

  plane.addEventListener("click", launchPlane);

}

function launchPlane() {

  const plane = document.querySelector("#paper-plane");
  if (!plane) return;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const x = Math.random() * screenWidth;
  const y = Math.random() * screenHeight;

  plane.style.transition = "transform 2.5s linear";

  plane.style.transform = `translate(${x}px, -${y}px) rotate(20deg)`;

}

/* ---------------- INIT ---------------- */

window.addEventListener("DOMContentLoaded", () => {

  setInternetWeather();
  setLastUpdated();
  startTypingEffect();

  setSideAscii();
  setupTerminal();
  createPlane();

});
