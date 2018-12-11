import React  from 'react';
import { withRouter } from 'react-router-dom';
import { Button, List, Row, Skeleton } from 'antd';
import { FormattedMessage, FormattedRelative } from 'react-intl';

// TODO think about CSSinJS for styles
const formButton = {
  type: 'primary',
  ghost: true,
  style: {
    border: 'none',
    padding: 0,
    height: 'auto',
    boxShadow: 'none'
  }
};

class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { edit: true };
  }

  render() {
    const { contacts } = this.props;
    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="datasetContacts" defaultMessage="Dataset contacts"/></h1>
          <Button htmlType="button" type="primary">
            <FormattedMessage id="createNew" defaultMessage="Create new"/>
          </Button>
        </Row>

        <List
          itemLayout="horizontal"
          dataSource={contacts}
          renderItem={item => (
            <List.Item actions={[
              <Button htmlType="button" {...formButton}>
                <FormattedMessage id="edit" defaultMessage="Edit"/>
              </Button>,
              <Button htmlType="button" {...formButton}>
                <FormattedMessage id="delete" defaultMessage="Delete"/>
              </Button>
            ]}>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      {item.lastName ? `${item.firstName} ${item.lastName}` : item.organization}
                      <span style={{ fontSize: '12px', color: 'grey', marginLeft: 10 }}>
                        <FormattedMessage id={item.type}/>
                      </span>
                    </React.Fragment>
                  }
                  description={
                    <React.Fragment>
                      <FormattedMessage
                        id="createdByRow"
                        defaultMessage={`Created {date} by {author}`}
                        values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                      />
                    </React.Fragment>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ContactList);