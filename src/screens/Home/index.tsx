import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';

import Logo from '../../assets/logo.svg';
import  { api }  from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';

import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
} from './styles';

export function Home(){
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const netInfo = useNetInfo();
  const navigation = useNavigation<any>();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car });
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        if(isMounted){
          setCars(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if(isMounted){
          setLoading(false);
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false; //garantir que o estado só será atualizado enquanto estiver montando a tela
    };    //essa função é equivalente ao 'antigo' didUnmounted
  }, []);

  useEffect(() => {
    if(netInfo.isConnected){
      Alert.alert('Você está on-line!')
    } else {
      Alert.alert('Você está off-line!')
    }
  },[netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />

         {
            !loading &&
            <TotalCars>
              total {cars.length} carros
            </TotalCars>
          }
        </HeaderContent>
      </Header>
      { loading ? <LoadAnimation /> :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <Car
              data={item}
              onPress={() => handleCarDetails(item)}
            />
          }
        />
      }
    </Container>
  );
}
