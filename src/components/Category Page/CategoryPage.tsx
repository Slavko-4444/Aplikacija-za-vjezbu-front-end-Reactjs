import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import CategoryTypes from '../../types/CategoryTypes';
import api, { ApiResponse } from '../../api/api'
import ArticleType from '../../types/ArticleType';
import { Link, Redirect } from 'react-router-dom';
import { ApiConfig } from '../../config/api.config';

interface ArticleDto {
    articleId: number;
    name: string;
    excerpt?: string;
    description?: string;
    articlePrices?: {
        price: number;
        createdAt: string;
    }[];
    photos?: {
        imagePath: string;
    }[]
}

interface CategoryPageState {
    IsUserLoggedIn: boolean;
    category?: CategoryTypes;
    subcategories?: CategoryTypes[];
    items?: ArticleType[];
    message: string;
    filters: {
        keywords: string;
        priceMin: number;
        priceMax: number;
        orderBy: "name asc" | "name desc" | "price asc" | "price desc";
        selectedFeatures: {
            featureId: number;
            value: string;
        }[],

    },
    features: {
        featureId: number;
        name: string;
        values: string[];
    }[];
}

interface CategoryDto {
    categoryId: number;
    name: string;
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
        this.state = {
            IsUserLoggedIn: true,
            message: '',
            filters: {
                keywords: '',
                priceMin: 0.01,
                priceMax: Number.MAX_SAFE_INTEGER,
                orderBy: "price asc", 
                selectedFeatures: [], 
            },
            features: [],
        };
    }
    render() {
        if (!this.state.IsUserLoggedIn)
            return (<Redirect to="/login" />);
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
                        {this.printOptionalMessage()}
                        {this.showSubcategories()}
                        <Row>
                            <Col xs='12' md='4' lg='3'>{ this.printFilters() }</Col>
                            <Col xs='12' md='8' lg='9'>{this.showArticles()}</Col>
                        </Row>
                    </Card.Body>
                </Card>
                 Contact details
            </Container>
            
        );
    }

    
    
    private printFilters() {
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor='keywords'>Serach keywords:</Form.Label>
                    <Form.Control type="text" id="keywords" value={this.state.filters.keywords} onChange={e => this.changeEventInFilter(e as any)} />
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col xs='12' sm='6'>
                            <Form.Label htmlFor='priceMin'>Minimum Price:</Form.Label>
                            <Form.Control type="number" id="priceMin" step="0.01" min="0.01" max="99999.99 " value={this.state.filters.priceMin} onChange={ e => this.changeEventInFilter(e as any)} />
                        </Col>
                        <Col xs='12' sm='6'>
                            <Form.Label htmlFor='priceMax'>Maximum Price:</Form.Label>
                            <Form.Control type="number" id="priceMax" step="0.01" min="0.02" max="100000" value={this.state.filters.priceMax} onChange={ e => this.changeEventInFilter(e as any)} /> 
                        </Col>
                    </Row>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Form.Control as="select" onChange={e => this.filterOrderChange(e as any)} defaultValue={this.state.filters.orderBy}>
                        <option value="name asc">Sort by name - ascending</option>
                        <option value="name desc">Sort by name - discending</option>
                        <option value="price asc">Sort by price - ascending</option>
                        <option value="price desc">Sort by price - discending</option>
                    </Form.Control>
                </Form.Group>
                <br />

                {this.state.features.map(this.printFeatureFilterComponent, this)}

                <Form.Group>
                    <button type="button" className="btn btn-primary col-12" onClick={() => this.applyFilters()} ><FontAwesomeIcon icon={faSearch}/>Search</button>
                </Form.Group>
            </>
        )
    }

    private printFeatureFilterComponent(feature: { featureId: number; name: string; values: string[]; }) {

        return (
        <>
            <Form.Group>
            <Form.Label><strong>{feature.name}</strong>:</Form.Label>
                    {feature.values.map(value => this.printFeatureFilterChecker(feature, value), this)}      
            </Form.Group>
        </>)}
    
    private printFeatureFilterChecker(feature: any, value: string) {
        return(
            <Form.Check type='checkbox' label={value} value={value}
                        data-feature-id={feature.featureId}
                        onChange={e=> this.feautureOnChange(e as any)}/>
        )
        
    }
 
    private printOptionalMessage() {
        if (this.state.message === '')
            return;
        return (
            <Card.Text>
                    { this.state.message }
            </Card.Text>
        )
    }

    private showArticles() {
        if (this.state.items?.length === 0 || this.state.items === undefined)
            return <div>There are  no articles in category</div>
            return (
                <Row>
                    {this.state.items.map(this.singleArticle)}
                </Row>
            )
        
    }
    
    private singleArticle(artc: ArticleType) {
        return (
            <Col lg="3" md="4" sm="6" xs="12">
                <Card className='mb-3'>
                    <Card.Header>
                        <img alt={artc.imagePath} src={ApiConfig.PHOTO_PATH + "small/" + artc.imagePath}
                        className="w-100"/>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p"><strong>{artc.name}</strong></Card.Title>
                        <Card.Text>
                            {artc.excerpt}
                        </Card.Text>
                        <Card.Text>
                            Price: {Number(artc.price).toFixed(2)} EUR
                        </Card.Text>
                        <Link to={`/article/${artc.articleId}`} className="btn btn-primary btn-block btn-sm" >Open article page</Link>
                    </Card.Body>
                </Card>
            </Col>
        ); 
    }

    private showSubcategories() {
        
        if (this.state.subcategories?.length === 0)
            return;
        return (
            <Row>
                {this.state.subcategories?.map(this.singleCategory)}
            </Row>
        )
      
    }

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

    private feautureOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const featureId = Number( event.target.dataset.featureId);
        const value = event.target.value;
        if (event.target.checked) {
            this.addFilterFeatureValue(featureId, value);
        }
        else {
            this.removeFilterFeatureValue(featureId, value);
        }
       
    }
    
    private addFilterFeatureValue(featureId: number, value: string) {
        
        const newSelectedFeatures = [...this.state.filters.selectedFeatures];
        newSelectedFeatures.push({ featureId: featureId, value: value });
        this.UpdateSelectedFiltersInState(newSelectedFeatures);
    }

    private removeFilterFeatureValue(featureId: number, value: string) {
        const newSelectedFeatures = this.state.filters.selectedFeatures.filter(record => {
            return !(record.featureId === featureId && record.value === value);
        })
        this.UpdateSelectedFiltersInState(newSelectedFeatures);
    }
    
    private UpdateSelectedFiltersInState(newSelectedFeatures: any) {
        this.setState(Object.assign(this.state, {
            filters: Object.assign(this.state.filters, {
                selectedFeatures: newSelectedFeatures,
            })
        }))
    
    }

    private filterOrderChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newFilter = Object.assign(this.state.filters, {
            orderBy: event.target.value,
        })
        return this.setState(Object.assign(this.state, { filters: newFilter }));
    }

    private changeEventInFilter(event: React.ChangeEvent<HTMLInputElement>) {
        const newFilter = Object.assign(this.state.filters, {
            [event.target.id] : event.target.value
        })

        return this.setState(Object.assign(this.state, { filters: newFilter }));
    }

    private setFeatures(event: any) {
        return this.setState(Object.assign(this.state, { features: event }));
    }

    private applyFilters() {
       console.log(this.state)
       this.getCategoryData();
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });
        this.setState(newState);
    }
    
    private setCategory(ctg: CategoryTypes) {
        this.setState(Object.assign(this.state, {
            category: ctg,
        }));
    }

    private  setSubcategories( subcs: CategoryTypes[]) {
        this.setState(Object.assign(this.state, {
            subcategories: subcs
        }));
    }

    private  setItems(its: ArticleType[]) {
        this.setState(Object.assign(this.state, {
            items: its
        }));
    }

    private setLoggined(IsLoggin: boolean) {
        const newState = Object.assign(this.state, {
            IsUserLoggedIn: IsLoggin
        });
        this.setState(newState);
    }
    componentDidMount(): void {
        this.getCategoryData();
    }

    componentDidUpdate(nextProps: CategoryPageProps): void {
        if (nextProps.match.params.cId === this.props.match.params.cId)
            return;
        this.getCategoryData();
    }

    private async getCategoryData() {
       await api('/api/category/' + this.props.match.params.cId, "get", {})
        .then((res: ApiResponse) => {
            if (res.status !== 'ok') 
                if (res.status === 'login Error')
                    return this.setLoggined(false);
                else 
                    return this.setErrorMessage(res.status+"1");
                    
            
            const categoryApi: CategoryTypes = {
                categoryId: Number(res.data.categoryId),
                name: res.data.name
            }   
    
            this.setCategory(categoryApi);
            
            const categories: CategoryTypes[] = res.data.categories.map((category: CategoryDto) => {
                return {
                    categoryId: category.categoryId,
                    name: category.name
                }
            })
            
            this.setSubcategories(categories);
        })

        const orderParts = this.state.filters.orderBy.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();
        const featureFilters: any[] = [];

        for (const item of this.state.filters.selectedFeatures) {
            let found = false;
            let foundRef = null;

            for (const featureFilter of featureFilters) {
                if (featureFilter.featureId === item.featureId) {
                    found = true;
                    foundRef = featureFilter;
                    break;
                }
            }
            if (!found) {
                featureFilters.push({
                    featureId: item.featureId,
                    values: [item.value],
                })
            } else {
                foundRef.values.push(item.value);
            }
        }

        api('/api/article/search', 'post', {
            categoryId: Number(this.props.match.params.cId),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMin,
            priceMax: Number(this.state.filters.priceMax),
            features: featureFilters,
            orderBy: orderBy,
            orderDirection: orderDirection
        }).then((res: ApiResponse) => {
            if (res.status === 'login Error')
                return this.setLoggined(false);
            
            else if (res.status === 'service Error')
                return this.setErrorMessage("Bad search " + res.status);
            if (res.data.errorStatus === 0)
            {
                this.setErrorMessage("");
                this.setItems([]);
                return;
            }
            
            
            const articles: ArticleType[] = res.data.map(this.FillArticleType);
            this.setItems(articles);
            this.getFeatures();
        })
    }

    private FillArticleType(article: ArticleDto) {
        const object: ArticleType = {
            articleId: article.articleId,
            name: article.name,
            excerpt: article.excerpt,
            description: article.description,
            imagePath: '',
            price: 0,   
        }
        if (article.photos !== undefined && article.photos.length !== 0)
            object.imagePath = article.photos[article.photos.length - 1].imagePath;
        
        if (article.articlePrices !== undefined && article.articlePrices.length !== 0)
            object.price = article.articlePrices[article.articlePrices.length - 1].price;
        
        return object;
    }

    private getFeatures() {
        api('api/feature/values/' + this.props.match.params.cId, 'get', {})
            .then((res: ApiResponse) => {

                if (res.status === 'login Error')
                    return this.setLoggined(false);
            
                else if (res.status === 'service Error')
                    return this.setErrorMessage("Bad search " + "Please try to refresh page. ");
                if (res.data.errorStatus === 0) {
                    this.setErrorMessage("");
                    return;
                }

                this.setFeatures(res.data.features);
            })
    }
} 



export default CategoryPage;