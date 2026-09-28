"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  /** Jeda animasi dalam DETIK (mis. 0.1). Nilai > 10 dianggap milidetik dan otomatis dikonversi. */
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Pengaman: cegah konten tak pernah muncul gara-gara salah satuan (ms vs detik).
  const d = delay > 10 ? delay / 1000 : delay;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
