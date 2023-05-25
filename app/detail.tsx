import {
    Image,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Link, useRouter } from "expo-router";
import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";

import Icon from "@expo/vector-icons/Feather";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { api } from "../src/lib/api";

type MemoryProps = {
  content: string;
  isPublic: string;
  coverUrl: string;
  createAt: string;
};

export default function EditMemory({ id: string }) {
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [memory, setMemory] = useState<MemoryProps | null>(null);

  async function loadMemories(id: string) {
    const token = await SecureStore.getItemAsync("st-token-app");
    const response = await api.get("/update/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMemory(response.data);
  }

  async function openImagePicker() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      // console.log(result);

      if (result.assets[0]) {
        setPreview(result.assets[0].uri);
        setImageType(result.assets[0].type);
      }
    } catch (error) {
      console.log("erro: não conseguiu ler a imagem. " + error);
    }
  }

  async function hadleEditMemory() {
    const token = await SecureStore.getItemAsync("st-token-app");
    let coverUrl = "";

    if (preview) {
      const uploadFormData = new FormData();

      uploadFormData.append("file", {
        uri: preview,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      coverUrl = uploadResponse.data.fileUrl;
    }

    await api.put(
      "/memories",
      { content, isPublic, coverUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push("/memories");
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-center gap-2">
        <NLWLogo />

        <Link href="/memories" asChild>
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
          onPress={openImagePicker}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color={"#fff"} />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="rounded-sm border border-dashed border-gray-500 bg-black/10 p-1 font-body text-sm text-gray-50 "
          placeholderTextColor={"#565656"}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />
        <TouchableOpacity
          onPress={hadleEditMemory}
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase leading-none text-black">
            Salvar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
