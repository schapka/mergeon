[![npm](https://img.shields.io/npm/v/mergeon.svg?style=flat)](https://www.npmjs.org/package/mergeon)
[![Build Status](https://travis-ci.org/schapka/mergeon.svg?branch=master)](https://travis-ci.org/schapka/mergeon)
[![Build status](https://ci.appveyor.com/api/projects/status/cwrjsbht5tuicc94/branch/master?svg=true)](https://ci.appveyor.com/project/schapka/mergeon/branch/master)

# Mergeon

> Loading extendable JSON structures

## Installation

```text
npm i -S mergeon
```

## Examples

### Simple use case

**`entry.json`**

```json
{
  "items": [
    {
      "_extends": "./default-item.json",
      "title": "New title"
    }
  ]
}
```

**`default-item.json`**

```json
{
  "title": "Item title",
  "image": {
    "src": "path/to/image.jpg"
  }
}
```

**Result**

```json
{
  "items": [
    {
      "title": "New title",
      "image": {
        "src": "path/to/image.jpg"
      }
    }
  ]
}
```

### Additional examples

See [test directory](https://github.com/schapka/mergeon/tree/master/test) for additional examples.

## Usage

### Javascript / Node

```js
import mergeon from 'mergeon';

mergeon
  .load({
    entry: 'data/entry.json',
  })
  .then(result => {
    const jsonString = JSON.stringify(result.data, null, 2);
    /* ... */
  })
  .catch(error => {
    /* ... */
  });
```

### CLI

```text
mergeon data/entry.json > output.json
```

## Options

### `entry` (required)

| Type              | Default value |
| ----------------- | ------------- |
| `string | object` | `undefined`   |

### `context`

| Type     | Default value   |
| -------- | --------------- |
| `string` | `process.cwd()` |

### `extendKey`

| Type     | Default value |
| -------- | ------------- |
| `string` | `"_extends"`  |

### `mergeCustomizer`

| Type       | Default value |
| ---------- | ------------- |
| `function` | `undefined`   |

This function will be passed as customizer to lodash’s [`_.mergeWith`](https://lodash.com/docs/4.17.4#mergeWith) method.

> **Note:** This option is not available to CLI
