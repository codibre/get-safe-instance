[![Actions Status](https://github.com/Codibre/safe-redis-wrapper/workflows/build/badge.svg)](https://github.com/Codibre/safe-redis-wrapper/actions)
[![Actions Status](https://github.com/Codibre/safe-redis-wrapper/workflows/test/badge.svg)](https://github.com/Codibre/safe-redis-wrapper/actions)
[![Actions Status](https://github.com/Codibre/safe-redis-wrapper/workflows/lint/badge.svg)](https://github.com/Codibre/safe-redis-wrapper/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3b88781ef0ec77d6fae0/test_coverage)](https://codeclimate.com/github/Codibre/safe-redis-wrapper/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/3b88781ef0ec77d6fae0/maintainability)](https://codeclimate.com/github/Codibre/safe-redis-wrapper/maintainability)
[![Packages](https://david-dm.org/Codibre/safe-redis-wrapper.svg)](https://david-dm.org/Codibre/safe-redis-wrapper)
[![npm version](https://badge.fury.io/js/safe-redis-wrapper.svg)](https://badge.fury.io/js/safe-redis-wrapper)

Am pbkect wrapper to make its operations error proof. Basically, any error is ignored. You can have a callback when an error happens, for registering purpose,
bue during the application use, every error will be ignored and undefined will be returned instead.

## How to Install

```
npm i safe-redis-wrapper
```

## How to use it

Just wrap your redis instance and use the wrapped one

```ts
const wrappedRedis = getSafeInstance(someRedisInstance, timeout, ['get', 'getBuffer'], myErrorCallback)
```

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
