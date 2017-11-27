const publishUrl = Cypress.env('PUBLISH_URL')
const findUrl = Cypress.env('FIND_URL')
const legacyUrl = Cypress.env('LEGACY_URL')
const legacyUsername = Cypress.env('LEGACY_USERNAME')
const legacyPassword = Cypress.env('LEGACY_PASSWORD')
const testDatafileUrl = 'https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/269519/gov-uk_domain_names_as_at_1_October_2013.csv'

const createDatasetOnLegacy = (datasetName) => {
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
  cy.get('#title').type(datasetName)
  cy.log('Created dataset with ' + datasetName)
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
  cy.request(`${publishUrl}/api/sync-beta`)
    .then(res => {
      expect(res.status).to.eq(200)
    })
  cy.wait(6000)
}

const findDatasetOnBeta = (date, testDatasetName) => {
  // Note that you are not allowed to visit more than one unique domain in a single test hence why we are using cy.request instead. See https://docs.cypress.io/guides/guides/web-security.html#Cross-Origin-Iframes
  cy.request(`${findUrl}/use-of-data/confirm`)
  cy.request(`${findUrl}/search?q=awesome+dataset+${date}`)
    .its('body')
    .should('match', new RegExp(`<a[^>]*>${testDatasetName}<\/a>`))
}

describe('Synchronisation tests', () => {
  it('it synchronises a dataset from Legacy to Publish Beta', () => {
    const date = new Date().toISOString()
    const testDatasetName = `awesome dataset ${date}`

    createDatasetOnLegacy(testDatasetName)
    triggerSync()
    findDatasetOnBeta(date, testDatasetName)
  })
})
