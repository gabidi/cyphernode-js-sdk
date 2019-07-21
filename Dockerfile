FROM node:12.2.0-alpine
COPY . /app
WORKDIR /app
RUN yarn
RUN yarn global add typescript
# @FIXME remove supress flag when we're prod ready
#RUN tsc --suppress -p tsconfig.json 
# CI
CMD ["node","/app/node_modules/ava/cli.js","/app/integrationTests/*.spec*.js"]

# docker run -it -e CYPHERNODE_API_KEY=$(gopass show misc/cyphernode_gatekeeper_admin_apikey) -e CYPHERNODE_MQTT_BROKER=dist_broker_1 -e CYPHERNODE_GATEWAY_URL="https://dist_gatekeeper_1:443/v0/" -e NODE_TLS_REJECT_UNAUTHORIZED=0 --network cyphernodenet cyphernode-js-sdk:intergrationTests node /app/node_modules/ava/cli.js
