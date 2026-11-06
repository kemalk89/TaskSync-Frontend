import { tryJson } from "@app/api";
import { envAuthUsernamePasswordUrl } from "../../../environment-variables";

/**
 * Maps validation error codes of the identity API ('POST /register') to messages
 * that can be displayed to the user.
 */
const validationErrorTranslations: Record<string, string> = {
  DuplicateUserName: "Diese E-Mail-Adresse ist bereits registriert.",
  DuplicateEmail: "Diese E-Mail-Adresse ist bereits registriert.",
  InvalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  InvalidUserName: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  PasswordTooShort: "Das Passwort muss mindestens 6 Zeichen lang sein.",
  PasswordRequiresDigit: "Das Passwort muss mindestens eine Ziffer enthalten.",
  PasswordRequiresUpper:
    "Das Passwort muss mindestens einen Großbuchstaben enthalten.",
  PasswordRequiresLower:
    "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.",
  PasswordRequiresNonAlphanumeric:
    "Das Passwort muss mindestens ein Sonderzeichen enthalten.",
  PasswordRequiresUniqueChars:
    "Das Passwort darf keine Zeichen mehrfach hintereinander enthalten.",
};

function extractSignupErrorMessage(responseData: unknown): string {
  // The identity API responds with a validation problem details objectin case of
  // invalid registration data.
  if (typeof responseData === "object" && responseData !== null) {
    const errors = (responseData as { errors?: Record<string, string[]> })
      .errors;

    if (errors && typeof errors === "object") {
      const messages = Object.keys(errors)
        .map((errorCode) => validationErrorTranslations[errorCode])
        .filter((message) => message !== undefined);

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }

  return "Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.";
}

export async function POST(request: Request) {
  const url = envAuthUsernamePasswordUrl + "register";
  const data = await request.json();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200) {
    const responseData = await tryJson(response);
    console.error(
      `Could not submit signup. ${response.status} - ${response.statusText} -`,
      responseData,
    );
    return Response.json(
      { message: extractSignupErrorMessage(responseData) },
      { status: response.status },
    );
  }

  return Response.json({ message: "Success" }, { status: 200 });
}
