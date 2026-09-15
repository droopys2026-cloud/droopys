"use client";

import { useEffect, useRef } from "react";
import { wrap } from "@motionone/utils";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

/**
 * Bandeau de texte qui défile en continu.
 *
 * Le texte est répété quatre fois : c'est ce qui permet à la bande de reboucler
 * sans trou, quelle que soit la largeur d'écran.
 *
 * Avec `scrollDependent`, la vitesse — et le sens — suivent le défilement de la
 * page : on remonte, la bande repart en arrière. La vélocité passe par un
 * ressort pour éviter les à-coups d'une molette.
 */
type MarqueeProps = {
  children: string;
  /** Vitesse de base en % par seconde. Négatif = vers la gauche. */
  baseVelocity?: number;
  className?: string;
  scrollDependent?: boolean;
  /** Délai avant le premier mouvement, en millisecondes. */
  delay?: number;
  /** Taille du texte. Séparée de `className` : deux classes de taille sur le
      même élément ne se départagent pas de façon fiable. */
  sizeClassName?: string;
};

export function ScrollTextMarquee({
  children,
  baseVelocity = -3,
  className = "",
  scrollDependent = false,
  delay = 0,
  sizeClassName = "text-[11vw] sm:text-[8vw]",
}: MarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1.2], {
    clamp: false,
  });

  const x = useTransform(baseX, (value) => `${wrap(-20, -45, value)}%`);

  const directionFactor = useRef(1);
  const hasStarted = useRef(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    // Un texte qui défile sans fin est exactement ce que « moins d'animations »
    // vise : on ne démarre pas du tout dans ce cas.
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion.current) return;

    const timer = setTimeout(() => {
      hasStarted.current = true;
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useAnimationFrame((_, delta) => {
    if (!hasStarted.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (scrollDependent) {
      if (velocityFactor.get() < 0) directionFactor.current = -1;
      else if (velocityFactor.get() > 0) directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex flex-nowrap overflow-x-hidden overflow-y-visible whitespace-nowrap">
      <motion.div
        className="flex flex-nowrap gap-10 whitespace-nowrap"
        style={{ x }}
      >
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={`block leading-[1.15] ${sizeClassName} ${className}`}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
