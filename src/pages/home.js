import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  SafeAreaView,
  View,
  Text,
  Platform,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';

Icon.loadFont();

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioFMC: '',
    };
    this.webViewRef = React.createRef();
  }

  onAndroidBackPress = () => {
    if (this.webViewRef) {
      this.webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onAndroidBackPress,
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
    });
  }

  render() {
    const {navigation} = this.props;

    const url = navigation.getParam('url');

    const urlLogin = url + '&app=1';

    const btVoltar = () => {
      this.webViewRef.current.goBack();
    };

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Login'})],
    });

    const btSair = () => {
      this.props.navigation.dispatch(resetAction);
    };

    return (
      <SafeAreaView style={{flex: 1}}>
        <WebView
          source={{uri: urlLogin}}
          ref={this.webViewRef}
          startInLoadingState={true}
          renderLoading={() => (
            <>
              <View>
                <Text>Carregando</Text>
              </View>
            </>
          )}
          originWhitelist={['*']}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          automaticallyAdjustContentInsets={true}
          useWebKit
        />

        {Platform.OS === 'ios' && (
          <View style={style.viewBottom}>
            <TouchableOpacity onPress={btVoltar} style={style.btVoltar}>
              <Text>
                {' '}
                <Icon name="arrowleft" size={16} color="#000" /> Voltar{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={btSair} style={style.btSair}>
              <Text>
                {' '}
                Sair <Icon name="logout" size={16} color="#000" />{' '}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {Platform.OS === 'android' && (
          <View style={style.viewBottom}>
            <TouchableOpacity
              onPress={btSair}
              style={style.btSair}
              justifyContent="center">
              <Text style={{color: 'white'}}>
                {' '}
                <Icon name="logout" size={16} color="white" /> Sair{' '}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  viewBottom: {
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#2a2c2d',
    color: 'white',
  },
  btVoltar: {
    backgroundColor: '#d4d4d4',
    paddingTop: 15,
    paddingBottom: 10,
    paddingRight: 25,
    paddingLeft: 25,
  },
  btSair: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 25,
    justifyContent: 'center',
  },
});
