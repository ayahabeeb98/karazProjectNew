import React from 'react';
import './App.css';
import RegisterLayout from "./layouts/registration/RegisterLayout";
import {BrowserRouter , Switch , Route,Redirect} from "react-router-dom";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import Home from "./pages/rigistration/Home";
import Login from "./pages/rigistration/Login";
import Recover from "./pages/rigistration/Recover";
import ConfirmOptions from "./pages/rigistration/ConfirmOptions";
import ConfirmationCode from "./pages/rigistration/ConfirmationCode";
import LogoutFromOtherDevices from "./pages/rigistration/LogoutFromOtherDevices";
import ResetPassword from "./pages/rigistration/ResetPassword";
import VerifyAccount from "./pages/rigistration/VerifyAccount";
import Profile from "./pages/rigistration/Profile";
import MainDashboard from "./pages/dashboard/MainDashboard";
import SignUp from "./pages/rigistration/signup/Signup";
import {RouteWrapper,PrivateRoute} from "./Routes/RouteWrapper";

function App() {
  return (
      <BrowserRouter>
          <Switch>
              <RouteWrapper path="/" exact component={Home}  layout={RegisterLayout} />
              <RouteWrapper path="/login" component={Login}  layout={RegisterLayout} />
              <RouteWrapper path="/recover" exact component={Recover}  layout={RegisterLayout} />
              <RouteWrapper path="/recover/confirm" component={ConfirmOptions} layout={RegisterLayout} />
              <RouteWrapper path="/recover/code" component={ConfirmationCode}  layout={RegisterLayout} />
              <RouteWrapper path="/recover/logout" component={LogoutFromOtherDevices}  layout={RegisterLayout}/>
              <RouteWrapper path="/reset-password" component={ResetPassword}  layout={RegisterLayout} />
              <PrivateRoute path="/verify-account" component={VerifyAccount}  layout={RegisterLayout} />
              <PrivateRoute path="/profile" component={Profile}  layout={RegisterLayout} />


              <RouteWrapper path="/signup"  component={SignUp} layout={RegisterLayout} />

              <RouteWrapper path="/dashboard" exact layout={DashboardLayout} component={MainDashboard}/>

              {/*The redirect component only gets rendered if no other routes match first*/}
              <Redirect to='/'/>
          </Switch>
      </BrowserRouter>
  );
}






export default App;
