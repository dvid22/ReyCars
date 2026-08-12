export const PUBLIC_ROUTES = {
  home: "/", about: "/nosotros", courses: "/servicios", process: "/proceso",
  team: "/equipo", facilities: "/instalaciones", contact: "/contacto",
  recruitment: "/trabaja-con-nosotros",
} as const;

export const ADMIN_ROUTES = {
  login: "/admin/login", dashboard: "/admin", home: "/admin/inicio",
  about: "/admin/nosotros", courses: "/admin/servicios", process: "/admin/proceso",
  team: "/admin/equipo", facilities: "/admin/instalaciones",
  testimonials: "/admin/testimonios", faq: "/admin/faq", contact: "/admin/contacto",
  recruitment: "/admin/recruitment", settings: "/admin/configuracion",
} as const;