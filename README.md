starter-kit-api
===============
This project is a bare bones starter kit for a GasBuddy microservice using
[swagger](http://swagger.io/) and [gb-services](https://github.com/gas-buddy/gb-services) for service setup and
dependency management.

Naming
======
From the [Standards](https://github.com/gas-buddy/Standards) repo:
```
If your project hosts a public API, call it something-api.
If your project hosts an internal service, call it something-serv.
If your project hosts a web site, call it something-web.
```

Project Structure
===================
|Item|Contents|
|---|---|
|api|The swagger document provided by this service, and a package.json that allows publishing that specification as an independent module|
|src|ES6 source files that implement the API defined in api using express and swaggerize-express|
|src/handlers|Implementations of the handlers to implement your API. One directory per path part, where the last part is used as a filename, and that js file should export functions named after the verbs that your API implements on that URL. See [the simple example](src/handlers/pets.js)
|config|Runtime configuration for the service|
|tests|Tests for the API and any other components that need testing|
|wercker.yml|A CI pipeline which can be run using wercker.com or the wercker CLI|
|Dockerfile|A Docker file to run your service in PRODUCTION, which is typically used to put your service in Kubernetes|
|docker/Dockerfile.dev|A Docker file to run your service in development, triggered by npm run docker-dev|
|.*|Various project settings are in .babelrc, .eslintrc, and .*ignore|
|README.md|THIS FILE, WHICH YOU BETTER REPLACE WITH A DESCRIPTION OF YOUR SERVICE|

The main application startup code is contained in [src/lib/start.js](src/lib/start.js),
which creates a GbService, loads configuration and then adds the features we use (features are usually shared
services like postgres or RabbitMQ). The config files contain (among other things), a list
of the other GasBuddy microservices which your service needs to use, and gb-services
will take care of setting up a client for that service for you in app.gb.services.**whatever**.

A simple test is included which can be run with ```npm test```. It uses our shared test
infrastructure to start and stop the express server on each test run and make schema
validation a bit easier.

Logging
=======
One of the things that gb-services does for you is setup a log infrastructure that includes
a "correlation id" that will survive across service calls in the infrastructure. In practice this
means two important things:

1) You should use req.gb.logger in your handlers to log stuff.
```
export function get(req, res) {
  req.gb.logger.info('The most incredible things are about to happen.');
}
```
2) Your library code should typically take a "context" parameter as the first arg if it needs to log stuff,
which handlers will pass to you (by passing req).
```
export function someHelperMethod(context, someArg) {
  context.gb.logger.info('I do what I am told');
}
```

Connections
========

You may require access to certain modules on start up and may want to refer to the same connection throughout the lifetime of the application.  These connections can be configured in the configuration.  

For example, if you need to refer to a connection that is in your dependencies in the config.

```
"connections": {
  "coolService": {
    "module": "require:@gasbuddy/cool-service-client"
  }
}
```
This connection will now be available in the context variable.
```
function useCoolService(context) {
  context.gb.coolService.chill();
}
```

You can also create modules that can be called on startup, by doing the following.

```
"connections": {
  "warmer": {
    "module": "sourcerequire:./lib/warmer"
  }
}
```

In this case, warmer is in the /src/lib folder.  The connection warmer will also be in the gb module.

The warmer module should look something like this:

```
export default class Warmer {
  constructor(context, config) {
    // set variables
    // check connections
  }
  
  doSomething(context) {

  }
}
```


Databases
=========
Connections can be made to GasBuddy databases (SQL Server and Postgres) via the "db" key in your connections.  We will typically use a `configured-xxxxx-client` to connect to a database.  These clients will wrap other libraries but are there to ensure consistent logging and metrics creation across services.

We also use the db-migrate and db-migrate-pg packages for postgres.


Services
========
Connections can be made to other GasBuddy swagger-based services via the "serviceConnections" key in your configuration

```
  "serviceFactory": {
    "clients": {
      "payment-activation-serv": "require:@gasbuddy/payment-activation-client",
    }
  },
```

That service would be made available. 

```
import { PaymentActivationServ } from '@gasbuddy/payment-activation-client;

export async function activate(context) {
  const payActivate = new PaymentActivationServ(context);
  await payActivate.activate();
}
```

If you need to use any extra auth with the service you can provide that in the endpoints section of the `serviceFactory`.

```
  "endpoints": {
    "payment-activation": {
      "username": "foobar",
      "password": "keytar:aGoodKeyName"
    }
  },
```

