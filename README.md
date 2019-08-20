# An Isomorphic Javascript SDK for CypherNode

** UNDER HEAVY WIP **
# Client Tests

All tests need to have Cyphernode running on your PC.
Note that you must have a valid Cyphernode admin api key to run the tests and you must pass the key to the SDK tests. The easiest way to do so is using environment variables.
Simply create a 
```
.env
``` 
file in the root directory of this repo and add the following enviroment variables:
```
CYPHERNODE_API_KEY=
CYPHER_GATEWAY_URL=https://localhost:2009/v0/
```
then run 
```
yarn test:clients
```

## Integration Tests
Integration tests currently cover
1. Matrix transport and Bridge: Ability to use Matrix.io to communicate with your Cyphernode in a disritbuted and e2e encrypted fashion (@todo)
2. Mqtt Event Lsner: Subscribing and acting on Cyphernode watch events.

### Integration Test requirments
1. Must have a valid matrix synapse server url
2. Must have two pairs of matrix user logins (One to be used to test the server and the other the client)
Best way is to amend the previously mentioned .env file with the following variables:

```bash
CYPHERNODE_MQTT_BROKER= 
CYPHERNODE_MQTT_PORT=,
CYPHERNODE_MATRIX_USER=
CYPHERNODE_MATRIX_PASS=
CYPHERNODE_MATRIX_TEST_CLIENT_USER=
CYPHERNODE_MATRIX_TEST_CLIENT_PASS=
CYPHERNODE_MATRIX_SERVER=
```
3. Integration tests need to be run in a Docker container that is attached to thesame network overlay cyphernode is runnig on.

### Running Integration test steps:

1- Build the docker container, run the following command in the root directory of the repo:
```bash
docker build --tag cyphernode-js-sdk:intergrationTests
```
2-  Run the integration tests in the container just built : 
```bash
docker run -it \
        --network=cyphernodenet \
        --env-file .env \
        -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
        -e CYPHERNODE_GATEWAY_URL="https://dist_gatekeeper_1:443/v0/" \
        -e CYPHERNODE_MQTT_BROKER="dist_broker_1" \
        cyphernode-js-sdk:intergrationTests node /app/node_modules/ava/cli.js integrationTests/*.spec.js
```
A helper script that runs the exact same commands as above is located in:
```bash
./scripts/docker-integrationTests.sh
```

