import React, { useState, useEffect } from 'react';

// APIs
import { getInstitution } from '../../api/institution';

export default function InstitutionLink({ uuid, ...props }) {
  const [institution, setInstitution] = useState(uuid);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getInstitution(uuid);
      setInstitution(response.data);
    };

    fetchData();
  }, [uuid])

  return <a href={`/institution/${uuid}`} {...props}>{institution.name || uuid}</a>
}