describe('Dashboard Visual Tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('should match dashboard layout across viewports', () => {
    cy.visit('/admin/dashboard');
    
    // Desktop view
    cy.viewport(1920, 1080);
    cy.visualSnapshot('Dashboard - Desktop');
    
    // Tablet view
    cy.viewport(768, 1024);
    cy.visualSnapshot('Dashboard - Tablet');
    
    // Mobile view
    cy.viewport(375, 667);
    cy.visualSnapshot('Dashboard - Mobile');
  });

  it('should match stats cards layout', () => {
    cy.visit('/admin/dashboard');
    cy.getByTestId('stats-cards').should('be.visible');
    cy.visualSnapshot('Stats Cards');
  });

  it('should match activity chart layout', () => {
    cy.visit('/admin/dashboard');
    cy.getByTestId('activity-chart').should('be.visible');
    cy.visualSnapshot('Activity Chart');
  });
}); 