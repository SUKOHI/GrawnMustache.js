const express = require('express');
const app = express();
const GrownMustache = require('../GrownMustache');

// Template
app.engine('mst', GrownMustache.express(gm => {

  gm.set({
    key1: 'value1',
    key2: 'value2',
    key3: 'value3'
  });
  return gm; // must

}));
app.set('views', './tests/views');
app.set('view engine', 'mst');

app.get('/', (req, res) => {

  res.render('index', {
    message: 'テストメッセージ'
  });

});
app.listen(11111);
