describe('Tasks App Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/folder/Tareas');
    cy.contains('Tareas'); // Verifica que el título de la app esté presente
  });
});
