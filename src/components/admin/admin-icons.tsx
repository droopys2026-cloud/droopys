/**
 * Glyphes de l'admin. La capture ne contenait aucun tracé : ceux-ci sont les
 * miens, dessinés sur la même grille de 24 et à la taille mesurée (16 px).
 */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 16,
  height: 16,
  "aria-hidden": true,
};

export function IconDashboard() {
  return (
    <svg {...base}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.5" />
      <rect x="13.5" y="11" width="7" height="9.5" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconTag() {
  return (
    <svg {...base}>
      <path d="M11.5 3.5H20v8.5l-8.6 8.6a1.4 1.4 0 0 1-2 0l-6.5-6.5a1.4 1.4 0 0 1 0-2Z" />
      <circle cx="16.2" cy="7.8" r="1.4" />
    </svg>
  );
}

export function IconBox() {
  return (
    <svg {...base}>
      <path d="M12 3.5 20.5 8v8L12 20.5 3.5 16V8Z" />
      <path d="M3.5 8 12 12.5 20.5 8" />
      <path d="M12 12.5v8" />
    </svg>
  );
}

export function IconOrders() {
  return (
    <svg {...base}>
      <path d="M5 4.5h11l3 4v11H5Z" />
      <path d="M8.5 12h7" />
      <path d="M8.5 15.5h7" />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg {...base}>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M3.8 19c0-3.1 2.6-4.8 5.7-4.8s5.7 1.7 5.7 4.8" />
      <path d="M16.5 6.4a3 3 0 0 1 0 5.6" />
      <path d="M18 14.6c1.5.6 2.4 1.8 2.4 3.4" />
    </svg>
  );
}

export function IconPages() {
  return (
    <svg {...base}>
      <path d="M6 3.5h8L18.5 8v12.5H6Z" />
      <path d="M13.5 3.5V8h5" />
    </svg>
  );
}

export function IconSettings() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6M17.9 17.9l-1.6-1.6M7.7 7.7 6.1 6.1" />
    </svg>
  );
}

export function IconStorefront() {
  return (
    <svg {...base}>
      <path d="M4.5 9.5h15V20h-15Z" />
      <path d="M3.5 9.5 5 4h14l1.5 5.5" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

export function IconHelp() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.6a2.3 2.3 0 1 1 3 2.2c-.6.2-.9.7-.9 1.3v.4" />
      <path d="M12 16.6h.01" />
    </svg>
  );
}

export function IconBolt() {
  return (
    <svg {...base}>
      <path d="M13 3 5.5 13.2h5.3L11 21l7.5-10.2h-5.3Z" />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg {...base}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.3 15.3 4.7 4.7" />
    </svg>
  );
}

export function IconTrash() {
  return (
    <svg {...base}>
      <path d="M4.5 6.5h15" />
      <path d="M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7" />
      <path d="M6.5 6.5 7.3 19c0 .8.7 1.5 1.5 1.5h6.4c.8 0 1.5-.7 1.5-1.5l.8-12.5" />
      <path d="M10.5 10v6.5M13.5 10v6.5" />
    </svg>
  );
}
