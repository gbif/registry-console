let fs = require('fs');
let chokidar = require('chokidar');
let MarkdownIt = require('markdown-it');
let _ = require('lodash');
let dir = __dirname + '/../public/_translations/';

let md = new MarkdownIt();
// // which fields to parse as markdown. We need to know which fields anyhow as we won't show everything as html
let markdownFields = [
  'help.commentContent',
  'syncState.about',
  'overingested.about',
  'ingestion.about'
];

function save(o, name) {
  fs.writeFile(dir + name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation files was succesfully build');
  });
}

function updateFile(path) {
  let fileName = getLocale(path);
  // Removing file from cache to guarantee loading actual data
  delete require.cache[require.resolve(`../locales/${fileName}`)];
  let translation = require(`../locales/${fileName}`);
  let htmlTranslation = _.mapValues(translation, (value, key) => markdownFields.includes(key) ? md.render(value) : value);
  save(htmlTranslation, fileName);
}

function removeFile(path) {
  let fileName = getLocale(path);
  fs.unlink(dir + fileName, (err) => {
    if (err) throw err;
    console.log(dir + fileName, 'was deleted');
  });
}

function getLocale(path) {
  return path.replace(/locales\\/g, '');
}

const watcher = chokidar.watch('./locales', { persistent: true });

watcher
  .on('add', updateFile)
  .on('change', updateFile)
  .on('unlink', removeFile)
  .on('error', function (error) {
    console.error('Error happened', error);
  });