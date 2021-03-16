function throttleFunction(fn, wait) {
  let waiting = false;
  return (...args) => {
    if (!waiting) {
      fn(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, wait);
    }
  };
}

const targetRpm = 33.33333333;
let samples = 0,
  meanRotation = 0,
  running = false;

const onDeviceMotion = throttleFunction((evt) => {
  meanRotation =
    (meanRotation * samples + evt.rotationRate.gamma) / (samples + 1);
  const rpm = Math.abs(meanRotation) / (2 * Math.PI);
  const deviation =
    Math.abs(1 - Math.min(rpm, targetRpm) / Math.max(rpm, targetRpm)).toFixed(
      2
    ) * 100;
  samples++;
  document.getElementById("rpm").innerHTML = rpm.toFixed(2);
  document.getElementById("deviation").innerHTML = deviation;
}, 100);

function checkSupportAndPermissions() {
  if (window.DeviceOrientationEvent) {
    return typeof DeviceMotionEvent.requestPermission === "function"
      ? DeviceMotionEvent.requestPermission()
      : Promise.resolve();
  } else {
    return Promise.reject("Not supported");
  }
}

function animateStart() {
  document
    .getElementsByClassName("record-container")[0]
    .classList.add("animated", "accelerating");
  setTimeout(
    () =>
      document
        .getElementsByClassName("record-container")[0]
        .classList.remove("accelerating"),
    2000
  );
}

function start() {
  return checkSupportAndPermissions()
    .then(() => {
      running = true;
      animateStart();
      setTimeout(() => {
        window.addEventListener("devicemotion", onDeviceMotion);
      }, 1000);
    })
    .catch(() => {
      running = true;
      animateStart();
      document.getElementById("rpm").innerHTML = "Not supported";
    });
}

function finish() {
  document
    .getElementsByClassName("record-container")[0]
    .classList.remove("animated");
  window.removeEventListener("devicemotion", onDeviceMotion);
  samples = 0;
  meanRotation = 0;
  running = false;
}

document.getElementById("record").addEventListener("click", () => {
  running ? finish() : start();
});

document.getElementById("mode").addEventListener("click", () => {
  const isDarkMode =
    getComputedStyle(document.body).backgroundColor === "rgb(0, 0, 0)";
  document.body.classList.remove("lightmode");
  document.body.classList.remove("darkmode");
  document.body.classList.add(isDarkMode ? "lightmode" : "darkmode");
});
