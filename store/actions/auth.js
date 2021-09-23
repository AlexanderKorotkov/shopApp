import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (token, userId, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      token,
      userId
    })
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    try {
      const res = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDEN4-l1__2BgentyytTJFPHG97NGeAomc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );

      console.log(res);

      if (!res.ok) {
        const errorResData = await res.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_EXISTS') {
          message = 'Email already exist'
        }
        throw new Error(message)
      }

      const resData = await res.json();

      dispatch(
        authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000)
      );
      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
      saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    } catch (err) {
      throw err
    }
  }
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const res = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDEN4-l1__2BgentyytTJFPHG97NGeAomc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );

      if (!res.ok) {
        const errorResData = await res.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_NOT_FOUND' || 'INVALID_PASSWORD') {
          message = 'Email or Password is not correct!'
        }
        throw new Error(message)
      }

      const resData = await res.json();

      dispatch(
        authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000)
      );
      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
      saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    } catch (err) {
      throw err
    }
  }
};

export const logout = () => {
  clearLogoutTImer();
  AsyncStorage.removeItem('userData');
  return {
    type: LOGOUT,
  }
};

const clearLogoutTImer = () => {
  if (timer) {
    clearTimeout(timer)
  }
};

const setLogoutTimer  = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime)
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token,
    userId,
    expiryDate: expirationDate.toISOString()
  }))
};