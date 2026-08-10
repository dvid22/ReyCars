# Arquitectura ReyCars

## Público
Inicio · Nosotros · Cursos · Proceso · Equipo · Instalaciones · Contacto · Trabaja con nosotros.

## Admin
Login · Dashboard · Inicio · Nosotros · Cursos · Proceso · Equipo · Instalaciones · Testimonios · FAQ · Contacto · Reclutamiento · Configuración.

## Regla de estilos
Cada página, módulo y componente usa su propio `*.module.css`.
`src/app/globals.css` solo contiene reset, fuente base y tokens esenciales.

## Trabaja con nosotros
La ruta pública se habilitará desde `settings/recruitment`.
Cuando esté deshabilitada, deberá ocultarse de navegación/footer y devolver `notFound()` o redirigir.

## Firestore previsto
- settings/general
- settings/recruitment
- pages/home
- pages/about
- pages/process
- courses/{courseId}
- instructors/{instructorId}
- facilities/{facilityId}
- gallery/{imageId}
- testimonials/{testimonialId}
- faqs/{faqId}
- vacancies/{vacancyId}
- applications/{applicationId}
- admins/{uid}

Las reglas incluidas son provisionales y deben endurecerse antes de producción.
