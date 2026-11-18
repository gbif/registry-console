import { sanitizeHtml } from './sanitizeHtml';

// These test our own config. The rest is DOMPurify's job.
describe('sanitizeHtml', () => {
  it('keeps ordinary formatting, tables, images and plain text', () => {
    const html = '<p>Some <b>bold</b> and a list</p><ul><li>one</li></ul><table border="1"><tbody><tr><td>cell</td></tr></tbody></table><img src="https://example.org/a.png" alt="a">';
    expect(sanitizeHtml(html)).toBe(html);
    expect(sanitizeHtml('line one\nline two & more')).toBe('line one\nline two & more');
  });

  it('removes event handlers', () => {
    expect(sanitizeHtml('<img src="x" onerror="x()">')).not.toMatch(/onerror/i);
  });

  it('opens links and image map links in a new tab without access to the console window', () => {
    const html = '<a href="https://example.org" target="_self" rel="opener">x</a><map name="m"><area href="https://example.org" shape="default"></map>';
    const doc = new DOMParser().parseFromString(sanitizeHtml(html), 'text/html');
    doc.querySelectorAll('a, area').forEach(link => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
    expect(doc.querySelectorAll('a, area')).toHaveLength(2);
  });

  it('removes classes, styles, ids, popovers and form controls', () => {
    const html = '<div class="ant-modal-wrap" id="p" popover style="position:fixed">x</div><style>body{display:none}</style>'
      + '<form action="https://other.example"><input name="password"><button>Log in</button></form>';
    expect(sanitizeHtml(html)).not.toMatch(/class=|id=|popover|style|<form|<input|<button/i);
  });

  it('returns an empty string for missing content', () => {
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml(null)).toBe('');
  });
});
