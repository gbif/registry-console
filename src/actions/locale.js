import localeApi, { LOCALE_STORAGE_NAME } from '../api/locale';
import { addError } from './errors';

export const LOCALE_SET = 'LOCALE_SET';
export const LOCALE_LOADING = 'LOCALE_LOADING';

export const setLocale = ({ locale, messages }) => ({
  type: LOCALE_SET,
  locale: { locale, messages, loading: false }
});

export const loadingLocale = loading => ({
  type: LOCALE_LOADING,
  locale: { loading }
});

export const changeLocale = locale => async (dispatch, getState) => {
  if (locale) {
    dispatch(loadingLocale(true));
    localStorage.setItem(LOCALE_STORAGE_NAME, locale);

    localeApi.getMessages(locale)
      .then(res => {
        dispatch(setLocale({ locale, messages: res.data }));
      })
      .catch(err => {
        dispatch(addError(err.response));
      });
  }
};
