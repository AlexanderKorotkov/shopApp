import React from 'react';
import {createStackNavigator} from 'react-navigation-stack'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import {useDispatch} from "react-redux";
import Colors from "../constants/Colors";
import {Platform, SafeAreaView, Button, View} from "react-native";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import {Ionicons} from "@expo/vector-icons";
import StartUpScreen from "../screens/StartUpScreen";
import AuthScreen from "../screens/user/AuthScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import * as authActions from "../store/actions/auth";

const defaultNavOprions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : '',

};

const ProductNavigator = createStackNavigator({
  ProductsOverview: ProductsOverviewScreen,
  ProductDetail: ProductDetailScreen,
  Cart: CartScreen,
}, {
  navigationOptions: {
    drawerIcon: (drawerConfig) =>
      <Ionicons
        name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
        size={23}
        color={drawerConfig.tintColor}
      />
  },
  defaultNavigationOptions: defaultNavOprions
});

const OrdersNavigator = createStackNavigator({
  Orders: OrdersScreen,
}, {
  navigationOptions: {
    drawerIcon: (drawerConfig) =>
      <Ionicons
        name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
        size={23}
        color={drawerConfig.tintColor}
      />
  },
  defaultNavigationOptions: defaultNavOprions
});

const AdminNavigator = createStackNavigator({
  UserProducts: UserProductsScreen,
  EditProduct: EditProductScreen,
}, {
  navigationOptions: {
    drawerIcon: (drawerConfig) =>
      <Ionicons
        name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
        size={23}
        color={drawerConfig.tintColor}
      />
  },
  defaultNavigationOptions: defaultNavOprions
});

const ShopNavigator = createDrawerNavigator({
  Products: ProductNavigator,
  Orders: OrdersNavigator,
  Admin: AdminNavigator
}, {
  contentOptions: {
    activeTintColor: Colors.primary
  },
  contentComponent: (props) => {
    const dispatch = useDispatch();
    return (
      <View style={{flex: 1, padding: 20}}>
        <SafeAreaView forceInset={{top: 'always', horizontal: 'newer'}}>
          <DrawerItems {...props} />
          <Button title='Logout' color={Colors.primary} onPress={() => {
            dispatch(authActions.logout());
          }} />
        </SafeAreaView>
      </View>
    )
  }
});

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen
}, {
  defaultNavigationOptions: defaultNavOprions
});

const MainNavigator = createSwitchNavigator({
  StartUp: StartUpScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);