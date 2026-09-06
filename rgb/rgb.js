let min = 0;
let max = 255;
let r, g, b;

document.addEventListener('DOMContentLoaded', () => {

  // Put your logic here
  console.log("Your website has finished loading!");
  r, g, b = generateColor();

  document.documentElement.style.setProperty('--box-red', `rgb(${r}, 0, 0)`);
  document.documentElement.style.setProperty('--box-green', `rgb(0, ${g}, 0)`);
  document.documentElement.style.setProperty('--box-blue', `rgb(0, 0, ${b})`);

  console.log(`Red: ${r}, Green: ${g}, Blue: ${b}`);
});

function generateColor() {
    min = 0;
    max = 255;
    r = Math.floor(Math.random() * (max - min + 1) + min);
    g = Math.floor(Math.random() * (max - min + 1) + min);
    b = Math.floor(Math.random() * (max - min + 1) + min);
    return r, g, b;
}