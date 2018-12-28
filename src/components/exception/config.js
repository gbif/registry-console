/**
 * Default exceptions configuration
 * @type {{'500': {img: string, title: string, desc: string}, '403': {img: string, title: string, desc: string}, '404': {img: string, title: string, desc: string}}}
 */
const config = {
  403: {
    img: '../images/403.svg',
    title: '403',
    desc: 'Sorry, you don\'t have access to this page',
  },
  404: {
    img: '../images/404.svg',
    title: '404',
    desc: 'Sorry, the page you visited does not exist',
  },
  500: {
    img: '../images/405.svg',
    title: '500',
    desc: 'Sorry, the server is reporting an error',
  },
};

export default config;
