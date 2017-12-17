[![npm](https://img.shields.io/npm/v/mergeon.svg?style=flat)](https://www.npmjs.org/package/mergeon)
[![Build Status](https://travis-ci.org/schapka/mergeon.svg?branch=master)](https://travis-ci.org/schapka/mergeon)

# Mergeon

> Loading extendable JSON structures

## Example

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

| Type     | Default value |
| -------- | ------------- |
| `string` | `undefined`   |

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
