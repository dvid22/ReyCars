"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { coursesService } from "@/firebase/firestore/courses.service";
import type {
  Course,
  CourseFormData,
} from "@/types/course.types";

import styles from "./AdminCursosPage.module.css";

const EMPTY_FORM: CourseFormData = {
  slug: "",
  category: "",
  name: "",
  description: "",
  imageUrl: "",
  active: true,
  order: 1,
  price: null,
  priceLabel: "",
  theoryHours: null,
  practiceHours: null,
  durationLabel: "",
  modality: "",
  audience: "",
  features: [],
  includes: [],
};

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function money(value?: number | null) {
  if (typeof value !== "number") return "Consultar";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [form, setForm] = useState<CourseFormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [includesText, setIncludesText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  async function loadCourses() {
    try {
      setError("");
      setIsLoading(true);
      setCourses(await coursesService.getCourses());
    } catch (error) {
      console.error(error);
      setError("No fue posible cargar los cursos desde Firestore.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCourses();
  }, []);

  const activeCount = useMemo(
    () => courses.filter((course) => course.active).length,
    [courses]
  );

  function openCreate() {
    setEditingCourse(null);
    setForm({
      ...EMPTY_FORM,
      order: courses.length + 1,
    });
    setImageFile(null);
    setFeaturesText("");
    setIncludesText("");
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function openEdit(course: Course) {
    setEditingCourse(course);

    setForm({
      slug: course.slug,
      category: course.category,
      name: course.name,
      description: course.description,
      imageUrl: course.imageUrl,
      active: course.active,
      order: course.order,
      price: course.price ?? null,
      priceLabel: course.priceLabel ?? "",
      theoryHours: course.theoryHours ?? null,
      practiceHours: course.practiceHours ?? null,
      durationLabel: course.durationLabel ?? "",
      modality: course.modality ?? "",
      audience: course.audience ?? "",
      features: course.features ?? [],
      includes: course.includes ?? [],
    });

    setFeaturesText((course.features ?? []).join("\n"));
    setIncludesText((course.includes ?? []).join("\n"));
    setImageFile(null);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingCourse(null);
    setImageFile(null);
  }

  function updateField<K extends keyof CourseFormData>(
    key: K,
    value: CourseFormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    if (!form.name.trim()) {
      setError("El nombre del curso es obligatorio.");
      return;
    }

    if (!form.category.trim()) {
      setError("La categoría es obligatoria.");
      return;
    }

    if (!form.description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      let imageUrl = form.imageUrl;

      if (imageFile) {
        imageUrl = await coursesService.uploadCourseImage(imageFile);
      }

      const payload: CourseFormData = {
        ...form,
        slug: form.slug.trim() || toSlug(form.name),
        imageUrl,
        features: featuresText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        includes: includesText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingCourse) {
        await coursesService.updateCourse(editingCourse.id, payload);
        setSuccess("Curso actualizado correctamente.");
      } else {
        await coursesService.createCourse(payload);
        setSuccess("Curso creado correctamente.");
      }

      setIsModalOpen(false);
      setEditingCourse(null);
      setImageFile(null);
      await loadCourses();
    } catch (error) {
      console.error(error);
      setError("No fue posible guardar el curso. Revisa Firestore y Storage.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(course: Course) {
    try {
      setError("");
      setSuccess("");

      await coursesService.setCourseActive(course.id, !course.active);

      setCourses((current) =>
        current.map((item) =>
          item.id === course.id
            ? { ...item, active: !item.active }
            : item
        )
      );

      setSuccess(!course.active ? "Curso publicado." : "Curso ocultado.");
    } catch (error) {
      console.error(error);
      setError("No fue posible cambiar el estado del curso.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      await coursesService.deleteCourse(deleteTarget.id);

      setCourses((current) =>
        current.filter((course) => course.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
      setSuccess("Curso eliminado correctamente.");
    } catch (error) {
      console.error(error);
      setError("No fue posible eliminar el curso.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>CONTENIDO · CURSOS</span>
          <h1>Oferta formativa</h1>
          <p>
            Administra los cursos visibles en ReyCars sin salir del panel.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={openCreate}
        >
          <span className={styles.plus}>+</span>
          Nuevo curso
        </button>
      </div>

      <div className={styles.overview}>
        <div className={styles.overviewLead}>
          <span>Resumen</span>
          <strong>{courses.length}</strong>
          <p>cursos registrados</p>
        </div>

        <div className={styles.overviewStat}>
          <span className={styles.dotActive} />
          <div>
            <strong>{activeCount}</strong>
            <p>Publicados</p>
          </div>
        </div>

        <div className={styles.overviewStat}>
          <span className={styles.dotInactive} />
          <div>
            <strong>{courses.length - activeCount}</strong>
            <p>Ocultos</p>
          </div>
        </div>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={() => void loadCourses()}
          disabled={isLoading}
        >
          Actualizar
        </button>
      </div>

      {error ? <div className={styles.alertError}>{error}</div> : null}
      {success ? <div className={styles.alertSuccess}>{success}</div> : null}

      <div className={styles.contentCard}>
        <div className={styles.listHeader}>
          <div>
            <span>CURSOS REGISTRADOS</span>
            <strong>
              {courses.length === 0
                ? "Sin contenido todavía"
                : "Contenido publicado y administrable"}
            </strong>
          </div>

          <p>Orden · Estado · Formación · Inversión</p>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <span />
            <p>Cargando cursos...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyNumber}>01</span>
            <h2>Tu oferta comienza aquí.</h2>
            <p>
              Crea el primer curso y empieza a administrar la información
              que después verá el usuario en la página pública.
            </p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={openCreate}
            >
              Crear primer curso
            </button>
          </div>
        ) : (
          <div className={styles.courseList}>
            {courses.map((course) => (
              <article key={course.id} className={styles.courseRow}>
                <div className={styles.courseIndex}>
                  {String(course.order).padStart(2, "0")}
                </div>

                <div className={styles.courseImage}>
                  {course.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.imageUrl} alt="" />
                  ) : (
                    <span>{course.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className={styles.courseMain}>
                  <div className={styles.metaLine}>
                    <span>{course.category}</span>
                    <span
                      className={
                        course.active
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      {course.active ? "Publicado" : "Oculto"}
                    </span>
                  </div>

                  <strong>{course.name}</strong>
                  <p>{course.description}</p>
                </div>

                <div className={styles.courseData}>
                  <div>
                    <span>Inversión</span>
                    <strong>{course.priceLabel || money(course.price)}</strong>
                  </div>

                  <div>
                    <span>Teoría</span>
                    <strong>
                      {course.theoryHours ?? "—"}
                      {course.theoryHours != null ? " h" : ""}
                    </strong>
                  </div>

                  <div>
                    <span>Práctica</span>
                    <strong>
                      {course.practiceHours ?? "—"}
                      {course.practiceHours != null ? " h" : ""}
                    </strong>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => openEdit(course)}
                    className={styles.editAction}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleToggle(course)}
                  >
                    {course.active ? "Ocultar" : "Publicar"}
                  </button>

                  <button
                    type="button"
                    className={styles.deleteAction}
                    onClick={() => setDeleteTarget(course)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {isModalOpen ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <span>{editingCourse ? "EDITAR CURSO" : "NUEVO CURSO"}</span>
                <h2 id="course-modal-title">
                  {editingCourse ? editingCourse.name : "Crear curso"}
                </h2>
              </div>

              <button type="button" onClick={closeModal} aria-label="Cerrar">
                ×
              </button>
            </header>

            <form className={styles.form} onSubmit={handleSave}>
              <section className={styles.formSection}>
                <div className={styles.sectionHeading}>
                  <span>01</span>
                  <div>
                    <strong>Información general</strong>
                    <p>Nombre, categoría y descripción pública.</p>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <label>
                    <span>Nombre *</span>
                    <input
                      value={form.name}
                      onChange={(event) => {
                        const value = event.target.value;
                        updateField("name", value);
                        if (!editingCourse) updateField("slug", toSlug(value));
                      }}
                      placeholder="Ej. Licencia B1"
                    />
                  </label>

                  <label>
                    <span>Categoría *</span>
                    <input
                      value={form.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      placeholder="Ej. Automóvil"
                    />
                  </label>

                  <label>
                    <span>Slug</span>
                    <input
                      value={form.slug}
                      onChange={(event) =>
                        updateField("slug", toSlug(event.target.value))
                      }
                      placeholder="licencia-b1"
                    />
                  </label>

                  <label>
                    <span>Orden</span>
                    <input
                      type="number"
                      min="0"
                      value={form.order}
                      onChange={(event) =>
                        updateField("order", Number(event.target.value))
                      }
                    />
                  </label>

                  <label className={styles.full}>
                    <span>Descripción *</span>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="Descripción pública del curso"
                    />
                  </label>
                </div>
              </section>

              <section className={styles.formSection}>
                <div className={styles.sectionHeading}>
                  <span>02</span>
                  <div>
                    <strong>Formación e inversión</strong>
                    <p>Datos académicos y comerciales del curso.</p>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <label>
                    <span>Precio</span>
                    <input
                      type="number"
                      min="0"
                      value={form.price ?? ""}
                      onChange={(event) =>
                        updateField(
                          "price",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value)
                        )
                      }
                      placeholder="1450000"
                    />
                  </label>

                  <label>
                    <span>Texto de inversión</span>
                    <input
                      value={form.priceLabel ?? ""}
                      onChange={(event) =>
                        updateField("priceLabel", event.target.value)
                      }
                      placeholder="Ej. Consultar"
                    />
                  </label>

                  <label>
                    <span>Horas teóricas</span>
                    <input
                      type="number"
                      min="0"
                      value={form.theoryHours ?? ""}
                      onChange={(event) =>
                        updateField(
                          "theoryHours",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value)
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>Horas prácticas</span>
                    <input
                      type="number"
                      min="0"
                      value={form.practiceHours ?? ""}
                      onChange={(event) =>
                        updateField(
                          "practiceHours",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value)
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>Duración / paquete</span>
                    <input
                      value={form.durationLabel ?? ""}
                      onChange={(event) =>
                        updateField("durationLabel", event.target.value)
                      }
                      placeholder="Ej. Paquete de 14 horas"
                    />
                  </label>

                  <label>
                    <span>Modalidad</span>
                    <input
                      value={form.modality ?? ""}
                      onChange={(event) =>
                        updateField("modality", event.target.value)
                      }
                      placeholder="Presencial"
                    />
                  </label>

                  <label className={styles.full}>
                    <span>Público objetivo</span>
                    <input
                      value={form.audience ?? ""}
                      onChange={(event) =>
                        updateField("audience", event.target.value)
                      }
                      placeholder="¿Para quién está pensado este curso?"
                    />
                  </label>
                </div>
              </section>

              <section className={styles.formSection}>
                <div className={styles.sectionHeading}>
                  <span>03</span>
                  <div>
                    <strong>Contenido e imagen</strong>
                    <p>Beneficios, incluidos y recurso visual.</p>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <label className={styles.full}>
                    <span>Características · una por línea</span>
                    <textarea
                      rows={4}
                      value={featuresText}
                      onChange={(event) => setFeaturesText(event.target.value)}
                      placeholder={"Formación teórica\nPrácticas personalizadas"}
                    />
                  </label>

                  <label className={styles.full}>
                    <span>Incluye · un elemento por línea</span>
                    <textarea
                      rows={4}
                      value={includesText}
                      onChange={(event) => setIncludesText(event.target.value)}
                      placeholder={"Clases teóricas\nClases prácticas"}
                    />
                  </label>

                  <label className={styles.full}>
                    <span>Imagen del curso</span>

                    <div className={styles.imageField}>
                      {form.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.imageUrl} alt="" />
                      ) : (
                        <div className={styles.imagePlaceholder}>Sin imagen</div>
                      )}

                      <div className={styles.imageControls}>
                        <strong>
                          {imageFile ? imageFile.name : "Selecciona una imagen"}
                        </strong>
                        <p>JPG, PNG o WEBP.</p>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) =>
                            setImageFile(event.target.files?.[0] ?? null)
                          }
                        />
                      </div>
                    </div>
                  </label>

                  <label className={styles.switchField}>
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(event) =>
                        updateField("active", event.target.checked)
                      }
                    />
                    <span>Publicar este curso</span>
                  </label>
                </div>
              </section>

              {error ? (
                <div className={styles.formError} role="alert">
                  {error}
                </div>
              ) : null}

              <footer className={styles.formFooter}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Guardando..."
                    : editingCourse
                      ? "Guardar cambios"
                      : "Crear curso"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className={styles.modalBackdrop}>
          <section
            className={styles.confirm}
            role="alertdialog"
            aria-modal="true"
          >
            <span>ELIMINAR CURSO</span>
            <h2>{deleteTarget.name}</h2>
            <p>
              Esta acción eliminará el documento del curso en Firestore y no
              podrá deshacerse.
            </p>

            <div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setDeleteTarget(null)}
                disabled={isSaving}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.dangerButton}
                onClick={() => void confirmDelete()}
                disabled={isSaving}
              >
                {isSaving ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}