import React from 'react';
import Container from 'react-bootstrap/Container';
import { faHomeLg } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row } from 'react-bootstrap';
import CategoryTypes from '../../types/CategoryTypes';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api'

interface AdministratorDashboardSTATE {
  IsAdministratorLoggedIn: boolean;
}


export class  AdministratorDashboard extends React.Component {
  state: AdministratorDashboardSTATE;

  constructor(props: Readonly<{}>) {
    super(props); 
    this.state = {
        IsAdministratorLoggedIn: true,
    }
  }

  private setLoggined(IsLoggin: boolean) {
    const newState = Object.assign(this.state, {
        IsAdministratorLoggedIn: IsLoggin
    });
    this.setState(newState);
  }
  
  componentWillUpdate() {
    this.getMyData();
  }

  componentWillMount(): void {
    this.getMyData();
  }

  private getMyData() {
    api('api/administrator/', 'get', {}, 'administrator')
      .then((res: ApiResponse) => {
      
        if (res.status !== "ok") {
          this.setLoggined(false);
          return;
        }
      });
  }
  render() {

    if (this.state.IsAdministratorLoggedIn === false)
      return (<Redirect to="/admin/login" />);
    
    return (
      <Container>
        <Card>
          <Card.Body> 
            <Card.Title>
              <FontAwesomeIcon icon={faHomeLg} />Administrator dashboard
            </Card.Title>
            <ul>
              <li><Link to="administrator/dashboard/category">Categories</Link></li>
              <li><Link to="administrator/dashboard/feature">Features</Link></li>
              <li><Link to="administrator/dashboard/article">Articles</Link></li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    )
  };
  
}
export default AdministratorDashboard;

