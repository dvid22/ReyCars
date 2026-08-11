"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/firebase/auth/auth.service";

import styles from "./AdminLoginPage.module.css";

export function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = authService.observeAuth((user) => {
      if (user) {
        router.replace("/admin");
        return;
      }

      setIsCheckingSession(false);
    });

    return unsubscribe;
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setIsLoading(true);

      await authService.login(normalizedEmail, password);

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className={styles.page}>
        <div
          className={styles.sessionLoader}
          role="status"
          aria-label="Comprobando sesión"
        >
          <span />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.visual}>
        <Image
          src="/assets/images/home/hero-driving-lesson.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 760px) 100vw, 70vw"
          className={styles.visualImage}
        />

        <div className={styles.visualOverlay} />

        <div className={styles.visualContent}>
          <div className={styles.visualMessage}>
            <span className={styles.eyebrow}>
              PANEL ADMINISTRATIVO
            </span>

            <h1>
              Todo ReyCars,
              <br />
              en un solo lugar.
            </h1>

            <p>
              Gestiona cursos, contenido, equipo y configuración desde un
              panel interno conectado directamente con tu sitio web.
            </p>
          </div>

          <div className={styles.visualFoot}>
            <span>CEA ReyCars</span>
            <span>Ubaté · Colombia</span>
          </div>
        </div>
      </section>

      <section className={styles.formSide}>
        <div className={styles.formGlow} aria-hidden="true" />
        <div className={styles.formGlowSecondary} aria-hidden="true" />

        <div className={styles.formPanel}>
          <div className={styles.brand}>
            <Image
              src="/assets/branding/logo-reycars.png"
              alt="CEA ReyCars"
              width={340}
              height={150}
              priority
              className={styles.logo}
            />
          </div>

          <div className={styles.formHeading}>
            <span>REYCARS ADMIN</span>

            <h2>Iniciar sesión</h2>

            <p>
              Ingresa con tu cuenta administrativa para continuar al panel.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Correo electrónico</span>

              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="admin@reycars.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                disabled={isLoading}
              />
            </label>

            <label className={styles.field}>
              <span>Contraseña</span>

              <div className={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={isLoading}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </label>

            {error ? (
              <div className={styles.error} role="alert">
                <span />
                <p>{error}</p>
              </div>
            ) : null}

            <button
              type="submit"
              className={styles.submit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  Ingresando...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className={styles.security}>
            <span />
            <p>
              Acceso exclusivo para personal autorizado de CEA ReyCars.
            </p>
          </div>
        </div>

        <div className={styles.bottomBrand}>
          <span>Centro de Enseñanza Automovilística</span>
          <span>Panel interno</span>
        </div>
      </section>
    </main>
  );
}