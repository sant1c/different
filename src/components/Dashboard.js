import React, { Component } from "react";
import axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", tenantData: [] };

    this.handleChange = this.handleChange.bind(this);
    this.submitButtonHandler = this.submitButtonHandler.bind(this);
  }

  componentDidMount() {
    var self = this;
    this.getTenantDetails().then(data => {
      console.log("DATATATA", data.data);
      self.setState({
        tenantData: data.data
      });
    });
  }

  getTenantDetails() {
    return axios.get(`https://hiring-task-api.herokuapp.com/v1/leases/`);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  submitButtonHandler = () => {
    this.props.history.push("/lease/" + this.state.value);
  };

  submitTenantHandler = event => {
    console.log("---------------", this.state.tenantData);
    this.props.history.push("/lease/" + event.target.value);
  };

  render() {
    let tenantData = this.state.tenantData;

    return (
      <div>
        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="text"
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder="Enter ID"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <button onClick={this.submitButtonHandler.bind(this)}>
                  Submit
                </button>
              </div>
            </div>
          </form>
          <h2>Tenant Details</h2>
          <div className="row">
            <div className="input-field col s12">
              {tenantData.map(tenantDat => (
                <h4 key={tenantDat.id}>
                  <button
                    onClick={this.submitTenantHandler.bind(this)}
                    value={tenantDat.id}
                  >
                    {tenantDat.tenant}
                  </button>
                </h4>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
