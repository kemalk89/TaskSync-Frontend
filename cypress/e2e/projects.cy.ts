describe("Projects", () => {
  it("passes", () => {
    cy.loginWithAuth0(
      Cypress.env("auth_username"),
      Cypress.env("auth_password")
    );

    cy.contains("Projects");
    // Create a new project
    const projectTitle = "Test Project created by Cypress";
    cy.get("main").contains("Create").click();
    cy.get("#description").type(
      "Description of the test project created by Cypress."
    );
    cy.get("#title").type(`${projectTitle}{enter}`);
    // Ensure new project is listed in the table
    cy.get("table").contains(projectTitle);
  });
});
