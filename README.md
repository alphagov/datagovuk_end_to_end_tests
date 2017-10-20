# dgu-tester
End-to-end tests for data.gov.uk


This repo contains end-to-end tests that descrine user journeys across DGU.
It aims to cover Find, Publish, as well as Legacy for synchronisation

## Installing

Type `npm install`

Set the following environment variables:

* `CYPRESS_FIND_URL`: where Find is (eg, http://localhost:3000)
* `CYPRESS_PUBLISH_URL`: where Publish is (eg, http://localhost:3000)
* `CYPRESS_LEGACY_URL`: where Legacy is (eg, http://test.data.gov.uk)


## Running the tests

* `npm run cypress:run`

To see the tests running and debug them:

* `npm run cypress:open`


## Writing tests

* Add nodejs test files to `cypress/integration`
