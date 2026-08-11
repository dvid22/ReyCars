import type {
  LucideIcon,
} from "lucide-react";

import {
  Bike,
  BookOpen,
  CalendarDays,
  Car,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Flag,
  GraduationCap,
  IdCard,
  MapPin,
  MapPinned,
  Route,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import type {
  ProcessIconName,
} from "@/types/process.types";

export type ProcessIconOption = {
  value: ProcessIconName;
  label: string;
  icon: LucideIcon;
};

export const PROCESS_ICON_OPTIONS:
  ProcessIconOption[] = [
    {
      value: "route",
      label: "Ruta",
      icon: Route,
    },
    {
      value: "map-pin",
      label: "Ubicación",
      icon: MapPin,
    },
    {
      value: "clipboard",
      label: "Registro",
      icon: ClipboardCheck,
    },
    {
      value: "book",
      label: "Teoría",
      icon: BookOpen,
    },
    {
      value: "car",
      label: "Automóvil",
      icon: Car,
    },
    {
      value: "bike",
      label: "Motocicleta",
      icon: Bike,
    },
    {
      value: "flag",
      label: "Meta",
      icon: Flag,
    },
    {
      value: "graduation",
      label: "Formación",
      icon: GraduationCap,
    },
    {
      value: "file",
      label: "Documento",
      icon: FileText,
    },
    {
      value: "shield",
      label: "Seguridad",
      icon: ShieldCheck,
    },
    {
      value: "check",
      label: "Completado",
      icon: CheckCircle2,
    },
    {
      value: "id-card",
      label: "Licencia",
      icon: IdCard,
    },
    {
      value: "user",
      label: "Persona",
      icon: UserRound,
    },
    {
      value: "calendar",
      label: "Calendario",
      icon: CalendarDays,
    },
    {
      value: "clock",
      label: "Horario",
      icon: Clock3,
    },
  ];

const iconMap =
  Object.fromEntries(
    PROCESS_ICON_OPTIONS.map(
      (option) => [
        option.value,
        option.icon,
      ]
    )
  ) as Record<
    ProcessIconName,
    LucideIcon
  >;

export function getProcessIconLabel(
  value: ProcessIconName
) {
  return (
    PROCESS_ICON_OPTIONS.find(
      (option) =>
        option.value === value
    )?.label ?? "Icono"
  );
}

export function ProcessIconGlyph({
  type,
  size = 20,
  strokeWidth = 1.65,
  className,
}: {
  type: ProcessIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon =
    iconMap[type] ??
    MapPinned;

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}