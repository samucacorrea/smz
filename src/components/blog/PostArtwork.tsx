type PostArtworkProps = {
  artKey?: string;
  label?: string;
  variant?: "cover" | "bare";
};

export function PostArtwork({
  artKey,
  label,
  variant = "cover",
}: PostArtworkProps) {
  const artwork = renderArt(artKey, label);

  if (variant === "bare") {
    return artwork;
  }

  const background = getBackground(artKey);

  return (
    <div
      className="cover-art"
      style={{
        background,
      }}
    >
      {artwork}
    </div>
  );
}

function getBackground(artKey?: string) {
  switch (artKey) {
    case "ia-network":
    case "crm":
    case "n8n":
      return "linear-gradient(135deg, #0F2A0A, #0A0A0A)";
    case "roi-bars":
    case "checkout":
    case "trend-line":
      return "linear-gradient(135deg, #0A0A0A, #1C1C1C)";
    case "voice":
    case "seo-bars":
    case "content-bars":
    case "quarters":
      return "linear-gradient(135deg, #161616, #0A0A0A)";
    case "checklist":
    case "funnel":
      return "linear-gradient(135deg, #0A0A0A, #161616)";
    default:
      return "linear-gradient(135deg, #161616, #1C1C1C)";
  }
}

function renderArt(artKey?: string, label?: string) {
  switch (artKey) {
    case "ia-network":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <g stroke="rgba(182,255,60,0.25)" strokeWidth="1" fill="none">
            <circle cx="60" cy="60" r="6" />
            <circle cx="100" cy="40" r="6" />
            <circle cx="140" cy="60" r="6" />
            <circle cx="100" cy="80" r="6" />
            <line x1="60" y1="60" x2="100" y2="40" />
            <line x1="100" y1="40" x2="140" y2="60" />
            <line x1="140" y1="60" x2="100" y2="80" />
            <line x1="100" y1="80" x2="60" y2="60" />
            <line x1="60" y1="60" x2="140" y2="60" />
          </g>
          <circle cx="100" cy="60" r="10" fill="#B6FF3C" />
          <text x="100" y="63" textAnchor="middle" fontFamily="var(--ff-display)" fontWeight="700" fontSize="9" fill="#0A0A0A">
            IA
          </text>
        </svg>
      );
    case "roi-bars":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <g fontFamily="var(--ff-display)" fontWeight="700" letterSpacing="-2">
            <text x="100" y="58" textAnchor="middle" fontSize="40" fill="#F5F5F0">
              +312<tspan fontSize="22" fill="#B6FF3C">%</tspan>
            </text>
            <text x="100" y="86" textAnchor="middle" fontFamily="var(--ff-mono)" fontSize="10" letterSpacing="2" fill="rgba(255,255,255,0.5)">
              ROI 3X
            </text>
          </g>
        </svg>
      );
    case "checklist":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <circle cx="100" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <path d="M100 16 A44 44 0 0 1 144 60" fill="none" stroke="#B6FF3C" strokeWidth="3" />
          <circle cx="100" cy="60" r="6" fill="#B6FF3C" />
          <text x="100" y="64" textAnchor="middle" fontFamily="var(--ff-mono)" fontSize="9" fill="rgba(255,255,255,0.6)">
            CHECKLIST
          </text>
        </svg>
      );
    case "funnel":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <g stroke="rgba(182,255,60,0.25)" strokeWidth="1" fill="none">
            <circle cx="60" cy="60" r="6" />
            <circle cx="100" cy="40" r="6" />
            <circle cx="140" cy="60" r="6" />
            <circle cx="100" cy="80" r="6" />
            <line x1="60" y1="60" x2="100" y2="40" />
            <line x1="100" y1="40" x2="140" y2="60" />
            <line x1="140" y1="60" x2="100" y2="80" />
            <line x1="100" y1="80" x2="60" y2="60" />
            <line x1="60" y1="60" x2="140" y2="60" />
          </g>
          <circle cx="100" cy="60" r="10" fill="#B6FF3C" />
          <text x="100" y="63" textAnchor="middle" fontFamily="var(--ff-display)" fontWeight="700" fontSize="9" fill="#0A0A0A">
            FUNIL
          </text>
        </svg>
      );
    case "seo-bars":
    case "content-bars":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <g fontFamily="var(--ff-mono)" fontSize="10" fill="rgba(255,255,255,0.55)" letterSpacing="1">
            <rect x="30" y="34" width="140" height="6" fill="rgba(255,255,255,0.1)" />
            <rect x="30" y="34" width="140" height="6" fill="#B6FF3C" />
            <rect x="30" y="50" width="140" height="6" fill="rgba(255,255,255,0.1)" />
            <rect x="30" y="50" width="90" height="6" fill="rgba(255,255,255,0.55)" />
            <rect x="30" y="66" width="140" height="6" fill="rgba(255,255,255,0.1)" />
            <rect x="30" y="66" width="60" height="6" fill="rgba(255,255,255,0.35)" />
            <rect x="30" y="82" width="140" height="6" fill="rgba(255,255,255,0.1)" />
            <rect x="30" y="82" width="30" height="6" fill="rgba(255,255,255,0.2)" />
          </g>
        </svg>
      );
    case "checkout":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <rect x="40" y="20" width="120" height="80" rx="4" fill="none" stroke="rgba(255,255,255,0.2)" />
          <rect x="50" y="32" width="60" height="6" fill="rgba(255,255,255,0.35)" />
          <rect x="50" y="44" width="80" height="4" fill="rgba(255,255,255,0.2)" />
          <rect x="50" y="54" width="70" height="4" fill="rgba(255,255,255,0.2)" />
          <rect x="50" y="76" width="40" height="14" fill="#B6FF3C" />
          <line x1="92" y1="83" x2="106" y2="83" stroke="#0A0A0A" strokeWidth="2" />
        </svg>
      );
    case "crm":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <path d="M 30 90 Q 60 30, 100 60 T 170 30" stroke="rgba(182,255,60,0.3)" strokeWidth="1" fill="none" />
          <circle cx="100" cy="60" r="14" fill="#B6FF3C" />
          <text x="100" y="65" textAnchor="middle" fontFamily="var(--ff-display)" fontWeight="700" fontSize="11" fill="#0A0A0A">
            CRM
          </text>
        </svg>
      );
    case "voice":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <text x="100" y="68" textAnchor="middle" fontFamily="var(--ff-display)" fontStyle="italic" fontWeight="500" fontSize="36" fill="rgba(255,255,255,0.85)">
            “voz”
          </text>
          <line x1="50" y1="92" x2="150" y2="92" stroke="#B6FF3C" strokeWidth="2" />
        </svg>
      );
    case "trend-line":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <g stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none">
            <path d="M 20 100 L 70 70 L 110 80 L 150 40 L 180 20" />
          </g>
          <path d="M 20 100 L 70 70 L 110 80 L 150 40 L 180 20" stroke="#B6FF3C" strokeWidth="2" fill="none" />
          <circle cx="180" cy="20" r="4" fill="#B6FF3C" />
        </svg>
      );
    case "n8n":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <g stroke="#B6FF3C" strokeWidth="1" fill="none" opacity="0.5">
            <rect x="40" y="30" width="40" height="20" rx="3" />
            <rect x="120" y="30" width="40" height="20" rx="3" />
            <rect x="40" y="70" width="40" height="20" rx="3" />
            <rect x="120" y="70" width="40" height="20" rx="3" />
            <line x1="80" y1="40" x2="120" y2="40" />
            <line x1="80" y1="80" x2="120" y2="80" />
          </g>
          <circle cx="100" cy="60" r="10" fill="#B6FF3C" />
          <text x="100" y="63" textAnchor="middle" fontFamily="var(--ff-display)" fontWeight="700" fontSize="9" fill="#0A0A0A">
            n8n
          </text>
        </svg>
      );
    case "quarters":
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <g fontFamily="var(--ff-mono)" fontSize="10" letterSpacing="1.5" fill="rgba(255,255,255,0.6)">
            <text x="100" y="40" textAnchor="middle">Q1</text>
            <text x="100" y="58" textAnchor="middle">Q2</text>
            <text x="100" y="76" textAnchor="middle">Q3</text>
            <text x="100" y="94" textAnchor="middle" fill="#B6FF3C">Q4</text>
          </g>
          <line x1="40" y1="46" x2="80" y2="46" stroke="rgba(255,255,255,0.2)" />
          <line x1="40" y1="64" x2="80" y2="64" stroke="rgba(255,255,255,0.2)" />
          <line x1="40" y1="82" x2="80" y2="82" stroke="rgba(255,255,255,0.2)" />
          <line x1="40" y1="100" x2="80" y2="100" stroke="#B6FF3C" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 120" width="80%" aria-hidden="true">
          <circle cx="100" cy="60" r="36" fill="none" stroke="rgba(255,255,255,0.2)" />
          <text x="100" y="65" textAnchor="middle" fontFamily="var(--ff-display)" fontWeight="700" fontSize="12" fill="#B6FF3C">
            {label ?? "SMZ"}
          </text>
        </svg>
      );
  }
}
