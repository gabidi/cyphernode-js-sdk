# An Isomorphic Javascript SDK for Bitcoin, C-lightning and Opentimestamp Vis-à-vis CypherNode.

# Why ?

Cyphernode simplifies to a large extent the historically cumbersome process for an individual to run a full-node and thus participate in the Bitcoin value network.
The aim of the SDK is to further help access by bridging the gap between the "systems software" technological stack and the "product space" where product developers can start easily building apps for the future.

This SDK aims to abstract complications and offer a clean and friendly way to access the value proposition these systems offer with a value add of a modular transport.

## Usage,Tests and Examples

### Requirements
1. You need to have Cyphernode running on an HTTP accessible PC
2. You must have a valid Cyphernode admin api key to run the tests and you must pass the key to the SDK tests. The easiest way to do so is using environment variables. 
Make sure the following enviroment variables are set when using the sdk:
```
CYPHERNODE_API_KEY=
CYPHER_GATEWAY_URL=https://localhost:2009/v0/
```


### Example using the BTC client:
```js 
const {btcClient} = require('cyphernode-js-sdk');
const client = btcClient();
const balance = client.getBalance();
console.log(`Your balance is ${balance} bitcoins`);
```

### Example using the Lightining client:
```js 
const {lnClient} = require('cyphernode-js-sdk');
const client = lnClient();
const makeInvoicePayload = {
   msatoshi: 10,
   label: "much-ease-invoice",
   description: "This rocks",
   expiry: 900,
   callback_url: "http://url.to/call/when/invoice/paid"
 };
const invoice = await createInvoice(makeInvoicePayload);
// Show qrCode(invoice)
```
Documentation of this SDK is WIP in the meantime client tests serve as 'how-to' examples.
Futhermore the SDK is written in typescript which should help give a better understanding of parameters and return types for the functions being called.

## Transport Stacks

This SDK ships with a default HTTP transport stack, IE it will forward all your requests to the cyphernode endpoint via 'regular' GET and POST http requests.
The HTTP transport stack is automatically initilaized by default when a client is instantiated and uses the isomorphic package 'superagent' to send HTTP requests and is in fact the only depedency this sdk has. This is in the name of ease of use for both node and browser users.

You can easily drop that dependancy from the sdk by modifiying `./transports/cypherNodeHTTPTransport.ts` (or creating a new one in our [transports repo](https://github.com/gabidi/cyphernode-js-sdk-transports) !).

### Connecting Using a proxy (ex: TOR)
The included HTTP transport supports connecting to your Cyphernode using an HTTP, HTTPS or Socks proxy !
You can simply set the enviroment variable below with your proxy's url:
```bash
CYPHERNODE_HTTP_TRANSPORT_PROXY=socks://localhost:9050
CYPHER_GATEWAY_URL=cyphernode.onion or cleanet url/ip
```
and the SDK will automatically route all requests through the proxy.
Alternativley you can also setup the proxy programmatically, please reference the example located in the `./src/examples/` folder.

### Distritbued and custom transports

A big part of this SDK seeks to help integrate Bitcoin into other communication protocols via the notion of transport architecture. Please check the [Cyphernode transport repo](https://github.com/gabidi/cyphernode-js-sdk-transports) for more information on how to reach your Cyphernode via different communication protocols

### Client Tests
```
/clients/
```
Contains the individual clients that can be instaniated to access each of Cyphernode's services, at this time these are:

- btcClient.js : All things bitcoin
- lncClient.js : All things lighting
- otsClient.js : (WIP) All this opentimestamp

Test files for each client are included that showcase the usage of functionality

#### Client test requirements and steps:
1. All tests need to have Cyphernode running on your PC
2. You must have a valid Cyphernode admin api key to run the tests and you must pass the key to the SDK tests. The easiest way to do so is using environment variables. Simply create a 
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
## TODOs

1. JSDoc this puppy
2. Test coverage for all functions
3. _Fix OTS functions_
4. Add remaining LN functions
5. Add link to MVP app

--- 
License

(The MIT License)

Copyright (c) 2020 gabidi <gabidi@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.i
