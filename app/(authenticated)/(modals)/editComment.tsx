import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import { useRestaurantRankingStore } from "@/store/restaurantRanking-storage";
import { updateRestaurantComment } from "@/firebase";
import { useAppStore } from "@/store/app-storage";

const editComment = () => {
  let restaurantId = useLocalSearchParams<any>().restaurantId as any;

  const { comment, updateComment } = useRestaurantRankingStore();
  const router = useRouter();
  const { userDbInfo } = useAppStore();
  const { height } = Dimensions.get("window");
  const [commentDraft, setCommentDraft] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const textInputRef = useRef<TextInput | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get keyboard height
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      ({ endCoordinates }) => {
        setKeyboardHeight(endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    setCommentDraft(comment);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Focus text input when edit mode is enabled
  useEffect(() => {
    if (editMode) {
      textInputRef.current?.focus();
      // scroll to end after text input is focused
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 700);
    }
  }, [editMode]);

  function scrollViewSizeChanged(height: number) {
    if (!isFocused) return;
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }

  const hanleSavePressed = async () => {
    //Save updated comment in db
    setIsSaving(true);
    updateComment(commentDraft);
    await updateRestaurantComment(userDbInfo!.id, restaurantId, commentDraft);
    setEditMode(false);
    router.back();
  };

  const OFFSET = 50;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: editMode ? "Edit Comments" : "Comments",
          headerTitleStyle: { fontFamily: "nm-b", fontSize: Font.medium },
          headerLeft: () => (
            <View style={styles.headerIconContainer}>
              {editMode ? (
                <TouchableOpacity
                  disabled={isSaving}
                  style={{ justifyContent: "center" }}
                  onPress={() => {
                    router.back();
                    setEditMode(false);
                  }}
                >
                  <Text style={{ color: Colors.error, fontSize: 18 }}>Cancel</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity disabled={isSaving} onPress={() => router.back()}>
                  <Ionicons name="chevron-back-circle-outline" size={30} color={Colors.black} />
                </TouchableOpacity>
              )}
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerIconContainer}>
              {editMode ? (
                <>
                  {isSaving ? (
                    <ActivityIndicator size={"small"} color={Colors.primary} />
                  ) : (
                    <TouchableOpacity onPress={hanleSavePressed}>
                      <Text style={{ color: Colors.primary, fontSize: 18 }}>Save</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setEditMode(true);
                  }}
                >
                  <Text style={{ color: Colors.primary, fontSize: 18 }}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      ></Stack.Screen>

      <ScrollView
        ref={scrollViewRef}
        style={{
          maxHeight: isFocused ? height - keyboardHeight - OFFSET : "100%",
        }}
        onContentSizeChange={(_, height) => {
          const scrollViewHeight = height;
          scrollViewSizeChanged(scrollViewHeight + 40);
        }}
        contentInset={{ bottom: 10 }}
      >
        <TextInput
          ref={textInputRef}
          style={[styles.textInputContainer, { paddingBottom: isFocused ? 100 : 20 }]}
          value={commentDraft}
          onChangeText={(text) => setCommentDraft(text)}
          placeholder="Comments about the restaurant..."
          placeholderTextColor={Colors.gray}
          multiline
          selectionColor={Colors.primary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editMode}
        />
      </ScrollView>
    </View>
  );
};

export default editComment;

const styles = StyleSheet.create({
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },

  textInputContainer: {
    padding: 10,
    lineHeight: 20,
    color: Colors.black,
  },
});
