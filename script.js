const BLOG_URL = "/blog.html";

// If you share a specific hex, replace/add it here.
const PAPER_COLORS = ["#efc17b"];
const PAPER_TOLERANCE = 48;

const image = document.getElementById("machine-image");
const tooltip = document.getElementById("paper-tooltip");
const accessibleLink = document.querySelector(".paper-link-accessible");

const offscreenCanvas = document.createElement("canvas");
const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });

let paperCenter = { x: 0.16, y: 0.78 };
let hasImageData = false;

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  if (value.length !== 6) {
    return null;
  }

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}

const targetColors = PAPER_COLORS.map(hexToRgb).filter(Boolean);

function isPaperPixel(r, g, b, a) {
  if (a < 8) {
    return false;
  }

  return targetColors.some((target) => {
    const dr = r - target.r;
    const dg = g - target.g;
    const db = b - target.b;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    return distance <= PAPER_TOLERANCE;
  });
}

function mapClientToNaturalPixels(clientX, clientY) {
  const rect = image.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  const xRatio = (clientX - rect.left) / rect.width;
  const yRatio = (clientY - rect.top) / rect.height;

  if (xRatio < 0 || xRatio > 1 || yRatio < 0 || yRatio > 1) {
    return null;
  }

  const x = Math.floor(xRatio * (image.naturalWidth - 1));
  const y = Math.floor(yRatio * (image.naturalHeight - 1));
  return { x, y };
}

function clientPointIsPaper(clientX, clientY) {
  if (!hasImageData || !offscreenCtx) {
    return false;
  }

  const point = mapClientToNaturalPixels(clientX, clientY);
  if (!point) {
    return false;
  }

  const pixel = offscreenCtx.getImageData(point.x, point.y, 1, 1).data;
  return isPaperPixel(pixel[0], pixel[1], pixel[2], pixel[3]);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function positionTooltip(clientX, clientY) {
  const margin = 10;
  const tooltipRect = tooltip.getBoundingClientRect();
  const x = clamp(clientX, margin + tooltipRect.width / 2, window.innerWidth - margin - tooltipRect.width / 2);
  const y = clamp(clientY, margin + tooltipRect.height + 12, window.innerHeight - margin);

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function positionTooltipAtPaperCenter() {
  const rect = image.getBoundingClientRect();
  const x = rect.left + rect.width * paperCenter.x;
  const y = rect.top + rect.height * paperCenter.y;
  positionTooltip(x, y);
}

function showTooltip() {
  tooltip.classList.add("is-visible");
}

function hideTooltip() {
  tooltip.classList.remove("is-visible");
}

function navigateToBlog() {
  window.location.href = BLOG_URL;
}

function computePaperCenter() {
  if (!hasImageData || !offscreenCtx) {
    return;
  }

  let minX = image.naturalWidth;
  let maxX = 0;
  let minY = image.naturalHeight;
  let maxY = 0;
  let found = false;

  const data = offscreenCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data;

  for (let y = 0; y < image.naturalHeight; y += 2) {
    for (let x = 0; x < image.naturalWidth; x += 2) {
      const i = (y * image.naturalWidth + x) * 4;
      if (isPaperPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        found = true;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (found) {
    paperCenter = {
      x: (minX + maxX) / 2 / image.naturalWidth,
      y: (minY + maxY) / 2 / image.naturalHeight
    };
  }
}

function setupImageData() {
  if (!image.complete || !image.naturalWidth || !offscreenCtx) {
    return;
  }

  offscreenCanvas.width = image.naturalWidth;
  offscreenCanvas.height = image.naturalHeight;
  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  offscreenCtx.drawImage(image, 0, 0);
  hasImageData = true;
  computePaperCenter();
  positionTooltipAtPaperCenter();
}

image.addEventListener("pointermove", (event) => {
  if (clientPointIsPaper(event.clientX, event.clientY)) {
    showTooltip();
    positionTooltip(event.clientX, event.clientY);
    return;
  }

  hideTooltip();
});

image.addEventListener("pointerleave", hideTooltip);

image.addEventListener("click", (event) => {
  if (!clientPointIsPaper(event.clientX, event.clientY)) {
    return;
  }

  event.preventDefault();
  navigateToBlog();
});

accessibleLink.addEventListener("click", (event) => {
  event.preventDefault();
  navigateToBlog();
});

accessibleLink.addEventListener("focus", () => {
  positionTooltipAtPaperCenter();
  showTooltip();
});

accessibleLink.addEventListener("blur", hideTooltip);

window.addEventListener("resize", () => {
  positionTooltipAtPaperCenter();
});

if (image.complete) {
  setupImageData();
} else {
  image.addEventListener("load", setupImageData, { once: true });
}
