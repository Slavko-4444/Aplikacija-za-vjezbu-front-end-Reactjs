import React from 'react';
import { Redirect } from 'react-router-dom';
import OrderType  from '../../types/OrderType';
import api, {ApiResponse} from '../../api/api'
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxOpen, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import CartType from '../../types/CartType';

interface OPState{
    isUserLoggedIn: boolean;
    orders: OrderType[];
    cartVisible: boolean;
    cart?: CartType,
}

interface OrderDto {
    orderId: number;
    createdAt: string;
    userId: number;
    status: 'pending' | 'rejected' | 'accepted' | 'shipped';
    cart: {
        cartId: number;
        createdAt: string;
        cartArticles: {
            quantity: number;
            article: {
                articleId: number;
                name: string;
                excerpt: string;
                status: 'available'|'visible'|'hidden'
                isPromoted: number;
                articlePrices: {
                    price: number; 
                    createdAt: string;
                }[];
                category: {
                    categoryId: number;
                    name: string;
                    imagePath: string;
                }
            };
        }[];            
    }
}

export class OrderPage extends React.Component {
    state: OPState;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            isUserLoggedIn: true,
            orders: [],
            cartVisible: false,
        }
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        })

        this.setState(newState)
    }

    private setOrders(orders: OrderType[]) {
        this.setState(Object.assign(this.state, {
            orders: orders,
        }))
    }

    componentDidMount() {
        console.log("ovde")
        this.getOrders();    
    }

    componentDidUpdate() {
        console.log("ovde1")
        this.getOrders();    
    }

    private getOrders() {
        api('api/user/cart/allOrders', 'get', {})
            .then((res: ApiResponse) => {
            
                const data: OrderDto[] = res.data;
                const orders: OrderType[] = data.map(order => ({
                    orderId: order.orderId,
                    status: order.status,
                    createdAt: order.createdAt,
                    cart: {
                        cartId: order.cart.cartId,
                        userId: order.userId,
                        user: null,
                        createdAt: order.cart.createdAt,
                        cartArticles: order.cart.cartArticles.map(cArticle => (({
                            cartArticleId: 0,
                            articleId: cArticle.article.articleId,
                            quantity: cArticle.quantity,
                            article: {
                                articleId: cArticle.article.articleId,
                                name: cArticle.article.name,
                                category: {
                                    categoryId: cArticle.article.category.categoryId,
                                    name: cArticle.article.category.name,
                                },
                                articlePrices: cArticle.article.articlePrices.map(aPrice => ({
                                    articlePriceId: 0,
                                    price: aPrice.price,
                                    createdAt: aPrice.createdAt 
                                })),
                            },
                        }))),
                        
                    },
                }))

                this.setOrders(orders);      
        })
    }

    private setCartVisiblestate(v: boolean) {
        this.setState(Object.assign(this.state, {cartVisible: v}))
    }

    private setCartState(cart: CartType) {
        this.setState(Object.assign(this.state, {cart: cart}))
    }
    private hideCart() {
        this.setCartVisiblestate(false);

    }

    // Promjena da se uzmu cijene kada je korpa napravaljena
    private calculateSum() {
        let sum: number = 0;

        if (!this.state.cart)
            return sum;
        
        const cartTimestamp = new Date(this.state.cart.createdAt).getTime();
        // ne uzimamo najnoviju cijenu, vec onu koja je bila kad samo stavljali u korpi, u slucaju da 
        //se cijena povecavala to bi bilo veliki problem...
        for (const item of this.state.cart?.cartArticles) {
            let price = item.article.articlePrices[0]

            for (let ap of item.article.articlePrices) {
                const articlePriceTimestamp = new Date(ap.createdAt).getTime();

                if (articlePriceTimestamp < cartTimestamp)
                    price = ap;
                else 
                    break
            }

            sum += price.price * item.quantity;                         
        }
        return sum;
    }
    private showCart() {
        this.setCartVisiblestate(true);
    }
    render() {
        
        if (!this.state.isUserLoggedIn)
            return <Redirect to='/login' />
        
        const sum: number = this.calculateSum();
        return (
            <Container>
            <Card>
              <Card.Body> 
                <Card.Title>
                  <FontAwesomeIcon icon={faBox} />My orders:
                </Card.Title>
                <Row>
                <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Created at</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                                <tbody>
                                    {this.state.orders.map(this.printOrderRow, this)}
                                </tbody>
                </Table>
                </Row>
              </Card.Body>
                </Card>
                
                <Modal size='lg' centered show={this.state.cartVisible} onHide={() => this.hideCart()}>
                    <Modal.Header closeButton><Modal.Title>Your order content</Modal.Title>
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
                                            <td style={{textAlign: 'right'}}>{ cartArticle.quantity }</td>
                                            <td style={{textAlign: 'right'}}>{ price } EUR</td>
                                            <td style={{textAlign: 'right'}}>{ total } EUR</td>
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
                        
                    </Modal.Body>
                </Modal>
          </Container>
        )
    }
    
    private setAndShowCart(cart: CartType) {
        this.setCartState(cart);
        this.showCart();
    }

    private printOrderRow(order: OrderType) {
        return (
            <tr>
                <td>{order.createdAt}</td>
                <td>{order.status}</td>
                <td className='text-right'>
                    <Button size='sm' variant="primary" onClick={() => this.setAndShowCart(order.cart)} className='col-12'>
                        <FontAwesomeIcon icon={faBoxOpen} />
                    </Button>
                </td>
            </tr>
        )
    }

}