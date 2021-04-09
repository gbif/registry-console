export function getMarkdown({ suggestion, original }) {
  let diff = {};
  Object.keys(suggestion)
    .filter(x => JSON.stringify(suggestion[x]) !== JSON.stringify(original[x]))
    .forEach(x => diff[x] = suggestion[x]);

  const lines = Object.keys(suggestion)
    .filter(x => JSON.stringify(suggestion[x]) !== JSON.stringify(original[x]))
    .map(x => {
      const s = suggestion[x];
      const o = original[x];
      return `**${x}**\n${getValue(o, true)}\n${getValue(s)}`;
    });
  let str = `<!--Please provide a reason for your change suggestion here-->




<!-- PLEASE DO NOT CHANGE ANYTHING BELOW
LEAVING IT INTACT WILL MAKE IT EASIER FOR US TO REVIEW IT -->

`;
  str += `[View changes in registry](${window.location.origin}${window.location.pathname}?suggestion=${encodeURIComponent(JSON.stringify(diff))})\n\n`;
  
  lines.forEach(x => str += `${x}\n\n`);

  str += '\n';

  return str;
}

function getValue(o, isDeleted) {
  let val = '';
  if (typeof o === 'undefined') {
    val = `_undefined_`;
    if (isDeleted) val = '~~' + val + '~~';
  } else if (isObj(o)) {
    val = `<pre><code>${isDeleted ? '<del>' : ''}${encode(JSON.stringify(o, null, 2))}${isDeleted ? '</del>' : ''}</code></pre>`;
  } else if (o.indexOf('\n') > -1) {
    val = `<pre><code>${isDeleted ? '<del>' : ''}${o}${isDeleted ? '</del>' : ''}</code></pre>`;
  } else {
    val = `\`${o}\``;
    if (isDeleted) val = '~~' + val + '~~';
  }
  return val;
}

function encode(rawStr) {
  return rawStr.replace(/[\u00A0-\u9999<>&]/g, function (i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
}

function isObj(o) {
  return typeof o === 'object' && o !== null;
}