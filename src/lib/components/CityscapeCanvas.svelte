<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame: number | undefined;

  const pixelSize = 6;
  const waveSpeed = 0.0003;
  const revealDelay = 1000; // ms before animation starts
  const revealDuration = 2500; // ms for the full radial fade-in
  const revealFadeWidth = 0.18; // width of the soft edge

  type RGB = [number, number, number];

  const oceanBlue: RGB = [12, 16, 54];
  const sunsetPink: RGB = [163, 36, 91];
  const sunsetOrange: RGB = [241, 115, 54];
  const goldenYellow: RGB = [255, 223, 0];
  // const goldenYellow: RGB = [254, 206, 98];
  const sunYellow: RGB = [255, 223, 0];
  const sunOrange: RGB = [255, 160, 60];

  let rowNoise: number[] = [];
  let animationStartTime: number | null = null;

  function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  function lerpColor(c1: RGB, c2: RGB, t: number): RGB {
    return [
      Math.round(lerp(c1[0], c2[0], t)),
      Math.round(lerp(c1[1], c2[1], t)),
      Math.round(lerp(c1[2], c2[2], t)),
    ];
  }

  function gradientColor(t: number): RGB {
    // t goes from 0 (edges) to 1 (center)
    if (t < 1 / 3) {
      return lerpColor(oceanBlue, sunsetPink, t * 3);
    } else if (t < 2 / 3) {
      return lerpColor(sunsetPink, sunsetOrange, (t - 1 / 3) * 3);
    } else {
      return lerpColor(sunsetOrange, goldenYellow, (t - 2 / 3) * 3);
    }
  }

  function animate(timestamp: number) {
    if (!canvas || !ctx) return;

    if (animationStartTime === null) {
      animationStartTime = timestamp;
    }

    const elapsed = timestamp - animationStartTime;

    if (elapsed < revealDelay) {
      drawBlueBase();
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    const revealProgress = Math.min(1, (elapsed - revealDelay) / revealDuration);

    drawOcean(timestamp, revealProgress);

    animationFrame = requestAnimationFrame(animate);
  }

  function drawOcean(timestamp: number, revealProgress: number) {
    if (!canvas || !ctx) return;

    const phase = timestamp * waveSpeed;
    const oceanTop = Math.floor(canvas.height * 0.7);
    const oceanHeight = canvas.height - oceanTop;
    const centerX = canvas.width / 2;
    const maxDistance = centerX;

    for (let y = oceanTop; y < canvas.height; y += pixelSize) {
      const rowIndex = Math.floor((y - oceanTop) / pixelSize);
      const rowWidthRandom = rowNoise[rowIndex] ?? 0.85;

      // Each row gets its own animated weighting so the transition boundary looks wavy.
      const rowShift = Math.sin(phase + y / 42) * 0.2;

      // Rows closer to the top of the ocean are warmer (sun reflection).
      const verticalT = (y - oceanTop) / oceanHeight;
      const verticalShift = (1 - verticalT) * 0.12;

      for (let x = 0; x < canvas.width; x += pixelSize) {
        const distanceFromCenter = Math.abs(x - centerX);
        const distNorm = distanceFromCenter / maxDistance;

        // Radial reveal from the center outward.
        if (distNorm > revealProgress + revealFadeWidth) continue;
        const alpha = distNorm > revealProgress
          ? 1 - (distNorm - revealProgress) / revealFadeWidth
          : 1;

        // t = 0 at edges (blue), t = 1 at center (yellow)
        const rawT = 1 - distNorm;
        // Remap so only the inner portion reaches the warm colors, with row-to-row variation.
        let t = Math.max(0, (rawT - rowWidthRandom) / (1 - rowWidthRandom)) + rowShift + verticalShift;
        t = Math.max(0, Math.min(1, t));

        const [r, g, b] = gradientColor(t);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }

    ctx.globalAlpha = 1;
  }

  function drawSun() {
    if (!canvas || !ctx) return;

    const sunRadius = Math.min(canvas.width, canvas.height) * 0.22;
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.6;
    const sunCenter: RGB = [255, 252, 220];

    for (let y = centerY - sunRadius; y <= centerY + sunRadius; y += pixelSize) {
      for (let x = centerX - sunRadius; x <= centerX + sunRadius; x += pixelSize) {
        const dx = x + pixelSize / 2 - centerX;
        const dy = y + pixelSize / 2 - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > sunRadius) continue;

        const t = distance / sunRadius;
        let color: RGB;
        if (t < 0.7) {
          color = lerpColor(sunCenter, sunYellow, t / 0.7);
        } else {
          color = lerpColor(sunYellow, sunOrange, (t - 0.7) / 0.3);
        }

        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }

  function generateRowNoise() {
    if (!canvas) return;
    const oceanTop = Math.floor(canvas.height * 0.7);
    const rowCount = Math.ceil((canvas.height - oceanTop) / pixelSize);
    rowNoise = Array.from({ length: rowCount }, (_, i) => {
      const t = i / Math.max(1, rowCount - 1);
      // Top rows (t=0) are wider, bottom rows (t=1) are narrower.
      const baseWidth = lerp(0.55, 0.85, t);
      return baseWidth + Math.random() * 0.15;
    });
  }

  function resizeCanvas() {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = canvas.clientHeight;
    generateRowNoise();
  }

  function drawBlueBase() {
    if (!canvas || !ctx) return;

    const oceanTop = Math.floor(canvas.height * 0.7);
    ctx.fillStyle = `rgb(${oceanBlue[0]}, ${oceanBlue[1]}, ${oceanBlue[2]})`;
    ctx.fillRect(0, oceanTop, canvas.width, canvas.height - oceanTop);
  }

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d');
      if (ctx) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        drawBlueBase();
        animationFrame = requestAnimationFrame(animate);

        return () => {
          window.removeEventListener('resize', resizeCanvas);
          if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
        };
      }
    }
  });
</script>

<div id="canvas-wrapper">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  #canvas-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8rem;
    pointer-events: none;
    z-index: 2;
    @media (min-width: 768px) {
      height: 14rem;
    }
    canvas {
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgb(12 16 54 / 0) 70%, rgb(12 16 54 / 1) 71%, rgb(12 16 54 / 1) 100%);
      /* background: radial-gradient(circle at top, rgb(12 16 54 / 0) 70%, rgb(12 16 54 / 1) 71%, rgb(12 16 54 / 1) 100%); */
      z-index: 2;
    }
    &::before {
      --sun-size: 6rem;
      content: '';
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: var(--sun-size);
      height: var(--sun-size);
      border-radius: 50%;
      background: radial-gradient(
        circle at 30% 30%,
        rgb(255 252 220 / 1) 0%,
        rgb(255 223 0 / 1) 40%,
        rgb(241 115 54 / 1) 75%,
        rgb(163 36 91 / 1) 100%
      );
      box-shadow: 0 0 2rem 1rem rgb(255 223 0 / 0.5), 0 0 4rem 2rem rgb(255 160 60 / 0.3);
      z-index: -1;
    }
  }
</style>