const viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1366, height: 768, name: 'laptop' },
  { width: 1920, height: 1080, name: 'desktop' }
];

describe('Responsive Design Visual Tests', () => {
  viewports.forEach(viewport => {
    describe(`${viewport.name} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
      });

      it('should match navigation layout', () => {
        cy.visit('/');
        cy.getByTestId('main-nav').should('be.visible');
        cy.visualSnapshot(`Navigation - ${viewport.name}`);
      });

      it('should match lesson content layout', () => {
        cy.visit('/lessons/1');
        cy.getByTestId('lesson-container').should('be.visible');
        cy.visualSnapshot(`Lesson Layout - ${viewport.name}`);
      });

      it('should match exercise layout', () => {
        cy.visit('/exercises/mcq');
        cy.getByTestId('exercise-container').should('be.visible');
        cy.visualSnapshot(`Exercise Layout - ${viewport.name}`);
      });
    });
  });
}); 