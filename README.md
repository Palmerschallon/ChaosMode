# ChaosMode
Chaos Mode is a single-file stress-test and glitch toolkit for sites you control. It blends brute-force layout breakage, random DOM chaos, structured degradations, and broadcast-style glitch overlays. Built to expose weak points, simulate failure, and turn collapse into aesthetic experiment.

**Chaos Mode** is a single-file stress-tester and glitch aesthetic injector for websites you control.  
It blends four voices into one tool:

- **Raw Builder**: Brute-force layout breakage (overflow blowouts, box model inversion).
- **Cynical Hacker**: Random DOM mutations, flaky asset simulation, handler delays.
- **Dry Architect**: Structured degradations — typography stress, latency injection, accessibility strip.
- **Trickster Broadcaster**: Aesthetic failure — glitch overlays, scanlines, jitter.

## Usage

1. Copy `chaos-mode.js` into your project.
2. Include it in your HTML (local/dev environment only):

```html
<script src="chaos-mode.js"></script>
```

3. Controls:
   - **Ctrl+Alt+C** → Toggle control panel
   - **Ctrl+Alt+X** → Enable/Disable all toggles
   - `window.Chaos.disable()` → Manually disable and clean up

4. Panic button: Reload the page.

## Safety

- Only run this on sites you **own/control**.  
- Do **not** deploy to production.  
- Chaos Mode is for **experimentation, stress-testing, and aesthetic play**.

## Features

- Toggle individual chaos modules (layout mayhem, mutation storm, glitch overlay, etc).
- Combine multiple chaos modes for maximum entropy.
- Add glitchy text with:

```html
<h1 class="chaos-glitch" data-text="LAST CHANNEL">LAST CHANNEL</h1>
```

---
Experimental Builder ethos: **break it first, see what survives.**
