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
  meanRotation = 0;

const onDeviceMotion = throttleFunction((evt) => {
  meanRotation =
    (meanRotation * samples +
      evt.rotationRate
        .gamma) /* +
        evt.rotationRate.alpha +
        evt.rotationRate.beta*/ /
    (samples + 1);
  const rpm = Math.abs(meanRotation) / (2 * Math.PI);
  samples++;
  document.getElementById("rpm").innerHTML = rpm.toFixed(2);
  document.getElementById("deviation").innerHTML =
    100 *
    Math.abs(1 - Math.min(rpm, targetRpm) / Math.max(trpm, targetRpm)).toFixed(
      2
    );
}, 100);

function start() {
  document
    .getElementsByClassName("record-container")[0]
    .classList.add("animated");
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission();
    }
    setTimeout(() => {
      window.addEventListener("devicemotion", onDeviceMotion);
    }, 1000);
  } else {
    document.getElementById("orientation").innerHTML = "Not supported";
  }
}

function finish() {
  document
    .getElementsByClassName("record-container")[0]
    .classList.remove("animated");
  window.removeEventListener("devicemotion", onDeviceMotion);
  samples = 0;
  meanRotation = 0;
}

document.getElementById("start").addEventListener("click", start);
document.getElementById("finish").addEventListener("click", finish);
