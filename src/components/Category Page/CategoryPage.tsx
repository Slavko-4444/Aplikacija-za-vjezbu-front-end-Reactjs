import { faListAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Card } from 'react-bootstrap';
import CategoryTypes from '../../types/CategoryTypes';



interface CategoryPageState {
    category?: CategoryTypes; 
}
interface CategoryPageProps{
    match: {
        params: {
            cId: number
        }
    }
}

export class CategoryPage extends React.Component<CategoryPageProps> {

    state : CategoryPageState 

    constructor(props: Readonly<CategoryPageProps>) {
        super(props);
        this.state = {};
    }
    render(){
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} />  {this.state.category?.name}
                        </Card.Title>
                        <Card.Text>
                           Here, we will have our articles...
                        </Card.Text>
                    </Card.Body>
                </Card>
                 Contact details
            </Container>
            
        );
    }

    componentWillMount(): void {
        this.getCategoryData();
    }

    componentWillReceiveProps(nextProps: CategoryPageProps): void {
        if (nextProps.match.params.cId === this.props.match.params.cId)
            return;
        
        this.getCategoryData();
    }

    private getCategoryData() {
        setTimeout(() => { 
            const data: CategoryTypes = {
                name: 'Category' + this.props.match.params.cId,
                categoryId: this.props.match.params.cId,
                items: []
            }
            this.setState({ category: data });
        }, 750);
    }
} 

export default CategoryPage;