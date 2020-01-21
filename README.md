# GrawnMustache.js

A template package extended [mustache.js](https://github.com/janl/mustache.js) for providing Extension.

# Installation

Run the following command.

    npm i grown-mustache

# Preparation

Load the package as follows.

    const GrownMustache = require('GrownMustache');

# Usage

## Basic usage

The basic usage is the same with `mustache.js`.

    const gm = new GrownMustache({
        dir: './views',   // Optional
        extension: 'mst'  // Optional
    });

    gm.render('index', {
        message: 'Message'
    });

***Note:***  
`index` means `./views/index.mst` in this case.  
Or you also can use absolute path like `/home/your/path/to/template/index.mst` instead.

## Extension

This feature is inspired by [Blade](https://laravel.com/docs/6.x/blade).  
As such, the usage is very similar.

First, create a layout file called `layouts/app.mst` in this case.

    <!DOCTYPE html>
    <html lang="ja">
      <head>
        @yield('title')
      </head>
      <body>
        <div id="app">
          @yield('content')
        </div>
      </body>
    </html>

Secondally, create a main file called `index.mst`.

    @extends('layouts/app')

    @section('title')

      <title>{{ title }}</title>

    @stop

    @section('content')

      <h1>YOUR HEADING</h1>
      <div id="app">
          {{ message }}
      </div>

    @stop

***Note:***  
Of course, you can use "mustache" symbolizing `{{ *** }}` in both of the files.

Finally, call `render()` as follows.

    gm.render('index', {
        title: 'Test title',
        message: 'Test message'
    });

# Set parameter

You can use `set()` to set parameter(s) replacing with `{{ *** }}`.

    gm.set('key1', 'value1');

or with object.

    gm.set({
      key2: 'value2',
      key3: 'value3'
    });

# Use in Express app

## Basic usage in Express.js

`GrownMustache` has a callback function for Express.  
Use it as follows.

    const GrownMustache = require('GrownMustache');

    // Template
    app.engine('mst', GrownMustache.express());
    app.set('views', './views');
    app.set('view engine', 'mst');

## with Callback

`express()` can receive a callback function as the first argument.  
It will be called before rendering.

    app.engine('mst', GrownMustache.express((gm, path, options) => {

      gm.set({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
      });
      return gm; // must

    }));

# License

This package is licensed under the MIT License.  
Copyright 2020 Sukohi Kuhoh
