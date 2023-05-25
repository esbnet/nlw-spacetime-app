import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { useEffect } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";
import Stripes from "../src/assets/stripes.svg";

import { api } from "../src/lib/api";

const StyledStripes = styled(Stripes);

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/f7319650946839d29f4f",
};

export default function App() {
  const router = useRouter();

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "f7319650946839d29f4f",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post("/register", { code, platform: 'app' });
    const { token } = response.data;
    await SecureStore.setItemAsync("st-token-app", token);
    router.push("/memories");
  }

  useEffect(() => {
    // console.log(makeRedirectUri({
    //   scheme: 'nlwspacetime'
    // }),)
    if (response?.type === "success") {
      const { code } = response.params;
      handleGithubOAuthCode(code);
    }
  }, [response]);

  if (!hasLoadedFonts) return null;

  return (
    <View className="flex-1 items-center  px-8 py-10">
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
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase leading-none text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

      <StatusBar style="light" translucent />
    </View>
  );
}
