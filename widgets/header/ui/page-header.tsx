"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";

type Props = {
  title: string;
  description: string;
  breadcrumbs?: { href: string; text: string }[];
};

export function PageHeader(props: PropsWithChildren<Props>) {
  const pathname = usePathname();
  return (
    <div className="page__header">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        {props.breadcrumbs?.map((breadcrumb) => (
          <BreadcrumbItem href={breadcrumb.href} key={breadcrumb.href}>
            {breadcrumb.text}
          </BreadcrumbItem>
        ))}
        <BreadcrumbItem href={pathname}>{props.title}</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-2xl my-5">{props.title}</h1>
      <p className="text-slate-300 text-sm">{props.description}</p>

      {props.children}
    </div>
  );
}
