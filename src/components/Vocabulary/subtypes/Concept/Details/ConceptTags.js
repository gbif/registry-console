import React, { useState, useEffect } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import {Tooltip, Row, Col, Tag, Select, Button, Icon} from "antd"
import { NavLink } from "react-router-dom";
import _ from "lodash";
// APIs
import {
  getConceptTags,
  addConceptTag,
  removeConceptTag
} from "../../../../../api/vocabulary";
import {
    searchVocabularyTags
  } from "../../../../../api/vocabularyTag";
import withContext from "../../../../hoc/withContext";

const {Option} = Select;
const ConceptTags = ({ vocabulary, concept, onSubmit, addError, addSuccess, editMode }) => {
 

  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null)
  const [fetching, setFetching] = useState(false);
  const [conceptTags, setConceptTags] = useState(concept.tags ? [...concept.tags] : [])

  useEffect(() => {
    const fetchData = async () => {
      const result = await searchVocabularyTags({ q: "" });
      setTags(result.data.results || []);
    };
 
    fetchData();
  }, []);

  const handleTagSearch = (value) => {
    setFetching(true);
    searchVocabularyTags({ q: value }).then((response) => {
      const data = _.get(response, "data.results[0]")
        ? response.data.results
        : [];
        setTags(data);
      setFetching(false);
    });
  };
  
  const getTagsForConcept = () => {
    getConceptTags(vocabulary.name, concept.name)
    .then((res) => {
        setConceptTags(res.data)
        
    })
  }
 
  const submit = (tagName) => {
    setSaving(true)
    return addConceptTag(vocabulary.name, concept.name, {tagName})
        .then(()=> {
            setSaving(false)
            if(typeof onSubmit === 'function'){
                onSubmit()
            };
            getTagsForConcept()
        })
        .catch((error) => {
            setSaving(false)
          if (addError) {
            addError({
              status: error.response.status,
              statusText: error.response.data,
            });
          }
        });
  } 

  const removeTag = tagName => {
    return removeConceptTag(vocabulary.name, concept.name, tagName)
    .then(()=> {
        setSaving(false)
        if(typeof onSubmit === 'function'){
            onSubmit()
        };
        getTagsForConcept()
    })
    .catch((error) => {
        setSaving(false)
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
        <Col span={16}>
        {conceptTags.length > 0 && conceptTags.map(t => <Tooltip title={t.description}><Tag closable={editMode} onClose={() => removeTag(t.name)} key={t.name} color={t.color}>{t.name}</Tag></Tooltip>)}
        {conceptTags.length === 0 && "No tags"}      
        </Col>
        <Col span={8}>
        {editMode && <React.Fragment><Select
        placeholder="Add tag"
        loading={saving || fetching}
        value={selectedTag}
        style={{width: 140}}
        showSearch
        onChange={val => {
            setSelectedTag(val)
            submit(val).then(() => setSelectedTag(null))
        }}
        onSearch={handleTagSearch}>
            {tags.map(t => <Option  key={t.name}>
                <Tag  color={t.color}>{t.name}</Tag>
            </Option>)}
        </Select>
        <NavLink to={{
            pathname: "/vocabularyTags"
        }}>
        <Button type="link" > 
            <Icon type="plus" /> Create new tag</Button>
            </NavLink>
        </React.Fragment>}      
    </Col> 
  </Row>
    
  );
};

const mapContextToProps = ({ addError, addSuccess }) => ({
    addError,
    addSuccess
  });
export default withContext(mapContextToProps)(ConceptTags);


    