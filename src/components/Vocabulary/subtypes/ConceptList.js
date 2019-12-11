import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { searchConcepts } from '../../../api/vocabulary';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
import { standardColumns } from '../../search/columns';
// Wrappers
import { HasRole, roles } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';

// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import ConceptForm from './Concept/Details/ConceptForm';



class ConceptList extends React.Component {
  state = { isModalVisible: false,
    columns : [
      {
        title: <FormattedMessage id="name" defaultMessage="Name"/>,
        dataIndex: 'name',
        width: '50%',
        render: (text, record) => <Link to={`/vocabulary/${this.props.vocabulary.name}/concept/${record.name}`}>{text}</Link>
      },
      ...standardColumns
    ] };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  handleDeprecate = concept => {
    this.props.deprecateConcept(this.props.vocabulary.name, concept);
  };



  render() {
    const { isModalVisible, columns } = this.state;
    const { parent, vocabulary, initQuery = { limit: 25, offset: 0 }, updateCounts } = this.props;
    // Adding column with Delete Dataset action
    const tableColumns = columns.concat({
      render: record => (
        <ConfirmButton
          title={<FormattedMessage
            id="deprecate.confirmation.concept"
            defaultMessage="Are you sure to deprecate this concept?"
          />}
          onConfirm={() => this.handleDeprecate(record)}
          iconType={'delete'}
          type={'icon'}
        />
      )
    });

    return (
      <React.Fragment>

        <Row type="flex" justify="space-between">
          <Col span={20}>
            <h2>
             {parent ? <FormattedMessage id="vocabularyConcepts" defaultMessage="Concepts"/> : <FormattedMessage id="vocabularyChildConcepts" defaultMessage="Child concepts"/>}
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
          return  searchConcepts(vocabulary.name, query)
      .then(res => {
        updateCounts('concepts', res.data.count)
        return res;
      })
          }}
          initQuery={initQuery}
          render={props => <React.Fragment>
            <DataTable {...props} noHeader={true} columns={tableColumns}/> 
            <ConceptForm
            parent={parent}
            vocabulary={vocabulary}
            visible={isModalVisible}
            onCancel={this.hideModal}
            onSubmit={() => {this.hideModal(); props.fetchData(initQuery)}}
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