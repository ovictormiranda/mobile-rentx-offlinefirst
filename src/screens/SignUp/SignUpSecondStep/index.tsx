import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';

import { api } from '../../../services/api';

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle
} from './styles';

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  }
}

export function SignUpSecondStep(){
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { user } = route.params as Params;  //here, recovering data through params from the last route SignUpFirstStep

  function handleBack() {
    navigation.goBack();
  }

  async function handleRegister() {
    if (!password || !passwordConfirm) {
      return Alert.alert('Informe a senha e a confirmação de senha.');
    }

    if (password != passwordConfirm) {
      return Alert.alert('Por favor, insira 2 senhas iguais.')
    }

    //sending signUp information to the api
    await api.post('/users', {
      name: user.name, //name, email, and driver license comes from the last route SignUpFirstStep
      email: user.email, // cause of that we had to pass this information as user.name
      driver_license: user.driverLicense,
      password,  //this comes from here, from this page/route
    })
    .then(() =>{
      navigation.navigate('Confirmation', {
        nextScreenRoute: 'SignIn',
        title: 'Conta criada!',
        message: `Agore é só fazer login\ne aproveitar.`
      });
    })
    .catch(() => {
      Alert.alert('Opa!', 'Não foi possível cadastrar :/')
    });
  }


// using the keyboardAvoiding View we CANT use FLEX: 1 on CONTAINER component (styles)
// cause it broken the interface, to fix just exclude the flex style on CONTAINER component
  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet active/>
              <Bullet active={false} />
            </Steps>
          </Header>

          <Title>
            Crie sua{'\n'}conta
          </Title>
          <Subtitle>
            Faça seu cadastro de{'\n'}
            forma rápida e fácil
          </Subtitle>

          <Form>
            <FormTitle>2. Senha</FormTitle>
            <PasswordInput
              iconName='lock'
              placeholder='Senha'
              onChangeText={setPassword}
              value={password}
            />
            <PasswordInput
              iconName='lock'
              placeholder='Repetir Senha'
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
          </Form>

          <Button
            title="Cadastrar"
            color={theme.colors.success}
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
