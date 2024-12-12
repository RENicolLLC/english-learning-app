import '@percy/cypress';

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Admin bypass for testing
Cypress.Commands.add('loginAsAdmin', () => {
  cy.request({
    method: 'POST',
    url: '/api/admin/login',
    body: {
      bypassKey: Cypress.env('ADMIN_BYPASS_KEY')
    }
  }).then((response) => {
    window.localStorage.setItem('adminToken', response.body.token);
  });
});

// User impersonation for testing
Cypress.Commands.add('impersonateUser', (userId: string, level: number) => {
  cy.loginAsAdmin();
  cy.request({
    method: 'POST',
    url: '/api/admin/bypass-auth',
    headers: {
      'x-admin-bypass': Cypress.env('ADMIN_BYPASS_KEY')
    },
    body: { userId, level }
  }).then((response) => {
    window.localStorage.setItem('userToken', response.body.token);
  });
});

// Visual testing helpers
Cypress.Commands.add('visualSnapshot', (name: string) => {
  if (Cypress.env('PERCY_ENABLED')) {
    cy.percySnapshot(name);
  }
}); 