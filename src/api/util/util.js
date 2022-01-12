export async function eachLimit(collection, limit, iteratorFunction) {
  let index = 0;
  while (index < collection.length) {
    await Promise.all(collection.slice(index, index + limit).map(iteratorFunction))
    index += limit;
  }
  return collection
}

export function removeEmptyStrings(item = {}) {
  for (const [key, value] of Object.entries(item)) {
    if (value === '' || typeof value === 'undefined' || value === null) delete item[key];
  }
  return item;
}