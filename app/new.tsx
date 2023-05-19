import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";
import { Link } from "expo-router";

import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets();

  const [isPublic, setIsPublic] = useState(false);

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-center gap-2">
        <NLWLogo />

        <Link href="/memories">
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color={"#fff"} />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={!isPublic ? "#c0c0c0" : "#9b79ea"}
            trackColor={{ false: "#372560", true: "#c0c0c0" }}
          />
          <Text className="font-body text-base text-gray-200 ">
            {" "}
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          <View className="flex-row items-center gap-2">
            <Icon name="image" color={"#fff"} />
            <Text className="font-body text-sm text-gray-200">
              Adicionar foto ou vídeo de capa
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          multiline
          className="rounded-sm border border-dashed border-gray-500 bg-black/10 p-1 font-body text-sm text-gray-50 "
          placeholderTextColor={"#565656"}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2 items-center self-end"
          // onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase leading-none text-black">
            Salvar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
