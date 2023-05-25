import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Link, useRouter } from "expo-router";
import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";

import Icon from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import dayjs from "dayjs";
import ptbr from "dayjs/locale/pt-br";
import * as SecureStore from "expo-secure-store";
import { api } from "../src/lib/api";

dayjs.locale(ptbr);

interface MemoriesProps {
  coverUrl: string;
  excerpt: string;
  id: string;
  createdAt: string;
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets();
  const [memories, setMemories] = useState<MemoriesProps[]>([]);

  const route = useRouter();

  async function signOut() {
    await SecureStore.deleteItemAsync("st-token-app");
    route.push("/");
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync("st-token-app");
    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMemories(response.data);
  }

  useEffect(() => {
    loadMemories();
  }, [memories]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      {/* header */}
      <View className="mt-4 flex-col items-center justify-between gap-2 px-6">
        <NLWLogo />
        <View className="flex-row gap-2 space-x-10">
          <Link href="new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color={"#000"} />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color={"#000"} />
          </TouchableOpacity>
        </View>
      </View>

      {memories.length <= 0 ? (
        <View className="mt-40 items-center justify-center">
          <Text className="font-alt text-base text-gray-100 text-center">
            Nenhuma memória registrada até o momento!
          </Text>
        </View>
      ) : (
        <View className="mt-6 space-y-10">
          {memories.map((memory) => {
            return (
              <View key={memory.id} className="space-y-4">
                <View className="flex-row items-center gap-2">
                  <View className="h-px w-5 bg-gray-50" />
                  <Text className="font-body text-xs text-gray-100">
                    {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
                  </Text>
                </View>
                <View className="space-y-2 px-8">
                  <Image
                    source={{
                      uri: memory.coverUrl,
                    }}
                    alt=""
                    className="aspect-video w-full rounded-lg"
                  />
                  <Text className="font-body text-base leading-relaxed text-gray-100">
                    {memory.excerpt}
                  </Text>
                  <Link
                    href={"/memories/id"}
                    className="flex flex-row items-center self-end rounded-full"
                  >
                    <TouchableOpacity className="cursor-pointer flex-row items-center hover:bg-black/20">
                      <Text className="mr-2 font-body text-sm text-gray-100">
                        Ler mais
                      </Text>
                      <Icon
                        name="arrow-right"
                        size={16}
                        color={"#9e9e9e"}
                      ></Icon>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
