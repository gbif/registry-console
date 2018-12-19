import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Tooltip, Icon, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';

const styles = theme => ({
  formItem: {
    marginBottom: 15
  },
  label: {
    verticalAlign: 'middle',
    lineHeight: '40px',
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: 'rgba(0, 0, 0, 0.85)',
    '&:after': {
      content: '":"',
      margin: '0 8px 0 2px',
      position: 'relative',
      top: '-0.5px'
    }
  },
  content: {
    paddingTop: 9,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

class PresentationItem extends Component {
  render() {
    const { classes, children, label, helpText } = this.props;
    return (
      <Row>
        <Col sm={24} md={6}>
          <div>
            <dt className={classes.label}>
              {label}
              {helpText && <React.Fragment>&nbsp;
                <Tooltip title={helpText}>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </React.Fragment>}
            </dt>
          </div>
        </Col>
        <Col sm={24} md={18}>
          {Array.isArray(children) ?
            children.map((item, i) => (<dd className={classes.content} key={i}>{item}</dd>))
          : (<dd className={classes.content}>{children}</dd>)}
        </Col>
      </Row>
    );
  }
}

const Item = injectSheet(styles)(PresentationItem);

export const TextField = ({ field, data }) => (
  <Item label={<FormattedMessage id={`field_${field}`} defaultMessage={field}/>}>
    {data[field]}
  </Item>
);

export default Item;
