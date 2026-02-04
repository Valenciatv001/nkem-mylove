


"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Heart = {
  id: string;
  left: number;
  dx: number;
  durationMs: number;
  size: number;
  emoji: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function Home() {

  const HER_NAME = "Nkem💖"; 

  const cardRef = useRef<HTMLDivElement | null>(null);
  const noFloatRef = useRef<HTMLDivElement | null>(null);

  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [noTransform, setNoTransform] = useState<string>("translate(-50%, -50%)");
  const [hearts, setHearts] = useState<Heart[]>([]);
    const [isTouch, setIsTouch] = useState(false);
  

  const emojis = useMemo(() => ["💖", "💘", "💗", "✨", "💞", "😍"], []);

  const addHeart = (x?: number) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1000;
    const left = typeof x === "number" ? x : Math.random() * w;

    const id = crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const dx = Math.random() * 160 - 80;
    const durationMs = (2.1 + Math.random() * 1.1) * 1000;
    const size = 16 + Math.random() * 18;

    const h: Heart = { id, left, dx, durationMs, size, emoji };
    setHearts((prev) => [...prev, h]);

    window.setTimeout(() => {
      setHearts((prev) => prev.filter((p) => p.id !== id));
    }, durationMs + 800);
  };

  const burstHearts = (count = 20) => {
    const base = window.innerWidth / 2;
    for (let i = 0; i < count; i++) {
      window.setTimeout(() => addHeart(base + (Math.random() * 240 - 120)), i * 40);
    }
  };

  const moveNoAway = (pointerX: number, pointerY: number) => {
    const pad = 60;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const cx = w / 2;
    const cy = h / 2;

    const vx = cx - pointerX;
    const vy = cy - pointerY;

    const mag = Math.max(1, Math.hypot(vx, vy));
    const nx = vx / mag;
    const ny = vy / mag;

    const dist = 140 + Math.random() * 120;
    let x = pointerX + nx * dist;
    let y = pointerY + ny * dist;

    x = clamp(x, pad, w - pad);
    y = clamp(y, pad, h - pad);

    // base anchor is left:55%, top:68% with translate(-50%,-50%)
    const baseX = w * 0.55;
    const baseY = h * 0.68;
    const dx = x - baseX;
    const dy = y - baseY;

    setNoTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`);
  };

  // Detect touch devices (mobile/tablet)
useEffect(() => {
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
}, []);

  // ===== mouse listeners for tilt + NO dodge =====
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;

        setRy(clamp(dx * 10, -10, 10));
        setRx(clamp(-dy * 10, -10, 10));
      }

      const nf = noFloatRef.current;
      if (nf) {
        const r = nf.getBoundingClientRect();
        const mx = e.clientX;
        const my = e.clientY;
        const near =
          mx > r.left - 60 && mx < r.right + 60 && my > r.top - 60 && my < r.bottom + 60;

        if (near) moveNoAway(mx, my);
      }
    };

    const onLeave = () => {
      setRx(0);
      setRy(0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // subtle ambient hearts
  useEffect(() => {
    const t = window.setInterval(() => addHeart(Math.random() * window.innerWidth), 1200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <>
      <div className="noise" />

      <main className="wrap">
        <div
          ref={cardRef}
          className="card tilt"
          style={{
            // CSS vars for tilt
            ["--rx" as any]: `${rx}deg`,
            ["--ry" as any]: `${ry}deg`,
          }}
        >
          <div className="hearts">
            {hearts.map((h) => (
              <div
                key={h.id}
                className="heart"
                style={{
                  left: `${h.left}px`,
                  fontSize: `${h.size}px`,
                  animationDuration: `${h.durationMs}ms`,
                  ["--dx" as any]: `${h.dx}px`,
                }}
              >
                {h.emoji}
              </div>
            ))}
          </div>

          <div className="content">
            <div className="topline">
              <div className="badge">
                <span className="dot" />
                <span className="badgeText">Valentine Protocol</span>
              </div>
              <div className="hint">{isTouch ? "Tap the screen 😌" : "Move your mouse 😌"}</div>
            </div>

            <h1>
              Hi <span className="name">{HER_NAME}</span>…
              <br />
              will you be my <span className="val">Val</span>?
            </h1>

            <p className="sub">
              No pressure — just a soft “yes” and I’ll handle the rest: dates, vibes, and the kind
              of love that makes the world quiet.
            </p>

            <div className="grid">
              <div className="panel">
                <h3>Why you?</h3>
                <p>
                  {/* Because you feel like peace and trouble at the same time — the good kind. I’m
                  asking properly 😌 */}

                  Because you feel like peace and trouble at the same time — the good kind.
                  You calm me, challenge me, and somehow feel like home. I’m asking properly 😌
                </p>
              </div>

              <div className="panel">
                <h3>What you get</h3>
                <p>
                  Maximum care ✅
                  <br />
                  Premium attention ✅
                  <br />
                  Soft life energy ✅
                </p>
              </div>
            </div>

            <div className="ctaRow">
              <button
                className="btn yes"
                onClick={() => {
                  burstHearts(26);
                  setModalOpen(true);
                }}
              >
                YES 💖
              </button>

              <div className="footer">*Only one correct answer. Choose wisely 🙂</div>
            </div>
          </div>
        </div>
      </main>

      {/* floating NO (non-clickable) */}
      <div
        ref={noFloatRef}
        className="noFloat"
        style={{ transform: noTransform }}
        aria-hidden="true"
      >
        <button className="btn no" tabIndex={-1} aria-hidden="true">
          NO 😭
        </button>
      </div>

      {/* modal */}
      <div
        className={`modal ${modalOpen ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
      >
        <div className="sheet">
          <h2>Yessss! 💘</h2>
          <p>
            I knew it 😌. You just made my day. <br />
            I’m officially your Valentine now.
          </p>
          <div className="miniRow">
            <button className="btn yes" onClick={() => burstHearts(34)}>
              More Hearts ✨
            </button>
            <button className="btn ghost" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(:root) {
          --bg1: #0b1020;
          --bg2: #140b1f;
          --glass: rgba(255, 255, 255, 0.08);
          --stroke: rgba(255, 255, 255, 0.12);
          --text: rgba(255, 255, 255, 0.92);
          --muted: rgba(255, 255, 255, 0.65);
          --accent1: #ff4d8d;
          --accent2: #7c4dff;
          --accent3: #2de2e6;
          --shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
          --radius: 22px;
        }

        :global(html),
        :global(body) {
          height: 100%;
        }

        :global(body) {
          margin: 0;
          overflow: hidden;
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue",
            Arial;
          background: radial-gradient(1200px 600px at 20% 20%, rgba(255, 77, 141, 0.18), transparent
                55%),
            radial-gradient(900px 500px at 80% 35%, rgba(124, 77, 255, 0.18), transparent 55%),
            radial-gradient(800px 520px at 55% 85%, rgba(45, 226, 230, 0.12), transparent 60%),
            linear-gradient(140deg, var(--bg1), var(--bg2));
        }

        .noise {
          pointer-events: none;
          position: fixed;
          inset: -30%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity: 0.07;
          transform: rotate(12deg);
          animation: drift 12s linear infinite;
        }

        @keyframes drift {
          from {
            transform: translate3d(-2%, -2%, 0) rotate(12deg);
          }
          to {
            transform: translate3d(2%, 2%, 0) rotate(12deg);
          }
        }

        /* mobile-first */
        .wrap {
          height: 100%;
          display: grid;
          place-items: center;
          padding: max(16px, env(safe-area-inset-top)) 16px
            max(16px, env(safe-area-inset-bottom));
          perspective: 1200px;
        }

        .card {
          width: min(900px, 92vw);
          min-height: 420px;
          border-radius: var(--radius);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.06));
          border: 1px solid var(--stroke);
          box-shadow: var(--shadow);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: -2px;
          background: radial-gradient(500px 200px at 25% 20%, rgba(255, 77, 141, 0.35), transparent
                60%),
            radial-gradient(520px 220px at 80% 30%, rgba(124, 77, 255, 0.3), transparent 60%),
            radial-gradient(540px 240px at 60% 85%, rgba(45, 226, 230, 0.22), transparent 65%);
          filter: blur(18px);
          opacity: 0.55;
          transform: translateZ(-1px);
        }

        .tilt {
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.12s ease;
        }

        .content {
          position: relative;
          padding: 42px 40px 34px;
          display: grid;
          gap: 18px;
          transform: translateZ(20px);
        }

        .topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          opacity: 0.95;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.18);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
          transform: translateZ(22px);
        }

        .badgeText {
          font-weight: 700;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent1), var(--accent2));
          box-shadow: 0 0 18px rgba(255, 77, 141, 0.5);
        }

        .hint {
          font-size: 13px;
          color: var(--muted);
          user-select: none;
        }

        h1 {
          margin: 0;
          font-size: clamp(34px, 4vw, 56px);
          letter-spacing: -0.03em;
          line-height: 1.05;
          text-shadow: 0 18px 30px rgba(0, 0, 0, 0.35);
        }

        .sub {
          margin: 0;
          max-width: 60ch;
          color: rgba(255, 255, 255, 0.76);
          font-size: clamp(14px, 1.8vw, 18px);
          line-height: 1.55;
        }

        .name {
          background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.65));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .val {
          background: linear-gradient(135deg, var(--accent3), #fff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 18px;
          margin-top: 14px;
          align-items: stretch;
        }

        .panel {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.18);
          padding: 18px;
          position: relative;
          overflow: hidden;
          transform: translateZ(18px);
        }

        .panel::after {
          content: "";
          position: absolute;
          inset: -1px;
          background: radial-gradient(320px 120px at 20% 0%, rgba(255, 77, 141, 0.2), transparent
                65%);
          pointer-events: none;
        }

        .panel h3 {
          margin: 0 0 6px;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
        }

        .panel p {
          margin: 0;
          color: rgba(255, 255, 255, 0.82);
          line-height: 1.55;
          font-size: 15px;
        }

        .ctaRow {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
          margin-top: 18px;
          padding-top: 10px;
          position: relative;
        }

        .btn {
          border: 0;
          cursor: pointer;
          border-radius: 16px;
          padding: 14px 18px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: white;
          position: relative;
          transform: translateZ(22px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
          user-select: none;
        }

        .btn:active {
          transform: translateZ(22px) scale(0.98);
        }

        .yes {
          background: linear-gradient(135deg, var(--accent1), var(--accent2));
        }

        .yes:hover {
          filter: brightness(1.08);
          box-shadow: 0 26px 55px rgba(255, 77, 141, 0.18), 0 26px 55px rgba(124, 77, 255, 0.14);
        }

        .no {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.78);
          cursor: default;
          pointer-events: none; /* cannot click */
        }

        .footer {
          margin-top: 10px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
        }

        .noFloat {
          position: fixed;
          left: 55%;
          top: 68%;
          z-index: 30;
          pointer-events: none;
          transition: transform 0.22s ease;
        }

        .hearts {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .heart {
          position: absolute;
          bottom: -40px;
          opacity: 0;
          animation-name: floatUp;
          animation-timing-function: ease;
          animation-fill-mode: forwards;
          filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.45));
        }

        @keyframes floatUp {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--dx), -560px, 0) scale(1.25);
            opacity: 0;
          }
        }

        .modal {
          position: fixed;
          inset: 0;
          display: none;
          place-items: center;
          padding: 22px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(10px);
          z-index: 60;
        }

        .modal.open {
          display: grid;
        }

        .sheet {
          width: min(560px, 94vw);
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.07));
          box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55);
          padding: 22px;
        }

        .sheet h2 {
          margin: 0 0 10px;
          font-size: 26px;
          letter-spacing: -0.02em;
        }

        .sheet p {
          margin: 0 0 16px;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.6;
        }

        .miniRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ghost {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        @media (max-width: 720px) {
          .content {
            padding: 34px 22px 26px;
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
