import { useEffect, useRef, useState, ReactNode, ElementType } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ============================================================
   GLOBAL STYLES + FONT (self-contained)
   ============================================================ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      html, body, #root { background: #0C0C0C; font-family: 'Kanit', sans-serif; }
      .hero-heading {
        background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `}</style>
  );
}

/* ============================================================
   FADE IN
   ============================================================ */
type FadeInProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
};
function FadeIn({
  children,
  as = "div",
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: FadeInProps) {
  const MotionTag = motion.create(as as ElementType);
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* ============================================================
   MAGNET
   ============================================================ */
type MagnetProps = {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  style?: React.CSSProperties;
};
function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const within =
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding;
      if (within) {
        setActive(true);
        setPos({ x: dx / strength, y: dy / strength });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   ANIMATED TEXT (scroll char reveal)
   ============================================================ */
function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const words = text.split(" ");
  const totalChars = text.length;
  let charIndex = 0;

  return (
    <p
      ref={ref}
      className="font-medium text-center leading-relaxed max-w-[560px] mx-auto"
      style={{ color: "#D7E2EA", fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
    >
      {words.map((word, wi) => {
        const wordSpan = (
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((char, ci) => {
              const start = charIndex / totalChars;
              const end = (charIndex + 1) / totalChars;
              charIndex += 1;
              return (
                <Char
                  key={ci}
                  progress={scrollYProgress}
                  range={[start, end]}
                  char={char}
                />
              );
            })}
          </span>
        );
        // account for the space removed by split
        charIndex += 1;
        return (
          <span key={`w-${wi}`}>
            {wordSpan}
            {wi < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </p>
  );
}
function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ opacity: 0.2 }}>{char}</span>
      <motion.span style={{ position: "absolute", left: 0, top: 0, opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

/* ============================================================
   BUTTONS
   ============================================================ */
function ContactButton() {
  return (
    <a
      href="https://skool.com/wiktory-ai-3521"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform duration-200 hover:scale-105"
      style={{
        background:
          "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow:
          "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
        outline: "2px solid white",
        outlineOffset: "-3px",
      }}
    >
      Napisz do mnie
    </a>
  );
}

function LiveProjectButton() {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors duration-200 hover:bg-[#D7E2EA]/10">
      Zobacz projekt
    </button>
  );
}

/* ============================================================
   NAV
   ============================================================ */
const NAV_LINKS = [
  { label: "O mnie", href: "#o-mnie" },
  { label: "Usługi", href: "#uslugi" },
  { label: "Projekty", href: "#projekty" },
  {
    label: "Kontakt",
    href: "https://skool.com/wiktory-ai-3521",
    external: true,
  },
];

/* ============================================================
   HERO
   ============================================================ */
function HeroSection() {
  return (
    <section
      className="h-screen flex flex-col relative"
      style={{ overflowX: "clip" }}
    >
      <FadeIn as="nav" delay={0} y={-20}>
        <nav className="flex justify-between px-6 md:px-10 pt-6 md:pt-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="flex-1 flex flex-col justify-end px-6 md:px-10 relative">
        <div className="overflow-hidden">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[8vw] sm:text-[8.5vw] md:text-[9vw] lg:text-[9.5vw] mt-6 sm:mt-4 md:-mt-5">
              Cześć, jestem wiktory
            </h1>
          </FadeIn>
        </div>

        <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <p
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
              style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
            >
              twórca 3d, którego napędza tworzenie uderzających i niezapomnianych
              projektów
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <ContactButton />
          </FadeIn>
        </div>

        <FadeIn
          delay={0.6}
          y={30}
          className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
        >
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="Portret Wiktory"
              className="w-full h-auto select-none pointer-events-none"
            />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}

/* ============================================================
   MARQUEE
   ============================================================ */
const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

function MarqueeRow({ images }: { images: string[] }) {
  const tripled = [...images, ...images, ...images];
  return (
    <div className="flex gap-3">
      {tripled.map((src, i) => (
        <img
          key={i}
          src={src}
          loading="lazy"
          alt=""
          className="rounded-2xl object-cover flex-shrink-0"
          style={{ width: 420, height: 270 }}
        />
      ))}
    </div>
  );
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3 overflow-hidden"
      style={{ background: "#0C0C0C" }}
    >
      <div ref={row1Ref} style={{ willChange: "transform" }}>
        <MarqueeRow images={MARQUEE_IMAGES.slice(0, 11)} />
      </div>
      <div ref={row2Ref} style={{ willChange: "transform" }}>
        <MarqueeRow images={MARQUEE_IMAGES.slice(11)} />
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */
function AboutSection() {
  return (
    <section
      id="o-mnie"
      className="min-h-screen flex flex-col items-center justify-center relative px-5 sm:px-8 md:px-10 py-20"
      style={{ background: "#0C0C0C" }}
    >
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt=""
          className="w-[120px] sm:w-[160px] md:w-[210px]"
        />
      </FadeIn>
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt=""
          className="w-[100px] sm:w-[140px] md:w-[180px]"
        />
      </FadeIn>
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt=""
          className="w-[120px] sm:w-[160px] md:w-[210px]"
        />
      </FadeIn>
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt=""
          className="w-[130px] sm:w-[170px] md:w-[220px]"
        />
      </FadeIn>

      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 relative z-10">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              O mnie
            </h2>
          </FadeIn>
          <AnimatedText text="Prowadzę społeczność na Skool poświęconą AI, gdzie pomagam rozwijać biznesy z wykorzystaniem sztucznej inteligencji. Wspieram freelancerów w skalowaniu ich pracy i prowadzę social media od początku do końca. Zbudujmy razem coś niezwykłego!" />
        </div>
        <ContactButton />
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */
const SERVICES = [
  {
    n: "01",
    name: "Modelowanie 3D",
    desc: "Tworzenie szczegółowych obiektów, postaci i środowisk dopasowanych do konkretnych potrzeb klienta — idealne do gier, produktów i wizualizacji.",
  },
  {
    n: "02",
    name: "Rendering",
    desc: "Wysokiej jakości, fotorealistyczne rendery, które prezentują projekty z indywidualnym oświetleniem, teksturami i materiałami, ożywiając koncepcje.",
  },
  {
    n: "03",
    name: "Motion Design",
    desc: "Dynamiczne animacje i grafika ruchoma, które dodają energii i opowieści markom, produktom i doświadczeniom cyfrowym.",
  },
  {
    n: "04",
    name: "Branding",
    desc: "Tworzenie spójnych identyfikacji wizualnych — od logo po pełne systemy marki — które komunikują wyraźną i zapadającą w pamięć obecność.",
  },
  {
    n: "05",
    name: "Projektowanie stron",
    desc: "Projektowanie czystych, nowoczesnych i nastawionych na konwersję stron z dbałością o układ, typografię i user experience.",
  },
];

function ServicesSection() {
  return (
    <section
      id="uslugi"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: "#FFFFFF" }}
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ color: "#0C0C0C", fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Usługi
      </h2>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.1}>
            <div
              className="flex items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12"
              style={{ borderTop: "1px solid rgba(12, 12, 12, 0.15)" }}
            >
              <span
                className="font-black leading-none flex-shrink-0"
                style={{
                  color: "#0C0C0C",
                  fontSize: "clamp(3rem, 10vw, 140px)",
                }}
              >
                {s.n}
              </span>
              <div className="flex flex-col gap-3 pt-2">
                <h3
                  className="font-medium uppercase"
                  style={{
                    color: "#0C0C0C",
                    fontSize: "clamp(1rem, 2.2vw, 2.1rem)",
                  }}
                >
                  {s.name}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl"
                  style={{
                    color: "#0C0C0C",
                    opacity: 0.6,
                    fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PROJECTS (sticky stacking cards)
   ============================================================ */
type Project = {
  n: string;
  category: string;
  name: string;
  col1: [string, string];
  col2: string;
};
const PROJECTS: Project[] = [
  {
    n: "01",
    category: "Klient",
    name: "Nextlevel Studio",
    col1: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    ],
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    n: "02",
    category: "Projekt własny",
    name: "Aura Brand Identity",
    col1: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    ],
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    n: "03",
    category: "Klient",
    name: "Solaris Digital",
    col1: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    ],
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32"
    >
      <motion.div
        style={{ scale, top: `${index * 28}px` }}
        className="relative w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8"
      >
        <div className="bg-[#0C0C0C] rounded-[36px] sm:rounded-[46px] md:rounded-[56px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-5">
              <span
                className="font-black leading-none text-[#D7E2EA]"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
              >
                {project.n}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[#D7E2EA] uppercase tracking-widest font-light text-sm opacity-70">
                  {project.category}
                </span>
                <span
                  className="text-[#D7E2EA] font-medium uppercase"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {project.name}
                </span>
              </div>
            </div>
            <LiveProjectButton />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-3" style={{ width: "40%" }}>
              <img
                src={project.col1[0]}
                alt=""
                loading="lazy"
                className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(130px, 16vw, 230px)" }}
              />
              <img
                src={project.col1[1]}
                alt=""
                loading="lazy"
                className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(160px, 22vw, 340px)" }}
              />
            </div>
            <div style={{ width: "60%" }}>
              <img
                src={project.col2}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section
      id="projekty"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: "#0C0C0C" }}
    >
      <h2
        className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-16"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Projekt
      </h2>
      <div className="max-w-6xl mx-auto">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.n} project={p} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  return (
    <main style={{ background: "#0C0C0C", overflowX: "clip" }}>
      <GlobalStyles />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
