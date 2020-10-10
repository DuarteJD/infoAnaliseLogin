import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Base64 from '../services/base64';

Icon.loadFont();

import {
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import axios from '../services/api';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: '',
      senha: '',
      hash: '',
      url: '',
      error: '',
      valida: false,
    };
  }

  componentDidMount() {
    this.pegarDadosStorage();
  }

  pegarDadosStorage = async () => {
    const usuarioSave = await AsyncStorage.getItem('@usuario');
    const senhaSave = await AsyncStorage.getItem('@senha');

    if (usuarioSave || senhaSave) {
      this.setState({
        usuario: usuarioSave,
        senha: senhaSave,
      });
    }
  };

  pegarData() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = dia.length === 1 ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = mes.length === 1 ? '0' + mes : mes,
      anoF = data.getFullYear();
    return anoF + '-' + mesF + '-' + diaF;
  }

  gerarToken() {
    var header = {
      typ: 'JWT',
      alg: 'HS256',
    };
    var newDate = new Date(this.pegarData());
    var payload = {
      exp: newDate.getTime() / 1000,
      uid: 1,
      email: this.state.usuario,
    };
    header = JSON.stringify(header);
    payload = JSON.stringify(payload);
    header = Base64.btoa(header);
    payload = Base64.btoa(payload);
    var sign = '';
    var token = header + '.' + payload + '.' + sign;
    return token;
  }

  validarLogin = async () => {
    const {usuario, senha} = this.state;
    const hash = this.gerarToken();
    this.setState({valida: true});
    var url = '?app=1';
    var bodyFormData = new FormData();
    bodyFormData.append('LoginVisitante[user]', usuario);
    bodyFormData.append('LoginVisitante[pass]', senha);
    bodyFormData.append('LoginVisitante[hash]', hash);
    axios({
      method: 'POST',
      url: url,
      data: bodyFormData,
    })
      .then((response) => {
        if (response.data === '0') {
          this.setState({valida: false});
          this.setState({error: 'Usuário ou Senha incorretos.'});
        } else {
          Keyboard.dismiss();
          this.setState({url: response.data});
          this.setState({usuario: usuario});
          this.setState({senha: senha});
          this.salvarDadosStorage();
          this.props.navigation.navigate('Home', {
            url: this.state.url,
          });
          this.setState({valida: false});
        }
      })
      .catch((e) => {
        this.setState({valida: false});
        this.setState({
          error: 'Erro ao tentar conectar ao servidor, verifique seu acesso.',
        });
      });
  };

  salvarDadosStorage = async () => {
    const {usuario, senha} = this.state;
    await AsyncStorage.setItem('@usuario', usuario);
    await AsyncStorage.setItem('@senha', senha);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/ia.png')} style={styles.logo} />

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#738dce"
          autoCapitalize="none"
          onChangeText={(usuario) => this.setState({usuario})}
          value={this.state.usuario}
        />

        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Senha"
          placeholderTextColor="#738dce"
          autoCapitalize="none"
          onChangeText={(senha) => this.setState({senha})}
          value={this.state.senha}
        />

        <Text style={styles.errorText}>{this.state.error}</Text>

        {!this.state.valida && (
          <TouchableOpacity
            style={styles.buttom}
            onPress={() => {
              this.validarLogin();
            }}>
            <Text style={styles.buttomText}>
              {' '}
              <Icon name="login" size={16} color="#fff" type="AntDesign" />{' '}
              Entrar
            </Text>
          </TouchableOpacity>
        )}

        {this.state.valida && <ActivityIndicator size="large" color="black" />}

        <Text style={styles.versaoText}>0.1.03092020</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  logo: {
    width: 175,
    height: 175,
    marginBottom: 10,
  },

  input: {
    marginTop: 10,
    width: 300,
    padding: 10,
    backgroundColor: '#e5e5e5',
    color: 'black',
    fontSize: 14,
    borderRadius: 4,
  },

  buttom: {
    marginTop: 20,
    width: 300,
    height: 42,
    backgroundColor: '#2a2c2d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  buttomText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e5e5',
  },

  versaoText: {
    marginTop: 5,
    fontSize: 8,
    color: '#3f5fac',
    alignItems: 'baseline',
  },

  errorText: {
    fontSize: 14,
    color: '#e60000',
    marginTop: 5,
  },
});
