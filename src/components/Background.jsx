import React from 'react';

/*
 * The page's only animation lives here, on one fixed canvas behind everything.
 *
 * Two layers:
 *  - Aurora: a few large, soft light sources drifting on slow orbits, drawn
 *    additively so they bloom where they overlap.
 *  - Field: a few hundred particles carried by a flow field made of summed
 *    sines (cheap, smooth, no noise library), drawn as short streaks with
 *    fading trails. The pointer pushes the field aside so the page feels alive
 *    under the cursor without anything on the page itself having to move.
 *
 * The two layers live on separate canvases. Trails need the previous frame
 * kept and faded; the aurora must be drawn fresh every frame, otherwise it
 * accumulates additively and bleaches to white within seconds.
 *
 * It caps device pixel ratio, pauses when the tab is hidden, and draws a single
 * still frame when the visitor prefers reduced motion.
 */

const PARTICLE_DENSITY = 1 / 6500; // particles per CSS pixel of viewport
const MAX_PARTICLES = 320;
const TRAIL_FADE = 0.085;

const AURORA = [
  { hue: 262, sat: 90, light: 45, radius: 0.55, orbit: 0.22, speed: 0.11, phase: 0.0, alpha: 0.55 },
  { hue: 192, sat: 95, light: 48, radius: 0.42, orbit: 0.28, speed: 0.08, phase: 2.1, alpha: 0.32 },
  { hue: 285, sat: 85, light: 42, radius: 0.48, orbit: 0.18, speed: 0.14, phase: 4.2, alpha: 0.42 },
  { hue: 220, sat: 90, light: 45, radius: 0.36, orbit: 0.3, speed: 0.06, phase: 1.3, alpha: 0.3 },
];

function angleAt(x, y, t) {
  const s = 0.0016;
  return (
    Math.sin(x * s + t * 0.35) * 1.1 +
    Math.cos(y * s * 1.3 - t * 0.27) * 0.9 +
    Math.sin((x + y) * s * 0.6 + t * 0.18) * 1.4
  );
}

function spawn(width, height, particle = {}) {
  particle.x = Math.random() * width;
  particle.y = Math.random() * height;
  particle.px = particle.x;
  particle.py = particle.y;
  particle.life = 0;
  particle.ttl = 240 + Math.random() * 420;
  particle.speed = 0.5 + Math.random() * 0.9;
  particle.hue = Math.random() < 0.7 ? 262 + Math.random() * 30 : 190 + Math.random() * 20;
  return particle;
}

export default function Background() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;

    /* Offscreen buffer for the particle trails. */
    const trails = document.createElement('canvas');
    const tctx = trails.getContext('2d');
    if (!tctx) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let running = true;
    let last = performance.now();
    let time = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      trails.width = canvas.width;
      trails.height = canvas.height;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, width, height);

      const count = Math.min(MAX_PARTICLES, Math.floor(width * height * PARTICLE_DENSITY));
      particles = Array.from({ length: count }, () => spawn(width, height));

      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);
    };

    const drawAurora = () => {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      // Size the lights to the viewport but cap them, so a tall window (or a
      // full-page screenshot) never turns into one wall of colour.
      const base = Math.min(Math.max(width, height), 1500);
      for (const light of AURORA) {
        const a = time * light.speed + light.phase;
        const cx = width * 0.5 + Math.cos(a) * width * light.orbit + Math.sin(a * 0.6) * width * 0.08;
        const cy = height * 0.45 + Math.sin(a * 0.8) * height * light.orbit;
        const r = base * light.radius;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `hsla(${light.hue}, ${light.sat}%, ${light.light}%, ${light.alpha})`);
        gradient.addColorStop(0.45, `hsla(${light.hue}, ${light.sat}%, ${light.light}%, ${light.alpha * 0.28})`);
        gradient.addColorStop(1, `hsla(${light.hue}, ${light.sat}%, ${light.light}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawField = (dt) => {
      // Fade the previous frame instead of clearing it: this is what turns the
      // particle positions into trails.
      tctx.globalCompositeOperation = 'destination-out';
      tctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_FADE})`;
      tctx.fillRect(0, 0, width, height);
      tctx.globalCompositeOperation = 'lighter';
      tctx.lineCap = 'round';
      for (const p of particles) {
        p.life += dt;
        if (p.life > p.ttl || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
          spawn(width, height, p);
          continue;
        }

        let angle = angleAt(p.x, p.y, time);

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const reach = 180;
          if (dist < reach) {
            const push = (1 - dist / reach) ** 2;
            angle = angle * (1 - push) + Math.atan2(dy, dx) * push;
          }
        }

        const v = p.speed * dt;
        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(angle) * v;
        p.y += Math.sin(angle) * v;

        const fade = Math.min(p.life / 60, 1, (p.ttl - p.life) / 60);
        tctx.strokeStyle = `hsla(${p.hue}, 90%, 74%, ${0.55 * fade})`;
        tctx.lineWidth = 1.1;
        tctx.beginPath();
        tctx.moveTo(p.px, p.py);
        tctx.lineTo(p.x, p.y);
        tctx.stroke();
      }
      tctx.globalCompositeOperation = 'source-over';

      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(trails, 0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    };

    const step = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 16.667, 2.5);
      last = now;
      time += dt * 0.016;

      drawAurora();
      drawField(dt);

      frame = window.requestAnimationFrame(step);
    };

    const still = () => {
      // Reduced motion: one settled frame, no loop. Let the field run a few
      // hidden ticks so the streaks exist, then leave it.
      for (let i = 0; i < 40; i += 1) {
        time += 0.016;
        drawAurora();
        drawField(1);
      }
    };

    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(frame);
      } else if (!reduceMotion) {
        running = true;
        last = performance.now();
        frame = window.requestAnimationFrame(step);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduceMotion) {
      still();
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
      frame = window.requestAnimationFrame(step);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
}
