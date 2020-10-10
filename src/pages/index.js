import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './login';
import Home from './home';

const MainNav = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false,
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false,
    },
  },
});

export default createAppContainer(MainNav);
