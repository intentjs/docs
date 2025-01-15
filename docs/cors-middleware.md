---
title: CORS Middleware
description: Comprehensive documentation for the built-in CORS middleware in Intent, covering introduction, installation, usage, options, and examples.
image:
---

# CORS Middleware Configuration

## Introduction to CORS
Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers that allows or restricts resources requested from another domain outside the domain from which the first resource was served. It is crucial for APIs that are accessed from web applications hosted on different origins.

## Configuration Options
The CORS settings can be modified in the `/config/http.ts` configuration file as follows:

- **origin**: An array of allowed origins. You can specify multiple origins or use `*` to allow all origins. For example:
  ```javascript
  origin: ['http://localhost:3000', 'https://mydomain.com'],
  ```

- **methods**: An array of HTTP methods that are allowed when accessing the resource. Common methods include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`.
  ```javascript
  methods: ['GET', 'POST'],
  ```

- **allowedHeaders**: An array of headers that can be used when making the actual request. For example:
  ```javascript
  allowedHeaders: ['Content-Type', 'Authorization'],
  ```

- **credentials**: A boolean indicating whether or not the request can include user credentials (like cookies, authorization headers, or TLS client certificates). Set to `true` to allow credentials.
  ```javascript
  credentials: true,
  ```

## Examples
Here are some examples of how to modify the CORS configuration:

### Allow All Origins
To allow requests from any origin:
```javascript
cors: {
  origin: ['*'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
},
```

### Allow Specific Origins
To allow requests from specific domains:
```javascript
cors: {
  origin: ['http://example.com', 'http://anotherdomain.com'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
},
```

### Customizing Methods
To restrict the allowed methods:
```javascript
cors: {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
},
```
