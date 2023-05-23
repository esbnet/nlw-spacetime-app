import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { useEffect, useState } from "react";

import { ImageBackground } from "react-native";

import * as SecureStore from 'expo-secure-store';

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";

import blurBg from "../src/assets/bg-blur.png";
import Stripes from "../src/assets/stripes.svg";


const StyledStripes = styled(Stripes);

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/f7319650946839d29f4f",
};

export default function Layout() {
  const [isUserAuthenticated, setIsAuthenticated] = useState<null | boolean>(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  useEffect(()=>{
    SecureStore.getItemAsync('st-token-app').then( token =>{
      setIsAuthenticated(!!token)
    })
  },[])

  if (!hasLoadedFonts) return <SplashScreen />;

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StyledStripes className="absolute left-2" />

      <StatusBar style="light" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: 'slide_from_left'
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated}/>
        <Stack.Screen name="memories"/>
        <Stack.Screen name="new"/>
        <Stack.Screen name="detail"/>
      </Stack>
    </ImageBackground>
  );
}
