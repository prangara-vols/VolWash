let inUse = true;
let timeLeft = 20;

function update() {
  if (inUse) {
    document.getElementById("status").innerText = "In Use";
    document.getElementById("timer").innerText = timeLeft + " sec left";
    timeLeft--;

    if (timeLeft < 0) {
      inUse = false;
    }
  } else {
    document.getElementById("status").innerText = "Available";
    document.getElementById("timer").innerText = "--";
  }
}

setInterval(update, 1000);
