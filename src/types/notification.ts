export type NotificationType = "veille" | "document" | "info";
export type NotificationVisibility = "global" | "assigned";

/** Une ligne `notifications` mappée camelCase ; `isRead` est calculé par utilisateur. */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  /** Date d'affichage métier (distincte de la création technique). */
  date: string;
  visibility: NotificationVisibility;
  assignedClientIds: string[];
  createdAt: string;
  /** Renseigné uniquement par les lectures côté portail (paire avec l'utilisateur courant). */
  isRead?: boolean;
}

export interface NewNotificationInput {
  type: NotificationType;
  message: string;
  date: string;
  visibility: NotificationVisibility;
  assignedClientIds: string[];
}
