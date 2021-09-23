import {LinearGradient} from "expo-linear-gradient";
import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {StyleSheet, View, Alert, Text, ScrollView, KeyboardAvoidingView, Button, ActivityIndicator} from 'react-native';
import {useDispatch} from "react-redux";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities
    }
  }
  return state;
};

const AuthScreen = (props) => {

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const authHandler = async () => {
    let action;
    if (isSignUp) {
      action = authActions.signup(formState.inputValues.email, formState.inputValues.password)
    } else {
      action = authActions.login(formState.inputValues.email, formState.inputValues.password)
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('Shop');
    } catch (err) {
      setError(err.message)
      setIsLoading(false);
    }

  };

  useEffect(() => {
    if (error) {
      Alert.alert('An Error', error, [{text: 'Ok'}])
    }
  }, [error]);

  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback((inputName, inputValue, inputValidity) => {
    formDispatch({
      type: FORM_INPUT_UPDATE,
      value: inputValue,
      isValid: inputValidity,
      input: inputName
    })
  }, [formDispatch]);

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id='email'
              label='E-Mail'
              keyboardType='email-address'
              required
              email
              autoCapitalize='none'
              errorText='Please enter a valid email address'
              onInputChange={inputChangeHandler}
              initialValue=''
            />

            <Input
              id='password'
              label='Password'
              keyboardType='default'
              secureTextEntry
              required
              autoCapitalize='none'
              minLength={5}
              errorText='Please enter a valid password'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
            <View style={styles.buttonContainer}>
              { isLoading ? (
                <ActivityIndicator size='small' color={Colors.primary} />
              ):(
                <Button
                  title={isSignUp ? 'Sign Up' : 'Login' }
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}` }
                color={Colors.accent}
                onPress={() => {
                  setIsSignUp(prevState => !prevState)
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
   marginTop: 10
  }
});

export default AuthScreen;
