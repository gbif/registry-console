import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import _ from "lodash";
// APIs
import {  getConceptsTree } from '../../../api/vocabulary';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
// Wrappers
import { HasRole, roles } from '../../auth';

// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import ConceptForm from './Concept/Details/ConceptForm';
import {DefinitionListTemplate} from './Item/ListTemplates'

const renderDefinition = (record, preferredLanguages) => {
  if(!record.definition || _.isEmpty(record.definition)){
    return "";
  } else {
    let definitionLanguage;
    if(_.get(preferredLanguages, "[0]") && record.definition.find(({ language }) => language == _.get(preferredLanguages, "[0]"))){
      definitionLanguage = _.get(preferredLanguages, "[0]")
    } else if(record.definition.find(({ language }) => language == "en")){
      definitionLanguage = "en"
    } else if(record.definition && record.definition.length > 0) {
      definitionLanguage = record.definition[0].language
    }

    if (definitionLanguage) {
      let definition = record.definition.find(({ language }) => language == definitionLanguage);
      return <DefinitionListTemplate item={{key: definition.key, language: definitionLanguage, value:  definition.value}}/>;
    }
    return "";
  }
  
}

class ConceptList extends React.Component {
                         
  constructor(props) {
    super(props)
    this.state  = { isModalVisible: false,
      columns : [
        {
          title: <FormattedMessage id="name" defaultMessage="Name"/>,
          dataIndex: 'name',
          width: "30%",
          render: (text, record) =>  <Link disabled={!!record?.deprecated } to={`/vocabulary/${this.props.vocabulary.name}/concept/${record.name}`}>{text}</Link>
        },
         {
          title: <FormattedMessage id="definition" defaultMessage="Definition"/>,
          dataIndex: 'definition',
          render: (text, record) => renderDefinition(record, this.props.preferredLanguages)
        } 
      ] };
  }
  

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  handleDeprecate = concept => this.props.deprecateConcept(this.props.vocabulary.name, concept);;

  handleRestore = concept => this.props.restoreConcept(this.props.vocabulary.name, concept);;



  render() {
    const { isModalVisible, columns, expandedRowKeys } = this.state;
    const { parent, vocabulary, initQuery = { limit: 250, offset: 0, includeChildrenCount: true }, updateCounts } = this.props;

    return (
      <React.Fragment>

        <Row type="flex" justify="space-between">
          <Col span={20}>
            <h2>
             {parent ? <FormattedMessage id="vocabularyChildConcepts" defaultMessage="Child concepts"/> : <FormattedMessage id="vocabularyConcepts" defaultMessage="Concepts"/>}
            </h2>
          </Col>
          <Col span={4} className="text-right">
            <HasRole roles={[roles.VOCABULARY_ADMIN]}>
              {!vocabulary.deprecated && (
                
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="add" defaultMessage="Add"/>
                </Button>
              )}
            </HasRole>
          </Col>
        </Row>
        <DataQuery
          api={query => {
          return  getConceptsTree(vocabulary.name, query)
      .then(res => {
        updateCounts('concepts', res.data._unNestedCount)
        this.setState({expandedRowKeys: res.data._keys})
        return res;
      })
          }}
          initQuery={initQuery}
          render={props => <React.Fragment>
            <DataTable {...props} expandedRowKeys={expandedRowKeys} onExpandedRowsChange={(keys) => this.setState({expandedRowKeys: keys})} noHeader={true} columns={columns.concat({
      width: "5%",
      render: (text, record) => (
        !!record?.deprecated ? <ConfirmButton
        title={<FormattedMessage
          id="restore.confirmation.concept"
          defaultMessage="Are you sure to restore this concept?"
        />}
        onConfirm={() => this.handleRestore(text).then(()=>props.fetchData(initQuery))}
        iconType={'undo'}
        type={'icon'}
      /> : <ConfirmButton
          title={<FormattedMessage
            id="deprecate.confirmation.concept"
            defaultMessage="Are you sure to deprecate this concept?"
          />}
          onConfirm={() => this.handleDeprecate(text).then(()=>props.fetchData(initQuery))}
          iconType={'delete'}
          type={'icon'}
        />
      )
    })} searchable/> 
            <ConceptForm
            parent={parent}
            vocabulary={vocabulary}
            visible={isModalVisible}
            onCancel={this.hideModal}
            onSubmit={() => {this.hideModal(); props.fetchData(initQuery).then(props.fetchData(initQuery))}}
          />
            </React.Fragment>}
        />
        
            
      </React.Fragment>
    );
  }
}

ConceptList.propTypes = {
  vocabulary: PropTypes.object.isRequired,
  createConcept: PropTypes.func.isRequired,
  deprecateConcept: PropTypes.func.isRequired,
  updateCounts: PropTypes.func.isRequired
};

export default ConceptList;