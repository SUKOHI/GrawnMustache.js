const GrownMustache = require('../GrownMustache');

const gm = new GrownMustache({
    dir: './views',
    extension: 'mst'
});
const content = gm.render('index', {
  message: 'Message'
});

console.log(content);
