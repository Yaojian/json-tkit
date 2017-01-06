# Overview

`json-tkit` is a toolkit for JSON.


## Installation

```
npm install json-tkit
```

## Usage

### prerequest: import the module 

```javascript
import * as jsonx from "json-tkit";
```

### Serialize an object with circular reference

```javascript
import * as jsonx from "json-tkit";

let o: any = {};
o.o = o;

let s = jsonx.serialize(o);
console.log(s);

let o2 = jsonx.deserialize(s);
console.log(o2.o == o2);
```