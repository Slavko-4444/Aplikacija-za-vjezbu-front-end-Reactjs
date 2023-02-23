import { faPhone, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export class UserLogin extends React.Component {

    render(){
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faSignInAlt} /> User login
                        </Card.Title>
                        <Card.Text>
                            Here will be login form for users...
                        </Card.Text>
                    </Card.Body>
                </Card>
                 Contact details
            </Container>
            
        );
    }
} 

export default UserLogin;