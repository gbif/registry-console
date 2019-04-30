# Registry Console localization

## How does it work
* Library **React Intl**
* API
* Localization files
* Scripts

### Library
App uses [React Intl](https://github.com/yahoo/react-intl) library to manage support of multi languages.

### API
Locale API located in [locale.js](./src/api/locale.js) file:
* [getMessages](./src/api/locale.js#L14) - loads localisation for active language
* [List of rtl languages](./src/api/locale.js#L5) - languages with right-to-left direction
* [isRtlLocale](./src/api/locale.js#L20) - returns true if active language supports right-to-left direction

### Scripts
There are 2 scripts which work with localisation:
* `npm build:locale` - watching [/locales/](./locales) folder and generates files for the app to [public/_translations](./public/_translations) folder
* `npm mock:locales` - creates mock localisation files from *en.json* to *ar-mock.json* and *en-mock.json*. Good to use mock files to check if all key:value pares for English were added and that app works good with other languages too.

### Localization files
There are 2 places in the app with localization: [/locales/](./locales) and [/public/_translations/](./public/_translations).
* [/locales/](./locales) - you should work with localization files only here (creating/removing/editing files). You can use markdown there and it will be translated to HTML automatically
* [/public/_translations/](./public/_translations) - **App uses these files**. They will be generated automatically after you launch `npm build:locale` command.

Usually, you should launch `npm build:locale` command after you started the project in the DEV mode - it works in a watch mode and will updated 
localisation files in public folder every time you change something.

### How to add new language
To add new language you should do several things:
1. Create new valid JSON file with appropriate name (e.g. `ru.json` for Russian language, because [ISO](https://en.wikipedia.org/wiki/ISO_639) code of language is `ru`) in [/locales/](./locales) folder
2. Add localisation data (key:value pairs)
3. Add new language to the [component](./src/components/Layout/SelectLang/index.js) responsible for language selection by user:
    * open the file
    * find array `languages` in the constructor
    * add new object to the array with fields:
        * `key` - should be the same as file name without extension
        * `code` - language code (usually, the same as `key`)
        * `name` - language name which will be displayed to the user (usually in the same language, not in English)
4. Add an import of required localisation for React Intl at the top of [App.js](./src/components/App.js#L10). 
5. Set it as a member of an array for method [addLocaleData](./src/components/App.js#L47). Library will use it to localize dates, numbers, date pickers, etc.
6. Launch `npm build:locale` if it has not been launched before
7. Check the result - if everything was done right, you would found new file in [/public/_translations/](./public/_translations) folder with the same name
8. Check that you can see added language in the language dropdown in browser

## Country, area and island codes (ISO 3166)

To update these codes based on the values in the GBIF Registry, use:

```
curl -fSs https://api.gbif.org/v1/enumeration/country | jq '.[] | {("country."+.iso2): .title}' | grep country | sort
```

and replace the values in [/locales/en.json](./locales/en.json).
