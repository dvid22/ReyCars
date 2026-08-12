"use client";

import Link from "next/link";

import {
  useRecruitment,
} from "@/hooks/useRecruitment";

type RecruitmentNavLinkProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export function RecruitmentNavLink({
  className,
  children =
    "Trabaja con nosotros",
  onClick,
}: RecruitmentNavLinkProps) {
  const {
    isEnabled,
    isLoading,
  } =
    useRecruitment();

  if (
    isLoading ||
    !isEnabled
  ) {
    return null;
  }

  return (
    <Link
      href="/trabaja-con-nosotros"
      className={
        className
      }
      onClick={
        onClick
      }
    >
      {children}
    </Link>
  );
}