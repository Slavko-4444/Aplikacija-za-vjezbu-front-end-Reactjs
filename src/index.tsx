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



const mainMenuItems = [
  new MainMenuItem("Home", '/'),
  new MainMenuItem("Contact", '/contact'),
  new MainMenuItem("Log in", '/login'),
  new MainMenuItem("Cat 4", '/category/4'),
  new MainMenuItem("Cat 21", '/category/21'),
  new MainMenuItem("Cat 7", '/category/7'),
]
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
      <MainMenu items={mainMenuItems} />
    
    <HashRouter>
      <Switch>
        <Route exact path="/" component= {HomePage} />
        <Route path='/contact' component={ContactPage} />
        <Route path='/login' component={UserLogin} />
        <Route path='/category/:cId' component={CategoryPage}/>
      </Switch> 
      
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
