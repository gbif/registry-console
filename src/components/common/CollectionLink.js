import React, { useState, useEffect } from 'react';

// APIs
import { getCollection } from '../../api/collection';

export default function CollectionLink({ uuid, ...props }) {
  const [collection, setCollection] = useState(uuid);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCollection(uuid);
      setCollection(response.data);
    };

    fetchData();
  }, [uuid])

  return <a href={`/collection/${uuid}`} {...props}>{collection.name || uuid}</a>
}