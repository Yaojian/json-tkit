# Overview

`json-tkit` is a toolkit for JSON.

It supports serializing javascript object with circular references to JSON and vice versa.

## Motivation

Inspiring [JSON-js](https://github.com/douglascrockford/JSON-js) with NPM and TypeScript support.

## Installation

```
npm install json-tkit
```

## Usage

### prerequest: import the module 

```typescript
import * as jsonx from "json-tkit";
```

### Serialize an object with circular reference

```typescript
let o: any = {};
o.o = o;

let s = jsonx.stringify(o);
console.log(s);

let o2 = jsonx.parse(s);
console.log(o2.o == o2);
```