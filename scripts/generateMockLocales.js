let fs = require('fs');
let pseudoloc = require('pseudoloc');
let dir = __dirname + '/../public/_translations/';
let _ = require('lodash');
let en = require('../public/_translations/en.json');
let arabString = 'رفياوض';

function getMockText(str, language) {
  if ((str.indexOf('{') !== -1) || (str.indexOf('%s') !== -1)) {
    return '[[[!' + str + '!]]]';
  } else {
    if (language === 'ar-mock') {
      return mockArab(str);
    } else {
      return pseudoloc.str(str);
    }
  }
}

function mockArab(str) {
  return generateMockString(arabString, str);
}

function generateMockString(letters, str) {
  let parts = str.split(' ');
  let s = '';
  parts.forEach(function (e) {
    s += generateMockSection(letters, e) + ' ';
  });
  s.trim();
  return s;
}

function generateMockSection(letters, str) {
  let length = str.length;
  let s = '';
  for (let i = 0; i < length; i++) {
    if ('(){}[]'.indexOf(str[i]) !== -1) {
      s += str[i];
    } else {
      let nr = Math.floor(Math.random() * 6);
      let letter = letters[nr];
      s += letter;
    }
  }
  return s;
}

function save(o, name) {
  fs.writeFile(dir + name + '.json', JSON.stringify(o, null, 2), function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Translation files was succesfully build');
  });
}

let translatedMockEn = _.mapValues(en, function (value, key, obj) {
  return getMockText(value, 'en-mock');
});
let translatedMockAr = _.mapValues(en, function (value, key, obj) {
  return getMockText(value, 'ar-mock');
});

save(translatedMockEn, 'en-mock');
save(translatedMockAr, 'ar-mock');