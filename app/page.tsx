'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import {
  Brain,
  ExternalLink,
  Layers,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  bringItems,
  contact,
  manifestoLines,
  projects,
  stats,
  techStack,
  type NavSection,
  type Project,
} from '@/lib/portfolio';

const SECTION_META: Record<
  NavSection,
  { label: string; path: string; hue: string; icon: ReactNode }
> = {
  start: {
    label: 'Start',
    path: '/Start',
    hue: '#00F0FF',
    icon: <User className="h-4 w-4" />,
  },
  work: {
    label: 'Work',
    path: '/Work',
    hue: '#B026FF',
    icon: <Layers className="h-4 w-4" />,
  },
  cognition: {
    label: 'Cognition',
    path: '/Cognition',
    hue: '#00F0FF',
    icon: <Brain className="h-4 w-4" />,
  },
  connect: {
    label: 'Connect',
    path: '/Connect',
    hue: '#B026FF',
    icon: <Mail className="h-4 w-4" />,
  },
};

function useOdometer(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);
  return value;
}

function MagneticButton({
  children,
  className,
  href,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classNames = clsx(
    'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-none border border-cyan-400/40 bg-black/60 px-6 py-3 font-mono text-sm uppercase tracking-[0.2em] text-[#E8E8E8] transition-colors hover:border-cyan-300 hover:text-white',
    className
  );

  const glow = (
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 to-[#B026FF]/10" />
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ x: sx, y: sy }}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className={classNames}
        onClick={(e) => e.stopPropagation()}
      >
        {glow}
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={classNames}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {glow}
      {children}
    </motion.button>
  );
}

function HolodeckGrid({
  section,
  mouseX,
  mouseY,
}: {
  section: NavSection;
  mouseX: number;
  mouseY: number;
}) {
  const hue = SECTION_META[section].hue;
  const tiltX = (0.5 - mouseY) * 14;
  const tiltY = (mouseX - 0.5) * 18;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${hue}18 0%, #0A0A0A 55%)`,
        }}
      />
      <div
        className="absolute left-1/2 top-[58%] h-[140vmax] w-[140vmax] origin-center -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `perspective(900px) rotateX(${62 + tiltX}deg) rotateZ(${tiltY}deg)`,
          backgroundImage: `
            linear-gradient(${hue}33 1px, transparent 1px),
            linear-gradient(90deg, ${hue}33 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 18%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 18%, transparent 72%)',
          transition: 'transform 0.15s ease-out',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(to top, #0A0A0A, transparent)',
        }}
      />
    </div>
  );
}

function Prism({
  project,
  index,
  selected,
  onSelect,
}: {
  project: Project;
  index: number;
  selected: boolean;
  onSelect: (p: Project) => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect(project)}
      className={clsx(
        'prism-shatter group relative h-40 w-36 shrink-0 sm:h-48 sm:w-44',
        selected && 'z-10'
      )}
      initial={{ opacity: 0, y: 40, rotateY: -30 }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
        rotateY: selected ? 0 : index % 2 === 0 ? -18 : 18,
        rotateX: selected ? 0 : 12,
        scale: selected ? 1.08 : 1,
      }}
      transition={{
        y: { duration: 4 + index, repeat: Infinity, ease: 'easeInOut' },
        default: { type: 'spring', stiffness: 120, damping: 16 },
      }}
      whileHover={{ scale: 1.12, rotateY: 0, rotateX: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(18deg) rotateY(-24deg)',
        }}
      >
        <div
          className="absolute inset-0 border border-white/20 backdrop-blur-md transition-all duration-300 group-hover:border-cyan-300/80 group-hover:shadow-[0_0_40px_rgba(0,240,255,0.35)]"
          style={{
            background: `linear-gradient(145deg, ${project.accent}33, #121212cc 55%, ${project.accent}22)`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
        <div
          className="absolute inset-[10%] opacity-40 transition-opacity group-hover:opacity-80"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            backgroundImage: `linear-gradient(${project.accent}55 1px, transparent 1px), linear-gradient(90deg, ${project.accent}55 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
          }}
        />
      </div>
      <div className="absolute inset-x-2 bottom-2 z-10 text-left">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">
          case_{String(index + 1).padStart(2, '0')}
        </p>
        <p className="font-display text-sm font-bold leading-tight text-[#E8E8E8]">
          {project.title}
        </p>
      </div>
    </motion.button>
  );
}

function OrbNav({
  section,
  onChange,
}: {
  section: NavSection;
  onChange: (s: NavSection) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPos({ x: window.innerWidth - 96, y: 28 });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({
      x: Math.min(window.innerWidth - 64, Math.max(8, e.clientX - offset.current.x)),
      y: Math.min(window.innerHeight - 64, Math.max(8, e.clientY - offset.current.y)),
    });
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const items = (Object.keys(SECTION_META) as NavSection[]).map((key, i, arr) => {
    const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
    const r = open ? 88 : 0;
    return {
      key,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      ...SECTION_META[key],
    };
  });

  return (
    <div
      className="fixed z-50"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="relative h-16 w-16">
        <AnimatePresence>
          {items.map((item) => (
            <motion.button
              key={item.key}
              type="button"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{
                opacity: open ? 1 : 0,
                x: item.x,
                y: item.y,
                scale: open ? 1 : 0.4,
                pointerEvents: open ? 'auto' : 'none',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              onClick={(e) => {
                e.stopPropagation();
                onChange(item.key);
                setOpen(false);
                document
                  .getElementById(`section-${item.key}`)
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={clsx(
                'absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border bg-black/80 font-mono text-[9px] uppercase tracking-wider text-[#E8E8E8] backdrop-blur-md',
                section === item.key
                  ? 'border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.45)]'
                  : 'border-white/20'
              )}
              style={{ color: item.hue }}
              title={item.path}
            >
              {item.icon}
              <span className="mt-0.5">{item.path.replace('/', '')}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute inset-0 rounded-full border border-cyan-400/50 bg-gradient-to-br from-[#00F0FF]/30 via-black to-[#B026FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.35)]"
          whileTap={{ scale: 0.92 }}
          animate={{ rotate: open ? 45 : 0 }}
        >
          <span className="absolute inset-[3px] rounded-full border border-white/10" />
          <Sparkles className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-cyan-200" />
        </motion.button>
      </div>
    </div>
  );
}

function Manifesto() {
  const [visible, setVisible] = useState(0);
  const [statsOn, setStatsOn] = useState(false);

  useEffect(() => {
    if (visible >= manifestoLines.length) {
      setStatsOn(true);
      return;
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 55);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="relative">
      <div className="glass-sheet noise-overlay relative overflow-hidden p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs text-cyan-300/80">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          live_manifesto.exe
        </div>
        <div className="min-h-[220px] space-y-1 font-mono text-[12px] leading-relaxed text-[#cfcfcf] sm:text-sm">
          {manifestoLines.slice(0, visible).map((line, i) => (
            <p
              key={i}
              className={clsx(
                'glitch-hover',
                i === visible - 1 && visible < manifestoLines.length && 'terminal-caret'
              )}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Audio waveform visual */}
        <div className="mt-6 flex h-12 items-end gap-[3px]">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-gradient-to-t from-[#B026FF] to-[#00F0FF]"
              animate={{ height: [6, 12 + ((i * 17) % 36), 8, 20 + ((i * 11) % 28), 6] }}
              transition={{ duration: 1.4 + (i % 5) * 0.12, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <OdometerStat key={s.label} {...s} active={statsOn} />
        ))}
      </div>
    </div>
  );
}

function OdometerStat({
  label,
  value,
  suffix,
  active,
}: {
  label: string;
  value: number;
  suffix: string;
  active: boolean;
}) {
  const n = useOdometer(value, active);
  return (
    <div className="border border-white/10 bg-[#121212]/80 p-4 text-center">
      <p className="font-display text-3xl font-extrabold tracking-tight text-gradient sm:text-4xl">
        {n}
        {suffix}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#888]">
        {label}
      </p>
    </div>
  );
}

function ProjectDrawer({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="glass-sheet noise-overlay fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto border-t border-cyan-400/30 p-6 sm:p-10"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <div className="mx-auto flex max-w-4xl flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
                    {project.year} · {project.status}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-lg text-[#B026FF]">{project.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-white/20 p-2 text-[#E8E8E8] hover:border-cyan-300"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-[#c8c8c8]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-white/15 bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan-200/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {project.href && (
                <MagneticButton href={project.href}>
                  Open project <ExternalLink className="h-4 w-4" />
                </MagneticButton>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Carousel({ onSelect }: { onSelect: (p: Project) => void }) {
  const [angle, setAngle] = useState(0);
  const count = projects.length;
  const step = 360 / count;

  return (
    <div className="relative mx-auto h-[280px] w-full max-w-3xl" style={{ perspective: 1200 }}>
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center gap-3">
        <MagneticButton onClick={() => setAngle((a) => a + step)}>Prev</MagneticButton>
        <MagneticButton onClick={() => setAngle((a) => a - step)}>Next</MagneticButton>
      </div>
      <motion.div
        className="absolute left-1/2 top-24 h-40 w-full -translate-x-1/2"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: angle }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      >
        {projects.map((p, i) => {
          const theta = i * step;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="absolute left-1/2 top-0 w-56 -translate-x-1/2 border border-cyan-400/25 bg-gradient-to-b from-[#121212] to-black p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-md hover:border-cyan-300"
              style={{
                transform: `rotateY(${theta}deg) translateZ(220px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                {p.year}
              </p>
              <p className="mt-2 font-display text-lg font-bold leading-tight">{p.title}</p>
              <p className="mt-2 line-clamp-3 font-mono text-[11px] text-[#999]">
                {p.subtitle}
              </p>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [section, setSection] = useState<NavSection>('start');
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [selected, setSelected] = useState<Project | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  const onMove = useCallback((e: MouseEvent) => {
    setMouse({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);

  const onClickRipple = useCallback((e: MouseEvent) => {
    const id = ++rippleId.current;
    setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setRipples((r) => r.filter((x) => x.id !== id));
    }, 900);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id.replace('section-', '') as NavSection;
          if (SECTION_META[id]) setSection(id);
        });
      },
      { threshold: 0.45 }
    );
    (Object.keys(SECTION_META) as NavSection[]).forEach((key) => {
      const el = document.getElementById(`section-${key}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const hue = useMemo(() => SECTION_META[section].hue, [section]);

  return (
    <div
      className="relative min-h-screen bg-[#0A0A0A] text-[#E8E8E8]"
      onMouseMove={onMove}
      onClick={onClickRipple}
    >
      <HolodeckGrid section={section} mouseX={mouse.x} mouseY={mouse.y} />
      <OrbNav section={section} onChange={setSection} />

      {/* Ripples */}
      <div className="pointer-events-none fixed inset-0 z-[60]">
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full border border-cyan-300/70"
            style={{ left: r.x, top: r.y }}
            initial={{ width: 0, height: 0, opacity: 0.8, x: 0, y: 0 }}
            animate={{
              width: 280,
              height: 280,
              opacity: 0,
              x: -140,
              y: -140,
            }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* START / INTRO */}
      <section id="section-start" className="snap-section relative px-5 pb-20 pt-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em]" style={{ color: hue }}>
            {SECTION_META[section].path}
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            Tumara Hall
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-cyan-300 sm:text-base">
            Software Developer | Invercargill, NZ
          </p>
          <p className="mt-8 max-w-2xl font-display text-2xl font-semibold leading-snug text-[#E8E8E8] sm:text-3xl">
            I build systems that actually work.{' '}
            <span className="text-gradient">In the real world.</span>
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#aaaaaa] sm:text-lg">
            I&apos;m a developer with a twist—I&apos;ve run industrial yards, managed logistics, and
            built assistive tech for families. I don&apos;t just write code. I solve problems people
            actually have.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="glass-sheet noise-overlay relative overflow-hidden p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
                What I bring
              </p>
              <ul className="mt-5 space-y-3">
                {bringItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-l border-cyan-400/40 pl-4 text-sm leading-relaxed text-[#c8c8c8]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gradient-to-br from-[#00F0FF] to-[#B026FF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="glass-sheet noise-overlay relative overflow-hidden p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#B026FF]">
                  I&apos;m looking for
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#c8c8c8]">
                  A role where I can build features that matter. Scheduling. Payments. Integrations.
                  AI-assisted development. I work best when I own the problem from start to finish.
                </p>
              </div>
              <div className="glass-sheet noise-overlay relative overflow-hidden p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
                  Tech I roll with
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <span
                      key={t}
                      className="border border-white/15 bg-black/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#E8E8E8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton
              onClick={() => {
                document.getElementById('section-work')?.scrollIntoView({ behavior: 'smooth' });
                setSection('work');
              }}
            >
              View work
            </MagneticButton>
            <MagneticButton href={`mailto:${contact.email}`}>Email me</MagneticButton>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="section-work" className="snap-section relative px-5 pb-24 pt-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#B026FF]">/Work</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-6xl">
            Active
            <br />
            <span className="text-gradient">cases.</span>
          </h2>

          <div className="mt-14">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/70">
              Holodeck · project prisms
            </p>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
              {projects.map((p, i) => (
                <Prism
                  key={p.id}
                  project={p}
                  index={i}
                  selected={selected?.id === p.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          </div>

          <div className="mt-20">
            <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-[#666]">
              Time-lapse drum · work showcase
            </p>
            <Carousel onSelect={setSelected} />
          </div>

          <div className="mt-24 glass-sheet noise-overlay relative overflow-hidden p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#B026FF]">
              Featured MVP · Charity impact
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              On My Tikanga Terms
            </h3>
            <p className="mt-3 max-w-2xl text-[#bdbdbd]">
              Designed for ACC Sensitive Claims survivors. Built by CB Tech Charitable Trust because
              I like to make meaningful applications — not just demos.
            </p>
            <div className="mt-6">
              <MagneticButton href="https://on-my-tikanga-terms-7p68pl8s3-girlb0ss1990s-projects.vercel.app/">
                Launch MVP <ExternalLink className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* COGNITION / BIO + VIDEO */}
      <section id="section-cognition" className="snap-section relative px-5 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">/Cognition</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-6xl">
              Living
              <br />
              <span className="text-gradient">signal.</span>
            </h2>
            <div className="mt-8">
              <Manifesto />
            </div>
          </div>
          <div>
            <div className="glass-sheet noise-overlay relative overflow-hidden p-3 sm:p-4">
              <div className="vimeo-frame border border-white/10">
                <iframe
                  src="https://player.vimeo.com/video/1092262059?badge=0&autopause=0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Tumara Hall (Ngāti Whatua) - Founder/Full Stack Developer, CB Tech NZ"
                />
              </div>
              <p className="mt-4 px-2 font-mono text-xs text-[#888]">
                Tumara Hall (Ngāti Whatua) — Founder / Full Stack Developer, CB Tech NZ ·{' '}
                <a
                  className="text-cyan-300 hover:underline"
                  href="https://vimeo.com/1092262059"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vimeo.com/1092262059
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section id="section-connect" className="snap-section relative px-5 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B026FF]">/Connect</p>
            <h2 className="mt-4 font-display text-5xl font-extrabold sm:text-7xl">
              Let&apos;s
              <br />
              <span className="text-gradient">talk.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[#aaaaaa]">
              Open to roles where I can own features end-to-end — scheduling, payments, integrations,
              and AI-assisted development.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <a
              href={`mailto:${contact.email}`}
              className="glass-sheet noise-overlay group relative overflow-hidden p-5 text-left transition-colors hover:border-cyan-300/50"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">
                Email
              </p>
              <p className="mt-1 break-all font-display text-sm font-semibold text-[#E8E8E8] group-hover:text-cyan-200">
                {contact.email}
              </p>
            </a>
            <a
              href={contact.phoneHref}
              className="glass-sheet noise-overlay group relative overflow-hidden p-5 text-left transition-colors hover:border-cyan-300/50"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-5 w-5 text-[#B026FF]" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">
                Phone
              </p>
              <p className="mt-1 font-display text-sm font-semibold text-[#E8E8E8] group-hover:text-cyan-200">
                {contact.phone}
              </p>
            </a>
            <a
              href={contact.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-sheet noise-overlay group relative overflow-hidden p-5 text-left transition-colors hover:border-cyan-300/50"
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">
                Address
              </p>
              <p className="mt-1 font-display text-sm font-semibold text-[#E8E8E8] group-hover:text-cyan-200">
                {contact.address}
              </p>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton href={`mailto:${contact.email}`}>Email Tumara</MagneticButton>
            <MagneticButton href={contact.phoneHref}>Call now</MagneticButton>
            <MagneticButton href="https://on-my-tikanga-terms-7p68pl8s3-girlb0ss1990s-projects.vercel.app/">
              View ACC MVP
            </MagneticButton>
          </div>
          <p className="mt-16 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#555]">
            © {new Date().getFullYear()} Tumara Hall · CB Tech Charitable Trust · Invercargill NZ
          </p>
        </div>
      </section>

      <ProjectDrawer project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
