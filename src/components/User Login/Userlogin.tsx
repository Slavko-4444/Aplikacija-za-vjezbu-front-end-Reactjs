import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Card, Col, Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, {ApiResponse, saveRefreshToken, saveToken} from '../../api/api'

interface UserLoginPageState {
    email: string;
    password: string;
    errorMessage: string;
    isLoggined: boolean;
}   

export class UserLogin extends React.Component {

    state: UserLoginPageState;
    constructor(props: Readonly<{}>) {
        super(props)

        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            isLoggined: false,
        }
    }


    private doLogin() {
        console.log(this.state)
        api('/auth/Administrator/login/user', 'post',
            {
            email: this.state.email,
            password: this.state.password,
            }).then((res: ApiResponse) => {
                if (res.status === 'service Error'){
                    console.log("Service error ", res.status, res.data)
                    this.setErrorMessage("Service error");
                    return;
                }
                if (res.status === 'login Error') 
                    if (res.data.errorStatus !== undefined) {
                        let message: string = '';
                        switch (res.data.errorStatus) {
                            case -3001: message= 'Unkwnon email'; break;
                            case -3002: message= 'Bad password'; break;
                        }
                        this.setErrorMessage(message);
                        return;
                    }

                    // ovdje znaci da smo povezani sa serverom, da je prosla prijava i da ocekujemo token i fresh token
                if (res.status === 'ok') {
                    saveToken(res.data.token)
                    saveRefreshToken(res.data.refreshToken)
                    this.setLoggined(true); 
                    }
                    // preusmjeriti korinsika...
        })
    }

    
    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newState = Object.assign(this.state, {
            [event.target.id]: event.target.value,
        });
        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });
        this.setState(newState);
    }
    private setLoggined(IsLoggin: boolean) {
        const newState = Object.assign(this.state, {
            isLoggined: IsLoggin
        });
        this.setState(newState);
    }

    render() {
        
        if (this.state.isLoggined)
            return (
                <Redirect to="/" />
            );
        return (
            <Container>
                <Col md={{ span: 6, offset: 3 }}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                                <FontAwesomeIcon icon={faSignInAlt} /> User login
                        </Card.Title>
                            <Form>
                                    <Form.Group>
                                        <Form.Label htmlFor="email">E-mail:</Form.Label>
                                        <Form.Control type='email' id="email" value={this.state.email} onChange={ event => this.formInputChanged(event as any)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor="password">Password:</Form.Label>
                                        <Form.Control type='password' id="password" value={this.state.password} onChange={ event => this.formInputChanged(event as any)} />
                                    </Form.Group>
                                    <br/>
                                    <Form.Group>
                                        <Button variant='primary' onClick={()=> this.doLogin()}>
                                            Log in
                                        </Button>
                                    </Form.Group>
                            </Form>
                            <Alert variant='danger' className={this.state.errorMessage?'':'d-none'}>{ this.state.errorMessage}</Alert>
                    </Card.Body>
                </Card>
                 Contact details
                </Col>
            </Container>
            
        );
    }
} 

export default UserLogin;