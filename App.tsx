import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import blurBg from "./src/assets/bg-blur.png";

import Stripes from "./src/assets/stripes.svg";
import NLWLogo from "./src/assets/nlw-spacetime-logo.svg";

import { styled } from "nativewind";
import { useEffect } from "react";

const StyledStripes = styled(Stripes);

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/f7319650946839d29f4f',
};

export default function App() {

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'f7319650946839d29f4f',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  useEffect(() => {

    // console.log(makeRedirectUri({
    //   scheme: 'nlwspacetime'
    // }),)

    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  if (!hasLoadedFonts) return null;

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 items-center bg-gray-900 px-8 py-10"
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe com o
            mundo!
          </Text>
        </View>

        <TouchableOpacity 
        activeOpacity={0.7} 
        className="rounded-full bg-green-500 px-5 py-2"
        onPress={()=>signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black leading-none">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">Feito com 💜 no NLW da Rocketseat</Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  );
}
