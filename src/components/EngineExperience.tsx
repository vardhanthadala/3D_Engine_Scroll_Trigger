"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EngineExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    const frameCount = 31;

    /* -------------------------------- */
    /* FRAME PATH                       */
    /* -------------------------------- */

    const currentFrame = (index: number) =>
      `/frames/ezgif-frame-${String(index)
        .padStart(3, "0")}.png`;

    const images: HTMLImageElement[] = [];

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    /* -------------------------------- */
    /* RENDER                           */
    /* -------------------------------- */

    const render = (index: number) => {
      const img = images[index];

      if (!img || !img.complete) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Background */

      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);

      /* -------------------------------- */
      /* PERFECT CONTAIN                  */
      /* -------------------------------- */

      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;

      const scale = Math.min(
        width / imageWidth,
        height / imageHeight
      );

      /* Adjust cinematic sizing */

      const finalScale = scale * 0.72;

      const drawWidth = imageWidth * finalScale;
      const drawHeight = imageHeight * finalScale;

      /* PERFECT CENTER */

      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      context.clearRect(0, 0, width, height);

      context.drawImage(
        img,
        x,
        y,
        drawWidth,
        drawHeight
      );
    };

    /* -------------------------------- */
    /* GSAP OBJECT                      */
    /* -------------------------------- */

    const obj = {
      frame: 0,
    };

    /* -------------------------------- */
    /* PRELOAD IMAGES                   */
    /* -------------------------------- */

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();

      img.src = currentFrame(i);

      images.push(img);
    }

    /* -------------------------------- */
    /* INITIAL DRAW                     */
    /* -------------------------------- */

    images[0].onload = () => {
      render(0);
    };

    /* -------------------------------- */
    /* SCROLL ANIMATION                 */
    /* -------------------------------- */

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        frame: frameCount - 1,


        ease: "none",

        scrollTrigger: {
          trigger: sectionRef.current,

          start: "top top",

          end: "+=6000",

          scrub: 1.0,

          pin: true,

          anticipatePin: 1,

          invalidateOnRefresh: true,
        },

       onUpdate: () => {
  render(Math.round(obj.frame));
},
      });
    });

    /* -------------------------------- */
    /* RESIZE                           */
    /* -------------------------------- */

    const handleResize = () => {
      render(obj.frame);
      ScrollTrigger.refresh();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      ctx.revert();

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Canvas */}

      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full"
      />

      {/* Cinematic Overlay */}

      {/* <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-white/90 text-[clamp(3rem,7vw,8rem)] leading-[0.9] tracking-[-0.06em] font-semibold">
            3D Engine
          </h1>

          <p className="mt-5 text-white/50 text-sm md:text-base tracking-[0.25em] uppercase">
            Precision In Motion
          </p>
        </div>
      </div> */}

      {/* Vignette */}

      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
    </section>
  );
}