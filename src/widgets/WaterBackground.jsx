import { useEffect, useRef } from "react";

/**
 * Fullscreen watery background with mouse-reactive ripples.
 * SVG turbulence + displacement (hardware accelerated).
 */
export default function WaterBackground() {
    const svgRef = useRef(null);
    const dispRef = useRef(null);
    const lightRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        let lastX = 0, lastY = 0;
        let raf = 0;
        let targetScale = 14; // default wave intensity
        let currScale = targetScale;

        const setLight = (clientX, clientY) => {
            const r = svg.getBoundingClientRect();
            const x = (clientX - r.left) / r.width;
            const y = (clientY - r.top) / r.height;
            if (lightRef.current) {
                lightRef.current.setAttribute("cx", x);
                lightRef.current.setAttribute("cy", y);
                lightRef.current.setAttribute("fx", x);
                lightRef.current.setAttribute("fy", y);
            }
        };

        const onMove = (e) => {
            const { clientX, clientY } = e;
            // follow light
            setLight(clientX, clientY);

            // increase displacement based on pointer speed
            const dx = clientX - lastX;
            const dy = clientY - lastY;
            const speed = Math.min(Math.hypot(dx, dy), 80);
            targetScale = 12 + speed * 0.7; // 12..68 approx
            lastX = clientX;
            lastY = clientY;

            if (!raf) tick();
        };

        const onLeave = () => {
            targetScale = 14; // ease back when mouse leaves
            if (!raf) tick();
        };

        function tick() {
            // ease scale to target for smoothness
            currScale += (targetScale - currScale) * 0.1;
            if (dispRef.current) {
                dispRef.current.setAttribute("scale", currScale.toFixed(2));
            }
            if (Math.abs(targetScale - currScale) > 0.2) {
                raf = requestAnimationFrame(tick);
            } else {
                raf = 0;
            }
        }

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerleave", onLeave, { passive: true });

        // initial center
        setLight(window.innerWidth / 2, window.innerHeight / 3);

        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <defs>
                {/* Water distortion */}
                <filter id="water">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.008 0.016"
                        numOctaves="2"
                        seed="3"
                    >
                        <animate
                            attributeName="baseFrequency"
                            dur="20s"
                            values="0.008 0.016; 0.012 0.022; 0.008 0.016"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap ref={dispRef} in="SourceGraphic" scale="14" />
                </filter>

                {/* Background gradient (soft sky/indigo) */}
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"  stopColor="#e0f2fe" />   {/* sky-100 */}
                    <stop offset="100%" stopColor="#e0e7ff" />  {/* indigo-100 */}
                </linearGradient>

                {/* Mouse-follow highlight (like light on water) */}
                <radialGradient id="mouseLight" ref={lightRef} cx="0.5" cy="0.35" r="0.55" fx="0.5" fy="0.35">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="55%"  stopColor="#ffffff" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Base gradient with water filter */}
            <rect width="100%" height="100%" fill="url(#bg)" filter="url(#water)" />
            {/* Light bloom that follows the mouse */}
            <rect width="100%" height="100%" fill="url(#mouseLight)" />
        </svg>
    );
}
