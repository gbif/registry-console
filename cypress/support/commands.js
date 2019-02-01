// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => {
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  })

  cy.request({
    url: 'https://registry-demo.gbif-dev.org/user/login',
    auth: {
      'user': 'admin',
      'pass': 'admin',
      'sendImmediately': true
    }
  }).then(response => {
    const user = response.body;
    const jwt = user.token;
    localStorage.setItem('jwt', jwt);
  });
})