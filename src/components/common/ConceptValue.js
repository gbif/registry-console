import React, { useEffect, useState } from 'react';
import injectSheet from 'react-jss';
import { getConcept } from '../../api/vocabulary';
import { Tooltip } from 'antd';

const styles = {

};

/**
 * Component will show given content only partially
 * If the content is too high, component will render "Show More" button
 */
const ConceptValue = ({ vocabulary, name }) => {
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState();

  useEffect(() => {
    setLoading(true);
    const request = getConcept(vocabulary, name);
    request.then(({ data }) => {
      setConcept(data);
      setLoading(false);
    }).catch(() => {
      // ignore errors
      setLoading(false);
    });
    // Specify how to clean up after this effect:
    return function cleanup() {
      request.cancel();
    };
  }, [vocabulary, name]);

  if (loading) return <>Loading</>;
  if (!concept) return <>Uknown</>;

  const conceptName = getLocalizedValue(concept.label, 'en', concept.name);
  const conceptDescription = getLocalizedValue(concept.definition, 'en', '');

  return (<>
    <Tooltip placement="top" title={conceptDescription}>
      {conceptName}
    </Tooltip>
  </>
  );
}

export default injectSheet(styles)(ConceptValue);

function getLocalizedValue(values, preferredLanguage, fallbackValue) {
  if (!Array.isArray(values) || !values || values.length === 0) return fallbackValue;
  const preferredValue = values.find(v => preferredLanguage == v.language);
  const englishValue = values.find(v => v.language === 'en');
  return preferredValue?.value || englishValue?.value || fallbackValue;
}

/*
example response from the API for a given concept:

{
"key": 2766,
"name": "ForProfit",
"externalDefinitions": [],
"editorialNotes": [],
"created": "2024-04-09T10:48:28.278753",
"createdBy": "mgrosjean",
"modified": "2024-04-11T13:10:21.04724",
"modifiedBy": "mhoefft",
"vocabularyKey": 137,
"definition": [
{
"key": 376,
"language": "en",
"value": "this institution is in it for the money - big money",
"createdBy": "mhoefft",
"created": "2024-04-11T13:10:05.985211",
"modifiedBy": "mhoefft",
"modified": "2024-04-11T13:10:05.985211"
}
],
"label": [
{
"key": 1731,
"language": "en",
"value": "For profit",
"createdBy": "mhoefft",
"created": "2024-04-11T13:09:45.016927"
}
],
"sameAsUris": [],
"tags": [],
"alternativeLabelsLink": "https://api.gbif-dev.org/v1/vocabularies/InstitutionalGovernance/concepts/ForProfit/alternativeLabels",
"hiddenLabelsLink": "https://api.gbif-dev.org/v1/vocabularies/InstitutionalGovernance/concepts/ForProfit/hiddenLabels"
}
*/