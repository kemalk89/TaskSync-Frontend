/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginWithAuth0(username: string, password: string): Chainable<void>;
    }
  }
}
export {};

Cypress.Commands.add("loginWithAuth0", (username: string, password: string) => {
  Cypress.log({ name: "loginWithAuth0", message: "Login with Auth0." });

  cy.visit("/");
  cy.get("main").contains("Login").click();

  const args = { username, password };
  cy.origin(
    "https://dev-ng4mbx4gds2o61r1.eu.auth0.com",
    { args },
    ({ username, password }) => {
      cy.get("#username").type(username);
      cy.get("#password").type(`${password}{enter}`);
    }
  );
});
