import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { PostMedia } from "@/components/blog/PostMedia";
import { LeadCtaButton } from "@/components/lead/LeadCtaButton";
import type { HomePageData } from "@/lib/wp-home";
import { formatDateLabel } from "@/utils/format";

export const homeFaqItems = [
  {
    question: "O que faz uma agência de marketing digital?",
    answer:
      "Uma agência de marketing digital planeja, executa e otimiza canais de aquisição como tráfego pago, SEO, conteúdo, landing pages, CRM e automação. O objetivo não é apenas gerar visitas, mas transformar demanda em pipeline, vendas e receita previsível.",
  },
  {
    question: "Quanto custa contratar uma agência de marketing digital para PME?",
    answer:
      "O investimento varia conforme estágio da operação, metas e escopo. Uma PME que precisa de mídia, site e inteligência comercial exige uma estrutura diferente de uma empresa que busca apenas otimizar campanhas já existentes. Na SMZ, o diagnóstico inicial serve justamente para dimensionar o plano sem empurrar entregas desnecessárias.",
  },
  {
    question: "A SMZ atende PMEs de quais segmentos?",
    answer:
      "Atendemos PMEs de serviços, educação, saúde, varejo, infoprodutos, indústria e operações locais que precisam crescer com mais controle. O ponto em comum não é o setor, e sim a necessidade de substituir achismo por estratégia, mensuração e cadência de otimização.",
  },
  {
    question: "Quando vale trocar freelancer ou equipe interna por uma agência de marketing digital?",
    answer:
      "Quando a empresa precisa de visão integrada entre mídia, conteúdo, CRO, CRM e receita. Em vez de depender de esforços isolados, a agência passa a operar com método, metas e leitura de funil completo, acelerando decisões e evitando desperdício de verba.",
  },
];

const serviceCards = [
  {
    idx: "S/01",
    href: "/servicos/trafego-pago",
    title: "Tráfego Pago",
    description:
      "Campanhas em Google, Meta, TikTok e YouTube estruturadas em funil real: aquisição, remarketing e recompra com KPIs alinhados ao seu P&L.",
    tags: ["Google Ads", "Meta", "TikTok"],
  },
  {
    idx: "S/02",
    href: "/servicos/seo-e-conteudo",
    title: "SEO & Conteúdo",
    description:
      "Auditoria técnica, arquitetura de conteúdo e produção orgânica para capturar a intenção de compra antes do anúncio entrar na conta.",
    tags: ["SEO técnico", "Editorial", "Topical authority"],
  },
  {
    idx: "S/03",
    href: "/servicos/redes-sociais",
    title: "Redes Sociais",
    description:
      "Conteúdo que constrói marca e gera demanda com calendário editorial, produção, copy e gestão de comunidade.",
    tags: ["Instagram", "LinkedIn", "YouTube"],
  },
  {
    idx: "S/04",
    href: "/servicos/sites-e-landing-pages",
    title: "Sites & Landing Pages",
    description:
      "Design e desenvolvimento de páginas pensadas como ferramenta de vendas, testadas, mensuradas e otimizadas continuamente.",
    tags: ["CRO", "Webflow", "Next.js"],
  },
  {
    idx: "S/05",
    href: "/servicos/automacao-e-crm",
    title: "Automação & CRM",
    description:
      "Implantação de HubSpot, RD ou n8n com fluxos de nutrição, qualificação e reativação para não perder lead no meio do caminho.",
    tags: ["HubSpot", "RD Station", "n8n + IA"],
  },
  {
    idx: "S/06",
    href: "/servicos/consultoria",
    title: "Consultoria Estratégica",
    description:
      "Para quem já tem time interno e precisa de direção: ICP, posicionamento, mix de canais, metas e governança.",
    tags: ["Fractional CMO", "GTM", "Workshops"],
  },
];

const processSteps = [
  {
    num: "01",
    title: "Diagnóstico",
    description:
      "Auditamos sua operação, mídia, funil, site e CRM. Mapeamos onde o dinheiro entra e onde escapa.",
    tag: "2 semanas · entrega: relatório + plano",
  },
  {
    num: "02",
    title: "Estratégia",
    description:
      "Construímos o plano de aquisição com metas claras de CAC, LTV, ROAS e payback antes de gastar o primeiro real.",
    tag: "2 semanas · entrega: blueprint + budget",
  },
  {
    num: "03",
    title: "Execução",
    description:
      "Mídia, conteúdo, site e CRM rodando como um time só, com cadência semanal de testes e ajustes.",
    tag: "Mês 1 a 3 · sprint semanal",
  },
  {
    num: "04",
    title: "Otimização",
    description:
      "Relatórios mensais, reuniões de resultado e decisões baseadas em dado, não em palpite ou tendência da semana.",
    tag: "Contínuo · review trimestral",
  },
];

const testimonials = [
  {
    initials: "FL",
    name: "Fernando Lopes",
    role: "CEO · BJJ STARS · Maior Evento da América Latina de Jiu Jitsu",
    quote:
      "Agencia muito pró ativa, com profissionais de comprometidos e com muita eficiência, Reocmendo 100%",
    featured: true,
  },
  {
    initials: "CE",
    name: "Carlos Eduardo",
    role: "Atleta· Campeão de Jiu Jitsu",
    quote:
      "Quem quer resultado precisa de uma boa equipe ao lado.Excelente profissionais, atenciosos nos mínimos detalhes. Obrigado pelo ótimo trabalho!",
  },
  {
    initials: "DZ",
    name: "Dayan Zaniquello",
    role: "CEO · ZNQ Advogados e Associados",
    quote:
      "Time consultivo de verdade. Senta com a gente, questiona e ajuda a tomar decisão. Não é fornecedor, é parceria.",
  },
];

const marqueeBrands = [
  "BJJ STARS",
  "Cacau Show",
  "Vivo",
  "Catho",
  "ZNQ",
  "Clinica Mirian",
  "Kadu Jiu-Jitsu",
  "Sensei Dojo",
];

type HomeLandingProps = {
  data: HomePageData;
};

export function HomeLanding({ data }: HomeLandingProps) {
  const { featuredPosts } = data;

  return (
    <main id="top">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container" style={{ position: "relative" }}>
          <div className="hero-grid">
            <div>
              <span className="eyebrow">Agência de marketing focada em resultado</span>
              <h1 className="hero-headline">
                Agência de marketing digital
                <br />
                para PMEs <span className="accent">que cansaram de achismo.</span>
              </h1>
              <p className="hero-sub">
                A SMZ é uma agência de marketing digital com gestão direta do sócio para
                empresas que precisam transformar mídia, SEO, conteúdo e site em receita
                mensurável. Da primeira reunião ao relatório do mês, cada decisão é guiada
                por dados, validada por testes e medida em resultado comercial.
              </p>
              <div className="hero-cta-row">
                <LeadCtaButton className="btn btn-primary" source="home_hero_primary">
                  Falar com um estrategista
                  <svg
                    className="arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </LeadCtaButton>
                <Link href="/#processo" className="btn btn-ghost">
                  Como trabalhamos
                </Link>
              </div>

              <div className="hero-chip-row" style={{ marginTop: 44 }}>
                <span className="chip">
                  <span className="dot" />
                  Vagas abertas para junho/2026
                </span>
                <span className="chip">Resposta em 1 dia útil</span>
              </div>
            </div>

            <aside className="hero-side" aria-label="Resultado em destaque">
              <div className="hero-stat-card">
                <span className="stat-label">Resultado em destaque · Q1 2026</span>
                <div className="stat-value">
                  +70<span className="stat-suffix">%</span>
                </div>
                <p className="stat-foot">
                  de receita atribuída nos primeiros 4 meses para um e-commerce, reduzindo o
                  CAC em 17%. Mesma verba, novo plano.
                </p>
              </div>

              <div className="hero-stat-card" style={{ background: "transparent" }}>
                <span className="stat-label">Como medimos sucesso</span>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "18px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {[
                    ["CAC ↓", "Custo de aquisição"],
                    ["ROAS ↑", "Retorno sobre mídia"],
                    ["LTV ↑", "Valor por cliente"],
                    ["Payback ↓", "Tempo até lucro"],
                  ].map(([label, value]) => (
                    <li
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                        fontSize: 14.5,
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>{label}</span>
                      <span style={{ fontFamily: "var(--ff-mono)", color: "var(--text)" }}>
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="marquee-wrap" aria-label="Marcas atendidas">
        <div className="marquee">
          {[...marqueeBrands, ...marqueeBrands].map((brand, index) => (
            <span key={`${brand}-${index}`}>{brand}</span>
          ))}
        </div>
      </div>

      <section id="resultados" className="numbers">
        <div className="container">
          <div className="section-label">
            <span className="num">01 /</span> Resultados
          </div>
          <div className="section-head">
            <h2>
              A agência de marketing digital
              <br />
              focada em resultado mensurável
              <br />
              entrega quando assume a operação.
            </h2>
            <p className="head-right">
              Como agência de marketing digital para PMEs, a SMZ organiza aquisição,
              mensuração e otimização sob uma mesma estratégia. Os números abaixo não são
              promessas de pitch: são a régua interna que usamos para avaliar qualidade,
              retenção e geração de receita ao longo dos contratos.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 28,
              marginBottom: 36,
            }}
          >
            <p className="lede" style={{ margin: 0, maxWidth: "none" }}>
              Boa parte das PMEs chega até nós depois de testar fornecedor demais, canal
              demais e ferramenta demais sem uma linha de raciocínio que conecte tudo. A
              função de uma agência de marketing digital não é gerar volume por vaidade,
              mas construir previsibilidade: entender margem, identificar gargalos do
              funil, definir prioridades e concentrar energia no que realmente move
              pipeline.
            </p>
            <p
              style={{
                margin: 0,
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            >
              Por isso a SMZ combina tráfego pago, SEO, conteúdo, CRO e CRM com leitura de
              negócio. Quando a estratégia nasce do P&amp;L e não do achismo, a operação
              fica mais enxuta, o CAC tende a cair e a empresa ganha clareza sobre onde
              insistir, onde pausar e onde escalar.
            </p>
          </div>

          <div className="numbers-grid">
            <div>
              <div className="num-tag">Mídia gerenciada</div>
              <p className="num-value">
                R$ 90<span className="unit">MI+</span>
              </p>
              <p className="num-label">
                investidos em Google, Meta e TikTok desde 2014.
              </p>
            </div>
            <div>
              <div className="num-tag">ROAS médio · 2025</div>
              <p className="num-value">
                4,2<span className="unit">x</span>
              </p>
              <p className="num-label">
                retorno sobre verba de mídia entre carteira ativa.
              </p>
            </div>
            <div>
              <div className="num-tag">Clientes ativos</div>
              <p className="num-value">
                87<span className="unit">.</span>
              </p>
              <p className="num-label">
                empresas em operação contínua, do local ao nacional.
              </p>
            </div>
            <div>
              <div className="num-tag">Retenção anual</div>
              <p className="num-value">
                92<span className="unit">%</span>
              </p>
              <p className="num-label">
                dos clientes renovam contrato. A métrica que mais importa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos">
        <div className="container">
          <div className="section-label">
            <span className="num">02 /</span> Serviços
          </div>
          <div className="section-head">
            <h2>
              Tudo o que precisa para crescer,
              <br />
              sob uma só liderança.
            </h2>
            <p className="head-right">
              Não somos uma agência de tudo. Somos uma agência de marketing digital
              orientada a aquisição, retenção e eficiência comercial. O que escolhemos
              fazer, fazemos com profundidade, processo e leitura financeira da operação.
            </p>
          </div>

          <p className="lede" style={{ marginTop: 0, marginBottom: 28, maxWidth: "72ch" }}>
            Cada frente abaixo existe para resolver um pedaço real do crescimento. Em vez
            de empilhar entregas desconectadas, nossa agência de marketing digital monta um
            sistema em que mídia, conteúdo, páginas e CRM conversam entre si. Isso reduz
            desperdício, acelera aprendizado e melhora a qualidade das oportunidades que
            chegam ao time comercial.
          </p>

          <div className="services-grid">
            {serviceCards.map((service) => (
              <article key={service.idx} className="service-card">
                <span className="idx">{service.idx}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 18 }}>
                  <Link href={service.href} className="inline-link">
                    Ver serviço <span className="arrow">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="processo" className="process">
        <div className="container">
          <div className="section-label">
            <span className="num">03 /</span> Metodologia
          </div>
          <div className="section-head">
            <h2>
              Um método, quatro etapas,
              <br />
              zero suposição.
            </h2>
            <p className="head-right">
              O <em className="italic-accent">Framework R/4</em> é como organizamos cada
              conta. Mesmo time, mesmo padrão, do diagnóstico à otimização semanal, para
              que a agência de marketing digital não dependa de improviso para performar.
            </p>
          </div>

          <p className="lede" style={{ marginTop: 0, marginBottom: 28, maxWidth: "70ch" }}>
            O método existe porque crescimento saudável não nasce de campanha isolada. Ele
            nasce de diagnóstico claro, definição de prioridade, execução disciplinada e
            revisão frequente das métricas certas. É essa sequência que separa operação
            profissional de marketing reativo.
          </p>

          <div className="process-grid">
            {processSteps.map((step) => (
              <div key={step.num} className="step">
                <p className="step-num">
                  {step.num}
                  <sup>R</sup>
                </p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="step-tag">{step.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos">
        <div className="container">
          <div className="section-label">
            <span className="num">04 /</span> Depoimentos
          </div>
          <div className="section-head">
            <h2>
              Quem trabalha com a SMZ
              <br />
              não volta para o achismo.
            </h2>
            <p className="head-right">
              Três fundadores que resumem, em uma frase, o que mudou na operação depois
              dos primeiros 90 dias de contrato.
            </p>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial featured">
              <blockquote>
                “{testimonials[0].quote}”
              </blockquote>
              <div className="person">
                <div className="avatar">{testimonials[0].initials}</div>
                <div>
                  <div className="person-name">{testimonials[0].name}</div>
                  <div className="person-role">{testimonials[0].role}</div>
                </div>
              </div>
            </div>

            <div className="testimonial-sub">
              {testimonials.slice(1).map((item) => (
                <div key={item.name} className="testimonial">
                  <blockquote>“{item.quote}”</blockquote>
                  <div className="person">
                    <div className="avatar">{item.initials}</div>
                    <div>
                      <div className="person-name">{item.name}</div>
                      <div className="person-role">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="blog">
        <div className="container">
          <div className="section-label">
            <span className="num">05 /</span> Blog
          </div>
          <div className="section-head">
            <h2>
              Notas de quem está
              <br />
              dentro da operação.
            </h2>
            <p className="head-right">
              Artigos escritos pelo time estratégico, baseados em contas reais que
              gerenciamos. Sem manual genérico, sem conteúdo inflado e sem repetir fórmulas
              vazias que muita agência de marketing digital publica só para preencher blog.
            </p>
          </div>

          <div className="blog-grid">
            {featuredPosts.map((post) => (
              <PostCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                category={post.categoryName}
                categoryKey={post.categorySlug}
                date={formatDateLabel(post.date)}
                dateTime={post.date}
                readingTime={post.readingTime}
                title={post.title}
                excerpt={post.excerpt}
                author={post.authorName}
                cover={
                  <PostMedia
                    imageUrl={post.featuredImageUrl}
                    imageAlt={post.featuredImageAlt}
                    artKey={post.featuredArtKey}
                    label={post.categoryName}
                  />
                }
                readMoreLabel={post.slug.includes("case") ? "Ler case" : "Ler artigo"}
              />
            ))}
          </div>

          <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
            <Link href="/blog" className="inline-link">
              Ver todos os artigos <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="contato" className="contact">
        <div className="container">
          <div className="section-label">
            <span className="num">06 /</span> Contato
          </div>
          <div className="contact-grid">
            <div>
              <h2 className="contact-headline">
                Sua próxima jogada
                <br />
                começa com uma
                <br />
                <span className="accent">conversa de 20 minutos.</span>
              </h2>
              <p className="lede" style={{ marginTop: 28 }}>
                Conte rapidamente sobre seu negócio. Em até <strong>1 dia útil</strong>{" "}
                voltamos com um diagnóstico inicial para entender se a SMZ faz sentido
                como agência de marketing digital para a sua fase, seu canal e sua meta de
                crescimento.
              </p>

              <div className="contact-info">
                <div className="info-row">
                  <span className="info-label">Instagram</span>
                  <a
                    className="info-value"
                    href="https://instagram.com/smz.agency"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @smz.agency
                  </a>
                </div>
                <div className="info-row">
                  <span className="info-label">E-mail</span>
                  <a className="info-value" href="mailto:contato@smz.agency">
                    contato@smz.agency
                  </a>
                </div>
                <div className="info-row">
                  <span className="info-label">Horário</span>
                  <span className="info-value">Seg a Sex · 9h às 19h</span>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="field">
                <label>Nome</label>
                <input type="text" value="Digite seu Nome" readOnly />
              </div>
              <div className="field">
                <label>Telefone</label>
                <input
                  type="text"
                  value="(11) 99999-9999"
                  readOnly
                />
              </div>
              <div className="field">
                <label>Próximo passo</label>
                <textarea
                  value="Depois do envio, nosso time analisa o cenário e entra em contato para entender a operação e indicar o melhor caminho."
                  readOnly
                />
              </div>
              <LeadCtaButton className="btn btn-primary lead-submit" source="home_contact_primary">
                Abrir mini formulário
                <svg
                  className="arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </LeadCtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="pillar-faq" id="faq">
        <div className="container">
          <div className="section-label">
            <span className="num">07 /</span> FAQ
          </div>
          <div className="faq-grid">
            <aside className="faq-aside">
              <h2>
                Perguntas comuns antes de contratar
                <br />
                uma agência de marketing digital.
              </h2>
              <p>
                Reunimos respostas objetivas para dúvidas que aparecem com frequência em
                reuniões comerciais. A ideia é ajudar sua empresa a entender quando vale
                estruturar aquisição com método e quando ainda faz mais sentido ajustar a
                base antes de acelerar investimento.
              </p>
              <p className="faq-help">
                Se preferir, você pode falar direto com a SMZ e receber um diagnóstico
                inicial da operação, sem compromisso.
              </p>
            </aside>

            <div className="faq-list">
              {homeFaqItems.map((item, index) => (
                <details key={item.question} className="faq-item" open={index === 0}>
                  <summary className="faq-q">
                    <span className="q-marker">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.question}</span>
                    <span className="q-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <div className="faq-a">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
