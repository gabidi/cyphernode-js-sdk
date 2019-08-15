# An Isomorphic Javascript SDK for CypherNode

** UNDER HEAVY WIP **
# Tests

All tests need to have Cyphernode running on your PC

## Client Tests
Must include your cyphernode admin api key
ex:
```
CYPHERNODE_API_KEY=$(gopass show misc/cyphernode_gatekeeper_admin_apikey) yarn test:unit:all
```

## Integration Tests


### Mqtt Sub tests

### Matrix server + Transport tests
1. Must have synapse url
2. Must have two matrix user and pass

@todo add env matrix stuff
```
DEBUG=test* CYPHERNODE_API_KEY=$(gopass show misc/cyphernode_gatekeeper_admin_apikey) NODE_TLS_REJECT_UNAUTHORIZED=0 node ./node_modules/ava/cli.js ./integrationTests/matrixTransport.spec.js 
```
