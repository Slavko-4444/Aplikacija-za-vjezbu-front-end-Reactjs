import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Card, Col, Container, Form, Alert, Button, Row} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api'

interface UserRegistrationSTATE {
    formdata: {
        email: string;
        password: string;
        phone: string;
        forename: string;
        surname: string;
        postalAddress: string;
    }
    message?: string;
    IsRegistered: boolean;
}

export class UserRegistration extends React.Component {

    state: UserRegistrationSTATE;
    constructor(props: Readonly<{}>) {
        super(props)
        this.state = {
            IsRegistered: false,
            formdata: {
                email: '',
                password: '',
                phone: '',
                forename: '',
                surname: '',
                postalAddress: '',
            }
        }
    }


    private doRegistration() {
        
        const data = {
            email: this.state.formdata.email,
            password: this.state.formdata.password,
            phoneNumber: this.state.formdata.phone,
            forename: this.state.formdata.forename,
            surname: this.state.formdata.surname,
            postalAddress: this.state.formdata.postalAddress,
        }
        
        console.log(data);
        api('/auth/Administrator/user/registration', 'post', data)
            .then((res: ApiResponse) => {
                if (res.status === 'service Error') {
                    // console.log("Service error ", res.status, res.data)
                    this.setMessage("Service error");
                    return;
                }
                if (res.status === 'login Error')
                    if (res.data.errorStatus !== undefined) {
                        this.handleErrors(res.data.errorStatus);
                        return;
                    }

                // ovdje znaci da smo povezani sa serverom, da je prosla prijava i da ocekujemo token i fresh token
                if (res.status === 'ok') 
                    this.setRegistered(true);
                
                    // preusmjeriti korinsika...
                });
    }
    private handleErrors(Message: number) {
        let message: string = '';
        switch (Message) {
            case -6000: message = 'New user account cannot be saved!'; break;
        }
        this.setMessage(message);
    }

    render() {

        return (
            <Container>
                        <Col md={{ span: 6, offset: 3 }}>
                                <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                    <FontAwesomeIcon icon={faUserPlus} /> User registration:
                                            </Card.Title>
                                            {
                                                (this.state.IsRegistered === false)?this.renderForm():this.renderRegistrationReadMessage()
                                            }
                                        </Card.Body>
                                </Card>
                        </Col>
            </Container>
            )

    }

    private renderForm() {
        return (<>
         <Form>
                <Row>
                    <Col md="6">
                    <Form.Group>
                        <Form.Label htmlFor="surname">Surname:</Form.Label>
                        <Form.Control type='text' id="surname" value={this.state.formdata.surname} onChange={ event => this.formInputChanged(event as any)} />
                    </Form.Group>
                    </Col>
                    <Col md="6">
                    <Form.Group>
                        <Form.Label htmlFor="forename">Forename:</Form.Label>
                        <Form.Control type='text' id="forename" value={this.state.formdata.forename} onChange={ event => this.formInputChanged(event as any)} />
                    </Form.Group>  
                    </Col>
                    
                </Row>
                

                <Row>
                    <Col md="6">
                        <Form.Group>
                                <Form.Label htmlFor="email">E-mail:</Form.Label>
                                <Form.Control type='email' id="email" value={this.state.formdata.email} onChange={ event => this.formInputChanged(event as any)} />
                        </Form.Group>
                    </Col>
                    <Col md="6">
                        <Form.Group>
                            <Form.Label htmlFor="password">Password:</Form.Label>
                            <Form.Control type='password' id="password" value={this.state.formdata.password} onChange={ event => this.formInputChanged(event as any)} />
                        </Form.Group>
                </Col>
                </Row>
                
            <Form.Group>
                <Form.Label htmlFor="phone">Phone number:</Form.Label>
                <Form.Control type='text' id="phone" value={this.state.formdata.phone} onChange={ event => this.formInputChanged(event as any)} />
            </Form.Group>
            <Form.Group>
                <Form.Label htmlFor="postalAddress">Postal address</Form.Label>
                <Form.Control as="textarea" rows={4} id="postalAddress" value={this.state.formdata.postalAddress} onChange={ event => this.formInputChanged(event as any)} />
            </Form.Group>
            
                <br />
                <Form.Group>
                    <Button variant='primary' onClick={() => this.doRegistration()}>
                        Register
                    </Button>
                </Form.Group>
            </Form>
            <Alert variant='danger' className={this.state.message ? '' : 'd-none'}>{this.state.message}</Alert>
        </>);
    }
    private renderRegistrationReadMessage() {
        return (
            <p>
                The account has been registered. <br />
                <Link to='/login'>Clik here</Link> to go to login page.
            </p>
        )
    }


// methods for seting the state values...
    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newFormDATA = Object.assign(this.state.formdata, {
            [event.target.id]: event.target.value,
        })

        const newState = Object.assign(this.state, {
            formdata: newFormDATA
        });
        this.setState(newState);
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });
        this.setState(newState);
    }
    private setRegistered(IsRegistered: boolean) {
        const newState = Object.assign(this.state, {
            IsRegistered: IsRegistered
        });
        this.setState(newState);
    }
}