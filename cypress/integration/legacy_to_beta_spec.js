const publishUrl = Cypress.env('PUBLISH_URL')
const findUrl = Cypress.env('FIND_URL')
const legacyUrl = Cypress.env('LEGACY_URL')
const legacyUsername = Cypress.env('LEGACY_USERNAME')
const legacyPassword = Cypress.env('LEGACY_PASSWORD')
const testDatafileUrl = 'https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/269519/gov-uk_domain_names_as_at_1_October_2013.csv'

const publishSyncBetaUrl = 'http://localhost:3000/api/sync_beta'

const date = new Date().toISOString()
const testDatasetName = `legacy dataset ${date}`
const createDatasetOnLegacy = (testDatasetName) => {
  cy.visit(legacyUrl)
  cy.contains('h1', 'Browse data by theme')
  cy.contains('Log in').click()
  cy.get('#edit-name').type(legacyUsername)
  cy.get('#edit-pass').type(legacyPassword)
  cy.get('#edit-submit').click()

  cy.contains('My profile')
  cy.contains('Publisher tools').click()
  cy.contains('Add a Dataset').click()
  cy.contains('h1', 'Add a Dataset')
  cy.get('#title').type(testDatasetName)
  cy.get('#next-button').click()

  cy.contains('h3', 'Data Files')
  cy.get('#individual_resources__0__description').type('data file title')
  cy.get('#individual_resources__0__url').type(testDatafileUrl)
  cy.get('#individual_resources__0__format').type('CSV')
  cy.get('#next-button').click()

  cy.contains('h3', 'Description')
  cy.get('#notes').type('the description of this dataset')
  cy.get('#next-button').click()

  cy.contains('h3', 'Licence')
  cy.get('#next-button').click()

  cy.contains('h3', 'Publisher')
  cy.get('#owner_org').select('Land Registry')
  cy.get('#save-button').click()
}

const triggerSync = () => {
  cy.request(publishSyncBetaUrl)
    .then(res => {
      expect(res.status).to.eq(200)
    })
}

const findDatasetOnBeta = (testDatasetName) => {
  cy.visit(findUrl)
  cy.get('.dgu-filters__apply-button').click()
  cy.contains('h1', 'Find government data')
  cy.get('#q').type(testDatasetName)
  cy.get('.dgu-search-box__button').click()
  cy.contains('h2',testDatasetName)
}

describe('Synchronisation tests', () => {
  it('it synchronises a dataset from Legacy to Publish Beta', () => {
    createDatasetOnLegacy(testDatasetName)
    cy.wait(6000)
    triggerSync()
  })

  // Note that Cypress does not allow a call to be made to more than one service in a single test, hence why searching on find is in a separate test
  it('finds the synchronised dataset on Find Beta', () => {
    findDatasetOnBeta(testDatasetName)
  })
})
