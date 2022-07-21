# iot-dash-app README

This is a web app frontend for the IOT-Dash app.

IOT-Dash is an application used for managing IoT devices and displaying data collected from them over MQTT.

This repository contains only the frontent part. Backend application is located in the repository [iot-dash-backend](https://github.com/Muph0/iot-dash-backend).

# Building and running

To build, you will need the `npm` package manager.
Clone this repo and then run the following.

```
npm install             # get all dependices
npm run oapi-gen-v1     # generate HTTP client for the backend API
```

> **NOTE:**
>
> Because of a bug in openapi generator, after generating,
> replace runtime.ts with runtime.hotfix.ts

You can then run the app with angular-cli.
```
npx ng serve
```

This will run the application in development mode and the generate OpenAPI client will point against fixed endpoint (i.e. `localhost:8080`).

If you want to host the app on the backend, you need to build it in production mode.
```
npx ng build -c production
```

Then the client will be pointed to the same origin as it is hosted on.

To bundle it together with the backend, follow the [programmers manual](https://muph0.github.io/iot-dash-backend/)
