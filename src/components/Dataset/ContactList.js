import React, { Fragment } from 'react'
import { withRouter } from 'react-router'
import { List, Skeleton } from 'antd'
import { FormattedRelative } from 'react-intl'

class ContactList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {edit: true}
  }

  render() {
    const { contacts } = this.props
    return (
      <React.Fragment>
        <List
          itemLayout="horizontal"
          dataSource={contacts}
          renderItem={item => (
            <List.Item actions={[<a>edit</a>, <a>more</a>]}>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<Fragment><a href="">{item.lastName ? `${item.firstName} ${item.lastName}` : item.organization}</a> <span style={{fontSize: '12px', color: 'grey', marginLeft: 10}}>{item.type}</span></Fragment>}
                  description={<FormattedRelative value={item.created} />}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </React.Fragment>
    )
  }
}

export default withRouter(ContactList)