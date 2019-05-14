/*
Create a hash for each translation json and save them in a map. This map can then be included in the build so the client knows what version to ask for. 
This allows for caching the translation file and busting when required on a per locale level.
*/
let fs = require('fs');
let dir = __dirname + '/../public/_translations/';
let dirOut = __dirname + '/../src/__locales__/';
var hash = require('object-hash');
let versionMap = {};

function save(o, name) {
  fs.writeFile(dirOut + name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation versions was hashed correctly');
  });
}

// read each file in sync
fs.readdirSync(dir).forEach(file => {
  let locale = file.substr(0, file.length - 5);
  versionMap[locale] = hash(require(dir + file));
});

//save the version map
save(versionMap, 'versions.json');