import { History } from 'history'
import * as React from 'react'
import {
  Grid,
  Icon,
  Image,
  Loader,
  Card
} from 'semantic-ui-react'

import {  getProducts } from '../api/products-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'

interface ProductsProps {
  auth: Auth
  history: History
}

interface ProductsState {
  products: Product[]
  newProductName: string
  newProductCategory: string  
  newProductPrice: number
  newProductDescription: string
  newProductStock: number
  loadingProducts: boolean
}

export class Store extends React.PureComponent<ProductsProps, ProductsState> {
  state: ProductsState = {
    products: [],
    newProductName: '',
    newProductCategory: '',
    newProductPrice: 0,
    newProductDescription: '',
    newProductStock: 0,    
    loadingProducts: true
  }

  async componentDidMount() {
    try {
      const products = await getProducts(this.props.auth.getIdToken())
      this.setState({
        products,
        loadingProducts: false
      })
    } catch (e) {
      alert(`Failed to fetch products: ${e}`)
    }
  }

  render() {
    return (
      <div>
     
        
        <h1>Floristify Store</h1>
        {this.renderProducts()}

      </div>
    )
  }

 

  renderProducts() {
    if (this.state.loadingProducts) {
      return this.renderLoading()
    }

    return this.renderProductsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Products
        </Loader>
      </Grid.Row>
    )
  }

  renderProductsList() {
    return (
      <Grid padded>
        {this.state.products.map((product, pos) => {
          return (
              <Grid.Column width={4} verticalAlign="middle">
                
                  <Card>
                      {product.attachmentUrl && (
                        <Image src={product.attachmentUrl} size="small" wrapped ui={false}  />
                      )}

                      <Card.Content>
                        <Card.Header>{product.name}</Card.Header>
                        <Card.Meta>
                          <span className='date'>{product.category}</span>
                        </Card.Meta>
                        <Card.Description>
                          {product.description}
                        </Card.Description>
                      </Card.Content>

                      <Card.Content extra>
                          <Icon name='dollar sign' />
                          {product.price}
                      </Card.Content>

                  </Card>

          </Grid.Column>
          )
        })}
      </Grid>
    )
  }

}
