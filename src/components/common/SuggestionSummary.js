import React from 'react';
import injectSheet from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { Alert, Button } from 'antd';
import CollectionLink from './CollectionLink';
import InstitutionLink from './InstitutionLink';
import DateValue from './DateValue';
import withContext from '../hoc/withContext';

const styles = {

};

/**
 * Component will show given content only partially
 * If the content is too high, component will render "Show More" button
 */
const SuggestionSummary = ({ hasUpdate, entityType, suggestion, entity, discardSuggestion, applySuggestion, showInForm, addSuccess, addError, refresh }) => {
  const isPending = suggestion && suggestion.status === 'PENDING';
  const isRelevant = isPending && !entity?.deleted;
  const hasChangesToReview = isPending && suggestion && suggestion.changes.length > 0;
  const EntityLink = entityType === 'COLLECTION' ? CollectionLink : InstitutionLink;

  const apply = () => {
    applySuggestion(suggestion.key, suggestion)
      .then(response => {
        addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
        refresh();
      })
      .catch(error => {
        addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  const discard = () => {
    discardSuggestion(suggestion.key)
      .then(response => {
        addSuccess({ statusText: <FormattedMessage id="suggestion.discardedSuccess" defaultMessage="Suggestion was discarded" /> });
        refresh();
      })
      .catch(error => {
        addError({ status: error.response.status, statusText: error.response.data });
        console.error(error);
      });
  }

  const getSuggestionSummary = () => {
    if (!suggestion) return null;
    return <>
      {hasUpdate && <div>
        <h4><FormattedMessage id="suggestion.proposedBy" defaultMessage="Proposed by" /></h4>
        <p>
          {suggestion.proposerEmail}
        </p>
      </div>}
      <div>
        <h4><FormattedMessage id="suggestion.comments" defaultMessage="Comments" /></h4>
        {suggestion.comments.map((x, i) => <p key={i}>{x}</p>)}
      </div>
      {suggestion.changes.length > 0 && <div>
        <h4><FormattedMessage id="suggestion.changes" defaultMessage="Changes" /></h4>
        <ul>
          {suggestion.changes.map((x, i) => <li key={i}>{x.field} : <pre><del>{JSON.stringify(x.previous, null, 2)}</del> {JSON.stringify(x.suggested, null, 2)}</pre></li>)}
        </ul>
      </div>}
    </>
  }

  return <>
    {suggestion && suggestion.status === 'DISCARDED' &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<FormattedMessage
          id="suggestion.suggestionDiscarded"
          defaultMessage="This suggestion was discarded {discarded} by {discardedBy}."
          values={{ discarded: <DateValue value={suggestion.discarded} />, discardedBy: suggestion.discardedBy }}
        />}
        type="info"
      />
    }

    {suggestion && suggestion.status === 'APPLIED' &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<FormattedMessage
          id="suggestion.suggestionApplied"
          defaultMessage="This suggestion was applied on {DATE} by {NAME}. See entity {ENTITY}."
          values={{ ENTITY: <EntityLink uuid={suggestion?.entityKey} />, DATE: <DateValue value={suggestion?.applied}/> , NAME: suggestion?.appliedBy }}
        />}
        type="info"
      />

      
    }

    {isPending && (entity && suggestion.proposed < entity.modified) &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<FormattedMessage id="suggestion.changedSinceSuggestion" defaultMessage="This entity has been updated since the suggestion was created." />}
        type="warning"
      />
    }

    {suggestion && suggestion.type === 'DELETE' &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<div>
          <p>
            <FormattedMessage id="suggestion.deleteSuggestion" defaultMessage="You are viewing a suggestion to delete an entity." />
          </p>
          {getSuggestionSummary()}
          {hasUpdate && isPending && <>
            <Button onClick={discard} style={{ marginRight: 8 }}><FormattedMessage id="suggestion.discard" defaultMessage="Discard" /></Button>
            {isRelevant && <Button type="danger" onClick={apply} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.delete" defaultMessage="Delete" />
            </Button>}
          </>}
        </div>}
        type="warning"
      />
    }

    {suggestion && suggestion.type === 'MERGE' &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<div>
          <p>
            <FormattedMessage
              id="suggestion.discardSuggestion"
              defaultMessage="Suggestion to merge this entity with {target}"
              values={{ target: <EntityLink uuid={suggestion.mergeTargetKey} /> }} />
          </p>
          {getSuggestionSummary()}
          {hasUpdate && isPending && <>
            <Button onClick={discard} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.discard" defaultMessage="Discard" />
            </Button>
            {isRelevant && <Button onClick={apply} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.merge" defaultMessage="Merge" />
            </Button>}
          </>}
        </div>}
        type="info"
      />
    }

    {suggestion && suggestion.type === 'CONVERSION_TO_COLLECTION' &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<div>
          <p>
            <FormattedMessage
              id="suggestion.convertSuggestion"
              defaultMessage="Suggestion to convert this entity to a collection."
              values={{ target: <EntityLink uuid={suggestion.mergeTargetKey} /> }} />
          </p>
          <p>
            {suggestion.institutionForConvertedCollection && <FormattedMessage
              id="suggestion.convertSuggestionExisting"
              defaultMessage="Will be created under {target}"
              values={{ target: <EntityLink uuid={suggestion.institutionForConvertedCollection} /> }} />
            }
            {suggestion.nameForNewInstitutionForConvertedCollection && <FormattedMessage
              id="suggestion.convertSuggestionExisting"
              defaultMessage="Will be created under a new name: {target}"
              values={{ target: suggestion.nameForNewInstitutionForConvertedCollection }} />
            }
          </p>
          {getSuggestionSummary()}
          {hasUpdate && isPending && <>
            <Button onClick={discard} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.discard" defaultMessage="Discard" />
            </Button>
            {isRelevant && <Button onClick={apply} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.convert" defaultMessage="Convert" />
            </Button>}
          </>}
        </div>}
        type="info"
      />
    }

    {suggestion && suggestion.type === 'UPDATE' &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<div>
          <p>
            <FormattedMessage id="suggestion.updateSuggestion" defaultMessage="You are viewing a suggestion to update an entity." />
          </p>
          {getSuggestionSummary()}
          {hasUpdate && isPending && <>
            <Button onClick={discard} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.discard" defaultMessage="Discard" />
            </Button>
            {!hasChangesToReview && <Button onClick={apply} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.closeAsDone" defaultMessage="Close as done" />
            </Button>}
            {hasChangesToReview > 0 && isRelevant && <>
              <Button onClick={apply} style={{ marginRight: 8 }}>
                <FormattedMessage id="suggestion.apply" defaultMessage="Apply" />
              </Button>
              <Button onClick={showInForm} style={{ marginRight: 8 }}>
                <FormattedMessage id="suggestion.showInForm" defaultMessage="Show in form" />
              </Button>
            </>}
          </>}
        </div>}
        type="info"
      />
    }
  </>
}

const mapContextToProps = ({ addError, addSuccess }) => ({ addError, addSuccess });

export default withContext(mapContextToProps)(injectSheet(styles)(SuggestionSummary));
