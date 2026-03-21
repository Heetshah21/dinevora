"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  label: string;
}

export default function SidebarNavLink({ href, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "10px 12px",
        borderRadius: "8px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 500,
        color: isActive ? "#111827" : "#374151",
        background: isActive ? "#e5e7eb" : "transparent",
        border: isActive ? "1px solid #d1d5db" : "1px solid transparent",
      }}
    >
      {label}
    </Link>
  );
}
