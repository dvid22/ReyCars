"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { coursesService } from "@/firebase/firestore/courses.service";
import type {
  Course,
  CourseFormData,
  CourseGroup,
  CourseIconType,
} from "@/types/course.types";

import styles from "./AdminServiciosPage.module.css";

type CourseKind =
  | "license"
  | "reinforcement"
  | "defensive"
  | "renewal"
  | "soat";

type WizardStep = 1 | 2 | 3;

type CourseDraft = {
  kind: CourseKind;

  name: string;
  categoryCode: string;
  description: string;

  vehicle: "Automóvil" | "Motocicleta" | "";

  theoryHours: number | null;
  practiceHours: number | null;

  reinforcementMode: "hour" | "package";
  packageHours: number | null;

  modules: number | null;

  price: number | null;

  renewalSinglePrice: number | null;
  renewalComboPrice: number | null;

  imageUrl: string;
  active: boolean;
  order: number;

  includes: string[];
};

const EMPTY_DRAFT: CourseDraft = {
  kind: "license",

  name: "",
  categoryCode: "",
  description: "",

  vehicle: "Automóvil",

  theoryHours: null,
  practiceHours: null,

  reinforcementMode: "hour",
  packageHours: null,

  modules: 2,

  price: 0,

  renewalSinglePrice: 0,
  renewalComboPrice: 0,

  imageUrl: "",
  active: true,
  order: 1,

  includes: [],
};

const COURSE_KINDS: Array<{
  value: CourseKind;
  title: string;
  description: string;
}> = [
  {
    value: "license",
    title: "Licencia",
    description: "Categorías A2, B1, C1 y similares.",
  },
  {
    value: "reinforcement",
    title: "Refuerzo",
    description: "Clases prácticas por hora o paquete.",
  },
  {
    value: "defensive",
    title: "Manejo defensivo",
    description: "Formación complementaria certificada.",
  },
  {
    value: "renewal",
    title: "Refrendación",
    description: "Renovación de una o varias categorías.",
  },
  {
    value: "soat",
    title: "SOAT",
    description: "Seguro obligatorio para carro o motocicleta.",
  },
];

function money(value?: number | null) {
  if (typeof value !== "number") return "Consultar";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPriceInput(value?: number | null) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "";
  }

  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(value);
}

function parsePriceInput(value: string) {
  const digits = value.replace(/\D/g, "");

  return digits ? Number(digits) : null;
}

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferKind(course: Course): CourseKind {
  const slug = course.slug.toLowerCase();
  const badge = course.badge.toLowerCase();

  if (
    slug.includes("soat") ||
    badge.includes("soat")
  ) {
    return "soat";
  }

  if (
    slug.includes("refrend") ||
    badge.includes("refrend")
  ) {
    return "renewal";
  }

  if (
    slug.includes("defens") ||
    badge.includes("certificado")
  ) {
    return "defensive";
  }

  if (
    slug.includes("refuerzo") ||
    badge.includes("refuerzo")
  ) {
    return "reinforcement";
  }

  return "license";
}

function parseMoneyFromInclude(
  items: string[],
  token: string
): number | null {
  const item = items.find((value) =>
    value.toLowerCase().includes(token.toLowerCase())
  );

  if (!item) return null;

  // Ejemplo:
  // "1 categoría: $345.000"
  // Debemos tomar únicamente "345.000",
  // no el "1" de "1 categoría".
  const pricePart = item.includes(":")
    ? item.split(":").slice(1).join(":")
    : item;

  const digits = pricePart.replace(/\D/g, "");

  return digits ? Number(digits) : null;
}

function isGeneratedInclude(
  value: string
) {
  const normalized = value
    .toLowerCase()
    .trim();

  return (
    /^\d+\s+horas?\s+te[oó]ricas?/.test(normalized) ||
    /^\d+\s+horas?\s+pr[aá]cticas?/.test(normalized) ||
    /^formaci[oó]n en /.test(normalized) ||
    /^clases por hora/.test(normalized) ||
    /^paquete de \d+\s+horas?/.test(normalized) ||
    /^paquete de horas/.test(normalized) ||
    /^clases personalizadas/.test(normalized) ||
    /^refuerzo de habilidades/.test(normalized) ||
    /^\d+\s+m[oó]dulos?/.test(normalized) ||
    /^formaci[oó]n por m[oó]dulos?/.test(normalized) ||
    /^formaci[oó]n b[aá]sica aplicada/.test(normalized) ||
    /^formaci[oó]n te[oó]rica/.test(normalized) ||
    /^1 categor[ií]a:/.test(normalized) ||
    /^combo:/.test(normalized) ||
    /^examen m[eé]dico y derechos de impresi[oó]n/.test(
      normalized
    )
  );
}

function getCustomIncludes(
  includes?: string[]
) {
  return (includes ?? []).filter(
    (item) => !isGeneratedInclude(item)
  );
}

function courseToDraft(course: Course): CourseDraft {
  const kind = inferKind(course);

  return {
    kind,

    name: course.name,
    categoryCode:
      kind === "license"
        ? course.badge.replace(/categoría/gi, "").trim()
        : "",
    description: course.description,

    vehicle:
      course.vehicle === "Motocicleta"
        ? "Motocicleta"
        : course.vehicle === "Automóvil"
          ? "Automóvil"
          : "",

    theoryHours: course.theoryHours ?? null,
    practiceHours: course.practiceHours ?? null,

    reinforcementMode:
      course.durationLabel ? "package" : "hour",
    packageHours:
      Number(
        course.durationLabel?.match(/\d+/)?.[0] ?? ""
      ) || null,

    modules:
      Number(
        course.theoryLabel?.match(/\d+/)?.[0] ?? ""
      ) || 2,

    price:
      typeof course.price === "number"
        ? course.price
        : 0,

    renewalSinglePrice:
      typeof course.price === "number" &&
      course.price > 0
        ? course.price
        : parseMoneyFromInclude(
            course.includes ?? [],
            "1 categoría"
          ) ?? 0,

    renewalComboPrice:
      parseMoneyFromInclude(
        course.includes ?? [],
        "combo"
      ) ?? 0,

    imageUrl: course.imageUrl,
    active: course.active,
    order: course.order,

    includes: getCustomIncludes(course.includes),
  };
}

function getKindLabel(kind: CourseKind) {
  return (
    COURSE_KINDS.find((item) => item.value === kind)
      ?.title ?? ""
  );
}

function getGroup(kind: CourseKind): CourseGroup {
  if (kind === "license") {
    return "Licencias de conducción";
  }

  if (kind === "soat") {
    return "Otros servicios";
  }

  return "Formación complementaria";
}

function getIcon(
  kind: CourseKind,
  vehicle: CourseDraft["vehicle"]
): CourseIconType {
  if (kind === "soat") return "soat";
  if (kind === "renewal") return "id";
  if (kind === "defensive") return "shield";
  if (kind === "reinforcement") {
    return vehicle === "Motocicleta"
      ? "motorcycle"
      : "steering";
  }

  return vehicle === "Motocicleta"
    ? "motorcycle"
    : "car";
}

function buildGeneratedIncludes(
  draft: CourseDraft
) {
  if (draft.kind === "license") {
    return [
      draft.theoryHours != null
        ? `${draft.theoryHours} horas teóricas`
        : "",
      draft.practiceHours != null
        ? `${draft.practiceHours} horas prácticas`
        : "",
      draft.vehicle
        ? `Formación en ${draft.vehicle.toLowerCase()}`
        : "",
    ].filter(Boolean);
  }

  if (draft.kind === "reinforcement") {
    return [
      draft.reinforcementMode === "hour"
        ? "Clases por hora"
        : draft.packageHours
          ? `Paquete de ${draft.packageHours} horas`
          : "Paquete de horas",
      "Clases personalizadas",
      "Refuerzo de habilidades",
    ];
  }

  if (draft.kind === "defensive") {
    return [
      draft.modules
        ? `${draft.modules} módulos`
        : "Formación por módulos",
      "Formación básica aplicada",
      "Formación teórica",
    ];
  }

  if (draft.kind === "soat") {
    return [
      draft.vehicle
        ? `SOAT para ${draft.vehicle.toLowerCase()}`
        : "SOAT para vehículo",
      "Cotización según características del vehículo",
      "Acompañamiento en la compra",
    ];
  }

  return [
    draft.renewalSinglePrice &&
    draft.renewalSinglePrice > 0
      ? `1 categoría: ${money(
          draft.renewalSinglePrice
        )}`
      : "1 categoría: Consultar precio en oficina",

    draft.renewalComboPrice &&
    draft.renewalComboPrice > 0
      ? `Combo: ${money(
          draft.renewalComboPrice
        )}`
      : "Combo: Consultar precio en oficina",

    "Examen médico y derechos de impresión",
  ];
}

function buildIncludes(draft: CourseDraft) {
  const generated =
    buildGeneratedIncludes(draft);

  const custom = draft.includes
    .map((item) => item.trim())
    .filter(Boolean);

  return [
    ...generated,
    ...custom.filter(
      (item) =>
        !generated.some(
          (generatedItem) =>
            generatedItem
              .toLowerCase()
              .trim() ===
            item.toLowerCase().trim()
        )
    ),
  ];
}

function buildPayload(
  draft: CourseDraft
): CourseFormData {
  const group = getGroup(draft.kind);
  const icon = getIcon(draft.kind, draft.vehicle);

  let badge = "";
  let subtitle = "";
  let category = "";
  let slugBase = draft.name;
  let price: number | null = null;
  let priceText = "";
  let priceLabel = "Inversión";
  let theoryHours: number | null = null;
  let theoryLabel = "";
  let practiceHours: number | null = null;
  let practiceLabel = "";
  let modality = "";
  let durationLabel = "";

  if (draft.kind === "license") {
    const code = draft.categoryCode.trim().toUpperCase();

    badge = code ? `Categoría ${code}` : "Licencia";
    subtitle =
      draft.vehicle === "Motocicleta"
        ? "Formación para motocicleta"
        : draft.name.toLowerCase().includes("particular")
          ? "Servicio particular"
          : "Formación para automóvil";

    category = draft.vehicle || "Licencia";
    slugBase = code || draft.name;

    theoryHours = draft.theoryHours;
    practiceHours = draft.practiceHours;
    modality = "Presencial";

    price =
      typeof draft.price === "number"
        ? draft.price
        : 0;

    if (price <= 0) {
      priceText = "Consultar precio en oficina";
    }
  }

  if (draft.kind === "reinforcement") {
    badge = "Refuerzo";
    subtitle = draft.vehicle || "Práctica personalizada";
    category = draft.vehicle || "Refuerzo";
    slugBase = `refuerzo-${draft.vehicle}`;

    practiceLabel =
      draft.reinforcementMode === "hour"
        ? "Por hora"
        : draft.packageHours
          ? `${draft.packageHours} h`
          : "Paquete";

    durationLabel =
      draft.reinforcementMode === "package" &&
      draft.packageHours
        ? `Paquete de ${draft.packageHours} horas`
        : "";

    modality = "Personalizada";
    priceLabel = "Valor";

    price =
      typeof draft.price === "number"
        ? draft.price
        : 0;

    if (price <= 0) {
      priceText = "Consultar precio en oficina";
    }
  }

  if (draft.kind === "defensive") {
    badge = "Certificado";
    subtitle = "Formación complementaria";
    category = "Manejo defensivo";
    slugBase = "manejo-defensivo";

    theoryLabel = draft.modules
      ? `${draft.modules} módulos`
      : "Módulos";

    modality = "Certificado";
    priceLabel = "Valor";

    price =
      typeof draft.price === "number"
        ? draft.price
        : 0;

    if (price <= 0) {
      priceText = "Consultar precio en oficina";
    }
  }

  if (draft.kind === "soat") {
    badge = "SOAT";
    subtitle =
      draft.vehicle === "Motocicleta"
        ? "Seguro obligatorio para motocicleta"
        : draft.vehicle === "Automóvil"
          ? "Seguro obligatorio para automóvil"
          : "Seguro obligatorio";

    category = "Seguros";
    slugBase = `soat-${draft.vehicle || "vehiculo"}`;
    modality = "Trámite";
    priceLabel = "Valor";

    price =
      typeof draft.price === "number"
        ? draft.price
        : 0;

    if (price <= 0) {
      priceText = "Cotizar según vehículo";
    }
  }

  if (draft.kind === "renewal") {
    badge = "Refrendación";
    subtitle = "Categoría individual o combo";
    category = "Trámite";
    slugBase = "refrendacion";
    modality = "Trámite";
    priceLabel = "Valor";

    // Un solo origen de verdad:
    // el precio numérico es el valor de una categoría.
    price =
      typeof draft.renewalSinglePrice === "number"
        ? draft.renewalSinglePrice
        : 0;

    priceText =
      price > 0
        ? `Desde ${money(price)}`
        : "Consultar precio en oficina";
  }

  const finalName =
    draft.name.trim() ||
    getKindLabel(draft.kind);

  return {
    slug: toSlug(slugBase),
    group,
    category,
    badge,
    name: finalName,
    subtitle,
    description: draft.description.trim(),

    imageUrl: draft.imageUrl,
    imageAlt: `${finalName} ReyCars`,

    active: draft.active,
    order: draft.order,

    price,
    priceText,
    priceLabel,

    theoryHours,
    theoryLabel,

    practiceHours,
    practiceLabel,

    vehicle: draft.vehicle,
    modality,
    durationLabel,
    audience: "",

    icon,
    whatsappLabel: `${badge} - ${finalName}`,

    features: [],
    includes: buildIncludes(draft),
  };
}

function getDraftPreview(draft: CourseDraft) {
  const payload = buildPayload(draft);

  return {
    badge: payload.badge,
    title: payload.name,
    subtitle: payload.subtitle,
    price:
      typeof payload.price === "number" &&
      payload.price > 0
        ? money(payload.price)
        : payload.priceText ||
          "Consultar precio en oficina",
  };
}

export function AdminServiciosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [editingCourse, setEditingCourse] =
    useState<Course | null>(null);

  const [step, setStep] = useState<WizardStep>(1);

  const [draft, setDraft] =
    useState<CourseDraft>(EMPTY_DRAFT);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Course | null>(null);

  const preview = useMemo(
    () => getDraftPreview(draft),
    [draft]
  );

  const activeCount = useMemo(
    () => courses.filter((course) => course.active).length,
    [courses]
  );

  async function loadCourses() {
    try {
      setError("");
      setIsLoading(true);
      setCourses(await coursesService.getCourses());
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible cargar los servicios desde Firestore."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCourses();
  }, []);

  function updateDraft<K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openCreate() {
    setEditingCourse(null);
    setDraft({
      ...EMPTY_DRAFT,
      order: courses.length + 1,
    });
    setImageFile(null);
    setStep(1);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function openEdit(course: Course) {
    setEditingCourse(course);
    setDraft(courseToDraft(course));
    setImageFile(null);
    setStep(1);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingCourse(null);
    setImageFile(null);
    setStep(1);
    setError("");
  }

  function validateCurrentStep() {
    if (step === 1) {
      if (!draft.name.trim()) {
        setError("Escribe el nombre del servicio.");
        return false;
      }

      if (
        draft.kind === "license" &&
        !draft.categoryCode.trim()
      ) {
        setError(
          "Escribe la categoría de la licencia, por ejemplo B1."
        );
        return false;
      }

      if (!draft.description.trim()) {
        setError("Escribe una descripción breve.");
        return false;
      }
    }

    if (step === 2) {
      if (
        (draft.kind === "license" ||
          draft.kind === "reinforcement" ||
          draft.kind === "soat") &&
        !draft.vehicle
      ) {
        setError("Selecciona el vehículo.");
        return false;
      }

      if (
        draft.kind === "license" &&
        (draft.theoryHours == null ||
          draft.practiceHours == null)
      ) {
        setError(
          "Indica las horas teóricas y prácticas."
        );
        return false;
      }

      if (
        draft.kind === "reinforcement" &&
        draft.reinforcementMode === "package" &&
        !draft.packageHours
      ) {
        setError(
          "Indica cuántas horas incluye el paquete."
        );
        return false;
      }

    }

    setError("");
    return true;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;

    setStep((current) =>
      Math.min(3, current + 1) as WizardStep
    );
  }

  function previousStep() {
    setError("");
    setStep((current) =>
      Math.max(1, current - 1) as WizardStep
    );
  }

  async function handleImportDefaults() {
    if (isImporting || courses.length > 0) return;

    try {
      setIsImporting(true);
      setError("");
      setSuccess("");

      const total =
        await coursesService.importDefaultCourses();

      if (total === 0) {
        setSuccess(
          "Firestore ya tiene servicios registrados."
        );
        return;
      }

      await loadCourses();

      setSuccess(
        `${total} servicios actuales de ReyCars fueron cargados correctamente.`
      );
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible importar los servicios actuales."
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function handleSave() {
    // Esta función SOLO se llama desde el botón
    // "Guardar cambios / Crear servicio" del paso 3.
    if (isSaving || step !== 3) return;

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      let imageUrl = draft.imageUrl;

      if (imageFile) {
        imageUrl =
          await coursesService.uploadCourseImage(
            imageFile
          );
      }

      const payload = buildPayload({
        ...draft,
        imageUrl,
      });

      if (editingCourse) {
        await coursesService.updateCourse(
          editingCourse.id,
          payload
        );

        setSuccess(
          "Servicio actualizado correctamente."
        );
      } else {
        await coursesService.createCourse(payload);

        setSuccess(
          "Servicio creado correctamente."
        );
      }

      setIsModalOpen(false);
      setEditingCourse(null);
      setImageFile(null);
      setStep(1);

      await loadCourses();
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible guardar el servicio. Revisa Firestore y Storage."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(course: Course) {
    try {
      setError("");
      setSuccess("");

      await coursesService.setCourseActive(
        course.id,
        !course.active
      );

      setCourses((current) =>
        current.map((item) =>
          item.id === course.id
            ? {
                ...item,
                active: !item.active,
              }
            : item
        )
      );

      setSuccess(
        !course.active
          ? "Servicio publicado."
          : "Servicio ocultado."
      );
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible cambiar el estado del servicio."
      );
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      await coursesService.deleteCourse(
        deleteTarget.id
      );

      setCourses((current) =>
        current.filter(
          (course) =>
            course.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
      setSuccess(
        "Servicio eliminado correctamente."
      );
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible eliminar el servicio."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function addInclude() {
    updateDraft("includes", [
      ...draft.includes,
      "",
    ]);
  }

  function updateInclude(
    index: number,
    value: string
  ) {
    updateDraft(
      "includes",
      draft.includes.map((item, currentIndex) =>
        currentIndex === index ? value : item
      )
    );
  }

  function removeInclude(index: number) {
    updateDraft(
      "includes",
      draft.includes.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            CONTENIDO · CURSOS
          </span>

          <h1>Oferta formativa</h1>

          <p>
            Administra los servicios que aparecen en
            el sitio web de ReyCars.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={openCreate}
        >
          <Plus size={16} strokeWidth={1.9} />
          Nuevo servicio
        </button>
      </div>

      <div className={styles.overview}>
        <div className={styles.overviewLead}>
          <span>Resumen</span>
          <strong>{courses.length}</strong>
          <p>servicios registrados</p>
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
            <strong>
              {courses.length - activeCount}
            </strong>
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

      {error && !isModalOpen ? (
        <div className={styles.alertError}>
          {error}
        </div>
      ) : null}

      {success ? (
        <div className={styles.alertSuccess}>
          {success}
        </div>
      ) : null}

      <div className={styles.contentCard}>
        <div className={styles.listHeader}>
          <div>
            <span>SERVICIOS REGISTRADOS</span>

            <strong>
              {courses.length === 0
                ? "Aún no hay servicios en Firestore"
                : "Contenido conectado con Firestore"}
            </strong>
          </div>

          <p>
            Orden · Estado · Formación · Inversión
          </p>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <span />
            <p>Cargando servicios...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyNumber}>
              07
            </span>

            <h2>
              Importa la oferta actual.
            </h2>

            <p>
              Los servicios actuales de ReyCars
              ya están preparados para cargarse en
              Firestore.
            </p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() =>
                void handleImportDefaults()
              }
              disabled={isImporting}
            >
              {isImporting
                ? "Importando..."
                : "Importar servicios actuales"}
            </button>
          </div>
        ) : (
          <div className={styles.courseList}>
            {courses.map((course) => (
              <article
                key={course.id}
                className={styles.courseRow}
              >
                <div className={styles.courseIndex}>
                  {String(course.order).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className={styles.courseImage}>
                  {course.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.imageUrl}
                      alt=""
                    />
                  ) : (
                    <span>
                      {course.name
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div className={styles.courseMain}>
                  <div className={styles.metaLine}>
                    <span>{course.badge}</span>

                    <span
                      className={
                        course.active
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      {course.active
                        ? "Publicado"
                        : "Oculto"}
                    </span>
                  </div>

                  <strong>{course.name}</strong>
                  <p>{course.description}</p>
                </div>

                <div className={styles.courseData}>
                  <div>
                    <span>Inversión</span>
                    <strong>
                      {typeof course.price === "number" &&
                      course.price > 0
                        ? money(course.price)
                        : "Consultar en oficina"}
                    </strong>
                  </div>

                  <div>
                    <span>Teoría</span>
                    <strong>
                      {course.theoryLabel ||
                        (course.theoryHours != null
                          ? `${course.theoryHours} h`
                          : "—")}
                    </strong>
                  </div>

                  <div>
                    <span>Práctica</span>
                    <strong>
                      {course.practiceLabel ||
                        (course.practiceHours != null
                          ? `${course.practiceHours} h`
                          : "—")}
                    </strong>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.editAction}
                    onClick={() =>
                      openEdit(course)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleToggle(course)
                    }
                  >
                    {course.active
                      ? "Ocultar"
                      : "Publicar"}
                  </button>

                  <button
                    type="button"
                    className={styles.deleteAction}
                    onClick={() =>
                      setDeleteTarget(course)
                    }
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
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <section
            className={styles.wizard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
          >
            <header className={styles.wizardHeader}>
              <div>
                <span>
                  {editingCourse
                    ? "EDITAR SERVICIO"
                    : "NUEVO SERVICIO"}
                </span>

                <h2 id="course-modal-title">
                  {editingCourse
                    ? editingCourse.name
                    : "Crear servicio"}
                </h2>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Cerrar"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </header>

            <div className={styles.steps}>
              <StepItem
                number={1}
                label="Información"
                current={step}
              />

              <span className={styles.stepLine} />

              <StepItem
                number={2}
                label="Formación"
                current={step}
              />

              <span className={styles.stepLine} />

              <StepItem
                number={3}
                label="Publicación"
                current={step}
              />
            </div>

            <div
              className={styles.wizardForm}
            >
              <div className={styles.stepContent}>
                {step === 1 ? (
                  <StepOne
                    draft={draft}
                    updateDraft={updateDraft}
                  />
                ) : null}

                {step === 2 ? (
                  <StepTwo
                    draft={draft}
                    updateDraft={updateDraft}
                  />
                ) : null}

                {step === 3 ? (
                  <StepThree
                    draft={draft}
                    updateDraft={updateDraft}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    preview={preview}
                    addInclude={addInclude}
                    updateInclude={updateInclude}
                    removeInclude={removeInclude}
                  />
                ) : null}
              </div>

              {error ? (
                <div
                  className={styles.formError}
                  role="alert"
                >
                  {error}
                </div>
              ) : null}

              <footer className={styles.wizardFooter}>
                <div>
                  {step > 1 ? (
                    <button
                      type="button"
                      className={styles.backButton}
                      onClick={previousStep}
                      disabled={isSaving}
                    >
                      <ArrowLeft
                        size={15}
                        strokeWidth={1.8}
                      />
                      Atrás
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.backButton}
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                  )}
                </div>

                <div className={styles.stepHint}>
                  Paso {step} de 3
                </div>

                {step < 3 ? (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={nextStep}
                  >
                    Continuar
                    <ArrowRight
                      size={15}
                      strokeWidth={1.8}
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Guardando..."
                      : editingCourse
                        ? "Guardar cambios"
                        : "Crear servicio"}

                    {!isSaving ? (
                      <Check
                        size={15}
                        strokeWidth={2}
                      />
                    ) : null}
                  </button>
                )}
              </footer>
            </div>
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
              Esta acción eliminará el servicio de
              Firestore y no podrá deshacerse.
            </p>

            <div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={isSaving}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.dangerButton}
                onClick={() =>
                  void confirmDelete()
                }
                disabled={isSaving}
              >
                {isSaving
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function StepItem({
  number,
  label,
  current,
}: {
  number: WizardStep;
  label: string;
  current: WizardStep;
}) {
  const completed = current > number;
  const active = current === number;

  return (
    <div
      className={`${styles.stepItem} ${
        active ? styles.stepItemActive : ""
      } ${
        completed
          ? styles.stepItemCompleted
          : ""
      }`}
    >
      <span>
        {completed ? (
          <Check size={13} strokeWidth={2.2} />
        ) : (
          number
        )}
      </span>

      <strong>{label}</strong>
    </div>
  );
}

function StepOne({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <div className={styles.stepPanel}>
      <div className={styles.stepHeading}>
        <span>01</span>
        <div>
          <h3>¿Qué servicio vas a publicar?</h3>
          <p>
            Solo necesitamos la información que verá
            el estudiante.
          </p>
        </div>
      </div>

      <div className={styles.kindGrid}>
        {COURSE_KINDS.map((kind) => {
          const selected =
            draft.kind === kind.value;

          return (
            <button
              key={kind.value}
              type="button"
              className={`${styles.kindCard} ${
                selected
                  ? styles.kindCardActive
                  : ""
              }`}
              onClick={() => {
                updateDraft("kind", kind.value);

                if (
                  kind.value === "reinforcement" &&
                  !draft.name
                ) {
                  updateDraft(
                    "name",
                    "Refuerzo práctico"
                  );
                }

                if (
                  kind.value === "defensive" &&
                  !draft.name
                ) {
                  updateDraft(
                    "name",
                    "Manejo defensivo"
                  );
                }

                if (
                  kind.value === "renewal" &&
                  !draft.name
                ) {
                  updateDraft(
                    "name",
                    "Refrendación de licencia"
                  );
                }

                if (
                  kind.value === "soat" &&
                  !draft.name
                ) {
                  updateDraft(
                    "name",
                    "SOAT"
                  );
                }
              }}
            >
              <span className={styles.kindCheck}>
                {selected ? (
                  <Check
                    size={13}
                    strokeWidth={2.2}
                  />
                ) : null}
              </span>

              <strong>{kind.title}</strong>
              <p>{kind.description}</p>
            </button>
          );
        })}
      </div>

      <div className={styles.simpleGrid}>
        <label>
          <span>Nombre del servicio</span>
          <input
            value={draft.name}
            onChange={(event) =>
              updateDraft(
                "name",
                event.target.value
              )
            }
            placeholder={
              draft.kind === "license"
                ? "Ej. Automóvil particular"
                : "Nombre del servicio"
            }
          />
        </label>

        {draft.kind === "license" ? (
          <label>
            <span>Categoría</span>
            <input
              value={draft.categoryCode}
              onChange={(event) =>
                updateDraft(
                  "categoryCode",
                  event.target.value.toUpperCase()
                )
              }
              placeholder="Ej. B1"
            />
          </label>
        ) : null}

        <label className={styles.full}>
          <span>Descripción</span>
          <textarea
            rows={4}
            value={draft.description}
            onChange={(event) =>
              updateDraft(
                "description",
                event.target.value
              )
            }
            placeholder="Explica brevemente qué ofrece este servicio."
          />
        </label>
      </div>
    </div>
  );
}

function StepTwo({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <div className={styles.stepPanel}>
      <div className={styles.stepHeading}>
        <span>02</span>
        <div>
          <h3>Detalles y precio</h3>
          <p>
            Te mostramos únicamente lo que aplica a
            este tipo de servicio.
          </p>
        </div>
      </div>

      {draft.kind === "license" ? (
        <LicenseFields
          draft={draft}
          updateDraft={updateDraft}
        />
      ) : null}

      {draft.kind === "reinforcement" ? (
        <ReinforcementFields
          draft={draft}
          updateDraft={updateDraft}
        />
      ) : null}

      {draft.kind === "defensive" ? (
        <DefensiveFields
          draft={draft}
          updateDraft={updateDraft}
        />
      ) : null}

      {draft.kind === "renewal" ? (
        <RenewalFields
          draft={draft}
          updateDraft={updateDraft}
        />
      ) : null}

      {draft.kind === "soat" ? (
        <SoatFields
          draft={draft}
          updateDraft={updateDraft}
        />
      ) : null}
    </div>
  );
}

function VehicleChoice({
  value,
  onChange,
}: {
  value: CourseDraft["vehicle"];
  onChange: (
    value: CourseDraft["vehicle"]
  ) => void;
}) {
  return (
    <div className={styles.choiceGroup}>
      <span className={styles.fieldLabel}>
        Vehículo
      </span>

      <div className={styles.segmented}>
        {(["Automóvil", "Motocicleta"] as const).map(
          (vehicle) => (
            <button
              key={vehicle}
              type="button"
              className={
                value === vehicle
                  ? styles.segmentedActive
                  : ""
              }
              onClick={() => onChange(vehicle)}
            >
              {vehicle}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
}) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const pendingDigitCaret =
    useRef<number | null>(
      null
    );

  const [text, setText] =
    useState(
      formatPriceInput(value)
    );

  const [isEditing, setIsEditing] =
    useState(false);

  useEffect(() => {
    if (!isEditing) {
      setText(
        formatPriceInput(value)
      );
    }
  }, [value, isEditing]);

  useLayoutEffect(() => {
    const digitCaret =
      pendingDigitCaret.current;

    const input =
      inputRef.current;

    if (
      digitCaret == null ||
      !input
    ) {
      return;
    }

    let digitsSeen = 0;
    let caretPosition = 0;

    if (digitCaret === 0) {
      caretPosition = 0;
    } else {
      for (
        let index = 0;
        index < text.length;
        index += 1
      ) {
        if (
          /\d/.test(
            text[index]
          )
        ) {
          digitsSeen += 1;
        }

        if (
          digitsSeen >=
          digitCaret
        ) {
          caretPosition =
            index + 1;
          break;
        }
      }

      if (
        digitsSeen <
        digitCaret
      ) {
        caretPosition =
          text.length;
      }
    }

    input.setSelectionRange(
      caretPosition,
      caretPosition
    );

    pendingDigitCaret.current =
      null;
  }, [text]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={text}
      placeholder={placeholder}
      onFocus={() => {
        setIsEditing(true);
      }}
      onChange={(event) => {
        const rawText =
          event.target.value;

        const caret =
          event.target.selectionStart ??
          rawText.length;

        const digitsBeforeCaret =
          rawText
            .slice(
              0,
              caret
            )
            .replace(
              /\D/g,
              ""
            ).length;

        const numericValue =
          parsePriceInput(
            rawText
          );

        pendingDigitCaret.current =
          digitsBeforeCaret;

        setText(
          formatPriceInput(
            numericValue
          )
        );

        onChange(
          numericValue
        );
      }}
      onBlur={() => {
        const numericValue =
          parsePriceInput(
            text
          );

        pendingDigitCaret.current =
          null;

        onChange(
          numericValue
        );

        setText(
          formatPriceInput(
            numericValue
          )
        );

        setIsEditing(false);
      }}
    />
  );
}

function PriceField({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <label>
      <span>Precio</span>

      <div className={styles.moneyInput}>
        <span>$</span>

        <MoneyInput
          value={draft.price}
          onChange={(value) =>
            updateDraft("price", value ?? 0)
          }
          placeholder="Ej. 1.300.000"
        />
      </div>

      <small className={styles.fieldHelp}>
        Escribe 0 si el precio debe consultarse en la oficina.
      </small>
    </label>
  );
}

function LicenseFields({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <div className={styles.simpleGrid}>
      <VehicleChoice
        value={draft.vehicle}
        onChange={(value) =>
          updateDraft("vehicle", value)
        }
      />

      <label>
        <span>Horas teóricas</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={draft.theoryHours ?? ""}
          onChange={(event) =>
            updateDraft(
              "theoryHours",
              parsePriceInput(event.target.value)
            )
          }
          placeholder="Ej. 32"
        />
      </label>

      <label>
        <span>Horas prácticas</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={draft.practiceHours ?? ""}
          onChange={(event) =>
            updateDraft(
              "practiceHours",
              parsePriceInput(event.target.value)
            )
          }
          placeholder="Ej. 20"
        />
      </label>

      <PriceField
        draft={draft}
        updateDraft={updateDraft}
      />
    </div>
  );
}

function ReinforcementFields({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <div className={styles.simpleGrid}>
      <VehicleChoice
        value={draft.vehicle}
        onChange={(value) =>
          updateDraft("vehicle", value)
        }
      />

      <div className={styles.choiceGroup}>
        <span className={styles.fieldLabel}>
          Forma de contratación
        </span>

        <div className={styles.segmented}>
          <button
            type="button"
            className={
              draft.reinforcementMode === "hour"
                ? styles.segmentedActive
                : ""
            }
            onClick={() =>
              updateDraft(
                "reinforcementMode",
                "hour"
              )
            }
          >
            Por hora
          </button>

          <button
            type="button"
            className={
              draft.reinforcementMode ===
              "package"
                ? styles.segmentedActive
                : ""
            }
            onClick={() =>
              updateDraft(
                "reinforcementMode",
                "package"
              )
            }
          >
            Paquete
          </button>
        </div>
      </div>

      {draft.reinforcementMode === "package" ? (
        <label>
          <span>Horas del paquete</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={draft.packageHours ?? ""}
            onChange={(event) =>
              updateDraft(
                "packageHours",
                parsePriceInput(event.target.value)
              )
            }
            placeholder="Ej. 14"
          />
        </label>
      ) : null}

      <PriceField
        draft={draft}
        updateDraft={updateDraft}
      />
    </div>
  );
}

function DefensiveFields({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <div className={styles.simpleGrid}>
      <label>
        <span>Número de módulos</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={draft.modules ?? ""}
          onChange={(event) =>
            updateDraft(
              "modules",
              parsePriceInput(event.target.value)
            )
          }
          placeholder="Ej. 2"
        />
      </label>

      <PriceField
        draft={draft}
        updateDraft={updateDraft}
      />
    </div>
  );
}

function RenewalFields({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <div className={styles.simpleGrid}>
      <label>
        <span>Valor una categoría</span>
        <div className={styles.moneyInput}>
          <span>$</span>
          <MoneyInput
            value={draft.renewalSinglePrice}
            onChange={(value) =>
              updateDraft(
                "renewalSinglePrice",
                value ?? 0
              )
            }
            placeholder="Ej. 345.000"
          />
        </div>
      </label>

      <label>
        <span>Valor combo</span>
        <div className={styles.moneyInput}>
          <span>$</span>
          <MoneyInput
            value={draft.renewalComboPrice}
            onChange={(value) =>
              updateDraft(
                "renewalComboPrice",
                value ?? 0
              )
            }
            placeholder="Ej. 525.000"
          />
        </div>
      </label>

      <div className={styles.infoNote}>
        <Check size={15} strokeWidth={2} />
        <span>
          Se mostrará automáticamente el precio
          “Desde {money(draft.renewalSinglePrice)}”.
        </span>
      </div>
    </div>
  );
}


function SoatFields({
  draft,
  updateDraft,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
}) {
  return (
    <div className={styles.simpleGrid}>
      <VehicleChoice
        value={draft.vehicle}
        onChange={(value) =>
          updateDraft("vehicle", value)
        }
      />

      <PriceField
        draft={draft}
        updateDraft={updateDraft}
      />

      <div className={styles.infoNote}>
        <Check size={15} strokeWidth={2} />
        <span>
          Si dejas el valor en cero, en el sitio
          aparecerá “Cotizar según vehículo”.
        </span>
      </div>
    </div>
  );
}

function StepThree({
  draft,
  updateDraft,
  imageFile,
  setImageFile,
  preview,
  addInclude,
  updateInclude,
  removeInclude,
}: {
  draft: CourseDraft;
  updateDraft: <K extends keyof CourseDraft>(
    key: K,
    value: CourseDraft[K]
  ) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  preview: {
    badge: string;
    title: string;
    subtitle: string;
    price: string;
  };
  addInclude: () => void;
  updateInclude: (
    index: number,
    value: string
  ) => void;
  removeInclude: (index: number) => void;
}) {
  const generatedIncludes =
    buildGeneratedIncludes(draft);

  return (
    <div className={styles.stepPanel}>
      <div className={styles.stepHeading}>
        <span>03</span>
        <div>
          <h3>Imagen y publicación</h3>
          <p>
            Revisa cómo quedará y decide si lo
            publicas de inmediato.
          </p>
        </div>
      </div>

      <div className={styles.publishLayout}>
        <div className={styles.publishFields}>
          <label className={styles.uploadBox}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setImageFile(
                  event.target.files?.[0] ?? null
                )
              }
            />

            <span className={styles.uploadIcon}>
              <ImagePlus
                size={21}
                strokeWidth={1.7}
              />
            </span>

            <strong>
              {imageFile
                ? imageFile.name
                : draft.imageUrl
                  ? "Cambiar imagen"
                  : "Seleccionar imagen"}
            </strong>

            <p>JPG, PNG o WEBP</p>
          </label>

          <div className={styles.includesBlock}>
            <div className={styles.includesHeader}>
              <div>
                <strong>
                  ¿Qué incluye este servicio?
                </strong>
                <p>
                  Opcional. Si no agregas nada, el
                  sistema lo genera automáticamente.
                </p>
              </div>

              <button
                type="button"
                onClick={addInclude}
              >
                <Plus
                  size={14}
                  strokeWidth={1.9}
                />
                Agregar
              </button>
            </div>

            <div className={styles.autoIncludes}>
              <span className={styles.autoIncludesLabel}>
                Se publicará automáticamente
              </span>

              <div className={styles.autoIncludesList}>
                {generatedIncludes.map(
                  (item, index) => (
                    <div
                      className={styles.autoIncludeItem}
                      key={`${item}-${index}`}
                    >
                      <span>
                        <Check
                          size={13}
                          strokeWidth={2}
                        />
                      </span>

                      <p>{item}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {draft.includes.length > 0 ? (
              <div className={styles.customIncludes}>
                <span className={styles.customIncludesLabel}>
                  Detalles adicionales
                </span>

                <div className={styles.includesList}>
                  {draft.includes.map(
                    (item, index) => (
                      <div
                        className={styles.includeRow}
                        key={index}
                      >
                        <span>
                          <Plus
                            size={12}
                            strokeWidth={2}
                          />
                        </span>

                        <input
                          value={item}
                          onChange={(event) =>
                            updateInclude(
                              index,
                              event.target.value
                            )
                          }
                          placeholder="Ej. Material de apoyo"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeInclude(index)
                          }
                          aria-label="Eliminar elemento"
                        >
                          <Trash2
                            size={14}
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <label className={styles.publishSwitch}>
            <div>
              <strong>Publicar servicio</strong>
              <p>
                Si lo desactivas, seguirá guardado
                pero no aparecerá en la web.
              </p>
            </div>

            <input
              type="checkbox"
              checked={draft.active}
              onChange={(event) =>
                updateDraft(
                  "active",
                  event.target.checked
                )
              }
            />

            <span
              className={styles.switchVisual}
              aria-hidden="true"
            >
              <i />
            </span>
          </label>
        </div>

        <aside className={styles.previewCard}>
          <span>VISTA PREVIA</span>

          <div className={styles.previewImage}>
            {imageFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(imageFile)}
                alt=""
              />
            ) : draft.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.imageUrl} alt="" />
            ) : (
              <div>
                <ImagePlus
                  size={25}
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          <small>{preview.badge}</small>
          <strong>{preview.title}</strong>
          <p>{preview.subtitle}</p>

          <div className={styles.previewPrice}>
            <span>Valor</span>
            <strong>{preview.price}</strong>
          </div>

          <div className={styles.previewStatus}>
            <span
              className={
                draft.active
                  ? styles.previewStatusActive
                  : styles.previewStatusInactive
              }
            />

            {draft.active
              ? "Se publicará en la web"
              : "Quedará oculto"}
          </div>
        </aside>
      </div>
    </div>
  );
}