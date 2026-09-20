import React from 'react';

/*
 * The opening: a comet of light traces an infinity loop, then the overlay
 * dissolves and the page eases in behind it.
 *
 * It runs on every full load of the home page and nowhere else. Hash
 * navigation never re-mounts the app, so it never replays mid-visit.
 *
 * The loop is a lemniscate rotated in 3D and drawn with perspective, so the
 * near half of the curve is wider and brighter than the far half, and the
 * whole figure tilts slightly as the comet travels. Glow is done by drawing
 * the trail in several passes with additive blending — wide and faint, then
 * narrow and bright — which reads as light rather than a stroke.
 */

const DRAW_MS = 2000; // one full pass of the loop
const HOLD_MS = 250; // linger with the loop complete
const FADE_MS = 700; // overlay dissolve

const TRAIL_LIFE_MS = 2600; // how long a point of the trail stays lit
const TRAIL_STEP = 0.012; // max parameter gap between trail points
const SPARK_RATE = 5; // sparks spawned per frame at the head

function lemniscate(t, a) {
  const s = Math.sin(t);
  const c = Math.cos(t);
  const d = 1 + s * s;
  return { x: (a * c) / d, y: (a * s * c) / d, z: 0 };
}

/* Rotate about X then Y, then project with a simple perspective camera. */
function project(p, tiltX, tiltY, cx, cy, focal) {
  let { x, y, z } = p;
  // tilt around x
  let y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
  let z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
  y = y1;
  z = z1;
  // tilt around y
  let x1 = x * Math.cos(tiltY) + z * Math.sin(tiltY);
  z1 = -x * Math.sin(tiltY) + z * Math.cos(tiltY);
  x = x1;
  z = z1;
  const scale = focal / (focal - z);
  return { x: cx + x * scale, y: cy + y * scale, depth: scale };
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Loader({ onDone }) {
  const canvasRef = React.useRef(null);
  const [phase, setPhase] = React.useState('draw'); // draw | fade | done

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frame = 0;
    let fadeTimer = 0;
    let doneTimer = 0;
    const start = performance.now();
    const trail = [];
    const sparks = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DRAW_MS, 1);
      const eased = easeInOut(progress);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const a = Math.min(width, height) * 0.28;
      const focal = a * 4;
      const tiltX = 0.55 + Math.sin(elapsed / 900) * 0.08;
      const tiltY = -0.35 + Math.sin(elapsed / 1300) * 0.12;

      // Head position along the loop. Start at the crossing so the figure
      // grows out from the middle.
      const t = -Math.PI / 2 + eased * Math.PI * 2;

      // Fill in the curve between this frame and the last so the line is
      // smooth whatever the frame rate, then drop points that have faded.
      const lastT = trail.length ? trail[trail.length - 1].t : t;
      const steps = Math.max(1, Math.ceil((t - lastT) / TRAIL_STEP));
      for (let i = 1; i <= steps; i += 1) {
        trail.push({ t: lastT + ((t - lastT) * i) / steps, born: now });
      }
      while (trail.length > 2 && now - trail[0].born > TRAIL_LIFE_MS) trail.shift();

      // Re-project the whole trail with this frame's tilt, so the figure
      // moves as one solid object rather than leaving old points behind.
      const points = trail.map((entry) => ({ ...project(lemniscate(entry.t, a), tiltX, tiltY, cx, cy, focal), born: entry.born }));
      const head = points[points.length - 1];

      // Sparks shed from the head, drifting and fading.
      if (progress < 1) {
        for (let i = 0; i < SPARK_RATE; i += 1) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.3 + Math.random() * 1.4;
          sparks.push({
            x: head.x + (Math.random() - 0.5) * 6,
            y: head.y + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.2,
            life: 1,
            size: 0.6 + Math.random() * 1.6,
          });
        }
      }

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // The trail: three passes, from a wide soft halo to a thin white core.
      const passes = [
        { width: 28, alpha: 0.05, color: '80, 140, 255' },
        { width: 14, alpha: 0.14, color: '120, 170, 255' },
        { width: 6, alpha: 0.5, color: '190, 215, 255' },
        { width: 2.2, alpha: 1, color: '255, 255, 255' },
      ];

      for (const pass of passes) {
        for (let i = 1; i < points.length; i += 1) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const along = 1 - (now - p1.born) / TRAIL_LIFE_MS; // 0 = faded, 1 = head
          const depth = (p1.depth - 0.8) / 0.5; // roughly 0..1, far..near
          const alpha = pass.alpha * along * along * (0.45 + 0.55 * depth);
          ctx.strokeStyle = `rgba(${pass.color}, ${alpha})`;
          ctx.lineWidth = pass.width * (0.35 + 0.65 * along) * (0.6 + 0.6 * depth);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      // The head itself: a hot core with a bloom.
      const bloom = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 42 * head.depth);
      bloom.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      bloom.addColorStop(0.15, 'rgba(200, 220, 255, 0.55)');
      bloom.addColorStop(0.5, 'rgba(100, 150, 255, 0.18)');
      bloom.addColorStop(1, 'rgba(60, 110, 255, 0)');
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 42 * head.depth, 0, Math.PI * 2);
      ctx.fill();

      // Sparks.
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy *= 0.97;
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(220, 235, 255, ${s.life * 0.9})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      if (elapsed < DRAW_MS + HOLD_MS + FADE_MS) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(draw);

    fadeTimer = window.setTimeout(() => setPhase('fade'), DRAW_MS + HOLD_MS);
    doneTimer = window.setTimeout(() => {
      setPhase('done');
      onDone?.();
    }, DRAW_MS + HOLD_MS + FADE_MS);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener('resize', resize);
    };
  }, [onDone]);

  if (phase === 'done') return null;

  return (
    <div className={`loader ${phase === 'fade' ? 'is-fading' : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="loader-canvas" />
      <div className="loader-mark">
        <span className="brand-dot" />
        IIVO
      </div>
    </div>
  );
}

/*
 * Whether to show the opening at all. Skips it for reduced-motion visitors
 * and for anything but the home page.
 */
export function shouldShowLoader() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}
