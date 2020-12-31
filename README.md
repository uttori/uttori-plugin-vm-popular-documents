[![view on npm](https://img.shields.io/npm/v/@uttori/plugin-vm-popular-documents.svg)](https://www.npmjs.com/package/@uttori/plugin-vm-popular-documents)
[![npm module downloads](https://img.shields.io/npm/dt/@uttori/plugin-vm-popular-documents.svg)](https://www.npmjs.com/package/@uttori/plugin-vm-popular-documents)
[![Build Status](https://travis-ci.com/uttori/uttori-plugin-vm-popular-documents.svg?branch=master)](https://travis-ci.com/uttori/uttori-plugin-vm-popular-documents)
[![Dependency Status](https://david-dm.org/uttori/uttori-plugin-vm-popular-documents.svg)](https://david-dm.org/uttori/uttori-plugin-vm-popular-documents)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-plugin-vm-popular-documents/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-plugin-vm-popular-documents?branch=master)

# Uttori View Model Enrichment Plugin - Popular Documents

A plugin to expose and add popular documents to a view-model or other object.

## Install

```bash
npm install --save @uttori/plugin-vm-popular-documents
```

## Dependencies

There must be a plugin registered with the hooks to listen for a `popular-documents` event and respond with an array containing the slugs of the popular documents.

## Config

```js
{
  // Registration Events
  events: {
    callback: ['view-model-home'],
  },

  // Key to use in the view model
  key: 'popularDocuments',

  // Number of documents to return.
  limit: 10,

  // A list of slugs to ignore when considering popularity.
  ignore_slugs: [],
}
```

* * *

## API Reference

<a name="ViewModelPopularDocuments"></a>

## ViewModelPopularDocuments
Uttori View Model Enrichment - Popular Documents

**Kind**: global class  

* [ViewModelPopularDocuments](#ViewModelPopularDocuments)
    * [.configKey](#ViewModelPopularDocuments.configKey) ⇒ <code>string</code>
    * [.defaultConfig()](#ViewModelPopularDocuments.defaultConfig) ⇒ <code>object</code>
    * [.validateConfig(config, _context)](#ViewModelPopularDocuments.validateConfig)
    * [.register(context)](#ViewModelPopularDocuments.register)
    * [.callback(viewModel, context)](#ViewModelPopularDocuments.callback) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="ViewModelPopularDocuments.configKey"></a>

### ViewModelPopularDocuments.configKey ⇒ <code>string</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  
**Returns**: <code>string</code> - The configuration key.  
**Example** *(ViewModelPopularDocuments.configKey)*  
```js
const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
```
<a name="ViewModelPopularDocuments.defaultConfig"></a>

### ViewModelPopularDocuments.defaultConfig() ⇒ <code>object</code>
The default configuration.

**Kind**: static method of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  
**Returns**: <code>object</code> - The configuration.  
**Example** *(ViewModelPopularDocuments.defaultConfig())*  
```js
const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
```
<a name="ViewModelPopularDocuments.validateConfig"></a>

### ViewModelPopularDocuments.validateConfig(config, _context)
Validates the provided configuration for required entries.

**Kind**: static method of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |
| config.configKey | <code>object</code> | A configuration object specifically for this plugin. |
| config.configKey.key | <code>string</code> | The that will be added to the passed in object and returned with the popular documents. |
| config.configKey.limit | <code>string</code> | The maximum number of documents to be returned. |
| _context | <code>object</code> | A Uttori-like context (unused). |

**Example** *(ViewModelPopularDocuments.validateConfig(config, _context))*  
```js
ViewModelPopularDocuments.validateConfig({ ... });
```
<a name="ViewModelPopularDocuments.register"></a>

### ViewModelPopularDocuments.register(context)
Register the plugin with a provided set of events on a provided Hook system.

**Kind**: static method of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.events | <code>object</code> | An object whose keys correspong to methods, and contents are events to listen for. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |

**Example** *(ViewModelPopularDocuments.register(context))*  
```js
const context = {
  config: {
    [ViewModelPopularDocuments.configKey]: {
      ...,
      events: {
        callback: ['document-save', 'document-delete'],
        validateConfig: ['validate-config'],
      },
    },
  },
  hooks: {
    on: (event, callback) => { ... },
  },
};
ViewModelPopularDocuments.register(context);
```
<a name="ViewModelPopularDocuments.callback"></a>

### ViewModelPopularDocuments.callback(viewModel, context) ⇒ <code>Promise.&lt;object&gt;</code>
Queries the hooks for popular documents and searches the storage provider.

**Kind**: static method of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  
**Returns**: <code>Promise.&lt;object&gt;</code> - The provided view-model document.  

| Param | Type | Description |
| --- | --- | --- |
| viewModel | <code>object</code> | A Uttori view-model object. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.key | <code>string</code> | The key to add the array of documents to on the view-model. |
| context.config.limit | <code>number</code> | The maximum number of documents to return. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> | A list of slugs to not consider when fetching popular documents. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.hooks.fetch | <code>function</code> | An event dispatch function that returns an array of results. |

**Example** *(ViewModelPopularDocuments.callback(viewModel, context))*  
```js
const context = {
  config: {
    [ViewModelPopularDocuments.configKey]: {
      ...,
    },
  },
  hooks: {
    on: (event) => { ... },
    fetch: (event, query) => { ... },
  },
};
ViewModelPopularDocuments.callback(viewModel, context);
```

* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)
