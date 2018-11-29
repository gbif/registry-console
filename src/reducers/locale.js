import {
  LOCALE_SET,
  LOCALE_LOADING
} from '../actions/locale'

import fr_FR from 'antd/lib/locale-provider/fr_FR';
import 'moment/locale/fr';
// setup mapping between ant locales and react-intl locales
const antLocales = {
  'da-DK': fr_FR
}

export default function (state = { locale: 'en', loading: false }, action) {
  switch (action.type) {
    case LOCALE_SET:
      return {...state, ...action.locale, antLocale: antLocales[action.locale.locale] }
    case LOCALE_LOADING:
      return {...state, loading: action.locale.loading }
    default:
      return state
  }
}