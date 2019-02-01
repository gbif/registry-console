let fs = require('fs');
let MarkdownIt = require('markdown-it');
let _ = require('lodash');
let dir = __dirname + '/../public/_translations/';
let locales = ['en', 'da'];

let md = new MarkdownIt();

// which fields to parse as markdown. We need to know which fields anyhow as we won't show everything as html
let markdownFields = [
  'help.commentContent'
];

function save(o, name) {
  fs.writeFile(dir + name + '.json', JSON.stringify(o, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation files was succesfully build');
  });
}

locales.forEach(locale => {
  let translation = require(`../locales/${locale}`);
  let htmlTranslation = _.mapValues(translation, (value, key) => markdownFields.includes(key) ? md.render(value) : value);
  save(htmlTranslation, `${locale}`)
});