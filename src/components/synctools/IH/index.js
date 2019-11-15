import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Alert, Col, Row, Table, Button } from 'antd';
import injectSheet from 'react-jss';

// import { overIngestedSearch } from '../../../api/monitoring';
import Paper from '../../search/Paper';
// import OffBy from './OffBy';
// import CrawlInfo from './CrawlInfo';
// import RecordDetails from '../../common/RecordDetails';
// import IngestionHistoryLink from '../../common/IngestionHistoryLink';
// import Actions from './overingested.actions';

const styles = {
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    minWidth: '600px',
    '& .small-cell': {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'center'
    }
  },
  candidates: {

  },
  candidate: {
    border: '1px solid #aaa',
    borderRadius: 5,
    padding: '3px 5px',
    margin: 5,
    //whiteSpace: 'nowrap'
  },
  candidateValue: {
    color: '#999',
    display: 'inline-block',
    padding: '0 20px 0 0'
  },
  candidateOption: {
    display: 'inline-block',
  },
  ihRecord: {
    color: '#999',
    '& span': {
      paddingRight: 10 
    }
  },
  name: {
    color: 'black',
  }
};

class IndexHerbariorum extends React.Component {
  constructor(props) {
    super(props);

    const columns = [
      {
        title: 'IH record',
        dataIndex: 'name',
        key: 'name',
        width: '200px',
        render: (text, record) => <div className={this.props.classes.ihRecord}>
          <span>{record.code}</span>
          <span className={this.props.classes.name}>{record.name}</span>
          <span>{record.country}</span>
        </div>
      },
      {
        title: 'Candidates',
        dataIndex: 'candidates',
        key: 'candidates',
        width: '200px',
        render: (text, record) => <div className={this.props.classes.candidates}>
          {record.candidates.map(x => <div key={x.key} className={this.props.classes.candidate}>
            <div className={this.props.classes.candidateValue}>{x.code}</div>
            <div className={this.props.classes.candidateValue} style={{color: 'black'}}>{x.name}</div>
            <div className={this.props.classes.candidateValue}>{x.country}</div>
            <div className={this.props.classes.candidateOption}><Button type="primary" size="small">Add IH irn</Button></div>
          </div>)}
          
        </div>,
      }
    ];

    this.state = {
      columns,
      tableData: undefined,
      loading: true
    };
  }

  componentDidMount() {
    // overIngestedSearch().then(response => {
    //   this.setState({
    //     loading: false,
    //     data: Object.values(response.data)
    //   });
    // }).catch(error => this.setState({ error }));

    // get a fresh data dump - all lines. move the managing of the data to a temporary service
    this.setState({
      loading: false,
      tableData: [
        {
          key: 5234,
          name: 'moscow state uni',
          code: 'msu',
          country: 'russia',
          candidates: [
            {
              key: '2345-2345',
              name: 'moscow state university',
              code: 'msu',
              country: 'russian federation',
              flags: {
                codeMatch: 'PERFECT',
                nameMatch: 'MEDIUM',
                countryMatch: 'GOOD'
              }
            },
            {
              key: '2345-23452',
              name: 'moscow state uni',
              code: 'msu-zoology',
              country: 'russia',
              flags: {
                codeMatch: 'MEDIUM',
                nameMatch: 'PERFECT',
                countryMatch: 'PERFECT'
              }
            },
            {
              key: '2345-234576',
              name: 'cph uni',
              code: 'msu',
              country: 'denmark',
              flags: {
                codeMatch: 'PERFECT',
                nameMatch: 'LOW',
                countryMatch: 'LOW'
              }
            }
          ]
        }
      ]
    })
  }

  render() {
    const { tableData, columns, loading } = this.state;
    const { classes, intl } = this.props;

    return (
      <React.Fragment>
        <Paper padded>
          <Row>
            <Col span={24}>
              <div className={classes.scrollContainer}>
                <Table
                  bordered
                  columns={columns}
                  dataSource={tableData}
                  size="small"
                  // rowKey={record => record.key}
                  loading={loading}
                  pagination={false}
                  className={classes.table}
                />
              </div>
              <pre>{JSON.stringify(tableData, null, 2)}</pre>
            </Col>
          </Row>
        </Paper>
      </React.Fragment>
    );
  }
}

export default injectIntl(injectSheet(styles)(IndexHerbariorum));
