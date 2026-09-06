import { adjustColorBrightness } from 'assets/utils.js';

let min = 0;
let max = 255;
let r, g, b;

document.addEventListener('DOMContentLoaded', () => {

    // Put your logic here
    console.log("Your website has finished loading!");
    r, g, b = chooseColor();

    changeSiteColors(r, g, b);

    const slider = document.querySelector('[type="range"]');

    slider.addEventListener('input', () => {
        slider.style.setProperty('--value', slider.value);
    });

    console.log(`Red: ${r}, Green: ${g}, Blue: ${b}`);

    const checkButton = document.getElementById('check');
    checkButton.addEventListener('click', () => {
        checkValue();
    });
});

function changeSiteColors(r, g, b) {
    document.documentElement.style.setProperty('--accent', `rgb(${r}, ${g}, ${b})`);
    document.documentElement.style.setProperty('--background-body', `rgb(${r}, ${g}, ${b})`);

    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    let textColor = adjustColorBrightness(hexColor);
    document.documentElement.style.setProperty('--text-main', textColor);

    document.documentElement.style.setProperty('--button-base', textColor);
    document.documentElement.style.setProperty('--text-bright', `rgb(${r}, ${g}, ${b})`);



}

function chooseColor() {
    min = 0;
    max = 200;
    r = Math.floor(Math.random() * (max - min + 1) + min);
    g = Math.floor(Math.random() * (max - min + 1) + min);
    b = Math.floor(Math.random() * (max - min + 1) + min);
    return r, g, b;
}
