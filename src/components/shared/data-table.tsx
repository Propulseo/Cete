// DataTable — ledger-style table primitives shared by admin and client (shadcn Table is not
// installed in this project). The table is one of the few "true surfaces": wrapped in a
// hairline shell. Header is a quiet tracked-uppercase row; body rows are hairline-divided
// with a subtle hover wash.
import * as React from "react";
import { cn } from "@/lib/utils";

export function DataTable({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-[var(--admin-line)] bg-card">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}

export function DataThead({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("border-b border-[var(--admin-line)] bg-secondary/60", className)} {...props} />;
}

export function DataTh({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function DataTbody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-[var(--admin-line)]", className)} {...props} />;
}

export function DataTr({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("transition-colors hover:bg-[var(--admin-sidebar-hover)]", className)} {...props} />;
}

export function DataTd({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle text-foreground", className)} {...props} />;
}
