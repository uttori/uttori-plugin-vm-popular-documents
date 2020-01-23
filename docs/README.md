[![view on npm](http://img.shields.io/npm/v/uttori-plugin-vm-popular-documents.svg)](https://www.npmjs.org/package/uttori-plugin-vm-popular-documents)
[![npm module downloads](http://img.shields.io/npm/dt/uttori-plugin-vm-popular-documents.svg)](https://www.npmjs.org/package/uttori-plugin-vm-popular-documents)
[![Build Status](https://travis-ci.org/uttori/uttori-plugin-vm-popular-documents.svg?branch=master)](https://travis-ci.org/uttori/uttori-plugin-vm-popular-documents)
[![Dependency Status](https://david-dm.org/uttori/uttori-plugin-vm-popular-documents.svg)](https://david-dm.org/uttori/uttori-plugin-vm-popular-documents)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-plugin-vm-popular-documents/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-plugin-vm-popular-documents?branch=master)

# Uttori View Model Enrichment - Popular Documents

A plugin to expose and add popular documents to a view-model or other object.

## Install

```bash
npm install --save uttori-plugin-vm-popular-documents
```

## Dependencies

There must be a plugin registered with the hooks to listen for a `popular-documents` event and respond with an array of the slugs of the popular documents.

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
    * [.configKey](#ViewModelPopularDocuments.configKey) ⇒ <code>String</code>
    * [.defaultConfig()](#ViewModelPopularDocuments.defaultConfig) ⇒ <code>Object</code>
    * [.validateConfig(config, _context)](#ViewModelPopularDocuments.validateConfig)
    * [.register(context)](#ViewModelPopularDocuments.register)
    * [.callback(viewModel, context)](#ViewModelPopularDocuments.callback) ⇒ <code>Object</code>

<a name="ViewModelPopularDocuments.configKey"></a>

### ViewModelPopularDocuments.configKey ⇒ <code>String</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  
**Returns**: <code>String</code> - The configuration key.  
**Example** *(ViewModelPopularDocuments.configKey)*  
```js
const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
```
<a name="ViewModelPopularDocuments.defaultConfig"></a>

### ViewModelPopularDocuments.defaultConfig() ⇒ <code>Object</code>
The default configuration.

**Kind**: static method of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  
**Returns**: <code>Object</code> - The configuration.  
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
| config | <code>Object</code> | A configuration object. |
| config[ViewModelPopularDocuments.configKey | <code>Object</code> | A configuration object specifically for this plugin. |
| config[ViewModelPopularDocuments.configKey].key | <code>String</code> | The that will be added to the passed in object and returned with the popular documents. |
| config[ViewModelPopularDocuments.configKey].limit | <code>String</code> | The maximum number of documents to be returned. |
| _context | <code>Object</code> | A Uttori-like context (unused). |

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
| context | <code>Object</code> | A Uttori-like context. |
| context.hooks | <code>Object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.config | <code>Object</code> | A provided configuration to use. |
| context.config.events | <code>Object</code> | An object whose keys correspong to methods, and contents are events to listen for. |

**Example** *(ViewModelPopularDocuments.register(context))*  
```js
const context = {
  hooks: {
    on: (event, callback) => { ... },
  },
  config: {
    [ViewModelPopularDocuments.configKey]: {
      ...,
      events: {
        callback: ['document-save', 'document-delete'],
        validateConfig: ['validate-config'],
      },
    },
  },
};
ViewModelPopularDocuments.register(context);
```
<a name="ViewModelPopularDocuments.callback"></a>

### ViewModelPopularDocuments.callback(viewModel, context) ⇒ <code>Object</code>
Queries the hooks for popular documents and searches the storage provider.

**Kind**: static method of [<code>ViewModelPopularDocuments</code>](#ViewModelPopularDocuments)  
**Returns**: <code>Object</code> - The provided view-model document.  

| Param | Type | Description |
| --- | --- | --- |
| viewModel | <code>Object</code> | A Uttori view-model object. |
| context | <code>Object</code> | A Uttori-like context. |
| context.config | <code>Object</code> | A provided configuration to use. |
| context.config.key | <code>String</code> | The key to add the array of documents to on the view-model. |
| context.config.limit | <code>Number</code> | The maximum number of documents to return. |
| context.config.ignore_slugs | <code>Array.&lt;String&gt;</code> | A list of slugs to not consider when fetching popular documents. |
| context.hooks | <code>Object</code> | An event system / hook system to use. |
| context.hooks.fetch | <code>function</code> | An event execution function. |
| context.storageProvider | <code>Object</code> | A provided Uttori StorageProvider instance. |
| context.storageProvider.getQuery | <code>function</code> | Access method for getting documents. |

**Example** *(ViewModelPopularDocuments.callback(viewModel, context))*  
```js
const context = {
  config: {
    [ViewModelPopularDocuments.configKey]: {
      ...,
    },
  },
  hooks: {
    fetch: () => { ... },
  },
  storageProvider: {
    getQuery: (query) => { ... }
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
