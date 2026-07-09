import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const HERO_VIDEO_LOOP_FADE_SECONDS = 0.7;
const HERO_VIDEO_RESTART_DELAY_MS = 90;

const routes = [
  {
    eyebrow: "4 noites · costa",
    title: "Costa Bruma",
    description:
      "Hospedagens discretas, barcos ao nascer do sol, cozinha de mar e mirantes que parecem editados a mão.",
    tags: ["oceano", "mesa autoral", "guia privado"],
    tone: "coast",
    image: asset("assets/nortada-hero.png"),
  },
  {
    eyebrow: "6 noites · interior",
    title: "Serra Lunar",
    description:
      "Estradas cênicas, ateliers vivos, lareiras silenciosas e caminhadas desenhadas para terminar bem à mesa.",
    tags: ["serra", "arte local", "slow travel"],
    tone: "serra",
    image: asset("assets/nortada-serra-lunar.png"),
  },
  {
    eyebrow: "3 noites · vinho",
    title: "Vinhas Atlânticas",
    description:
      "Provas íntimas, almoços de produtor, arquitetura rural e uma curadoria precisa de garrafas raras.",
    tags: ["vinho", "produtores", "hotelaria premium"],
    tone: "vinhas",
    image: asset("assets/nortada-vinhas-atlanticas.png"),
  },
];

const principles = [
  {
    title: "Ritmo próprio",
    description:
      "Menos deslocamento mecânico, mais pausas com sentido e transições desenhadas.",
  },
  {
    title: "Acesso local",
    description:
      "Guias, chefs, artesãos e anfitriões escolhidos pelo repertório que carregam.",
  },
  {
    title: "Concierge claro",
    description:
      "Uma pessoa acompanha o roteiro, ajusta detalhes e mantém o viajante orientado.",
  },
];

function Header() {
  return (
    <header className="site-header" aria-label="Navegação principal">
      <a className="brand" href="#top" aria-label="Nortada">
        <span className="brand-mark">N</span>
        nortada
      </a>
      <nav className="nav" aria-label="Seções">
        <a href="#experiencias">Experiências</a>
        <a href="#roteiros">Roteiros</a>
        <a href="#contato">Contato</a>
      </nav>
      <a className="header-contact" href="#contato">
        Falar com concierge
      </a>
    </header>
  );
}

function Hero() {
  const [activeRoute, setActiveRoute] = useState(0);
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);
  const heroVideoMaskRef = useRef(null);
  const heroVideoRestartTimer = useRef(null);
  const isHeroVideoLooping = useRef(false);
  const wasHeroVisible = useRef(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.22], ["0%", "10%"]);

  const resetHeroVideoLoop = () => {
    const video = heroVideoRef.current;

    window.clearTimeout(heroVideoRestartTimer.current);
    isHeroVideoLooping.current = false;
    heroVideoMaskRef.current?.classList.remove("is-visible");

    if (video) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    }
  };

  const pauseHeroVideoLoop = () => {
    window.clearTimeout(heroVideoRestartTimer.current);
    isHeroVideoLooping.current = false;
    heroVideoMaskRef.current?.classList.remove("is-visible");
    heroVideoRef.current?.pause();
  };

  const handleHeroVideoTimeUpdate = () => {
    const video = heroVideoRef.current;

    if (
      !video ||
      isHeroVideoLooping.current ||
      !Number.isFinite(video.duration)
    ) {
      return;
    }

    if (video.duration - video.currentTime <= HERO_VIDEO_LOOP_FADE_SECONDS) {
      isHeroVideoLooping.current = true;
      heroVideoMaskRef.current?.classList.add("is-visible");
    }
  };

  const handleHeroVideoEnded = () => {
    const video = heroVideoRef.current;

    if (!video) {
      return;
    }

    heroVideoMaskRef.current?.classList.add("is-visible");
    video.pause();
    video.currentTime = 0;

    window.clearTimeout(heroVideoRestartTimer.current);
    heroVideoRestartTimer.current = window.setTimeout(() => {
      void video.play().catch(() => {});
      heroVideoMaskRef.current?.classList.remove("is-visible");
      isHeroVideoLooping.current = false;
    }, HERO_VIDEO_RESTART_DELAY_MS);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveRoute((current) => (current + 1) % routes.length);
    }, 6200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const heroElement = heroRef.current;

    if (!heroElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.intersectionRatio >= 0.28;

        if (isVisible && !wasHeroVisible.current) {
          resetHeroVideoLoop();
          wasHeroVisible.current = true;
        }

        if (!isVisible) {
          pauseHeroVideoLoop();
          wasHeroVisible.current = false;
        }
      },
      { threshold: [0, 0.28] },
    );

    observer.observe(heroElement);

    return () => {
      observer.disconnect();
      window.clearTimeout(heroVideoRestartTimer.current);
    };
  }, []);

  const textReveal = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const active = routes[activeRoute];

  return (
    <section className="hero" id="top" aria-label="Nortada turismo de experiência">
      <motion.div
        className="hero-motion"
        aria-hidden="true"
        ref={heroRef}
        style={{ y: heroY }}
      >
        <video
          ref={heroVideoRef}
          className="hero-video"
          poster={asset("assets/nortada-hero-landscape.png")}
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleHeroVideoTimeUpdate}
          onEnded={handleHeroVideoEnded}
        >
          <source src={asset("assets/nortada-hero-waves.webm")} type="video/webm" />
        </video>
        <div
          ref={heroVideoMaskRef}
          className="hero-loop-mask"
          style={{ backgroundImage: `url(${asset("assets/nortada-hero-landscape.png")})` }}
        />
      </motion.div>

      <motion.div
        className="hero-inner"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.16 }}
      >
        <motion.p className="hero-kicker" variants={textReveal}>
          Turismo de experiência no ritmo do vento norte
        </motion.p>
        <motion.h1 variants={textReveal}>nortada</motion.h1>
        <motion.div className="hero-copy" variants={textReveal}>
          <p>
            Roteiros privados que costuram paisagem, gastronomia e encontros locais
            em jornadas com cadência cinematográfica, curadoria precisa e acolhimento
            humano do primeiro contato ao último brinde.
          </p>
          <div className="hero-actions" aria-label="Ações principais">
            <a className="button primary" href="#contato">
              Criar roteiro
            </a>
            <a className="button secondary" href="#roteiros">
              Ver experiências
            </a>
          </div>
        </motion.div>

        <motion.div className="hero-interface" variants={textReveal}>
          <div className="hero-briefing-panel" aria-label="Briefing inicial">
            <div>
              <span>Data</span>
              <strong>flexível</strong>
            </div>
            <div>
              <span>Ritmo</span>
              <strong>privado</strong>
            </div>
            <div>
              <span>Experiência</span>
              <strong>sob medida</strong>
            </div>
            <a href="#contato">Briefing</a>
          </div>

          <div className="hero-experience-stage" aria-label="Experiência em destaque">
            <AnimatePresence mode="wait">
              <motion.article
                className={`hero-feature-card ${active.tone}`}
                key={active.title}
                initial={{ opacity: 0, x: 72, rotate: 2.5, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: -64, rotate: -2.5, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="feature-image">
                  <motion.img
                    src={active.image}
                    alt=""
                    animate={{ scale: [1.08, 1.18], x: ["-2%", "2%"] }}
                    transition={{ duration: 3.6, ease: "easeInOut" }}
                  />
                </div>
                <div className="feature-content">
                  <small>{active.eyebrow}</small>
                  <h3>{active.title}</h3>
                  <p>{active.description}</p>
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="hero-card-rail" aria-label="Escolher experiência em destaque">
              {routes.map((route, index) => (
                <button
                  type="button"
                  className={`rail-card ${route.tone} ${
                    index === activeRoute ? "is-active" : ""
                  }`}
                  key={route.title}
                  aria-pressed={index === activeRoute}
                  aria-label={`Mostrar ${route.title} em destaque`}
                  onClick={() => {
                    setActiveRoute(index);
                  }}
                >
                  <img src={route.image} alt="" />
                  <span>{route.title}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.aside
        className="hero-meta"
        aria-label="Destaques"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <span>Formato</span>
          <strong>privado</strong>
        </div>
        <div>
          <span>Curadoria</span>
          <strong>autorais</strong>
        </div>
        <div>
          <span>Contato</span>
          <strong>concierge</strong>
        </div>
      </motion.aside>
    </section>
  );
}

function Story() {
  return (
    <section className="section intro" id="experiencias">
      <div className="section-inner">
        <div className="split-heading">
          <div>
            <p className="section-label">Narrativa visual</p>
            <h2>O destino aparece como história, não como checklist.</h2>
          </div>
          <p className="lead">
            A Nortada desenha viagens para quem quer sentir o território com tempo,
            contexto e acesso. Cada roteiro nasce de uma conversa e vira uma sequência
            elegante de cenas: chegada, descoberta, mesa, silêncio, travessia e memória.
          </p>
        </div>

        <div className="story-grid">
          <figure className="story-visual">
            <img src={asset("assets/nortada-hero.png")} alt="Costa atlântica ao entardecer" />
            <figcaption className="story-caption">
              <strong>Atlântico norte</strong>
              <span>Travessias curtas, mesas longas e pontos de vista reservados.</span>
            </figcaption>
          </figure>

          <div className="principles">
            {principles.map((principle, index) => (
              <article className="principle" key={principle.title}>
                <span>{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Routes() {
  return (
    <section className="section routes" id="roteiros">
      <div className="section-inner">
        <div className="split-heading">
          <div>
            <p className="section-label">Roteiros em destaque</p>
            <h2>Três portas de entrada para uma viagem sob medida.</h2>
          </div>
          <p className="lead">
            As experiências abaixo funcionam como ponto de partida. A conversa define
            o grau de aventura, o tempo de mesa, o nível de privacidade e o tom da viagem.
          </p>
        </div>

        <div className="routes-grid">
          {routes.map((route) => (
            <article className={`route ${route.tone}`} key={route.title}>
              <div className="route-image">
                <img src={route.image} alt="" />
              </div>
              <div className="route-body">
                <small>{route.eyebrow}</small>
                <h3>{route.title}</h3>
                <p>{route.description}</p>
                <div className="route-footer">
                  {route.tags.map((tag) => (
                    <span className="pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact" id="contato">
      <div className="section-inner contact-layout">
        <div>
          <p className="section-label">Pontos de contato</p>
          <h2>Uma conversa breve, um roteiro com presença.</h2>
          <p className="lead">
            O primeiro contato filtra data, perfil de viagem, celebrações, restrições e
            preferências de ritmo. Em até 48 horas, a Nortada devolve um desenho inicial
            com rota, hospedagem, experiências e próximos passos.
          </p>
        </div>
        <div className="contact-panel" aria-label="Canais de contato">
          <article className="contact-card">
            <h3>WhatsApp concierge</h3>
            <p>Resposta direta para começar uma rota privada ou ajustar uma viagem em andamento.</p>
            <div className="contact-link contact-link-static">+55 83 99999-9999</div>
          </article>
          <article className="contact-card">
            <h3>Briefing por e-mail</h3>
            <p>Ideal para grupos, datas especiais, imprensa ou experiências corporativas discretas.</p>
            <div className="contact-link contact-link-static">concierge@nortada.travel</div>
          </article>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Story />
        <Routes />
        <Contact />
      </main>
      <footer className="footer">
        <strong>nortada</strong>
        <span>Turismo de experiência · rotas privadas · curadoria premium</span>
      </footer>
    </>
  );
}

export default App;
