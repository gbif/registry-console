import React, { Component } from "react";

export default getData =>
  class fieldFormatter extends Component {
    constructor(props) {
      super(props);
      this.getTitle = this.getTitle.bind(this);
      this.state = {
        title: ""
      };
    }

    componentDidMount() {
      this._mounted = true;
      this.getTitle();
    }

    componentWillUnmount() {
      // Cancel fetch callback?
			this._mounted = false;
			if (this.dataResult && typeof this.dataResult.cancel === "function") {
				this.dataResult.cancel();
			}
    }

    componentDidUpdate(prevProps) {
      if (prevProps.id !== this.props.id) {
        this.getTitle();
      }
    }

    getTitle() {
      this.dataResult = getData(this.props.id);
      // if it is a promise, then wait for it to return
      if (this.dataResult && typeof this.dataResult.then === "function") {
        this.dataResult.then(
          result => {
            if (this._mounted) {
              this.setState({ title: result.data.title });
            }
          },
          error => {
            if (this._mounted) {
              this.setState({ title: "unknown", error: true });
            }
          }
        );
      } else {
        // the function simply returned a value.
        this.setState({ title: typeof this.dataResult.title === 'undefined' ? '' : this.dataResult.title });
      }
    } 

    render() {
      let title = this.state.error ? (
        <span className="discreet">unknown</span>
      ) : (
        this.state.title
      );
      const style = typeof title !== 'undefined'
        ? {}
        : {display:'inline-block', width: '100px', background: 'rgba(0,0,0,.1)'};
      return <span style={style}>{title}&nbsp;</span>;
    }
  };