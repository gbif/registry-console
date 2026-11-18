import DOMPurify from 'dompurify';

// Descriptions are formatted text. Classes, styles, ids, popovers and form controls are removed so a description
// can't pick up the console's global antd styles or show up outside its box. ShowMoreContent's container clips the rest.
const CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
  FORBID_ATTR: ['style', 'class', 'id', 'popover']
};

// Links open in a new tab without access to the console window, like the console's other external links.
DOMPurify.addHook('afterSanitizeAttributes', node => {
  if (node.hasAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/** Clean stored HTML (e.g. dataset and collection descriptions) before it is rendered. */
export const sanitizeHtml = html => DOMPurify.sanitize(html || '', CONFIG);
