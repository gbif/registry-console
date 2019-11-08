export const eachLimit = async (collection, limit, iteratorFunction) => {
  let index = 0;
  while (index < collection.length) {
    await Promise.all(collection.slice(index, index + limit).map(iteratorFunction))
    index += limit;
  }
  return collection
}