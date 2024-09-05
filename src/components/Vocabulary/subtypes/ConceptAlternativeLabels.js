import { List, Button, Col, Row, Pagination } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import _ from "lodash";
// APIs
import {  getConceptAlternativeLabels, addConceptAlternativeLabel, deleteConceptAlternativeLabel } from '../../../api/vocabulary';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
// Wrappers
import { HasRole, roles } from '../../auth';
import { FormattedRelativeDate } from '../../common/index';
import withWidth, { MEDIUM } from '../../hoc/Width';
import withContext from '../../hoc/withContext';

// Components
import ItemCreateForm from './Item/ItemCreateForm';
import { CreateButton } from '../../common/CreateMessage';

class ConceptAlternativeLabels extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      loading: true,
      count: 0,
      limit: 10,
      offset: 0,
      alternativeLabels: []
    };
  }

  componentDidMount() {  
    this._isMount = true;
    this.getData({ limit: this.state.limit });
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  handleSave = form => {
    const { addError } = this.props;
    form.validateFields().then((values) => {

      addConceptAlternativeLabel(this.props.vocabulary.name, this.props.concept.name, values)
        .then(()=> {          
          this.setState({
            isModalVisible: false
          });
          this.getData({ limit: this.state.limit });
          this.props.addSuccess({
            status: 200,
            statusText: this.props.intl.formatMessage({
              id: "beenAdded.alternativeLabel",
              defaultMessage: "Alternative label has been added"
            })
          });
          form.resetFields();
        })
        .catch(err => {
          console.log(err)
          addError(err)})

    });
  };

  deleteAltLabel = (key) => {
    const { vocabulary, concept } = this.props;
    return deleteConceptAlternativeLabel(vocabulary.name, concept.name, key)
      .then(res => {
        this.getData({ limit: this.state.limit });        
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: "beenDeleted.alternativeLabel",
            defaultMessage: "Alternative label has been deleted"
          })
        });
      })
      .catch(err => {
        console.log(err)
        this.props.addError(err)})
  };

  getData = async (query) => {
    this.setState({ loading: true });
    try{
    const altLabelsResponse = await getConceptAlternativeLabels(this.props.vocabulary.name, this.props.concept.name, query);    
    if (this._isMount) {
      this.setState({
        alternativeLabels: altLabelsResponse.data.results,        
        availableLanguages: altLabelsResponse.data.results ? altLabelsResponse.data.results.map(l => l.language): [],
        loading: false,
        count: altLabelsResponse.data.count,
        limit: altLabelsResponse.data.limit,
        offset: altLabelsResponse.data.offset,
      });
      this.props.updateCounts('alternativeLabels', altLabelsResponse.data.count);
    }
    } catch(err){
      if (this._isMount) {
        this.setState({ status: err.response.status, loading: false });
        if (![404, 500, 523].includes(err.response.status)) {
          this.props.addError({
            status: err.response.status,
            statusText: err.response.data
          });
        }
      }
    }
  }

  render() {
    const { alternativeLabels, count, limit, offset, isModalVisible, columns, expandedRowKeys } = this.state;
    const { intl } = this.props;
  
    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2>
                <FormattedMessage id="alternativeLabels" defaultMessage="Alternative Labels"/>

                {/* <Tooltip title={
                  <FormattedMessage
                    id="help.orgMachineTagsInfo"
                    defaultMessage="Machine tags are intended for applications to store information about an entity. A machine tag is essentially a name/value pair, that is categorised in a namespace. The 3 parts may be used as the application sees fit."
                  />
                }>
                  <QuestionCircleOutlined />
                </Tooltip> */}
              </h2>
            </Col>
            <Col span={4} className="text-right">
               <HasRole roles={[roles.VOCABULARY_ADMIN]}>
                  <div className="item-btn-panel">
                    <CreateButton onClick={() => this.showModal()} />
                  </div>
              </HasRole> 
            </Col>

            {/* <Col xs={12} sm={12} md={8} className="text-right">
              <HasAccess fn={this.props.canCreate}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasAccess>
            </Col> */}
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={alternativeLabels}
            header={
              alternativeLabels && alternativeLabels.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={alternativeLabels.length}/>, count: alternativeLabels.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item
                actions={[
                  <HasRole roles={[roles.VOCABULARY_ADMIN]}>
                    <ConfirmButton
                      title={<FormattedMessage id="delete.confirmation.alternativeLabel" 
                              defaultMessage="Are you sure to delete this alternative label?"/>}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteAltLabel(item.key)}
                      type={'link'}
                    />
                  </HasRole>
                ]}
                // style={width < MEDIUM ? { flexDirection: 'column' } : {}}
              >
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      <span className="item-title">{item.value}</span>
                      <span className="item-type">{item.language}</span>
                    </React.Fragment>
                  }
                  description={
                    <span className="item-description">
                        <FormattedMessage
                          id="createdByRow"
                          defaultMessage={`Created {date} by {author}`}
                          values={{ date: <FormattedRelativeDate value={item.created}/>, author: item.createdBy }}
                        />
                      </span>
                  }
                />
              </List.Item>
            )}
            style={{ marginBottom: '16px' }}
          />

          <ItemCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
            isMap={true}
            itemName={'alternative label'}
          />

        <Pagination total={count} pageSize={limit} current={1 + offset / limit} onChange={( page, pageSize ) => {
            this.getData({
              offset: (page - 1) * pageSize,
              limit: limit
            })}}
        />
          
        </div>
      </React.Fragment>
    );
  }
}

ConceptAlternativeLabels.propTypes = {
  vocabulary: PropTypes.object.isRequired,
  concept: PropTypes.func.isRequired  
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(ConceptAlternativeLabels)));