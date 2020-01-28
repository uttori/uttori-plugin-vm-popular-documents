/* eslint-disable security/detect-non-literal-fs-filename */
const test = require('ava');
const ViewModelPopularDocuments = require('../src');

const config = {
  [ViewModelPopularDocuments.configKey]: {
    ...ViewModelPopularDocuments.defaultConfig(),
    events: [],
    key: 'popDocs',
    limit: 1,
  },
};
const hooks = {
  fetch: () => ['good-title', 'fake-title'],
};
const storageProvider = {
  getQuery: (_query) => [
    {
      updateDate: null,
      createDate: new Date('2019-04-20').toISOString(),
      slug: 'good-title',
    },
    {
      updateDate: new Date('2019-04-21').toISOString(),
      createDate: new Date('2019-04-21').toISOString(),
      slug: 'fake-title',
    },
  ],
};

test('ViewModelPopularDocuments.register(context): can register', (t) => {
  t.notThrows(() => {
    ViewModelPopularDocuments.register({ hooks: { on: () => {} }, config: { [ViewModelPopularDocuments.configKey]: { events: { callback: [] } } } });
  });
});

test('ViewModelPopularDocuments.register(context): errors without event dispatcher', (t) => {
  t.throws(() => {
    ViewModelPopularDocuments.register({ hooks: {} });
  }, { message: 'Missing event dispatcher in \'context.hooks.on(event, callback)\' format.' });
});

test('ViewModelPopularDocuments.register(context): errors without events', (t) => {
  t.throws(() => {
    ViewModelPopularDocuments.register({ hooks: { on: () => {} }, config: { [ViewModelPopularDocuments.configKey]: { } } });
  }, { message: 'Missing events to listen to for in \'config.events\'.' });
});

test('ViewModelPopularDocuments.defaultConfig(): can return a default config', (t) => {
  t.notThrows(ViewModelPopularDocuments.defaultConfig);
});

test('ViewModelPopularDocuments.validateConfig(config, _context): throws when configuration key is missing', (t) => {
  t.throws(() => {
    ViewModelPopularDocuments.validateConfig({});
  }, { message: 'Config Error: \'uttori-plugin-vm-popular-documents\' configuration key is missing.' });
});

test('ViewModelPopularDocuments.validateConfig(config, _context): throws when ignore_slugs is not an array', (t) => {
  t.throws(() => {
    ViewModelPopularDocuments.validateConfig({
      [ViewModelPopularDocuments.configKey]: {
        ignore_slugs: {},
      },
    });
  }, { message: 'Config Error: `ignore_slugs` is should be an array.' });
});

test('ViewModelPopularDocuments.validateConfig(config, _context): throws when limit is not a number', (t) => {
  t.throws(() => {
    ViewModelPopularDocuments.validateConfig({
      [ViewModelPopularDocuments.configKey]: {
        limit: '10',
      },
    });
  }, { message: 'Config Error: `limit` should be a number.' });
});

test('ViewModelPopularDocuments.validateConfig(config, _context): throws when key is not a string', (t) => {
  t.throws(() => {
    ViewModelPopularDocuments.validateConfig({
      [ViewModelPopularDocuments.configKey]: {
        key: 10,
      },
    });
  }, { message: 'Config Error: `key` should be a valid Object key string.' });
});


test('ViewModelPopularDocuments.validateConfig(config, _context): can validate', (t) => {
  t.notThrows(() => {
    ViewModelPopularDocuments.validateConfig({
      [ViewModelPopularDocuments.configKey]: {
        key: 'popularDocuments',
        limit: 10,
        ignore_slugs: ['home-page'],
      },
    });
  });
});

test('ViewModelPopularDocuments.callback(viewModel, context): does not fail when hooks are missing', async (t) => {
  t.plan(1);
  const viewModel = {};
  const output = await ViewModelPopularDocuments.callback(viewModel, { config, storageProvider });
  t.deepEqual(output, {
    popDocs: [],
  });
});

test('ViewModelPopularDocuments.callback(viewModel, context): does not fail when there are no popular documents', async (t) => {
  t.plan(1);
  const viewModel = {};
  const output = await ViewModelPopularDocuments.callback(viewModel, { config, hooks: { fetch: () => Promise.resolve(null) }, storageProvider });
  t.deepEqual(output, {
    popDocs: [],
  });
});

test('ViewModelPopularDocuments.callback(viewModel, context): adds an empty array when limit is less than 1', async (t) => {
  t.plan(1);
  const viewModel = {};
  const output = await ViewModelPopularDocuments.callback(viewModel, { config: { ...config, [ViewModelPopularDocuments.configKey]: { key: 'popDocs', limit: 0 } }, storageProvider });
  t.deepEqual(output, {
    popDocs: [],
  });
});

test('ViewModelPopularDocuments.callback(viewModel, context): can return popular documents', async (t) => {
  t.plan(1);
  const viewModel = {};
  const output = await ViewModelPopularDocuments.callback(viewModel, { config, hooks, storageProvider });
  t.deepEqual(output, {
    popDocs: [
      {
        updateDate: null,
        createDate: new Date('2019-04-20').toISOString(),
        slug: 'good-title',
      },
      {
        updateDate: new Date('2019-04-21').toISOString(),
        createDate: new Date('2019-04-21').toISOString(),
        slug: 'fake-title',
      },
    ],
  });
});
