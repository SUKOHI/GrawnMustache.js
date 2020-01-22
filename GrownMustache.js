const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

class GrownMustache {

  constructor(options = {}) {

    this.dir = (options.dir !== undefined) ? options.dir : '';
    this.extension = (options.extension !== undefined) ? options.extension : 'mst';
    this.parameters = {};

  }

  render(path, params = []) {

    this.set(params);
    const rawContent = this.getFileContent(path);
    const lines = rawContent.split("\n");
    let renderedContent = '',
        extensionPath = '',
        sectionKey = '',
        sectionLines = [],
        sections = {};


    for(let rawLine of lines) {

      const line = rawLine.toLowerCase().replace(/[\s"']/g, '');
      const extentionMatches = line.match(/^@extends\(([a-z0-9\/]+)\)/);

      if(extentionMatches) {

        extensionPath = extentionMatches[1];
        continue;

      }

      const sectionMatches = line.match(/^@section\(([a-z0-9]+)\)/);

      if(sectionMatches) {

        sectionKey = sectionMatches[1];
        continue;

      }

      if(sectionKey !== '') {

        if(line === '@stop') {

          sections[sectionKey] = sectionLines.join("\n");
          sectionKey = '';
          sectionLines = [];
          continue;

        }

        sectionLines.push(rawLine);

      }

    }

    if(extensionPath !== '') {

      const extensionContent = this.getFileContent(extensionPath);
      const lines = extensionContent.split("\n");

      for(let i in lines) {

        let line = lines[i];
        const matches = line.match(/@yield\(["']?([a-z0-9]+)["']?\)/);

        if(matches) {

          const sectionKey = matches[1];
          const target = matches[0];
          const replacement = (sections[sectionKey] !== undefined) ? sections[sectionKey] : '';
          line = line.replace(target, replacement);

        }

        lines[i] = line;

      }

      renderedContent = lines.join("\n");

    } else {

      renderedContent = rawContent;

    }

    return mustache.render(
      this.getConvertedText(renderedContent),
      this.parameters
    );

  }

  set(values) {

    if(arguments.length === 2) {

      const key = arguments[0];
      const value = arguments[1];
      values = { [key]: value };

    }

    for(let key in values) {

      this.parameters[key] = values[key];

    }

  }

  // Getter
  getFilePath(filePath) {

    const fullDir = path.resolve(this.dir);

    if(filePath.startsWith(fullDir) && filePath.endsWith(this.extension)) {

      return filePath;

    }

    return this.dir +'/'+ filePath +'.'+ this.extension;

  }

  getFileContent(path) {

    const filePath = this.getFilePath(path);
    return fs.readFileSync(filePath, 'utf8');

  }

  getConvertedText(text) {

    text = this.getIncludedText(text);
    text = this.getRawConvertedText(text);
    return text;

  }

  getRawConvertedText(text) {

    return text.replace(/@(\{\{[^\}]+\}\})/g, (matches, rawText) => {

      return '{{=<% %>=}}'+ rawText +'<%={{ }}=%>';

    });

  }

  getIncludedText(text) {

    return text.replace(/@include\(\s*["']?([a-zA-Z0-9\/]+)\s*["']?\)/g, (matches, path) => {

      return this.getFileContent(path);

    });

  }

  // Static
  static express(beforeRendering) {

    return (path, options, callback) => {

      try {

        const settings = options.settings;
        let gm = new GrownMustache({
          dir: settings.views,
          extension: settings['view engine']
        });

        if(typeof beforeRendering === 'function') {

          gm = beforeRendering(gm, path, options);

        }

        const content = gm.render(path, options);
        return callback(null, content);

      } catch(error) {

        return callback(error);

      }

    };

  }

}

module.exports = GrownMustache;
