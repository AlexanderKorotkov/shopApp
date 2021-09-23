import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, FlatList, Text, Platform, View, ActivityIndicator} from 'react-native';
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {useSelector, useDispatch} from "react-redux";
import OrderItem from "../../components/shop/OrderItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Colors from "../../constants/Colors";
import * as ordersActions from '../../store/actions/orders'

const OrdersScreen = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  const loadOrdersHandler = useCallback(async () => {
    setIsLoading(true);
    await dispatch(ordersActions.fetchOrders());
    setIsLoading(false);
  });

  useEffect(() => {
    loadOrdersHandler();
  }, [setIsLoading]);

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

  if (!orders.length) {
    return (
      <View style={styles.centered}>
        <Text>No Orders Found!</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={orders}
      renderItem={(itemData) => {
        return (
          <OrderItem
            items={itemData.item.items}
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
          />
        )
      }}
    />
  );
};

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Your Orders',
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
  }
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default OrdersScreen;
