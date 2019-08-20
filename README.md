# An Isomorphic Javascript SDK for Bitcoin, C-lightning and Opentimestamp visa-vi CypherNode.

# Why ?
Cyphernode simplifies to a large extent the historically cumbersome process for an individual to run, ergo sum participate, in the Bitcoin value network.
The aim of the SDK is to help bring access by bridging access from the "systems software" technological stack into the "product space" where product developers can start easily building apps for the future.

This SDK aims to abstract complications and offer a clean and friendly way to access the value proposition these systems offer.

# What's the more part ?
This SDK also includes helpers and tools that bridge and integrate the Bitcoin network into [Matrix.org](https://matrix.org) distributed communication architecture. 
I have this inhert belief that mixing an encrypted federeated distirbuted communication protocl with a disitrbuted exchange of value protocol is a reciepe for magic to happen.
After all in the words of @aantonop

``` 
Money is a language. 
```

---
** UNDER HEAVY WIP **

## Tests and Examples

Documentation of this SDK is WIP in the meantime client and integration tests serve as exmaples on how to use this SDK.

### Client Tests

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

### Integration Tests
Integration tests currently cover
1. Matrix transport and Bridge: Ability to use Matrix.io to communicate with your Cyphernode in a disritbuted and e2e encrypted fashion (@todo)
2. Mqtt Event Lsner: Subscribing and acting on Cyphernode watch events.

#### Integration Test requirments
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

#### Running Integration test steps:

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
## TODOs

1. JSDoc this puppy
2. Test coverage for all functions
3. Fix OTS functions
4. Add remaining LN functions
5. Add link to MVP app
