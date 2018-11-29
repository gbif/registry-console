import { JWT_STORAGE_NAME } from '../user'

export default function setHeaders(headers = {}) {
    const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
    if (jwt) {
        return {
            ...headers,
            'Authorization': `Bearer ${jwt}`
        }
    } else {
        return headers;
    }
}