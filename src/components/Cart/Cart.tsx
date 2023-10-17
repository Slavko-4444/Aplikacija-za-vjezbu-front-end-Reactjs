import React from 'react';
import CartType from '../../types/CartType';
import api, {ApiResponse} from '../../api/api'
import { Alert, Button, Form, Modal, Nav, Tab, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faMinusSquare } from '@fortawesome/free-solid-svg-icons';

interface CartState {
    count: number;
    cart?: CartType;
    cartVisible: boolean;
    message: string;
    cartMenuColor: string;
}

export default class Cart extends React.Component {

    state: CartState;
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            count: 0,
            cartVisible: false,
            message: '',
            cartMenuColor: '#000000',
        };
    }


    componentDidMount(): void {
        this.updateCart();
        window.addEventListener("cart.update", ()=>this.updateCart());// ()=> this.function() VS this.function:  prva oznacava da se odnosi sa date komponente, a druga da je nezavisna funkcija, i nece prepoznati state elemente
    }

    componentWillUnmount(): void {
        window.removeEventListener("cart.update", ()=>this.updateCart())
    }
    
    private setStateMessage(newMessage: string) {
        return this.setState(Object.assign(this.state, { message: newMessage }));
    }
    private setStateCount(newCount: number) {
        return this.setState(Object.assign(this.state, { count: newCount }));
    }

    private setStateCart(newCart?: CartType) {
        return this.setState(Object.assign(this.state, { cart: newCart }));
    }

    private setStateCartMenuColor(newColor: string) {
        return this.setState(Object.assign(this.state, { cartMenuColor: newColor }));
    }

    private setStateCartVisible(newV: boolean) {
        return this.setState(Object.assign(this.state, { cartVisible: newV }));
    }

    private showCart() {
        this.setStateCartVisible(true);
    }
    private updateCart() {

        api('/api/user/cart', 'get', {})
            .then((res: ApiResponse) => {
            
                if (res.status === 'service Error') {
                    this.setStateCount(0);
                    this.setStateCart(undefined);
                    return;
                }

                this.setStateCart(res.data);
                this.setStateCount(res.data.cartArticles.length)
                this.setStateCartMenuColor('#FF0000')

                setTimeout(() => this.setStateCartMenuColor('#000000'), 2500);
        })
    }

    private calculateSum() {
        let sum: number = 0;

        if (!this.state.cart)
            return sum;
        
        for (const item of this.state.cart?.cartArticles) {
            sum += Number(item.article.articlePrices[item.article.articlePrices.length - 1].price) * item.quantity
                                  
        }
        return sum;
    }

    private removeFromCart(articleId: number) {

        const data = {
            articleId: articleId,
            newQuantity: 0
        }
        this.changeCartQuantity(data);
    }


    private updateQunatity(event: React.ChangeEvent<HTMLInputElement>) {
        const articleId = event.target.dataset.articleId;
        const newQuantity = event.target.value;

        const data = {
            articleId: Number(articleId),
            newQuantity: Number(newQuantity)
        }
        this.changeCartQuantity(data);
    }

    private changeCartQuantity(data: any) {
        api('/api/user/cart', 'patch', data)
            .then((res: ApiResponse) => {
                if (res.status === 'service Error') {
                    this.setStateCount(0);
                    this.setStateCart(undefined);
                    return;
                }

                this.setStateCart(res.data);
                this.setStateCount(res.data.cartArticles.length)
            });
    } 

    makeOrder() {
        console.log(this.state.cart?.cartArticles.length)
        api('/api/user/cart/makeOrder', 'post', {})
            .then((res: ApiResponse) => {
                if (res.status === 'service Error') {
                    this.setStateCount(0);
                    this.setStateCart(undefined);
                    return;
                }
                
                this.setStateMessage('Your order has been made!');
                this.setStateCount(0);
                this.setStateCart(undefined);

        })
    }

    private hideCart() {
        this.setStateMessage('');
        this.setStateCartVisible(false);
    }
    render() {

        const sum = this.calculateSum();
        return (
            <>
                <Nav.Item>
                    <Nav.Link active={false} onClick={()=> this.showCart()}
                    style={{color: this.state.cartMenuColor}} >
                        <FontAwesomeIcon icon={faCartArrowDown} /> ({this.state.count})
                    </Nav.Link>    
                </Nav.Item>

                <Modal size='lg' centered show={this.state.cartVisible} onHide={() => this.hideCart()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your shopping cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Article</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.cart?.cartArticles.map(cartArticle => {
                                    const price = Number(cartArticle.article.articlePrices[cartArticle.article.articlePrices.length - 1].price).toFixed(2)
                                    const total = Number(cartArticle.article.articlePrices[cartArticle.article.articlePrices.length - 1].price * cartArticle.quantity).toFixed(2);
                                  
                                    return (
                                        <tr>
                                            <td>{ cartArticle.article.category.name}</td>
                                            <td>{ cartArticle.article.name}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Form.Control type='number' step='1' min='1' value={ cartArticle.quantity } data-article-id={ cartArticle.article.articleId } onChange={ e => this.updateQunatity(e as any)} />
                                                </td>
                                            <td style={{textAlign: 'right'}}>{ price } EUR</td>
                                            <td style={{textAlign: 'right'}}>{ total } EUR</td>
                                            <td>
                                                <FontAwesomeIcon icon={faMinusSquare} onClick={() => this.removeFromCart(cartArticle.article.articleId)} />
                                            </td>
                                        </tr>
                                ) },this)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                                    <td style={{ textAlign: 'right' }}>{ Number(sum).toFixed(2) } EUR</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </Table>
                        <Alert variant="success" className={this.state.message ? '' : 'd-none'}>
                            {this.state.message}
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.makeOrder()} disabled={this.state.cart?.cartArticles.length === 0 || this.state.cart?.cartArticles.length=== undefined}>
                            Make an order
                        </Button>
                    </Modal.Footer>
                </Modal>

            </>
        );
    }
}