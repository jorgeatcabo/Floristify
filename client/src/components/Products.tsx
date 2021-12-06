import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Icon,
  Input,
  Image,
  Loader,
  Dropdown,
  Header,
  Container
} from 'semantic-ui-react'

import { createProduct, deleteProduct, getProducts, patchProduct } from '../api/products-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'
import {categories} from '../data/categories'

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

export class Products extends React.PureComponent<ProductsProps, ProductsState> {
  state: ProductsState = {
    products: [],
    newProductName: '',
    newProductCategory: '',
    newProductPrice: 0,
    newProductDescription: '',
    newProductStock: 0,    
    loadingProducts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductName: event.target.value })
  }

  handleCategoryChange = (event: React.SyntheticEvent<HTMLElement>, data:any) => {
  this.setState({newProductCategory:data.value})
}

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductPrice: event.target.valueAsNumber })
  }


  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductDescription: event.target.value })
  }

  handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductStock: event.target.valueAsNumber })
  }


  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/products/${productId}/edit`)
  }


  onProductCreate = async () => {
    try {
      const newProduct = await createProduct(this.props.auth.getIdToken(), {
        name: this.state.newProductName,
        category:this.state.newProductCategory,
        price:this.state.newProductPrice,
        description:this.state.newProductDescription,
        stock:this.state.newProductStock
      })
      this.setState({
        products: [...this.state.products, newProduct],
        newProductName: '',
        newProductCategory: '',
        newProductPrice: 0,
        newProductDescription: '',
        newProductStock: 0
      })
    } catch {
      alert('Product creation failed')
    }
  }

  onProductDelete = async (productId: string) => {
    try {
      await deleteProduct(this.props.auth.getIdToken(), productId)
      this.setState({
        products: this.state.products.filter(product => product.productId !== productId)
      })
    } catch {
      alert('Product deletion failed')
    }
  }

  onProductCheck = async (pos: number) => {
    try {
      const product = this.state.products[pos]
      await patchProduct(this.props.auth.getIdToken(), product.productId, {
        name: product.name,
        category:product.category,
        price:product.price,
        description:product.description,
        stock:product.stock
      })
      this.setState({
        products: update(this.state.products, {
        })
      })
    } catch {
      alert('Product deletion failed')
    }
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
     
        {this.renderCreateProductInput()}
        <h1>Products</h1>
        {this.renderProducts()}

      </div>
    )
  }

  renderCreateProductInput() {
    return (
      <Grid.Row>
        <h1>Floristify Backend</h1>
        <Grid.Column width={16}>
        <Input
            fluid
            actionPosition="left"
            placeholder="Name"
            onChange={this.handleNameChange}
          />
          <Dropdown
    placeholder='Select Category'
    fluid
    selection
    options={categories}
    value={this.state.newProductCategory}
    onChange={this.handleCategoryChange}
  />
          <Input
            fluid
            actionPosition="left"
            placeholder="Price"
            type="number"
            onChange={this.handlePriceChange}
          />
          <Input
            fluid
            actionPosition="left"
            placeholder="Description"
            onChange={this.handleDescriptionChange}
          />
          <Input
            fluid
            actionPosition="left"
            placeholder="Stock"
            type="number"
            onChange={this.handleStockChange}
          />
       
          <Button
          color="green" inverted
          fluid
          onClick={this.onProductCreate}>
          <Icon name="checkmark" /> Add Product
          </Button>

        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
        
            <><Container>

              <Grid.Row>

                <Grid.Column width={16}>
                  <Header textAlign="center" dividing size='huge'>
                  {product.attachmentUrl && (
                  <Image src={product.attachmentUrl} size="huge"  />
                 )}
                  </Header>
                </Grid.Column>
              
              </Grid.Row>
            </Container>
            
            <Grid.Row key={product.productId}>

              <Grid.Column width={3} floated="right">
                  <Header textAlign="left" dividing>
                    Name
                  </Header>
                  {product.name}
                </Grid.Column>

                <Grid.Column width={2} floated="right">
                  <Header textAlign="left" dividing>
                    Category
                  </Header>
                  {product.category}
                </Grid.Column>

                <Grid.Column width={2} floated="right">
                  <Header textAlign="left" dividing>
                    Price
                  </Header>
                  {product.price}
                </Grid.Column>

                <Grid.Column width={4} floated="right">
                  <Header textAlign="left" dividing>
                    Description
                  </Header>
                  {product.description}
                </Grid.Column>

                <Grid.Column width={2} floated="right">
                  <Header textAlign="left" dividing>
                    Stock
                  </Header>
                  {product.stock}
                </Grid.Column>

                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(product.productId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Grid.Column>

                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onProductDelete(product.productId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Grid.Column>

                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
              </Grid.Row></>
          
          )
          
        })}
      </Grid>
      
    )
  }

}
