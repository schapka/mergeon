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

```
mergeon data/entry.json
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

This function will be passed as customizer to lodash’s [`_.mergeWidth`](https://lodash.com/docs/4.17.4#mergeWith) method.

> **Note:** This option is not available to CLI
