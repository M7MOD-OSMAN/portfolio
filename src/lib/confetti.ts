/**
 * Confetti burst, ported from the legacy site's `confettea.js`.
 *
 * The physics are the original's, kept deliberately: gravity, per-axis decay,
 * 3D rotation and a sine wobble. It reads better than a naive particle spray
 * and it was already written and tuned.
 *
 * Three changes from the legacy version:
 *
 * - **Palette.** The original burst six saturated hues. `DESIGN.md` locks the
 *   site to one accent with no second hue, so this uses the accent plus
 *   neutrals pulled from the live CSS custom properties, which also means it
 *   follows the light/dark theme for free.
 * - **Leak fixed.** The original stopped its rAF loop when `ticks` ran out but
 *   only removed particles that had fallen past the viewport. Any particle
 *   still on screen at that moment was left in the DOM forever, invisible at
 *   opacity ~0. This removes everything it created, on every exit path.
 * - **Origin.** Takes an element and bursts from its centre, rather than
 *   always firing from the middle of the page.
 */

interface Particle {
  element: HTMLElement;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotation: [number, number, number];
  rotationSpeed: [number, number, number];
  wobble: number;
  wobbleHeight: number;
}

const PARTICLE_COUNT = 90;
const TICKS = 220;
const GRAVITY = 0.8;
const DECAY = 0.95;
const START_VELOCITY = 26;
const SPREAD_DEGREES = 60;

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

function paletteFrom(element: Element) {
  const styles = getComputedStyle(element);
  const read = (name: string) => styles.getPropertyValue(name).trim();
  // Weighted toward the accent so the burst still reads as one colour family
  // rather than a neutral grey cloud.
  return [
    read("--accent"),
    read("--accent"),
    read("--accent-ink"),
    read("--foreground"),
    read("--edge-strong"),
  ].filter(Boolean);
}

/**
 * Fires a burst from the centre of `origin`. Returns a cancel function; call it
 * on unmount so a burst in flight cannot outlive the component that fired it.
 */
export function burstConfetti(origin: Element): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const colors = paletteFrom(origin);
  const box = origin.getBoundingClientRect();
  const originX = box.left + box.width / 2;
  const originY = box.top + box.height / 2;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden";
  document.body.appendChild(layer);

  const particles: Particle[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const element = document.createElement("div");
    const round = Math.random() < 0.5;
    element.style.cssText = `position:absolute;top:0;left:0;width:8px;height:8px;will-change:transform,opacity;background:${
      colors[Math.floor(Math.random() * colors.length)]
    };border-radius:${round ? "50%" : "1px"}`;
    layer.appendChild(element);

    const angle = randomInRange(0, Math.PI * 2);
    const velocity = randomInRange(START_VELOCITY * 0.7, START_VELOCITY * 1.3);
    const spread = (Math.PI / 180) * randomInRange(-SPREAD_DEGREES, SPREAD_DEGREES);

    particles.push({
      element,
      x: originX,
      y: originY,
      z: 0,
      vx: Math.cos(angle) * Math.cos(spread) * velocity,
      vy: Math.sin(spread) * velocity,
      vz: Math.sin(angle) * Math.cos(spread) * velocity,
      rotation: [0, 0, 0],
      rotationSpeed: [
        randomInRange(-0.2, 0.2),
        randomInRange(-0.2, 0.2),
        randomInRange(-0.2, 0.2),
      ],
      wobble: Math.random() * 10,
      wobbleHeight: randomInRange(2, 5),
    });
  }

  let frame = 0;
  let ticks = 0;

  const cleanup = () => {
    cancelAnimationFrame(frame);
    layer.remove();
  };

  const animate = () => {
    ticks += 1;
    const progress = ticks / TICKS;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.vy += GRAVITY;
      p.vx *= DECAY;
      p.vy *= DECAY;
      p.vz *= DECAY;
      p.wobble += 0.1;
      p.wobbleHeight *= 0.99;

      p.rotation[0] += p.rotationSpeed[0];
      p.rotation[1] += p.rotationSpeed[1];
      p.rotation[2] += p.rotationSpeed[2];

      const wobbleX = Math.sin(p.wobble) * p.wobbleHeight;
      const wobbleY = Math.cos(p.wobble) * p.wobbleHeight;

      p.element.style.transform =
        `translate3d(${p.x + wobbleX}px, ${p.y + wobbleY}px, ${p.z}px) ` +
        `rotate3d(1,0,0,${p.rotation[0]}rad) ` +
        `rotate3d(0,1,0,${p.rotation[1]}rad) ` +
        `rotate3d(0,0,1,${p.rotation[2]}rad)`;
      p.element.style.opacity = String(Math.max(0, 1 - progress));

      if (p.y > window.innerHeight) {
        p.element.remove();
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0 && ticks < TICKS) {
      frame = requestAnimationFrame(animate);
    } else {
      // Every exit path tears the layer down, including the one the legacy
      // version fell through without cleaning up.
      cleanup();
    }
  };

  frame = requestAnimationFrame(animate);

  return cleanup;
}
