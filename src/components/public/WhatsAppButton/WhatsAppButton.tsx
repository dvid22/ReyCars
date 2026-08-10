import styles from "./WhatsAppButton.module.css";

export function WhatsAppButton() {
  const whatsappUrl =
    "https://wa.me/573102062512?text=Hola%20ReyCars%2C%20quiero%20recibir%20informaci%C3%B3n%20sobre%20sus%20cursos.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Contactar a ReyCars por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        className={styles.icon}
      >
        <path
          fill="currentColor"
          d="M16.04 3C8.85 3 3 8.77 3 15.86c0 2.28.61 4.5 1.77 6.45L3 29l6.87-1.79a13.15 13.15 0 0 0 6.17 1.55h.01C23.24 28.76 29 22.99 29 15.9 29 8.8 23.23 3 16.04 3Zm0 23.57h-.01a10.94 10.94 0 0 1-5.58-1.52l-.4-.24-4.08 1.06 1.09-3.95-.26-.4a10.67 10.67 0 0 1-1.67-5.66c0-5.92 4.9-10.73 10.92-10.73 2.91 0 5.65 1.12 7.71 3.15a10.58 10.58 0 0 1 3.2 7.6c0 5.9-4.9 10.69-10.92 10.69Zm5.99-8.02c-.33-.16-1.94-.95-2.24-1.06-.3-.1-.52-.16-.74.16-.22.33-.85 1.06-1.04 1.28-.19.22-.38.24-.71.08-.33-.16-1.39-.5-2.65-1.61a9.89 9.89 0 0 1-1.83-2.25c-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.76-1.01-2.41-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.1-1.14 2.68s1.17 3.11 1.33 3.33c.16.22 2.3 3.46 5.57 4.85.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.63-.09 1.94-.78 2.21-1.54.27-.76.27-1.41.19-1.54-.08-.14-.3-.22-.63-.38Z"
        />
      </svg>
    </a>
  );
}