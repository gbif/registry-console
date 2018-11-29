import React from 'react'
import { withRouter } from 'react-router'
import DatasetMenu from './DatasetMenu'
import { Spin } from 'antd'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../NotFound'
import DatasetDetails from './Details'
import ContactList from './ContactList'
import { getDatasetOverview } from '../../api/dataset'

//load dataset and provide via props to children. load based on route key.
//provide children with way to update root.

class Dataset extends React.Component {
  constructor(props){
    super(props)

    this.getData = this.getData.bind(this)

    this.state = {
      loading: true,
      error: false,
      data: undefined
    }
  }

  componentWillMount() {
    this.getData(this.state.query)
  }

  getData(){
    this.setState({
      loading: true,
      error: false
    })
    
    getDatasetOverview(this.props.match.params.key).then(data => {
        this.setState({
          data,
          loading: false,
          error: false,
        })
      })
      .catch(err => {
        this.setState({
          error: true
        })
      })
  }

  render() {
    const { match } = this.props
    const { data, loading, error } = this.state
    return (
      <React.Fragment>
        {!loading && <Route path="/:type?/:key?/:section?" render={props => (
          <DatasetMenu dataset={data.dataset} constituents={data.constituents}>
            <Switch>
              <Route exact path={`${match.path}`} render={() => <DatasetDetails dataset={data.dataset} refresh={this.getData}/>} />
              <Route path={`${match.path}/contact`} render={(props) => <ContactList contacts={data.dataset.contacts}/>} />
              <Route path={`${match.path}/constituents`} component={() => <h1>constituents</h1>} />
              <Route component={NotFound}/>
            </Switch>
          </DatasetMenu>
        )}
        />}

        {loading && <Spin size="large" />}
      </React.Fragment>
    )
  }
}

export default withRouter(Dataset)