import localeApi from '../api/locale';

export const LOCALE_SET = 'LOCALE_SET'
export const LOCALE_LOADING = 'LOCALE_LOADING'

export const setLocale = ({locale, messages}) => ({
    type: LOCALE_SET,
    locale: { locale, messages, loading: false }
})

export const loadingLocale = loading => ({
    type: LOCALE_LOADING,
    locale: { loading }
})

export const changeLocale = locale => async (dispatch, getState) => {
    if (locale) {
        dispatch(loadingLocale(true))
        localStorage.setItem('locale', locale)
        const messages = await localeApi.getMessages(locale)
        dispatch(setLocale({locale, messages}))
    }
}
