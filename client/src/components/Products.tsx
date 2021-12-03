import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createProduct, deleteProduct, getProducts, patchProduct } from '../api/products-api'
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

  handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductCategory: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductPrice: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductDescription: event.target.value })
  }

  handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newStockName: event.target.value })
  }


  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/products/${productId}/edit`)
  }

  onProductCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      //const dueDate = this.calculateDueDate()
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
        newProductPrice: '',
        newProductDescription: '',
        newProductStock: ''
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
        <Header as="h1">Products</Header>

        {this.renderCreateProductInput()}

        {this.renderProducts()}
      </div>
    )
  }

  renderCreateProductInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onProductCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
          <Input
            fluid
            actionPosition="left"
            placeholder="Category"
            onChange={this.handleCategoryChange}
          />
          <Input
            fluid
            actionPosition="left"
            placeholder="Price"
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
            onChange={this.handleStockChange}
          />

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
            <Grid.Row key={product.productId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onProductCheck(pos)}
                  checked={product.done}
                />
              </Grid.Column> */}
              <Grid.Column width={10} verticalAlign="middle">
                {product.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {product.category}
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
              {product.attachmentUrl && (
                <Image src={product.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
