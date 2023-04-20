import React, {useState} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import _cloneDeep from 'lodash/cloneDeep';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tag, Button, Popconfirm, Divider } from 'antd';
// APIs
import { canCreate } from '../../../api/permissions';
import { searchVocabularyTags, createVocabularyTag, updateVocabularyTag, deleteVocabularyTag } from '../../../api/vocabularyTag';

import withContext from '../../hoc/withContext';
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import { standardColumns } from '../../search/columns';
import { ItemHeader } from '../../common';
import { HasAccess } from '../../auth';
import Paper from '../../search/Paper';
import Form from './Form';



const title = { id: 'title.vocabularyTags', defaultMessage: 'Vocabulary Tags | GBIF Registry' };
const listName = <FormattedMessage id="vocabularyTags" defaultMessage="Vocabulary Tags"/>;



const VocabularyTags = ({ initQuery = { q: '', limit: 25, offset: 0 }, user, addSuccess, addError, intl }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tagForEdit, setTagForEdit] = useState(null)
 
    
   const handleSave = (form, cb) => {
       return form.validateFields().then(values => {
         
          const action = (values.key) ? updateVocabularyTag : createVocabularyTag;
          
         return action(values).then(response => {
            form.resetFields();      
            addSuccess({
              status: 200,
              statusText: intl.formatMessage({
                id: 'beenSaved.tag',
                defaultMessage: 'Tag has been saved'
              })
            }); 
            setIsModalVisible(false)
            setTagForEdit(null)
            if(typeof cb === 'function'){
                cb()
            }
          })       
        })
        .catch(error => {
          addError({ status: error.response.status, statusText: error.response.data });
          setIsModalVisible(false)
          setTagForEdit(null)
          if(typeof cb === 'function'){
              cb()
          }
        });;
      };
    
      const stdColumns = _cloneDeep(standardColumns);
  return (
    <React.Fragment>
       
        <DataQuery
      api={searchVocabularyTags}
      initQuery={initQuery}
      render={props => {
          const columns = [
              {
                title: <FormattedMessage id="name" defaultMessage="Name"/>,
                dataIndex: 'name',
                width: '200px',
                render: (text, record) => <Tag color={record.color != "#FFFFFF" ? record.color : ''} >{text}</Tag>
              },
              {
                title: 'Action',
                key: 'action',
                width: '82px',
                render: (text, record) => (
                  <div>                   
                    <Button style={{padding: 0}} type="link" onClick={() => {
                        setTagForEdit(record);
                        setIsModalVisible(true);
                        }
                        }><EditOutlined /></Button>
                   
                    <Divider type="vertical" />
                    <Popconfirm
                title="Are you sure delete this tag?"
                onConfirm={()=> {
                  deleteVocabularyTag(record).then(response => {            
                      
                      addSuccess({
                        status: 200,
                        statusText: intl.formatMessage({
                          id: 'beenDeleted.tag',
                          defaultMessage: 'Tag has been deleted'
                        })
                      }); 
                      props.forceUpdate()
                    }).catch(error => {
                      addError({ status: error.response.status, statusText: error.response.data });
                    })
                }}
                okText="Yes"
                cancelText="No"
              >
                    <Button style={{padding: 0}} type="link"><DeleteOutlined /></Button>
                    </Popconfirm>
                  </div>
                ),
              },
              {
                title: <FormattedMessage id="description" defaultMessage="Description"/>,
                dataIndex: 'description',
                width: '400px'
              },
              ...stdColumns
            ];
          return <React.Fragment>
          <Form 
       visible={isModalVisible}
       data={tagForEdit}
       onCancel={()=> {setIsModalVisible(false); setTagForEdit(null)}} 
       onCreate={(form) => {
           handleSave(form, props.forceUpdate)
           }}/>
          <ItemHeader listType={[listName, <FormattedMessage id="menu.vocabularyTags" defaultMessage="Vocabulary Tags"/>]} pageTitle={title} listTitle={<FormattedMessage id="menu.vocabularyTags" defaultMessage="Vocabulary Tags"/>}>
            <HasAccess fn={() => canCreate('vocabularyTag')}>
              <Button type="primary" onClick={() => setIsModalVisible(!isModalVisible)}>
                <FormattedMessage id="createNew" defaultMessage="Create new"/>
              </Button>
            </HasAccess>
          </ItemHeader>
          <Paper padded>
            <DataTable {...props} columns={columns} searchable/>
          </Paper>
        </React.Fragment>
      }
        
      }/>
      </React.Fragment>
  );
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(VocabularyTags))
