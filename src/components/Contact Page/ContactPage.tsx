import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export class ContactPage extends React.Component {

    render(){
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faPhone} /> Contact details
                        </Card.Title>
                        <Card.Text>
                            Contact details will be show here..
                        </Card.Text>
                    </Card.Body>
                </Card>
                 Contact details
            </Container>
            
        );
    }
} 

export default ContactPage;