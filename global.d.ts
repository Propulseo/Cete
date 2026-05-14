import type frMessages from "./messages/fr.json";

type Messages = typeof frMessages;

declare global {
  interface IntlMessages extends Messages {}
}
