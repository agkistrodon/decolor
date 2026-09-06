import { adjustColorBrightness } from '../assets/utils.js';

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

    const giveUpButton = document.getElementById('giveUp');
    giveUpButton.addEventListener('click', () => {
        giveUp();
    });
});

function changeSiteColors(r, g, b, changeText = true) {
    document.documentElement.style.setProperty('--background', `rgb(${r}, ${g}, ${b})`);
    document.documentElement.style.setProperty('--background-body', `rgb(${r}, ${g}, ${b})`);

    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    let textColor = adjustColorBrightness(hexColor);

    if (changeText) {
        document.documentElement.style.setProperty('--text-main', textColor);
    }

    document.documentElement.style.setProperty('--text-bright', `rgb(${r}, ${g}, ${b})`);
    document.documentElement.style.setProperty('--button-base', textColor);
}

function chooseColor() {
    min = 0;
    max = 255;
    r = Math.floor(Math.random() * (max - min + 1) + min);
    g = Math.floor(Math.random() * (max - min + 1) + min);
    b = Math.floor(Math.random() * (max - min + 1) + min);
    return r, g, b;
}

function checkValue() {
    const slider = document.querySelector('[type="range"]');
    const value = 255 - parseInt(slider.value, 10) / 100 * 255; // Convert slider value to 0-255 range

    let actualValue =  0.299 * r + 0.587 * g + 0.114 * b;

    let answer = document.getElementById('result');

    let accuracy = 100 - Math.abs(value - Math.round(actualValue)) * 100 / 255;

    if (value === Math.round(actualValue)) {
        answer.innerHTML = "<i>c</i>orr<i>ect</i>!";
    }

    else if (Math.abs(value - Math.round(actualValue)) <= 10) {
        answer.innerHTML = `<i>v</i>ery <i>c</i>l<i>ose</i>! <i>acc</i>uracy ${accuracy.toFixed(2)}%`;
    }

    else if (Math.abs(value - Math.round(actualValue)) <= 25) {
        answer.innerHTML = `<i>c</i>l<i>ose</i>! <i>acc</i>uracy ${accuracy.toFixed(2)}%`;
    }

    else {
        answer.innerHTML = `<i>try</i> aga<i>in</i>! <i>acc</i>uracy ${accuracy.toFixed(2)}%`;
    }

    console.log(`Slider Value: ${value}, Actual Value: ${Math.round(actualValue)}`);
}

function giveUp() {
    const slider = document.querySelector('[type="range"]');
    const value = 255 - parseInt(slider.value, 10) / 100 * 255;
    let actualValue =  0.299 * r + 0.587 * g + 0.114 * b;
    changeSiteColors(actualValue, actualValue, actualValue, false);



    let accuracy = 100 - Math.abs(value - Math.round(actualValue)) * 100 / 255;
    let answer = document.getElementById('result');
    answer.innerHTML = `<i>final</i> accuracy ${accuracy.toFixed(2)}%`;

    document.getElementById('check').disabled = true;
    document.getElementById('giveUp').disabled = true;
    document.querySelector('[type="range"]').disabled = true;

}