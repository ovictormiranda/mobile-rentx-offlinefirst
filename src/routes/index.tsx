import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SplashRoutes } from './splash.routes';

export function Routes(){

  return (
    <NavigationContainer>
      <SplashRoutes />
    </NavigationContainer>
  );
}
