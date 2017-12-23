[![npm](https://img.shields.io/npm/v/mergeon.svg?style=flat)](https://www.npmjs.org/package/mergeon)
[![Build Status](https://travis-ci.org/schapka/mergeon.svg?branch=master)](https://travis-ci.org/schapka/mergeon)
[![Build status](https://ci.appveyor.com/api/projects/status/cwrjsbht5tuicc94/branch/master?svg=true)](https://ci.appveyor.com/project/schapka/mergeon/branch/master)

# Mergeon

**Loading extendable JSON structures:**

* Load data from different JSON files
* Use wildcards/globs
* Override inherited values
* Merge data
* Customize merging

## Contents

* [Installation](#installation)
* [Examples](#examples)
  * [Simple use case](#simple-use-case)
  * [Target path](#target-path)
  * [Wildcards](#wildcards)
* [Usage](#usage)
  * [JS API](#js-api)
  * [CLI](#cli)
* [Options](#options)
  * [entry](#entry)
  * [context](#context)
  * [extendKey](#extendkey)
  * [mergeCustomizer](#mergecustomizer)

## Installation

**npm**

```text
npm i -S mergeon
```

**yarn**

```text
yarn add mergeon
```

## Examples

### Simple use case

Load data from different JSON file and override values:

**`entry.json`**

```json
{
  "_extends": "./default-data.json",
  "title": "New title",
  "image": {
    "alt": "New alt value"
  }
}
```

**`default-data.json`**

```json
{
  "title": "Default title",
  "image": {
    "src": "path/to/default/image.jpg",
    "alt": "Default alt value"
  }
}
```

**Result**

```json
{
  "title": "New title",
  "image": {
    "src": "path/to/default/image.jpg",
    "alt": "New alt value"
  }
}
```

### Target path

Define a target path by using special syntax (`<extendKey>:<targetPath>`):

**`entry.json`**

```json
{
  "_extends:target.path": "./default-data.json"
}
```

**`default-data.json`**

```json
{
  "title": "Default title"
}
```

**Result**

```json
{
  "target": {
    "path": {
      "title": "Default title"
    }
  }
}
```

### Wildcards

Load multiple files by adding wildcards:

**`entry.json`**

```json
{
  "_extends:buttons": "./buttons/*.json"
}
```

**`buttons/primary.json`**

```json
{
  "type": "primary"
}
```

**`buttons/secondary.json`**

```json
{
  "type": "secondary"
}
```

**Result**

```json
{
  "buttons": {
    "primary": {
      "type": "primary"
    },
    "secondary": {
      "type": "secondary"
    }
  }
}
```

### Additional examples

See [test directory](https://github.com/schapka/mergeon/tree/master/test) for additional examples, including **wildcards**, **globstars**, **customized merging** and many more.

## Usage

### JS API

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

### `entry`

| Type              | Default value |
| ----------------- | ------------- |
| `string | object` | `undefined`   |

> **Note:** This option is required

### `context`

| Type     | Default value   |
| -------- | --------------- |
| `string` | `process.cwd()` |

> **Note:** This option is not available to CLI

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
