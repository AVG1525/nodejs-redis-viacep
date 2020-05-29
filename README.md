# nodejs-redis-viacep
This project consists of the following tools:
 - [Redis](https://github.com/NodeRedis/node-redis)
 - [Express](https://github.com/expressjs/express)
 - [Axios](https://github.com/axios/axios)
 - [Node](https://github.com/nodejs/node)

## Installing Tools
Npm:
```npm
    apt-get install npm 
```
Node:
```npm
    apt-get install -y nodejs 
```

## Installing Project
Using npm:
```npm
    npm install
```

## Routes (GET)
Return 'OK':
```txt
    http://localhost:3000/
```
Return 'CEP':
```txt
    http://localhost:3000/get/:cep
```

## Start
Run `node server-redis.js`. Navigate to `http://localhost:3000/`.

