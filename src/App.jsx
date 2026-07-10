import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const routes = [
  {
    eyebrow: "4 noites · costa",
    title: "Costa Bruma",
    description:
      "Hospedagens discretas, barcos ao nascer do sol, cozinha de mar e mirantes que parecem editados a mão.",
    tags: ["oceano", "mesa autoral", "guia privado"],
    tone: "coast",
    image: asset("assets/nortada-hero.png"),
    chapter: "Ato I",
    coordinates: "Atlântico norte",
    mood: "bruma fria",
    signal: "maré baixa · barcos antes do sol",
    scene: "O barco sai antes do sol e o dia começa pelo silêncio.",
    accent: "#c7a15a",
    wash: "rgba(41, 93, 98, 0.46)",
  },
  {
    eyebrow: "6 noites · interior",
    title: "Serra Lunar",
    description:
      "Estradas cênicas, ateliers vivos, lareiras silenciosas e caminhadas desenhadas para terminar bem à mesa.",
    tags: ["serra", "arte local", "slow travel"],
    tone: "serra",
    image: asset("assets/nortada-serra-lunar.png"),
    chapter: "Ato II",
    coordinates: "interior alto",
    mood: "estrada lenta",
    signal: "lareira · atelier · mesa longa",
    scene: "A estrada sobe devagar, como se o roteiro esperasse a paisagem respirar.",
    accent: "#b46a4f",
    wash: "rgba(95, 68, 44, 0.48)",
  },
  {
    eyebrow: "3 noites · vinho",
    title: "Vinhas Atlânticas",
    description:
      "Provas íntimas, almoços de produtor, arquitetura rural e uma curadoria precisa de garrafas raras.",
    tags: ["vinho", "produtores", "hotelaria premium"],
    tone: "vinhas",
    image: asset("assets/nortada-vinhas-atlanticas.png"),
    chapter: "Ato III",
    coordinates: "vinhas de vento",
    mood: "verde mineral",
    signal: "produtor · garrafas raras · arquitetura rural",
    scene: "A mesa surge entre vinhas; a conversa amadurece.",
    accent: "#d1b46f",
    wash: "rgba(78, 103, 52, 0.5)",
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

const storyBeats = [
  {
    label: "Chegada",
    title: "A viagem abre em baixa velocidade.",
    description:
      "O primeiro deslocamento já vem com contexto, luz certa e uma chegada que não parece logística.",
  },
  {
    label: "Travessia",
    title: "Cada cena tem um motivo.",
    description:
      "Barco, estrada, trilha ou mesa entram quando criam memória, não para preencher um roteiro.",
  },
  {
    label: "Mesa",
    title: "O território chega pelo encontro.",
    description:
      "Chefs, produtores e anfitriões aparecem como parte da paisagem, com tempo para conversa.",
  },
  {
    label: "Memória",
    title: "O fim não tem pressa.",
    description:
      "A última cena deixa espaço para o viajante entender o que acabou de viver.",
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
    </header>
  );
}

function Hero() {
  const [activeRoute, setActiveRoute] = useState(0);
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);
  const wasHeroVisible = useRef(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.22], ["0%", "10%"]);

  const restartHeroVideo = () => {
    const video = heroVideoRef.current;

    if (video) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    }
  };

  const pauseHeroVideo = () => {
    heroVideoRef.current?.pause();
  };

  const handleHeroVideoEnded = () => {
    const video = heroVideoRef.current;

    if (!video) {
      return;
    }

    video.pause();

    if (Number.isFinite(video.duration)) {
      video.currentTime = Math.max(video.duration - 0.08, 0);
    }
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
          restartHeroVideo();
          wasHeroVisible.current = true;
        }

        if (!isVisible) {
          pauseHeroVideo();
          wasHeroVisible.current = false;
        }
      },
      { threshold: [0, 0.28] },
    );

    observer.observe(heroElement);

    return () => observer.disconnect();
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
    <section
      className={`hero hero-${active.tone}`}
      id="top"
      aria-label="Nortada turismo de experiência"
      style={{
        "--route-accent": active.accent,
        "--route-wash": active.wash,
      }}
    >
      <motion.div
        className="hero-motion"
        aria-hidden="true"
        ref={heroRef}
        style={{ y: heroY }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            className="hero-atmosphere"
            key={active.image}
            src={active.image}
            alt=""
            initial={{ opacity: 0, scale: 1.08, x: 42 }}
            animate={{ opacity: 0.34, scale: 1.02, x: 0 }}
            exit={{ opacity: 0, scale: 1.04, x: -34 }}
            transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <video
          ref={heroVideoRef}
          className="hero-video"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleHeroVideoEnded}
        >
          <source src={asset("assets/nortada-hero-waves.webm")} type="video/webm" />
        </video>
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
        <motion.h1 className="hero-title" variants={textReveal}>
          <span>nortada</span>
        </motion.h1>
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
          <div className="hero-command-stack">
            <AnimatePresence mode="wait">
              <motion.div
                className="hero-scene-note"
                key={active.title}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span>{active.chapter}</span>
                <strong>{active.scene}</strong>
              </motion.div>
            </AnimatePresence>

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
              <div>
                <span>Briefing</span>
                <strong>único</strong>
              </div>
            </div>
          </div>

          <div className="hero-experience-stage" aria-label="Experiência em destaque">
            <AnimatePresence mode="wait">
              <motion.article
                className={`hero-feature-card ${active.tone}`}
                key={active.title}
                initial={{ opacity: 0, x: 72, rotate: 2.5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -64, rotate: -2.5 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="feature-image">
                  <img src={active.image} alt="" />
                  <div className="feature-route-line">
                    <span>{active.chapter}</span>
                    <span>{active.coordinates}</span>
                  </div>
                </div>
                <div className="feature-content">
                  <small>{active.eyebrow}</small>
                  <h3>{active.title}</h3>
                  <p>{active.description}</p>
                  <strong className="feature-signal">{active.signal}</strong>
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
        <motion.div
          className="split-heading"
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="section-label">Narrativa visual</p>
            <h2>O destino aparece como história, não como checklist.</h2>
          </div>
          <p className="lead">
            A Nortada desenha viagens para quem quer sentir o território com tempo,
            contexto e acesso. Cada roteiro nasce de uma conversa e vira uma sequência
            elegante de cenas: chegada, descoberta, mesa, silêncio, travessia e memória.
          </p>
        </motion.div>

        <div className="story-grid">
          <motion.figure
            className="story-visual"
            initial={{ opacity: 0, clipPath: "inset(14% 0 14% 0)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={asset("assets/nortada-hero.png")} alt="Costa atlântica ao entardecer" />
            <div className="story-compass" aria-hidden="true">
              <span>N</span>
              <strong>38°</strong>
            </div>
            <figcaption className="story-caption">
              <strong>Atlântico norte</strong>
              <span>Travessias curtas, mesas longas e pontos de vista reservados.</span>
            </figcaption>
          </motion.figure>

          <div className="story-chapters">
            {storyBeats.map((beat, index) => (
              <motion.article
                className="story-chapter"
                key={beat.label}
                initial={{ opacity: 0, x: 34 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span>{beat.label}</span>
                <h3>{beat.title}</h3>
                <p>{beat.description}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="principles" aria-label="Princípios Nortada">
          {principles.map((principle, index) => (
            <motion.article
              className="principle"
              key={principle.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08, duration: 0.62 }}
            >
              <span>{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </motion.article>
          ))}
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
          {routes.map((route, index) => (
            <motion.article
              className={`route ${route.tone}`}
              key={route.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                delay: index * 0.08,
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="route-image">
                <img src={route.image} alt="" />
                <span>{route.chapter}</span>
              </div>
              <div className="route-body">
                <div className="route-coordinates">{route.coordinates}</div>
                <small>{route.eyebrow}</small>
                <h3>{route.title}</h3>
                <p>{route.description}</p>
                <blockquote>{route.scene}</blockquote>
                <div className="route-footer">
                  {route.tags.map((tag) => (
                    <span className="pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
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
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">Pontos de contato</p>
          <h2>Uma conversa breve, um roteiro com presença.</h2>
          <p className="lead">
            O primeiro contato filtra data, perfil de viagem, celebrações, restrições e
            preferências de ritmo. Em até 48 horas, a Nortada devolve um desenho inicial
            com rota, hospedagem, experiências e próximos passos.
          </p>
          <div className="contact-signature">
            <span>48h</span>
            <span>1 concierge</span>
            <span>roteiro privado</span>
          </div>
        </motion.div>
        <motion.div
          className="contact-panel"
          aria-label="Canais de contato"
          initial={{ opacity: 0, x: 34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>
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
