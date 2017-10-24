const publishUrl = Cypress.env('PUBLISH_URL')
const findUrl = Cypress.env('FIND_URL')
const testDatasetName = `test dataset ${new Date().toISOString()}`
const testDatafileUrl = 'https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/269519/gov-uk_domain_names_as_at_1_October_2013.csv'

describe('Synchronisation tests', () => {

  // beforeEach(() => {
  // })

  it('Creating a dataset on Publish', () => {
    cy.visit(publishUrl)
    cy.contains('h1', 'Publish and update data for your organisation')
    cy.contains('Sign in').click()

    cy.contains('h1', 'Sign in')
    cy.get('#user_email').type('publisher@example.com')
    cy.get('#user_password').type('password')
    cy.get('input[type=submit]').click()

    cy.contains('h1', 'Tasks')
    cy.contains('Manage datasets').click()
    cy.contains('Manage your datasets')
    cy.contains('Create a dataset').click()

    cy.contains('h1', 'Create a dataset')
    cy.get('#id_title').type(testDatasetName)
    cy.get('#id_summary').type('A disposable dataset created for testing sync')
    cy.contains('Save and continue').click()

    cy.contains('h1', 'Choose a licence for this dataset')
    cy.get('#id_licence_uk-ogl').click()
    cy.contains('Save and continue').click()

    cy.contains('h1', 'Choose a geographical area')
    cy.contains('Skip this step').click()

    cy.contains('h1', 'How frequently is this dataset updated?')
    cy.get('#id_frequency_never').click()
    cy.contains('Save and continue').click()

    cy.contains('h1', 'Add a link to your data')
    cy.get('#id_url').type(testDatafileUrl)
    cy.get('#id_name').type('some test datafile')
    cy.contains('Save and continue').click()

    cy.contains('h1', 'Links to your data')
    cy.contains('Save and continue').click()

    cy.contains('h1', 'Add a link to supporting documents')
    cy.contains('Skip this step').click()

    cy.contains('h1', `Publish  ‘${testDatasetName}’`)
    cy.get('input[type=submit]').click()

    cy.contains('h1', 'Your dataset has been published')
  })


  it('Finding the dataset on find', () => {
    cy.visit(findUrl)
    cy.contains('How we’ll use your data')
    cy.contains('Sign in to beta.data.gov.uk').click()
    cy.contains('Find government data')
    cy.get('input[type=text]').type(testDatasetName)
    cy.get('button[type=submit]').click()
    cy.contains(testDatasetName).click()
    cy.contains('h1', testDatasetName)
  })
})
