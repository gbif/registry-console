import { useCallback, useState, forwardRef, useEffect } from "react";
import { suggestConcept } from "../../api/vocabulary";
import FilteredSelectControl from "./FilteredSelectControl";
import { getLocalizedConceptValue } from "./ConceptValue";

const VocabularySelect = forwardRef(({ vocabulary, ...props }, ref) => {
  const [results, setResults] = useState([]);
  const [fetching, setFetching] = useState(false);

  const handleSearch = useCallback(async value => {
    setFetching(true);
    const request = suggestConcept(vocabulary, { q: value, limit: 500 }); // could set locale, but there is no fallback provided so it just removed all suggestions wihtout a translation. that is of no use
    request.then(({ data }) => {
      data.forEach(element => {
        element.key = element.name; // for reasons that I do not understand the key cannot be used for anything updates, but you have to provide the name. The name is essentially the key in this API, just not named as such
      });
      setResults(data);
      setFetching(false);
    }).catch(() => {
      // ignore errors
      setFetching(false);
    });
    // Specify how to clean up after this effect:
    return function cleanup() {
      request.cancel();
    };
  }, [vocabulary]);

  useEffect(() => {
    handleSearch('');// initial search
  }, []);

  return <FilteredSelectControl
    ref={ref}
    search={handleSearch}
    renderItem={concept => {
      const conceptName = getLocalizedConceptValue(concept.labels, 'en', concept.name);
      // const conceptDescription = getLocalizedConceptValue(concept.definitions, 'en', ''); // definitions not included in suggest endpoint
      return <div>{conceptName}
      </div>
    }}
    fetching={fetching}
    items={results}
    delay={1000}
    {...props}
  />
});

export default VocabularySelect;