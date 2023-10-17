import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'popper.js/dist/popper.js'
import HomePage from './components/HomePage/HomePage';
import {MainMenuItem, MainMenu } from './components/MainMenu/MainMenu';
import UserLogin from './components/User Login/Userlogin';
import ContactPage from './components/Contact Page/ContactPage';
import { HashRouter, Switch, Route} from 'react-router-dom';
import CategoryPage from './components/Category Page/CategoryPage';
import { UserRegistration } from './components/User Registration/User.registration';
import { OrderPage } from './components/Order Page/OrderPage';
import { AmdinistratorLogin } from './components/Administrator Login/administrator.login';
import AdministratorDashboard from './components/Administrator dashboard/administrator.dashboard';


const mainMenuItems = [
  new MainMenuItem("Home", '/'),
  new MainMenuItem("Contact", '/contact'),
  new MainMenuItem("Log in", '/login'),
  new MainMenuItem("Create account", '/user/registration'),
  new MainMenuItem("My Orders", '/user/orders'),
  new MainMenuItem("Admin log in", '/admin/login'),
]
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
      <MainMenu items={mainMenuItems} />
    
    <HashRouter>
      <Switch>
        <Route exact path="/" component = {HomePage} />
        <Route path='/login' component = {UserLogin} />
        <Route path='/admin/login' component = {AmdinistratorLogin} />
        <Route path='/contact' component = {ContactPage} />
        <Route path='/category/:cId' component = {CategoryPage}/>
        <Route path='/user/registration' component = {UserRegistration}/>
        <Route path='/user/orders' component = {OrderPage}/>
        <Route path='/admin_dashboard' component = {AdministratorDashboard}/>
      </Switch> 
      
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
