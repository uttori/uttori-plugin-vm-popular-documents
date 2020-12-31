let debug = () => {}; try { debug = require('debug')('Uttori.Plugin.ViewModel.PopularDocuments'); } catch {}
const R = require('ramda');

/**
 * Uttori View Model Enrichment - Popular Documents
 *
 * @example <caption>ViewModelPopularDocuments</caption>
 * const viewModel = ViewModelPopularDocuments.callback(viewModel, context);
 * @class
 */
class ViewModelPopularDocuments {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   *
   * @type {string}
   * @returns {string} The configuration key.
   * @example <caption>ViewModelPopularDocuments.configKey</caption>
   * const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-vm-popular-documents';
  }

  /**
   * The default configuration.
   *
   * @returns {object} The configuration.
   * @example <caption>ViewModelPopularDocuments.defaultConfig()</caption>
   * const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
   * @static
   */
  static defaultConfig() {
    return {
      // Key to use in the view model
      key: 'popularDocuments',

      // Number of documents to return.
      limit: 10,

      // Slugs to not consider when selecting the most popular documents.
      ignore_slugs: [],
    };
  }

  /**
   * Validates the provided configuration for required entries.
   *
   * @param {object} config - A configuration object.
   * @param {object} config.configKey - A configuration object specifically for this plugin.
   * @param {string} config.configKey.key - The that will be added to the passed in object and returned with the popular documents.
   * @param {string} config.configKey.limit - The maximum number of documents to be returned.
   * @param {object} _context - A Uttori-like context (unused).
   * @example <caption>ViewModelPopularDocuments.validateConfig(config, _context)</caption>
   * ViewModelPopularDocuments.validateConfig({ ... });
   * @static
   */
  static validateConfig(config, _context) {
    debug('Validating config...');
    if (!config[ViewModelPopularDocuments.configKey]) {
      const error = `Config Error: '${ViewModelPopularDocuments.configKey}' configuration key is missing.`;
      debug(error);
      throw new Error(error);
    }
    if (config[ViewModelPopularDocuments.configKey].key && typeof config[ViewModelPopularDocuments.configKey].key !== 'string') {
      const error = 'Config Error: `key` should be a valid Object key string.';
      debug(error);
      throw new Error(error);
    }
    if (config[ViewModelPopularDocuments.configKey].limit && typeof config[ViewModelPopularDocuments.configKey].limit !== 'number') {
      const error = 'Config Error: `limit` should be a number.';
      debug(error);
      throw new Error(error);
    }
    if (config[ViewModelPopularDocuments.configKey].ignore_slugs && !Array.isArray(config[ViewModelPopularDocuments.configKey].ignore_slugs)) {
      const error = 'Config Error: `ignore_slugs` is should be an array.';
      debug(error);
      throw new Error(error);
    }
    debug('Validated config.');
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   *
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @example <caption>ViewModelPopularDocuments.register(context)</caption>
   * const context = {
   *   config: {
   *     [ViewModelPopularDocuments.configKey]: {
   *       ...,
   *       events: {
   *         callback: ['document-save', 'document-delete'],
   *         validateConfig: ['validate-config'],
   *       },
   *     },
   *   },
   *   hooks: {
   *     on: (event, callback) => { ... },
   *   },
   * };
   * ViewModelPopularDocuments.register(context);
   * @static
   */
  static register(context) {
    debug('register');
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => {
        if (typeof ViewModelPopularDocuments[method] !== 'function') {
          debug(`Missing function "${method}" for key "${event}"`);
          return;
        }
        context.hooks.on(event, ViewModelPopularDocuments[method]);
      });
    });
  }

  /**
   * Queries the hooks for popular documents and searches the storage provider.
   *
   * @param {object} viewModel - A Uttori view-model object.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {string} context.config.key - The key to add the array of documents to on the view-model.
   * @param {number} context.config.limit - The maximum number of documents to return.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when fetching popular documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   * @returns {Promise<object>} The provided view-model document.
   * @example <caption>ViewModelPopularDocuments.callback(viewModel, context)</caption>
   * const context = {
   *   config: {
   *     [ViewModelPopularDocuments.configKey]: {
   *       ...,
   *     },
   *   },
   *   hooks: {
   *     on: (event) => { ... },
   *     fetch: (event, query) => { ... },
   *   },
   * };
   * ViewModelPopularDocuments.callback(viewModel, context);
   * @static
   */
  static async callback(viewModel, context) {
    debug('callback');
    const { key, limit, ignore_slugs } = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
    debug(`key: "${key}", limit: ${limit}, ignore_slugs: [${ignore_slugs.join(',')}]`);
    if (limit < 1) {
      viewModel[key] = [];
      return viewModel;
    }
    let results = [];
    let popular = [];
    try {
      popular = await context.hooks.fetch('popular-documents', { limit }, context);
      debug('popular:', popular.length);
      if (Array.isArray(popular) && popular.length > 0) {
        debug('popular:', popular.length);
        popular = popular.map((p) => p.slug);
        const slugs = `"${popular.join('", "')}"`;
        const not_in = `"${ignore_slugs.join('", "')}"`;
        const query = `SELECT * FROM documents WHERE slug NOT_IN (${not_in}) AND slug IN (${slugs}) ORDER BY updateDate DESC LIMIT ${limit}`;
        [results] = await context.hooks.fetch('storage-query', query);
        results = R.sortBy(R.pipe(R.prop('slug'), R.indexOf(R.__, popular)))(results);
      } else {
        debug('No popular documents returned');
      }
    } catch (error) {
      debug('Error:', error);
    }
    results = R.reject(R.isNil, results);
    debug('results:', results.length);
    viewModel[key] = results;
    return viewModel;
  }
}

module.exports = ViewModelPopularDocuments;
