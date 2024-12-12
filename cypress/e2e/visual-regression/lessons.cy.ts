describe('Lesson Interface Visual Tests', () => {
  beforeEach(() => {
    cy.impersonateUser('test-user', 1);
  });

  it('should match lesson layout across languages', () => {
    const languages = ['zh', 'vi', 'ja', 'th'];
    
    languages.forEach(lang => {
      cy.visit(`/lessons/1?lang=${lang}`);
      cy.visualSnapshot(`Lesson 1 - ${lang} language`);
      
      // Test specific components
      cy.getByTestId('lesson-content').should('be.visible');
      cy.visualSnapshot(`Lesson Content - ${lang}`);
      
      cy.getByTestId('pronunciation-guide').should('be.visible');
      cy.visualSnapshot(`Pronunciation Guide - ${lang}`);
    });
  });

  it('should match exercise layouts', () => {
    const exerciseTypes = ['mcq', 'fillInBlanks', 'speaking', 'writing'];
    
    exerciseTypes.forEach(type => {
      cy.visit(`/exercises/${type}`);
      cy.visualSnapshot(`Exercise - ${type}`);
    });
  });
}); 