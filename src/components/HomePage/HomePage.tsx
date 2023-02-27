import React from 'react';
import Container from 'react-bootstrap/Container';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row } from 'react-bootstrap';
import CategoryTypes from '../../types/CategoryTypes';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api'

interface HomePageSTATE {
  IsUserLoggedIn: boolean;
  categories: CategoryTypes[];
}

interface CategoryApiDTO {
  categoryId: number;
  name: string;
}

class HomePage extends React.Component {
  state: HomePageSTATE;

  constructor(props: Readonly<{}>) {
    super(props); 
    this.state = {
      IsUserLoggedIn: true,
      categories: []
    }
  }

  componentWillMount(): void {
    this.getCategories();
  }
  
  componentWillUpdate(): void {
    this.getCategories();
  }
  
  private getCategories() {
    api("/api/category", "get", {})
      .then((res: ApiResponse) => {
        if (res.status !== 'ok') {
          this.setLoggined(false);
          return;
        }
        this.setDataInState(res.data);
    })
  }

  private setDataInState(data: CategoryApiDTO[]) {

    const newCategories: CategoryTypes[] = data.map(category => {return({ categoryId: category.categoryId, name: category.name, items: [], })});
    
    const newState = Object.assign(this.state, {    
        categories: newCategories
    })

    this.setState(newState);
  }
  private setLoggined(IsLoggin: boolean) {
    const newState = Object.assign(this.state, {
      IsUserLoggedIn: IsLoggin
    });
    this.setState(newState);
  }
  
  render() {

    if (!this.state.IsUserLoggedIn)
      return (<Redirect to="/login" />);
    
    return (
      <Container>
        <Card>
          <Card.Body> 
            <Card.Title>
              <FontAwesomeIcon icon={faListAlt} />Top level categories
            </Card.Title>
            <Row>
              {this.state.categories.map(this.singleCategory)}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    )
  };
  
  private singleCategory(category: CategoryTypes) {
    return (
      <Col lg="3" md="4" sm="6" xs="12">
        <Card className='mb-3'>
          <Card.Body>
            <Card.Title as="p">{ category.name }</Card.Title>
            <Link to={`/category/${category.categoryId}`} className="btn btn-primary btn-block btn-sm" >Open category</Link>
          </Card.Body>  
        </Card>
      </Col>
    );
  }
}

export default HomePage;
