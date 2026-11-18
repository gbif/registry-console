/* eslint-disable no-script-url */ // these tests check that script URLs are not linked
import { safeHref } from './helpers';

describe('safeHref', () => {
  it('allows http and https URLs', () => {
    expect(safeHref('https://www.gbif.org/')).toBe('https://www.gbif.org/');
    expect(safeHref(' http://example.org/path?q=1 ')).toBe('http://example.org/path?q=1');
  });

  it('links host names without a scheme as http', () => {
    expect(safeHref('www.example.org')).toBe('http://www.example.org/');
    expect(safeHref('example.org:8080/path')).toBe('http://example.org:8080/path');
  });

  it('rejects other schemes', () => {
    expect(safeHref('javascript:void(0)')).toBeUndefined();
    expect(safeHref('java\tscript:void(0)')).toBeUndefined();
    expect(safeHref('data:text/html,hello')).toBeUndefined();
    expect(safeHref('javascript:www.example.org')).toBeUndefined();
    expect(safeHref('example.org:void(0)')).toBeUndefined();
  });

  it('leaves numbers, relative paths and other text unlinked', () => {
    // "10.5.3" would otherwise be read as the IP address 10.5.0.3
    expect(safeHref('10.5.3')).toBeUndefined();
    expect(safeHref('3.14')).toBeUndefined();
    expect(safeHref('localhost')).toBeUndefined();
    expect(safeHref('//example.org')).toBeUndefined();
  });

  it('rejects URLs with a user name or password', () => {
    expect(safeHref('https://www.gbif.org@other.example/')).toBeUndefined();
    expect(safeHref('www.gbif.org@other.example')).toBeUndefined();
  });

  it('rejects empty and non-string values', () => {
    expect(safeHref('')).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref(['https://example.org'])).toBeUndefined();
  });
});
