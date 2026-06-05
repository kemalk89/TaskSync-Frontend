/**
 * This is a barrel file. See https://basarat.gitbook.io/typescript/main-1/barrel.
 */

// Login
export { LoginPage } from "./features/user/login/login-page";
export { SignupPage } from "./features/user/signup/signup-page";

// Projects
export { ProjectViewPage } from "./features/project-view/project-view-page";
export { ProjectsPage } from "./features/projects/projects-page";

// Tickets
export { TicketsPage } from "./features/tickets/tickets-page";
export { NewTicketDialog } from "./features/tickets/new-ticket-dialog";
export { TicketForm } from "./features/tickets/ticket-form";
export { TicketViewPage } from "./features/ticket-view/ticket-view-page";
export type { TicketFormValues } from "./features/tickets/ticket-form";

// Users
export { UsersPage } from "./features/users/users-page";

// Settings
export { SettingsPage } from "./features/settings/settings-page";

// Common
export { NewFormModal } from "./NewFormModal/NewFormModal";
export type { ToastMessage } from "./toast";
export { ToastContext, ToastContainer } from "./toast";
export {
  ConfirmationModalContainer,
  ConfirmationModalProvider,
} from "./components/confirmation-modal";
export type {
  ConfirmationModalContentData,
  ConfirmationModalCallbacks,
} from "./components/confirmation-modal";
export { TranslationProvider, useTranslation } from "./i18n";
