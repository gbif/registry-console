# Registry Console localization

## How does it work
* Library **React Intl**
* API
* Localization files
* Scripts

### Library
App uses [React Intl](https://github.com/yahoo/react-intl) library to manage support of multi languages.

### API
Locale API located in `/src/api/locale/` folder:
* `getMessages` - loads localisation for active language
* `List of rtl languages` - contains languages that support right-to-left direction
* `isRtlLocale` - returns true if active language supports right-to-left direction

### Scripts
There are 2 scripts which work with localisation:
* `npm build:locale` - watching `/locales/` folder and generates files for the app to `/public/_translations/` folder
* `npm mock:locales` - creates mock localisation files from *en.json* to *ar-mock.json* and *en-mock.json*. Good to use mock files to check if all key:value pares for English were added and that app works good with other languages too.

### Localization files
There are 2 places in the app with localization: `/locales/` and `/public/_translations/`.
* `/locales/` - you should work with localization files only here (creating/removing/editing files). You can use markdown there and it will be translated to HTML automatically
* `/public/_translations/` - **App uses these files**. They will be generated automatically after you launch `npm build:locale` command.

Usually, you should launch `npm build:locale` command after you started the project in the DEV mode - it works in a watch mode and will updated 
localisation files in public folder every time you change something.

### How to add new language
To add new language you should do several things:
1. Add new valid JSON file with appropriate name (e.g. `ru.json` for Russian language, because code of language is `ru`)
2. Add localisation data (key:value pairs)
3. Add new language to the component responsible for language selection by user `/src/components/Layout/SelectLang/index.js`:
    * open the file
    * find array `languages` in the constructor
    * add new object to the array with fields:
        * `key` - should be the same as file name without extension
        * `code` - language code (usually, the same as `key`)
        * `name` - language name which will be displayed to the user (usually in the same language, not in English)
4. Launch `npm build:locale` if it has not been launched before
5. Check the result - if everything was done right, you would found new file in `/public/_translations/` folder with the same name
6. Check that you can see added language in the language dropdown in browser