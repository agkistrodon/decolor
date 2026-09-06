/**
 * Compute a readable, aesthetically tinted text color for a given background.
 * - Keeps the same hue as the background (tinted, never neutral gray)
 * - Slightly mutes saturation for softness
 * - Shifts lightness for contrast, clamped to [15%–85%] (never pure black/white)
 * - Auto-tunes via contrast loop (WCAG ≥ 2.5:1)
 * @param {string} hex - Background hex color
 * @returns {string} Adjusted text hex color
 */
export function adjustColorBrightness(hex) {
    const bg = tinycolor(hex);
    if (!bg.isValid()) return '#666666';

    const hsl = bg.toHsl();
    const isLight = bg.isLight();

    // Keep hue; for near-gray backgrounds add subtle warmth
    let h = hsl.h;
    let s = hsl.s;
    if (s < 0.08) {
        h = 30;
        s = 0.08;
    } else {
        s = Math.max(0.12, s * 0.65);
    }

    // Shift lightness away from bg, clamped to avoid extremes
    let l = isLight
        ? Math.max(0.15, hsl.l - 0.30)
        : Math.min(0.85, hsl.l + 0.30);

    let result = tinycolor({ h, s, l });

    // Fine-tune lightness until contrast ≥ 2.5
    let tries = 0;
    while (tinycolor.readability(hex, result) < 2.5 && tries < 20) {
        l += isLight ? -0.03 : 0.03;
        l = Math.max(0.15, Math.min(0.85, l));
        result = tinycolor({ h, s, l });
        tries++;
    }

    // Fallback: desaturate progressively if still too low contrast
    while (tinycolor.readability(hex, result) < 2.2 && s > 0.05) {
        s -= 0.08;
        s = Math.max(0.05, s);
        result = tinycolor({ h, s, l });
    }

    return result.toHexString();
}

/**
 * Validate a hex color string (with #).
 * @param {string} color
 * @returns {boolean}
 */
export function isValidHexColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Ensure a color string starts with #.
 * @param {string} color
 * @returns {string}
 */
export function prefixHash(color) {
    return color.startsWith('#') ? color : `#${color}`;
}

/**
 * Apply theme text color to close button and CSS variable.
 * Call this whenever the background color changes.
 * @param {string} textColor - The computed text color for the current background
 */
export function applyThemeColor(textColor) {
    document.documentElement.style.setProperty('--text-color', textColor);
    const closeBtn = document.querySelector('.close-button');
    if (closeBtn) closeBtn.style.color = textColor;
}

/**
 * Calculate score between two hex colors using weighted Euclidean distance (redmean).
 * More perceptually accurate than Manhattan distance — weights green heavily
 * (human eyes are most sensitive to green), adjusts red/blue based on luminance context.
 * Uses squared proximity curve for stricter scoring (distant colors score lower).
 * @param {string} userHex - User's guessed color
 * @param {string} targetHex - Target color
 * @returns {number} Score 0–100
 */
export function calculateScore(userHex, targetHex) {
    const u = tinycolor(userHex).toRgb();
    const t = tinycolor(targetHex).toRgb();

    const dr = u.r - t.r;
    const dg = u.g - t.g;
    const db = u.b - t.b;
    const rmean = (u.r + t.r) / 2;

    // Weighted Euclidean (redmean formula)
    const distance = Math.sqrt(
        (2 + rmean / 256) * dr * dr +
        4 * dg * dg +
        (2 + (255 - rmean) / 256) * db * db
    );

    const maxDistance = 764.83;
    const proximity = Math.max(0, 1 - distance / maxDistance);

    return Math.round(proximity * proximity * 100);
}

/**
 * Setup a smart hex color input: locked # prefix, auto-uppercase,
 * cursor always after #, max 7 chars, live formatting.
 * @param {HTMLInputElement} input - The text input element
 */
export function setupHexInput(input) {
    // Ensure # is always present and cursor never goes before it
    function enforce() {
        let v = input.value;
        // Always start with #
        if (!v.startsWith('#')) v = '#' + v.replace(/#/g, '');
        // Remove any non-hex chars after #
        v = '#' + v.slice(1).replace(/[^0-9a-fA-F]/g, '');
        // Max 7 chars (#XXXXXX)
        if (v.length > 7) v = v.slice(0, 7);
        // Uppercase
        v = v.toUpperCase();
        if (input.value !== v) input.value = v;
    }

    function clampCursor() {
        if (input.selectionStart < 1) {
            input.setSelectionRange(1, Math.max(1, input.selectionEnd));
        }
    }

    input.addEventListener('focus', () => {
        if (!input.value) input.value = '#';
        enforce();
        // Defer so the browser sets the cursor first
        requestAnimationFrame(() => clampCursor());
    });

    input.addEventListener('input', () => {
        enforce();
        clampCursor();
    });

    input.addEventListener('keydown', (e) => {
        // Prevent backspacing the #
        if (e.key === 'Backspace' && input.selectionStart <= 1 && input.selectionEnd <= 1) {
            e.preventDefault();
        }
        // Prevent arrow-left past #
        if (e.key === 'ArrowLeft' && input.selectionStart <= 1) {
            e.preventDefault();
        }
        // Home key → go to position 1, not 0
        if (e.key === 'Home') {
            e.preventDefault();
            input.setSelectionRange(1, 1);
        }
    });

    input.addEventListener('click', () => clampCursor());
    input.addEventListener('select', () => {
        requestAnimationFrame(() => clampCursor());
    });

    // Paste handler — clean pasted content
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        const clean = pasted.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
        const pos = input.selectionStart;
        const before = input.value.slice(1, pos);
        const after = input.value.slice(input.selectionEnd);
        input.value = '#' + (before + clean + after).slice(0, 6).toUpperCase();
        const newPos = Math.min(pos + clean.length, 7);
        input.setSelectionRange(newPos, newPos);
    });
}
