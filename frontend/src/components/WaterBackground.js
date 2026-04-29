import React, { useEffect, useRef } from "react";

const WaterBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    let time = 0;

    // Pollution particles
    const numParticles = 120;

    const particles = Array.from({ length: numParticles }, (_, i) => ({
      angle: Math.random() * Math.PI * 2,
      distanceSq: Math.random(),
      speed: (Math.random() - 0.5) * 0.01 + 0.004,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      migrates: i % 2 === 0,
    }));

    const drawRipple = (x, y, radius) => {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          radius + i * 18 + Math.sin(time * 4) * 6,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(0,200,255,${0.15 - i * 0.04})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const render = () => {
      time += 0.007;

      const cw = canvas.width;
      const ch = canvas.height;

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, cw, ch);

      const centerX = cw / 2;
      const centerY = ch / 2;

      // underwater caustic light
      for (let i = 0; i < 5; i++) {
        const gx = centerX + Math.sin(time * 0.5 + i) * 200;
        const gy = centerY + Math.cos(time * 0.6 + i) * 150;

        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 320);

        grad.addColorStop(0, "rgba(0,180,255,0.05)");
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      const cycleDuration = 3;
      const t = time % cycleDuration;

      let globalAlpha = 1;
      if (t > 2.5) {
        globalAlpha = 1 - (t - 2.5) / 0.5;
      } else if (t < 0.2) {
        globalAlpha = t / 0.2;
      }
      ctx.globalAlpha = globalAlpha;

      const dropRadius = Math.min(cw * 0.12, 120);
      const startDist = Math.max(cw * 0.25, dropRadius * 2.5);

      // They stop moving when centers are dropRadius * 1.6 apart
      const targetDist = dropRadius * 1.6;
      const maxMoveProgress = Math.max(0, 1 - (targetDist / 2) / startDist);

      let moveProgress = 0;
      if (t < 1.0) {
        const p = t / 1.0;
        moveProgress = -(Math.cos(Math.PI * p) - 1) / 2 * maxMoveProgress;
      } else {
        moveProgress = maxMoveProgress;
      }

      const d1x = centerX - startDist * (1 - moveProgress);
      const d1y = centerY;

      const d2x = centerX + startDist * (1 - moveProgress);
      const d2y = centerY;

      const dist = Math.hypot(d2x - d1x, d2y - d1y);

      let spreadRatio = 0;
      if (t > 0.8) {
        spreadRatio = Math.min(1, (t - 0.8) / 0.6);
        spreadRatio = -(Math.cos(Math.PI * spreadRatio) - 1) / 2;
      }

      const pureColor = { r: 0, g: 210, b: 255 };
      const murkColor = { r: 50, g: 80, b: 60 }; // Nasty green/brown

      const pR = pureColor.r + (murkColor.r - pureColor.r) * spreadRatio;
      const pG = pureColor.g + (murkColor.g - pureColor.g) * spreadRatio;
      const pB = pureColor.b + (murkColor.b - pureColor.b) * spreadRatio;

      const drawDrop = (x, y, rad, r, g, b) => {
        ctx.save();
        ctx.translate(x, y);

        const R = rad + Math.sin(time * 2 + x) * rad * 0.02;

        const grad = ctx.createRadialGradient(0, -R * 0.3, 0, 0, 0, R * 1.4);

        grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;

        ctx.beginPath();

        for (let i = 0; i <= Math.PI * 2 + 0.1; i += 0.1) {
          let angle = i;
          let radius = R;

          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.fill();

        // specular highlight
        const highlight = ctx.createRadialGradient(
          -R * 0.4,
          -R * 0.4,
          0,
          -R * 0.4,
          -R * 0.4,
          R
        );

        highlight.addColorStop(0, "rgba(255,255,255,0.7)");
        highlight.addColorStop(0.3, "rgba(255,255,255,0.2)");
        highlight.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = highlight;
        ctx.globalCompositeOperation = "lighter";
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        ctx.restore();
      };

      const drawFace = (x, y, rad, ratio, isPureInitially) => {
        ctx.save();
        ctx.translate(x, y);

        const state = isPureInitially ? ratio : 1;

        // Sclera color: pure = white, contaminated = pale greenish yellow
        const rC = 255 - state * 50;
        const gC = 255;
        const bC = 255 - state * 150;
        const eyeColor = `rgba(${rC}, ${gC}, ${bC}, 0.95)`;

        const eyeW = rad * 0.15;
        const eyeH = rad * (0.24 - state * 0.08);

        const eyeOffX = rad * 0.3;
        const eyeOffY = -rad * 0.1;

        const eyeTilt = state * 0.25;

        // Bouncing/wobbly effect for faces removed (vibration fixed)
        const wobbleY = 0;
        ctx.translate(0, wobbleY);

        const buildEye = (side) => {
          ctx.save();
          ctx.translate(side * eyeOffX, eyeOffY);
          ctx.rotate(side * -eyeTilt);

          // Save for clipping
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
          ctx.clip();

          // Sclera
          ctx.fillStyle = eyeColor;
          ctx.fill();

          // Pupil moves down and inwards as they get sick
          ctx.beginPath();
          const pupX = side * state * eyeW * 0.2;
          const pupY = state * eyeH * 0.3;
          ctx.arc(pupX, pupY, eyeW * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = "#051010";
          ctx.fill();

          // Pupil highlight
          ctx.beginPath();
          ctx.arc(pupX - eyeW * 0.15, pupY - eyeW * 0.15, eyeW * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();

          // Angry Eyelid drop down
          if (state > 0.01) {
            const yLid = -eyeH * 1.5 + state * eyeH * 1.8;
            ctx.rotate(side * 0.3 * state);
            ctx.fillStyle = `rgba(20, 60, 40, ${0.4 + state * 0.4})`;
            ctx.fillRect(-eyeW * 2, -eyeH * 2, eyeW * 4, eyeH * 2 + yLid);

            // Eyelid stroke
            ctx.beginPath();
            ctx.moveTo(-eyeW * 2, yLid);
            ctx.lineTo(eyeW * 2, yLid);
            ctx.strokeStyle = "rgba(0,0,0,0.8)";
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Under eye bags (sick look)
          if (state > 0.3) {
            ctx.beginPath();
            ctx.arc(0, eyeH * 0.8, eyeW * 0.8, Math.PI, Math.PI * 2);
            ctx.strokeStyle = `rgba(10,50,20,${(state - 0.3) * 0.8})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          ctx.restore();

          // Outer stroke for eye
          ctx.beginPath();
          ctx.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgba(0,30,10,0.6)";
          ctx.stroke();

          ctx.restore();
        };

        buildEye(-1);
        buildEye(1);

        // Mouth
        const mX = rad * 0.25;
        const mY = rad * 0.25;

        // Mouth drops and flips
        const endY = mY + state * (rad * 0.05);
        const cpY = mY + (rad * 0.2) - state * (rad * 0.6);

        ctx.beginPath();
        if (state > 0.9) {
          // sickly squiggly
          ctx.moveTo(-mX, endY);
          ctx.quadraticCurveTo(-mX * 0.5, endY - rad * 0.1, 0, endY + rad * 0.02);
          ctx.quadraticCurveTo(mX * 0.5, endY - rad * 0.05, mX, endY);
        } else {
          ctx.moveTo(-mX, endY);
          ctx.quadraticCurveTo(0, cpY, mX, endY);
        }

        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(10,30,20,0.8)";
        ctx.lineCap = "round";
        ctx.stroke();

        // Cheeks (blush) for pure state
        if (state < 0.3) {
          ctx.globalAlpha = 1 - state / 0.3;
          ctx.fillStyle = "rgba(0, 200, 255, 0.6)";

          ctx.beginPath();
          ctx.ellipse(-rad * 0.4, rad * 0.15, rad * 0.1, rad * 0.06, -0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(rad * 0.4, rad * 0.15, rad * 0.1, rad * 0.06, 0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 1;
        }

        ctx.restore();
      };

      drawDrop(d2x, d2y, dropRadius, murkColor.r, murkColor.g, murkColor.b);
      drawDrop(d1x, d1y, dropRadius, pR, pG, pB);

      drawFace(d2x, d2y, dropRadius, spreadRatio, false);
      drawFace(d1x, d1y, dropRadius, spreadRatio, true);

      if (dist < dropRadius * 3) {
        drawRipple(centerX, centerY, dropRadius * 1.5);
      }

      // pollution particles
      ctx.globalAlpha = globalAlpha;
      ctx.globalCompositeOperation = "source-over";
      particles.forEach((p) => {
        p.angle += p.speed + Math.sin(time * 2 + p.distanceSq * 10) * 0.003;

        const pRad = Math.sqrt(p.distanceSq) * (dropRadius * 0.85);

        const localX = Math.cos(p.angle) * pRad;
        const localY = Math.sin(p.angle) * pRad;

        let cx = d2x;
        let cy = d2y;

        if (p.migrates) {
          cx = d2x + (d1x - d2x) * spreadRatio;
          cy = d2y + (d1y - d2y) * spreadRatio;
        }

        const turbulenceX = Math.sin(time * 3 + p.angle) * 2;
        const turbulenceY = Math.cos(time * 2 + p.angle) * 2;

        const px = cx + localX + turbulenceX;
        const py = cy + localY + turbulenceY;

        ctx.fillStyle = `rgba(30,40,35,${p.opacity})`;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // micro splash droplets
      for (let i = 0; i < 5; i++) {
        const splashX = centerX + (Math.random() - 0.5) * dropRadius * 2;
        const splashY = centerY + (Math.random() - 0.5) * dropRadius * 2;

        ctx.beginPath();
        ctx.arc(splashX, splashY, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,240,255,0.6)";
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.9,
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default WaterBackground;