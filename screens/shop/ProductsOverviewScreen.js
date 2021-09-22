import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Platform, FlatList, Button, View, ActivityIndicator, Text} from 'react-native';
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {useSelector, useDispatch} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Colors from "../../constants/Colors";
import * as cartActions from '../../store/actions/cart'
import * as productActions from '../../store/actions/products'

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message)
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [loadProducts]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
    return () => {
      willFocusSub.remove();
    }
  }, [loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: 'ProductDetail',
      params: {
        prodId: id,
        productTitle: title
      }
    })
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size='large'
          color={Colors.primary}
        />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An Error Occurred</Text>
        <Button title='Try again' onPress={loadProducts} color={Colors.primary} />
      </View>
    )
  }

  if (!isLoading && !products.length) {
    return (
      <View style={styles.centered}>
        <Text>No Products Found!</Text>
      </View>
    )
  }

  return (
      <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
        keyExtractor={products.id}
        renderItem={itemData =>
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() =>{
              selectItemHandler(itemData.item.id, itemData.item.title)
            }}>
            <Button
              color={Colors.primary}
              title='View Details'
              onPress={() =>{
                selectItemHandler(itemData.item.id, itemData.item.title)
              }}
            />
            <Button
              color={Colors.primary}
              title='To Cart'
              onPress={() =>{
                dispatch(cartActions.addToCart(itemData.item))
              }}
            />
          </ProductItem>
        }
      />

  );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer()
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () =>  (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Cart'
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart')
          }}
        />
      </HeaderButtons>
    )
  };

};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProductsOverviewScreen;
