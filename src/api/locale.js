const rtlLocale = {
  'ar': true,
  'dv': true,
  'he': true,
  'ku': true,
  'fa': true,
  'ur': true
};

function getMessages(locale) {
  return fetch(`/_translations/${locale}.json`).then(response => response.json());
}

// Currently no support for rtl in Ant https://github.com/ant-design/ant-design/issues/4051
function isRtlLocale(locale) {
  return Boolean(rtlLocale[locale]);
}

export default {
  getMessages: getMessages,
  isRtlLocale: isRtlLocale
}