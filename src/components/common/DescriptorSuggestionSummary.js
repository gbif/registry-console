import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert, Button, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import DateValue from './DateValue';
import CollectionLink from './CollectionLink';
import { downloadDescriptorSuggestionFile } from '../../api/collection';

const { Paragraph } = Typography;

const DescriptorSuggestionSummary = ({ 
  hasUpdate, 
  suggestions, 
  discardSuggestion, 
  applySuggestion, 
  addSuccess, 
  addError, 
  refresh,
  showInForm
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  const isPending = suggestion => suggestion && suggestion.status === 'PENDING';
  const isRelevant = suggestion => isPending(suggestion) && suggestion.type !== 'DELETE';

  const apply = (suggestion) => {
    applySuggestion(suggestion.collectionKey, suggestion.key)
      .then(response => {
        addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
        refresh();
      })
      .catch(error => {
        addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  const discard = (suggestion) => {
    discardSuggestion(suggestion.collectionKey, suggestion.key)
      .then(response => {
        addSuccess({ statusText: <FormattedMessage id="suggestion.discardedSuccess" defaultMessage="Suggestion was discarded" /> });
        refresh();
      })
      .catch(error => {
        addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  const downloadFile = (suggestion) => {
    downloadDescriptorSuggestionFile(suggestion.collectionKey, suggestion.key)
      .then(response => {
        const format = suggestion.format?.toLowerCase() || 'csv';
        const sanitizedTitle = suggestion.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'descriptor';
        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const filename = `${sanitizedTitle}_${timestamp}.${format}`;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data);
        link.setAttribute('download', filename);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })  
      .catch(error => {
        addError({ status: error.response.status, statusText: error.response.data });
      });
  } 

  return (
    <React.Fragment>
      {suggestions.map(suggestion => (
        <Alert
          key={suggestion.key}
          style={{ marginBottom: 12 }}
          message={
            <div>
              {suggestion.status === 'APPLIED' && (
                <div style={{ marginBottom: 12 }}>
                  <FormattedMessage
                    id="suggestion.applied"
                    defaultMessage="This suggestion was applied on {DATE} by {NAME}. See entity {ENTITY}."
                    values={{ ENTITY: <CollectionLink uuid={suggestion?.collectionKey} />, DATE: <DateValue value={suggestion?.applied}/> , NAME: suggestion?.appliedBy }}
                  />
                </div>
              )}

              {suggestion.status === 'DISCARDED' && (
                <div style={{ marginBottom: 12 }}>
                  <FormattedMessage
                    id="suggestion.discarded"
                    defaultMessage="This suggestion was discarded on {date} by {user}."
                    values={{
                      date: <DateValue value={suggestion.discarded} />,
                      user: suggestion.discardedBy
                    }}
                  />
                </div>
              )}

              <h3>
                <strong><FormattedMessage id="suggestion.title" defaultMessage="Title" />: </strong>
                {suggestion.title}
              </h3>
              
              <h3>
                <strong><FormattedMessage id="suggestion.description" defaultMessage="Description" />: </strong>
                {suggestion.description}
              </h3>

              <div style={{ marginBottom: 12 }}>
                <strong><FormattedMessage id="suggestion.proposedBy" defaultMessage="Proposed by" />: </strong>
                {suggestion.proposerEmail}
              </div>

              <div style={{ marginBottom: 12 }}>
                <strong><FormattedMessage id="suggestion.proposedDate" defaultMessage="Proposed date" />: </strong>
                <DateValue value={suggestion.proposed} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <strong><FormattedMessage id="suggestion.type" defaultMessage="Type" />: </strong>
                {suggestion.type === 'CREATE' && <FormattedMessage id="suggestion.type.create" defaultMessage="Create New" />}
                {suggestion.type === 'UPDATE' && <FormattedMessage id="suggestion.type.update" defaultMessage="Update Existing" />}
                {suggestion.type === 'DELETE' && <FormattedMessage id="suggestion.type.delete" defaultMessage="Delete" /> }
              </div>

              {suggestion.comments && suggestion.comments.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <strong><FormattedMessage id="suggestion.comments" defaultMessage="Comments" />:</strong>
                  {suggestion.comments.map((comment, idx) => (
                    <Paragraph key={idx}>{comment}</Paragraph>
                  ))}
                </div>
              )}

              {suggestion.type === 'DELETE' && (
                <div style={{ marginBottom: 12, padding: 12, backgroundColor: '#fff1f0', border: '1px solid #ffccc7', borderRadius: 4 }}>
                  <strong>
                    <FormattedMessage 
                      id="suggestion.delete.warning" 
                      defaultMessage="Warning: This will delete the descriptor group and all its data." 
                    />
                  </strong>
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                {suggestion.suggestedFile && (
                <Button 
                  icon={<DownloadOutlined />} 
                  onClick={() => downloadFile(suggestion)}
                  style={{ marginRight: 8 }}
                >
                    <FormattedMessage id="download.file" defaultMessage="Download file" />
                  </Button>
                )}

                {hasUpdate && isPending(suggestion) && (
                  <>
                    <Button onClick={() => discard(suggestion)} style={{ marginRight: 8 }}>
                      <FormattedMessage id="suggestion.discard" defaultMessage="Discard" />
                    </Button>
                    {isRelevant(suggestion) && (
                      <Button onClick={() => showInForm(suggestion)} style={{ marginRight: 8 }}>
                        <FormattedMessage id="suggestion.showInForm" defaultMessage="Show in form" />
                      </Button>
                    )}
                    <Button type="primary" onClick={() => apply(suggestion)}>
                      <FormattedMessage id="suggestion.apply" defaultMessage="Apply" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          }
          type="info"
        />
      ))}
    </React.Fragment>
  );
};

export default DescriptorSuggestionSummary; 