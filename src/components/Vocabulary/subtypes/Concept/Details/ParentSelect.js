import React, { useState } from "react";
import { FilteredSelectControl } from "../../../../common";
import { FormattedMessage } from "react-intl";
import {Button, Row, Col} from "antd"
import _ from "lodash";
// APIs
import {
  updateConcept,
  searchConcepts,
} from "../../../../../api/vocabulary";

const ParentSelect = ({ vocabulary, concept, onSubmit, addError }) => {
  const [parentKey, setParentKey] = useState(
    concept.parents ? concept.parents[0].toString() : undefined
  );

  const [saving, setSaving] = useState(false);
  const [parents, setParents] = useState([]);
  const [fetching, setFetching] = useState(false);
  const handleParentSearch = (value) => {
    if (!value) {
      setParents([]);
      return;
    }

    setFetching(true);

    searchConcepts(vocabulary.name, { q: value }).then((response) => {
      const data = _.get(response, "data.results[0]")
        ? response.data.results.map((r) => ({
            ...r,
            disabled:
              concept && (r.parentKey === concept.key || r.key === concept.key),
          }))
        : [];
      setParents(data);
      setFetching(false);
    });
  };

  const submit = () => {
    setSaving(false)
    updateConcept(vocabulary.name, {
        ...concept,
        parentKey,
      })
        .then(()=> {
            setSaving(false)
            onSubmit()
        })
        .catch((error) => {
          if (addError) {
            addError({
              status: error.response.status,
              statusText: error.response.data,
            });
          }
        });
  }
    

  return (
    <Row type="flex" justify="space-between" >
    <Col xs={16} sm={16} md={16}>
    <FilteredSelectControl
      placeholder={
        <FormattedMessage
          id="select.parent"
          defaultMessage="Select a parent concept"
        />
      }
      value={parentKey}
      onChange={setParentKey}
      search={handleParentSearch}
      fetching={fetching}
      items={[{ key: null, name: "No parent" }, ...parents]}
      titleField="name"
      delay={300}
      style={{
        
      width: "100%"}}
      
    />
    </Col>
    <Col  className="text-right">
    <Button type="primary"
        onClick={submit}
        loading={saving}
      style={{ marginLeft: "10px" }}>Save</Button>
    </Col>
  </Row>
    
  );
};

export default ParentSelect;


    