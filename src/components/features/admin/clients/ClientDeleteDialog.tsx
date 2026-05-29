"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ClientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onConfirm: () => void;
}

export function ClientDeleteDialog({ open, onOpenChange, clientName, onConfirm }: ClientDeleteDialogProps) {
  const t = useTranslations("admin.clients.list");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("deleteTitle")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          <strong>{clientName}</strong> &mdash; {t("deleteMsg")}
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("allStatuses").split(" ")[0] === "Tous" ? "Annuler" : "Cancel"}</Button>
          <Button variant="destructive" onClick={onConfirm}>{t("deleteConfirm")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
