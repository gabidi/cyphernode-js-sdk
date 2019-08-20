FROM node:12.2.0-alpine
COPY . /app
WORKDIR /app
RUN yarn
#RUN yarn global add typescript
# @FIXME remove supress flag when we're prod ready
#RUN tsc --suppress -p tsconfig.json 
# CI
CMD ["node","/app/node_modules/ava/cli.js","/app/integrationTests/*.spec*.js"]

