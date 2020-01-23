const debug = require('debug')('Uttori.Plugin.ViewModel.PopularDocuments');
const R = require('ramda');

/**
 * Uttori View Model Enrichment - Popular Documents
 * @example <caption>ViewModelPopularDocuments</caption>
 * const sitemap = ViewModelPopularDocuments.generate({ ... });
 * @class
 */
class ViewModelPopularDocuments {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   * @return {String} The configuration key.
   * @example <caption>ViewModelPopularDocuments.configKey</caption>
   * const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-vm-popular-documents';
  }

  /**
   * The default configuration.
   * @return {Object} The configuration.
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
   * @param {Object} config - A configuration object.
   * @param {Object} config[ViewModelPopularDocuments.configKey] - A configuration object specifically for this plugin.
   * @param {String} config[ViewModelPopularDocuments.configKey].key - The that will be added to the passed in object and returned with the popular documents.
   * @param {String} config[ViewModelPopularDocuments.configKey].limit - The maximum number of documents to be returned.
   * @param {Object} _context - A Uttori-like context (unused).
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
   * @param {Object} context - A Uttori-like context.
   * @param {Object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Object} context.config - A provided configuration to use.
   * @param {Object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @example <caption>ViewModelPopularDocuments.register(context)</caption>
   * const context = {
   *   hooks: {
   *     on: (event, callback) => { ... },
   *   },
   *   config: {
   *     [ViewModelPopularDocuments.configKey]: {
   *       ...,
   *       events: {
   *         callback: ['document-save', 'document-delete'],
   *         validateConfig: ['validate-config'],
   *       },
   *     },
   *   },
   * };
   * ViewModelPopularDocuments.register(context);
   * @static
   */
  static register(context) {
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    const config = { ...ViewModelPopularDocuments.defaultConfig(), ...context.config[ViewModelPopularDocuments.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => context.hooks.on(event, ViewModelPopularDocuments[method]));
    });
  }

  /**
   * Queries the hooks for popular documents and searches the storage provider.
   * @param {Object} viewModel - A Uttori view-model object.
   * @param {Object} context - A Uttori-like context.
   * @param {Object} context.config - A provided configuration to use.
   * @param {String} context.config.key - The key to add the array of documents to on the view-model.
   * @param {Number} context.config.limit - The maximum number of documents to return.
   * @param {String[]} context.config.ignore_slugs - A list of slugs to not consider when fetching popular documents.
   * @param {Object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.fetch - An event execution function.
   * @param {Object} context.storageProvider - A provided Uttori StorageProvider instance.
   * @param {Function} context.storageProvider.getQuery - Access method for getting documents.
   * @return {Object} The provided view-model document.
   * @example <caption>ViewModelPopularDocuments.callback(viewModel, context)</caption>
   * const context = {
   *   config: {
   *     [ViewModelPopularDocuments.configKey]: {
   *       ...,
   *     },
   *   },
   *   hooks: {
   *     fetch: () => { ... },
   *   },
   *   storageProvider: {
   *     getQuery: (query) => { ... }
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
      if (Array.isArray(popular) && popular.length > 0) {
        debug('popular:', popular.length);
        popular = R.reverse(R.pluck('slug')(popular));
        const slugs = `"${popular.join('", "')}"`;
        const not_in = `"${ignore_slugs.join('", "')}"`;
        results = await context.storageProvider.getQuery(`SELECT * FROM documents WHERE slug NOT_IN (${not_in}) AND slug IN (${slugs}) ORDER BY updateDate DESC LIMIT ${limit}`);
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
