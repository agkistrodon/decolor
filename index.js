import { adjustColorBrightness } from 'assets/utils.js';

let min = 0;
let max = 255;
let r, g, b;

document.addEventListener('DOMContentLoaded', () => {

    // Put your logic here
    console.log("Your website has finished loading!");
    r, g, b = chooseColor();

    changeSiteColors(r, g, b);
});

function changeSiteColors(r, g, b) {
    document.documentElement.style.setProperty('--accent', `rgb(${r}, ${g}, ${b})`);
}

function chooseColor() {
    min = 0;
    max = 200;
    r = Math.floor(Math.random() * (max - min + 1) + min);
    g = Math.floor(Math.random() * (max - min + 1) + min);
    b = Math.floor(Math.random() * (max - min + 1) + min);
    return r, g, b;
}
