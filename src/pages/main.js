import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';

export default class Main extends Component {
  static navigationOptions = {
    title: 'JSHunt'
  };

  state = {
    productInfo: {},
    docs: [],
    page: 1
  };

  componentDidMount() {
    this.loadProducts();
  }

  loadProducts = async (page = 1) => {
    const response = await api.get(`/products?page=${page}`);

    const { docs, ...productInfo } = response.data;

    this.setState({
      docs: [... this.state.docs, ...docs],
      productInfo,
      page
    });
  };

  renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <TouchableOpacity 
        style={styles.productButton} 
        onPress={() => {
          this.props.navigation.navigate('Product', { product: item });
        }}>
        <Text style={styles.productButtonText}>Acessar</Text>
      </TouchableOpacity>
    </View>
  )

  loadMore = () => {
    const { page, productInfo } = this.state;

    if ( page === productInfo.pages ) return;

    const pageNumber = page + 1;

    this.loadProducts(pageNumber);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list} 
          data={this.state.docs}
          keyExtractor={item => item._id}
          renderItem={this.renderItem}
          onEndReached={this.loadMore}
          onEndReachedThereshold={0.1}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  },
  list: {
    padding: 20
  },
  productContainer:  {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5
  },
  productTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold'
  },
  productDescription: {
    color: '#999',
    marginTop: 5,
    fontSize: 16,
    lineHeight: 24
  },
  productButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42, 
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#DA552F',
    borderRadius: 5,
    backgroundColor: 'transparent'
  },
  productButtonText: {
    color: '#DA552F',
    fontSize: 16,
    fontWeight: 'bold'
  }
});