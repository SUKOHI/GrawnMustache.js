const GrownMustache = require('../GrownMustache');

const gm = new GrownMustache({
    dir: './views',
    extension: 'mst'
});

gm.set('key1', 'value1');
gm.set({
  key2: 'value2',
  key3: 'value3'
});

const content = gm.render('index', {
  message: 'Message'
});

console.log(content);
