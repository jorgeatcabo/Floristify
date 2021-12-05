import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment,Icon } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditProduct } from './components/EditProduct'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Products } from './components/Products'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            
              <Grid.Column width={16}>
                <Router history={this.props.history}>

                  <h1>Floristify Backend</h1>

                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
     
      <Menu compact icon='labeled'>

        <Menu.Item name="home" >
          <Icon name='home' />
          <Link to="/">Home</Link>
        </Menu.Item>
       
          {this.logInLogOutButton()}

          {this.storetButton()}
           
    </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          <Icon name='user'  />
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          <Icon name='user'  />
          Log In
        </Menu.Item>
      )
    }
  }

  storetButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="shopping cart" >
        <Icon name='shopping cart' />
        <Link to="/store" target='_blank'>My Store</Link>
      </Menu.Item>  
      )

    }
  }
  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <Products {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/products/:productId/edit"
          exact
          render={(props) => {
            return <EditProduct {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/store"
          exact
          render={(props) => {
            return <Products {...props} auth={this.props.auth} />
          }}
        />
        <Route component={NotFound} />
      </Switch>
    )
  }
}
