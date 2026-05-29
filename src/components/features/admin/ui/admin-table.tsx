// Moved to src/components/shared/data-table.tsx (shared admin + client). Re-export shim
// keeping the legacy Admin* names so existing admin imports keep working.
export {
  DataTable as AdminTable,
  DataThead as AdminThead,
  DataTh as AdminTh,
  DataTbody as AdminTbody,
  DataTr as AdminTr,
  DataTd as AdminTd,
} from "@/components/shared/data-table";
