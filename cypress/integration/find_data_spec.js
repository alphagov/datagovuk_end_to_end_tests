const findUrl = Cypress.env('FIND_URL')

describe('Find Data tests', () => {

  beforeEach(() => {
    cy.visit(findUrl)
    cy.contains('How we’ll use your data')
    cy.contains('Sign in to beta.data.gov.uk').click()
    cy.contains('Find government data')
  });

  it('Finds a dataset', () => {
    cy.get('input[type=text]').type('cats square kilometre')
    cy.get('button[type=submit]').click()
    cy.contains('Cats per square kilometre').click()
    cy.contains('mean number of cats per square kilometre across GB')
  })

  it('Doesn\'t find a non-existing dataset', () => {
    cy.get('input[type=text]').type('skdfbasijsoif w0j90292898 28wjwif')
    cy.get('button[type=submit]').click()
    cy.contains('searching again using different words')
  })


})
