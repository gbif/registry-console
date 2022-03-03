// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// https://docs.cypress.io/api/events/catalog-of-events#Uncaught-Exceptions
// added as AntD throws errors when running in an iframe and have done so for 3 years, so unlikely to change anytime soon. https://github.com/ant-design/ant-design/issues/15075 and https://github.com/ant-design/ant-design/issues/26621
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
})