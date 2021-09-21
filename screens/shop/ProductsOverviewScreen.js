import React from 'react';
import {StyleSheet, Platform, FlatList, Button, View} from 'react-native';
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {useSelector, useDispatch} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Colors from "../../constants/Colors";
import * as cartActions from '../../store/actions/cart'

const ProductsOverviewScreen = (props) => {

  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const selectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: 'ProductDetail',
      params: {
        prodId: id,
        productTitle: title
      }
    })
  };

  return (
      <FlatList
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

const styles = StyleSheet.create({});

export default ProductsOverviewScreen;
