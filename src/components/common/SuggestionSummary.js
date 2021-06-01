import React, { useEffect, useState } from 'react';
import injectSheet from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { Alert, Button } from 'antd';
import { Link } from 'react-router-dom'
import qs from 'qs';
import CollectionLink from './CollectionLink';
import DateValue from './DateValue';
import withContext from '../hoc/withContext';

const styles = {

};

/**
 * Component will show given content only partially
 * If the content is too high, component will render "Show More" button
 */
const SuggestionSummary = ({ suggestion, entity, discardSugggestion, applySuggestion, showInForm, addSuccess, addError, refresh }) => {
  const isPending = suggestion && suggestion.status === 'PENDING';
  const hasChangesToReview = isPending && suggestion && suggestion.changes.length > 0;

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
    discardSugggestion(suggestion.key, suggestion)
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
      <div>
        <h4><FormattedMessage id="suggestion.proposedBy" defaultMessage="Proposed by" /></h4>
        <p>
          {suggestion.proposerEmail}
        </p>
      </div>
      <div>
        <h4><FormattedMessage id="suggestion.comments" defaultMessage="Comments" /></h4>
        {suggestion.comments.map((x, i) => <p key={i}>{x}</p>)}
      </div>
      {suggestion.changes.length > 0 && <div>
        <h4><FormattedMessage id="suggestion.changes" defaultMessage="Changes" /></h4>
        <ul>
          {suggestion.changes.map((x, i) => <li key={i}>{x.field} : <del>{JSON.stringify(x.previous)}</del> {JSON.stringify(x.suggested)}</li>)}
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
          values={{discarded: <DateValue value={suggestion.discarded}/>, discardedBy: suggestion.discardedBy}}
        />}
        type="info"
      />
    }

    {suggestion && suggestion.status === 'APPLIED' &&
      <Alert
        style={{ marginBottom: 12 }}
        message={<FormattedMessage
          id="suggestion.suggestionApplied"
          defaultMessage="This suggestion was applied {applied} by {appliedBy}."
          values={{applied: <DateValue value={suggestion.applied}/>, appliedBy: suggestion.appliedBy}}
        />}
        type="info"
      />
    }

    {isPending && suggestion.proposed < entity.modified &&
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
            <FormattedMessage id="suggestion.deleteSuggestion" defaultMessage="You are reviewing a suggestion to delete an entity." />
          </p>
          {getSuggestionSummary()}
          {isPending && <>
            <Button onClick={discard} style={{ marginRight: 8 }}><FormattedMessage id="suggestion.discard" defaultMessage="Discard" /></Button>
            <Button type="danger" onClick={apply} style={{ marginRight: 8 }}><FormattedMessage id="suggestion.delete" defaultMessage="Delete" /></Button>
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
              values={{target: <CollectionLink uuid={suggestion.mergeTargetKey} />}} />
          </p>
          {getSuggestionSummary()}
          {isPending && <>
            <Button onClick={discard} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.discard" defaultMessage="Discard" />
            </Button>
            <Button onClick={apply} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.merge" defaultMessage="Merge" />
            </Button>
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
            <FormattedMessage id="suggestion.updateSuggestion" defaultMessage="You are reviewing a suggestion to update an entity." />
          </p>
          {getSuggestionSummary()}
          {isPending && <>
            <Button onClick={discard} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.discard" defaultMessage="Discard" />
            </Button>
            {!hasChangesToReview && <Button onClick={apply} style={{ marginRight: 8 }}>
              <FormattedMessage id="suggestion.closeAsDone" defaultMessage="Close as done" />
            </Button>}
            {hasChangesToReview > 0 && <>
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
