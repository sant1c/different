import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./Header";
import Dashboard from "./Dashboard";
import LeaseID from "./LeaseID";
import Lease from "./Lease";

const App = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/lease/:id" component={Lease} />
          <Route path="/LeaseID" component={LeaseID} />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
