import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Tooltip, Icon, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';

const styles = theme => ({
  formItem: {
    paddingBottom: 0,
    width: '100%',
    clear: 'both',
    '& > div': {
      minHeight: '32px',
      marginBottom: '5px',
    }
  },
  label: {
    lineHeight: 1,
    display: 'block',
    whiteSpace: 'nowrap',
    fontWeight: 'normal',
    color: 'rgba(0, 0, 0, 0.85)',
  },
  required: {
    display: 'inline-block',
    marginRight: '4px',
    content: '*',
    fontFamily: 'SimSun',
    lineHeight: 1,
    fontSize: '14px',
    color: '#f5222d'
  },
  content: {
    wordBreak: 'break-word',
    lineHeight: 1
  }
});

class PresentationItem extends Component {
  render() {
    const { classes, children, label, helpText, required } = this.props;
    return (
      <Row className={classes.formItem}>
        <Col sm={24} md={8}>
          <div>
            <dt className={classes.label}>
              {required && <span className={classes.required}>*</span>}
              {label}
              {helpText && <React.Fragment>&nbsp;
                <Tooltip title={helpText}>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </React.Fragment>}
            </dt>
          </div>
        </Col>
        <Col sm={24} md={16}>
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
