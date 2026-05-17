import type {
  Author,
  Category,
  HomeContent,
  MockContent,
  Post,
  SearchResult,
  Tag,
} from "@/types/content";

const authors: Author[] = [
  {
    id: "author-marina-souza",
    slug: "marina-souza",
    name: "Marina Souza",
    initials: "MS",
    role: "Head de Estratégia",
    shortBio:
      "12 anos liderando operações de marketing performance em e-commerces, SaaS e infoprodutos.",
    longBio: [
      "Marina lidera o time de estratégia da SMZ desde a fundação.",
      "Trabalha em diagnósticos, revisões trimestrais e posicionamento editorial.",
      "Escreve sobre estratégia de aquisição, IA aplicada à operação e CAC/LTV.",
    ],
    expertise: ["Estratégia", "IA", "SEO", "Posicionamento", "SaaS B2B"],
    stats: [
      { label: "Artigos publicados", value: "14.", footnote: "7 deste ano" },
      { label: "Tempo médio", value: "8MIN", footnote: "leituras densas e diretas" },
      { label: "Tempo na SMZ", value: "7ANOS", footnote: "desde a fundação" },
      { label: "Última publicação", value: "14MAI", footnote: "2026" },
    ],
    quote: {
      text: "Marca não é algoritmo. É hipótese de mundo — e isso ainda é trabalho humano.",
      attribution: "De “Posicionamento para SaaS B2B”, jan 2026",
    },
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/marina-souza" },
      { label: "X", href: "https://twitter.com/marinasouza" },
      { label: "E-mail", href: "mailto:marina@ag.smz" },
    ],
    seo: {
      title: "Marina Souza — Head de Estratégia · SMZ",
      description:
        "Head de Estratégia da SMZ. 12 anos liderando operações de marketing performance.",
      canonical: "https://ag.smz/blog/autor/marina-souza",
      ogImage: "https://ag.smz/blog/autores/og/marina-souza.png",
    },
  },
  {
    id: "author-felipe-almeida",
    slug: "felipe-almeida",
    name: "Felipe Almeida",
    initials: "FA",
    role: "Performance Lead",
    shortBio:
      "Especialista em mídia paga, estruturação de contas e decisões guiadas por ROAS.",
    longBio: [
      "Felipe lidera projetos de tráfego pago e análise de performance na SMZ.",
      "Seu foco é acelerar ciclos de teste e alocação inteligente de verba.",
    ],
    expertise: ["Tráfego Pago", "ROAS", "Meta Ads", "Google Ads"],
    stats: [
      { label: "Artigos publicados", value: "9.", footnote: "cases e mídia paga" },
      { label: "Tempo médio", value: "7MIN", footnote: "leituras operacionais" },
      { label: "Tempo na SMZ", value: "5ANOS", footnote: "escala e performance" },
      { label: "Última publicação", value: "02MAI", footnote: "2026" },
    ],
    socials: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/felipe-almeida" }],
    seo: {
      title: "Felipe Almeida — Performance Lead · SMZ",
      description: "Performance Lead da SMZ. Especialista em ROAS, mídia paga e escala.",
      canonical: "https://ag.smz/blog/autor/felipe-almeida",
      ogImage: "https://ag.smz/blog/autores/og/felipe-almeida.png",
    },
  },
  {
    id: "author-pedro-vilela",
    slug: "pedro-vilela",
    name: "Pedro Vilela",
    initials: "PV",
    role: "Consultor de Growth",
    shortBio: "Atua em CRM, automações, operação comercial e funis de aquisição.",
    longBio: [
      "Pedro trabalha na interseção entre marketing, CRM e automação.",
      "Escreve sobre implantação de processos e eficiência operacional.",
    ],
    expertise: ["CRM", "Automação", "IA", "Growth"],
    stats: [
      { label: "Artigos publicados", value: "8.", footnote: "growth e automação" },
      { label: "Tempo médio", value: "6MIN", footnote: "aplicação prática" },
      { label: "Tempo na SMZ", value: "4ANOS", footnote: "processos e receita" },
      { label: "Última publicação", value: "18ABR", footnote: "2026" },
    ],
    socials: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/pedro-vilela" }],
    seo: {
      title: "Pedro Vilela — Consultor de Growth · SMZ",
      description: "Consultor de Growth da SMZ. CRM, automação e operação comercial.",
      canonical: "https://ag.smz/blog/autor/pedro-vilela",
      ogImage: "https://ag.smz/blog/autores/og/pedro-vilela.png",
    },
  },
];

const categories: Category[] = [
  {
    id: "category-ia",
    slug: "ia",
    name: "IA",
    description:
      "Artigos sobre IA aplicada à operação de marketing: automação, criação, análise e CRM.",
    articleCount: 8,
    seo: {
      title: "IA no Marketing — Categoria · Blog SMZ",
      description:
        "Tudo o que a SMZ publicou sobre IA aplicada ao marketing de verdade.",
      canonical: "https://ag.smz/blog/categoria/ia",
      ogImage: "https://ag.smz/blog/og/categoria-ia.png",
    },
  },
  {
    id: "category-trafego-pago",
    slug: "trafego-pago",
    name: "Tráfego Pago",
    description: "Mídia, ROAS, CAC, criativos, Google Ads, Meta Ads e escala.",
    articleCount: 12,
    seo: {
      title: "Tráfego Pago — Categoria · Blog SMZ",
      description: "Artigos da SMZ sobre mídia paga, performance e escala.",
      canonical: "https://ag.smz/blog/categoria/trafego-pago",
    },
  },
  {
    id: "category-seo",
    slug: "seo",
    name: "SEO",
    description: "Conteúdo, topical authority, SERP e aquisição orgânica.",
    articleCount: 7,
    seo: {
      title: "SEO — Categoria · Blog SMZ",
      description: "Artigos da SMZ sobre SEO, conteúdo e autoridade tópica.",
      canonical: "https://ag.smz/blog/categoria/seo",
    },
  },
  {
    id: "category-estrategia",
    slug: "estrategia",
    name: "Estratégia",
    description: "Posicionamento, diferenciação, planejamento e crescimento.",
    articleCount: 9,
    seo: {
      title: "Estratégia — Categoria · Blog SMZ",
      description: "Artigos da SMZ sobre estratégia, posicionamento e crescimento.",
      canonical: "https://ag.smz/blog/categoria/estrategia",
    },
  },
  {
    id: "category-cases",
    slug: "cases",
    name: "Cases",
    description: "Casos reais de crescimento, mídia e performance.",
    articleCount: 5,
    seo: {
      title: "Cases — Categoria · Blog SMZ",
      description: "Cases reais da SMZ com foco em crescimento e performance.",
      canonical: "https://ag.smz/blog/categoria/cases",
    },
  },
  {
    id: "category-cro",
    slug: "cro",
    name: "CRO",
    description: "Conversão, checkout, atritos e melhoria de jornadas.",
    articleCount: 2,
    seo: {
      title: "CRO — Categoria · Blog SMZ",
      description: "Artigos da SMZ sobre conversão, UX e checkout.",
      canonical: "https://ag.smz/blog/categoria/cro",
    },
  },
];

const tags: Tag[] = [
  {
    id: "tag-roas",
    slug: "roas",
    name: "ROAS",
    description: "Retorno sobre verba de mídia: receita gerada dividida pelo investimento.",
    articleCount: 6,
    categorySlug: "trafego-pago",
    seo: {
      title: "#ROAS — Tag · Blog SMZ",
      description: "Tudo o que a SMZ publicou sobre ROAS.",
      canonical: "https://ag.smz/blog/tag/roas",
      ogImage: "https://ag.smz/blog/og/tag-roas.png",
    },
  },
  {
    id: "tag-cac",
    slug: "cac",
    name: "CAC",
    description: "Custo de aquisição, eficiência e rentabilidade.",
    articleCount: 8,
    categorySlug: "trafego-pago",
    seo: {
      title: "#CAC — Tag · Blog SMZ",
      description: "Artigos da SMZ sobre CAC e aquisição.",
      canonical: "https://ag.smz/blog/tag/cac",
    },
  },
  {
    id: "tag-meta-ads",
    slug: "meta-ads",
    name: "Meta Ads",
    description: "Criativos, escala e campanhas em Meta.",
    articleCount: 11,
    categorySlug: "trafego-pago",
    seo: {
      title: "#Meta Ads — Tag · Blog SMZ",
      description: "Artigos da SMZ sobre Meta Ads.",
      canonical: "https://ag.smz/blog/tag/meta-ads",
    },
  },
  {
    id: "tag-google-ads",
    slug: "google-ads",
    name: "Google Ads",
    description: "Busca, PMax, lances e escala em Google Ads.",
    articleCount: 9,
    categorySlug: "trafego-pago",
    seo: {
      title: "#Google Ads — Tag · Blog SMZ",
      description: "Artigos da SMZ sobre Google Ads.",
      canonical: "https://ag.smz/blog/tag/google-ads",
    },
  },
  {
    id: "tag-automacao",
    slug: "automacao",
    name: "Automação",
    description: "Eficiência operacional, fluxos e processos assistidos por IA.",
    articleCount: 4,
    categorySlug: "ia",
    seo: {
      title: "#Automação — Tag · Blog SMZ",
      description: "Artigos da SMZ sobre automação de marketing.",
      canonical: "https://ag.smz/blog/tag/automacao",
    },
  },
];

const posts: Post[] = [
  {
    id: "post-ia-resultados",
    slug: "como-a-ia-acelera-resultados",
    title: "Como a IA está acelerando os resultados dos nossos clientes",
    excerpt:
      "O que mudou na rotina de mídia, criação e análise depois que a SMZ incorporou IA no dia a dia das contas.",
    content:
      "Em 18 meses, a IA deixou de ser pauta de tendência e virou parte do nosso processo. Este texto explica o que mudou na operação da SMZ e o que continua sendo trabalho humano.",
    date: "2026-05-14",
    modified: "2026-05-14",
    readingTime: "8 min de leitura",
    authorSlug: "marina-souza",
    categorySlugs: ["ia"],
    tagSlugs: ["automacao", "roas"],
    featuredArtKey: "ia-network",
    seo: {
      title: "Como a IA está acelerando os resultados dos nossos clientes — Blog SMZ",
      description:
        "O que mudou na rotina de mídia, criação e análise depois que a SMZ incorporou IA.",
      canonical: "https://ag.smz/blog/como-a-ia-acelera-resultados",
      ogImage: "https://ag.smz/blog/og/como-a-ia-acelera-resultados.png",
    },
    faq: [
      {
        question: "IA substitui a equipe de marketing?",
        answer: "Não. Ela acelera execução e análise, mas decisão e posicionamento continuam humanos.",
      },
      {
        question: "Onde a IA gera mais ganho imediato?",
        answer: "Briefing, análise de dados, CRM e expansão de variações criativas.",
      },
    ],
    relatedPostSlugs: [
      "case-roi-3x",
      "identificar-boa-agencia",
      "cac-ltv-payback",
    ],
  },
  {
    id: "post-case-roi-3x",
    slug: "case-roi-3x",
    title: "O case que multiplicou o ROI em 3x usando IA na criação de campanhas",
    excerpt:
      "Como um cliente B2B passou de 1,4x para 4,2x de retorno sobre mídia em 90 dias.",
    content:
      "Um caso real sobre testes criativos em escala, uso disciplinado de IA e ganho de eficiência em mídia.",
    date: "2026-05-02",
    modified: "2026-05-02",
    readingTime: "6 min",
    authorSlug: "felipe-almeida",
    categorySlugs: ["cases", "trafego-pago"],
    tagSlugs: ["roas", "meta-ads"],
    featuredArtKey: "roi-bars",
    seo: {
      title: "O case que multiplicou o ROI em 3x usando IA na criação de campanhas",
      description: "Como um cliente B2B passou de 1,4x para 4,2x de retorno sobre mídia.",
      canonical: "https://ag.smz/blog/case-roi-3x",
    },
    relatedPostSlugs: [
      "como-a-ia-acelera-resultados",
      "google-ads-2026-busca-pura",
      "cac-ltv-payback",
    ],
  },
  {
    id: "post-identificar-boa-agencia",
    slug: "identificar-boa-agencia",
    title: "Como identificar uma boa agência de marketing em 2026",
    excerpt:
      "Sete perguntas para fazer antes de assinar contrato e três sinais de alerta.",
    content:
      "Um guia prático para avaliar agência, processo, profundidade estratégica e clareza operacional.",
    date: "2026-04-18",
    modified: "2026-04-18",
    readingTime: "7 min",
    authorSlug: "pedro-vilela",
    categorySlugs: ["estrategia"],
    tagSlugs: [],
    featuredArtKey: "checklist",
    seo: {
      title: "Como identificar uma boa agência de marketing em 2026",
      description: "Sete perguntas para fazer antes de assinar contrato.",
      canonical: "https://ag.smz/blog/identificar-boa-agencia",
    },
    relatedPostSlugs: ["posicionamento-saas", "planejamento-trimestral"],
  },
  {
    id: "post-cac-ltv-payback",
    slug: "cac-ltv-payback",
    title: "CAC, LTV, payback: o tripé que decide se vale a pena investir em mídia",
    excerpt:
      "Por que “tem mais cliente entrando” não é necessariamente o número certo para olhar.",
    content:
      "Uma leitura operacional sobre rentabilidade, aquisição e decisões de investimento em crescimento.",
    date: "2026-04-05",
    modified: "2026-04-05",
    readingTime: "9 min",
    authorSlug: "marina-souza",
    categorySlugs: ["estrategia", "trafego-pago"],
    tagSlugs: ["roas", "cac"],
    featuredArtKey: "funnel",
    seo: {
      title: "CAC, LTV, payback: o tripé que decide se vale a pena investir em mídia",
      description: "Artigo prático sobre CAC, LTV, payback e rentabilidade.",
      canonical: "https://ag.smz/blog/cac-ltv-payback",
    },
    relatedPostSlugs: ["case-roi-3x", "google-ads-2026-busca-pura"],
  },
  {
    id: "post-seo-2026",
    slug: "seo-2026-organico",
    title: "SEO em 2026: o orgânico ainda vale a pena com IA dominando a SERP?",
    excerpt:
      "Resposta curta: sim, mas o jogo mudou. Autoridade, intenção e formatos importam mais.",
    content:
      "Uma análise sobre o novo SEO em ambiente de IA generativa, SERP e topical authority.",
    date: "2026-03-10",
    modified: "2026-03-10",
    readingTime: "8 min",
    authorSlug: "marina-souza",
    categorySlugs: ["seo"],
    tagSlugs: [],
    featuredArtKey: "seo-bars",
    seo: {
      title: "SEO em 2026: o orgânico ainda vale a pena com IA dominando a SERP?",
      description: "As novas regras de autoridade, intenção e formatos no SEO.",
      canonical: "https://ag.smz/blog/seo-2026-organico",
    },
    relatedPostSlugs: ["topical-authority", "posicionamento-saas"],
  },
  {
    id: "post-cro-checkout",
    slug: "cro-checkout-ecommerce",
    title: "8 atritos invisíveis no checkout do seu e-commerce",
    excerpt:
      "Os micro-bloqueios que custam conversão e quase nenhum dono de loja percebe.",
    content:
      "Checklist prático para eliminar fricções no checkout e recuperar conversão perdida.",
    date: "2026-02-28",
    modified: "2026-02-28",
    readingTime: "7 min",
    authorSlug: "pedro-vilela",
    categorySlugs: ["cro"],
    tagSlugs: [],
    featuredArtKey: "checkout",
    seo: {
      title: "8 atritos invisíveis no checkout do seu e-commerce",
      description: "Checklist de atritos invisíveis que derrubam conversão no checkout.",
      canonical: "https://ag.smz/blog/cro-checkout-ecommerce",
    },
    relatedPostSlugs: ["hubspot-rd-station", "planejamento-trimestral"],
  },
  {
    id: "post-hubspot-rd",
    slug: "hubspot-rd-station",
    title: "HubSpot ou RD Station: como escolher o CRM certo para 2026",
    excerpt:
      "Não é sobre features, é sobre operação. Um guia direto com base em 30+ projetos.",
    content:
      "Comparativo entre HubSpot e RD Station com foco em processo, adoção e eficiência operacional.",
    date: "2026-02-14",
    modified: "2026-02-14",
    readingTime: "5 min",
    authorSlug: "pedro-vilela",
    categorySlugs: ["ia"],
    tagSlugs: ["automacao"],
    featuredArtKey: "crm",
    seo: {
      title: "HubSpot ou RD Station: como escolher o CRM certo para 2026",
      description: "Guia direto para decidir o CRM ideal para sua operação.",
      canonical: "https://ag.smz/blog/hubspot-rd-station",
    },
    relatedPostSlugs: ["como-a-ia-acelera-resultados", "planejamento-trimestral"],
  },
  {
    id: "post-posicionamento-saas",
    slug: "posicionamento-saas",
    title: "Posicionamento para SaaS B2B: pare de soar como todo mundo",
    excerpt:
      "O exercício de 90 minutos que rodamos com fundadores antes de qualquer linha de copy.",
    content:
      "Um texto sobre diferenciação real, mensagem e proposta de valor em SaaS B2B.",
    date: "2026-01-30",
    modified: "2026-01-30",
    readingTime: "11 min",
    authorSlug: "marina-souza",
    categorySlugs: ["estrategia"],
    tagSlugs: [],
    featuredArtKey: "voice",
    seo: {
      title: "Posicionamento para SaaS B2B: pare de soar como todo mundo",
      description: "Diferenciação real, não slogan, para SaaS B2B.",
      canonical: "https://ag.smz/blog/posicionamento-saas",
    },
    relatedPostSlugs: ["identificar-boa-agencia", "seo-2026-organico"],
  },
  {
    id: "post-google-ads",
    slug: "google-ads-2026-busca-pura",
    title: "Google Ads em 2026: quando ainda vale a pena usar busca pura?",
    excerpt:
      "PMax engoliu metade das contas, mas há cenários onde a busca tradicional ainda vence.",
    content:
      "Leitura sobre cenários onde busca pura ainda faz sentido em Google Ads.",
    date: "2026-01-15",
    modified: "2026-01-15",
    readingTime: "9 min",
    authorSlug: "felipe-almeida",
    categorySlugs: ["trafego-pago"],
    tagSlugs: ["roas", "google-ads"],
    featuredArtKey: "trend-line",
    seo: {
      title: "Google Ads em 2026: quando ainda vale a pena usar busca pura?",
      description: "Quando busca tradicional ainda é a melhor alavanca em Google Ads.",
      canonical: "https://ag.smz/blog/google-ads-2026-busca-pura",
    },
    relatedPostSlugs: ["case-roi-3x", "cac-ltv-payback"],
  },
  {
    id: "post-topical-authority",
    slug: "topical-authority",
    title: "Topical authority: por que o Google premia profundidade, não quantidade",
    excerpt:
      "Mapa de conteúdo, hub-and-spoke e a métrica de cobertura que substitui volume bruto.",
    content:
      "Uma leitura prática sobre topical authority, cobertura e autoridade editorial.",
    date: "2025-11-28",
    modified: "2025-11-28",
    readingTime: "10 min",
    authorSlug: "marina-souza",
    categorySlugs: ["seo"],
    tagSlugs: [],
    featuredArtKey: "content-bars",
    seo: {
      title: "Topical authority: por que o Google premia profundidade, não quantidade",
      description: "Profundidade, hub-and-spoke e cobertura semântica em SEO.",
      canonical: "https://ag.smz/blog/topical-authority",
    },
    relatedPostSlugs: ["seo-2026-organico"],
  },
  {
    id: "post-automacoes-ia",
    slug: "5-automacoes-ia",
    title: "5 automações de marketing que pagaram o investimento em IA",
    excerpt:
      "Os fluxos que mais retornam tempo na operação — qualificação, briefing, follow-up e relatório.",
    content:
      "Cinco casos de automação que realmente economizam tempo e reduzem ruído operacional.",
    date: "2025-11-10",
    modified: "2025-11-10",
    readingTime: "7 min",
    authorSlug: "pedro-vilela",
    categorySlugs: ["ia"],
    tagSlugs: ["automacao"],
    featuredArtKey: "n8n",
    seo: {
      title: "5 automações de marketing que pagaram o investimento em IA",
      description: "Fluxos de automação que mais retornam tempo na operação.",
      canonical: "https://ag.smz/blog/5-automacoes-ia",
    },
    relatedPostSlugs: ["hubspot-rd-station", "como-a-ia-acelera-resultados"],
  },
  {
    id: "post-planejamento",
    slug: "planejamento-trimestral",
    title: "Planejamento trimestral: como definir 3 metas que importam",
    excerpt:
      "O método de priorização que tira 80% do barulho do planejamento.",
    content:
      "Uma estrutura de planejamento trimestral centrada em foco, decisão e clareza operacional.",
    date: "2025-10-22",
    modified: "2025-10-22",
    readingTime: "8 min",
    authorSlug: "marina-souza",
    categorySlugs: ["estrategia"],
    tagSlugs: [],
    featuredArtKey: "quarters",
    seo: {
      title: "Planejamento trimestral: como definir 3 metas que importam",
      description: "Um método de priorização para tirar ruído do planejamento.",
      canonical: "https://ag.smz/blog/planejamento-trimestral",
    },
    relatedPostSlugs: ["identificar-boa-agencia", "hubspot-rd-station"],
  },
];

const home: HomeContent = {
  heroTitle: "Marketing focado em resultado.",
  heroSubtitle:
    "Operação, mídia, SEO, CRM e IA para marcas que precisam crescer com previsibilidade.",
  heroButtonText: "Falar com a SMZ",
  heroButtonUrl: "https://wa.me/",
  sections: [
    { id: "hero", type: "hero", title: "Hero" },
    { id: "services", type: "services", title: "Serviços" },
    { id: "results", type: "results", title: "Resultados" },
    { id: "testimonials", type: "testimonials", title: "Depoimentos" },
    { id: "faq", type: "faq", title: "FAQ" },
    { id: "blog", type: "blog", title: "Blog" },
    { id: "final-cta", type: "cta", title: "CTA final" },
  ],
  services: [
    "Tráfego pago",
    "SEO & conteúdo",
    "Sites & LPs",
    "Automação & CRM",
    "Consultoria estratégica",
  ],
  testimonials: [
    "Eles cortaram ruído e melhoraram nossa velocidade de teste.",
    "Foi a primeira agência que falou de operação antes de falar de campanha.",
  ],
  faq: [
    {
      question: "A SMZ atende qualquer tipo de empresa?",
      answer: "Não. A atuação é mais forte em operações que precisam previsibilidade e profundidade.",
    },
    {
      question: "Vocês trabalham com WordPress e Next.js?",
      answer: "Sim. O objetivo é separar CMS e frontend para performance, SEO e controle editorial.",
    },
  ],
  finalCtaTitle: "Quer clareza sobre a sua próxima alavanca de crescimento?",
  finalCtaText:
    "Uma conversa objetiva para mapear gargalos de aquisição, operação e conteúdo.",
  finalCtaButtonText: "Agendar diagnóstico",
  finalCtaButtonUrl: "https://wa.me/",
  seo: {
    title: "SMZ — Agência de Marketing Focada em Resultado",
    description:
      "Agência de marketing focada em previsibilidade de receita, operação e crescimento.",
    canonical: "https://ag.smz/",
    ogImage: "https://ag.smz/og/home.png",
  },
};

const searchResults: SearchResult[] = [
  {
    id: "search-post-ia",
    type: "post",
    title: "Como a IA está acelerando os resultados dos nossos clientes",
    href: "/blog/como-a-ia-acelera-resultados",
    snippet:
      "Em 18 meses, a IA deixou de ser pauta de tendência e virou parte do nosso processo.",
    breadcrumb: ["ag.smz", "blog", "como-a-ia-acelera-resultados"],
    meta: ["14 mai 2026", "8 min", "Marina Souza", "Match no título"],
  },
  {
    id: "search-category-ia",
    type: "categoria",
    title: "IA aplicada ao marketing de verdade",
    href: "/blog/categoria/ia",
    snippet:
      "Página de categoria com artigos sobre IA na operação de marketing.",
    breadcrumb: ["ag.smz", "blog", "categoria", "ia"],
    meta: ["Atualizado em 14 mai 2026", "8 artigos"],
  },
  {
    id: "search-case-roi",
    type: "case",
    title: "O case que multiplicou o ROI em 3x usando IA na criação de campanhas",
    href: "/blog/case-roi-3x",
    snippet:
      "Como um cliente B2B passou de 1,4x para 4,2x de retorno sobre mídia em 90 dias.",
    breadcrumb: ["ag.smz", "blog", "case-roi-3x"],
    meta: ["02 mai 2026", "6 min", "Felipe Almeida"],
  },
  {
    id: "search-service-crm",
    type: "servico",
    title: "Automação & CRM com IA",
    href: "/#servicos",
    snippet:
      "Implantação de CRM e automação com foco em eficiência operacional.",
    breadcrumb: ["ag.smz", "servicos", "automacao-crm"],
    meta: ["Serviço ativo", "Diagnóstico em 1 semana"],
  },
];

export const mockContent: MockContent = {
  home,
  authors,
  categories,
  tags,
  posts,
  searchResults,
  seo: {
    site: {
      title: "SMZ",
      description: "Agência de marketing focada em resultado.",
      canonical: "https://ag.smz/",
      ogImage: "https://ag.smz/og/site.png",
    },
    blog: {
      title: "Blog SMZ — Notas de quem está dentro da operação",
      description:
        "Artigos do time da SMZ sobre marketing focado em resultado: tráfego, SEO, IA e estratégia.",
      canonical: "https://ag.smz/blog",
      ogImage: "https://ag.smz/blog/og/blog-cover.png",
    },
  },
};

export function getPostBySlug(slug: string) {
  return mockContent.posts.find((post) => post.slug === slug);
}

export function getAuthorBySlug(slug: string) {
  return mockContent.authors.find((author) => author.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return mockContent.categories.find((category) => category.slug === slug);
}

export function getTagBySlug(slug: string) {
  return mockContent.tags.find((tag) => tag.slug === slug);
}

export function getPostsByAuthorSlug(slug: string) {
  return mockContent.posts.filter((post) => post.authorSlug === slug);
}

export function getPostsByCategorySlug(slug: string) {
  return mockContent.posts.filter((post) => post.categorySlugs.includes(slug));
}

export function getPostsByTagSlug(slug: string) {
  return mockContent.posts.filter((post) => post.tagSlugs.includes(slug));
}
