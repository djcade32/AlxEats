import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator, Text } from "react-native";
import Modal from "react-native-modal";

interface PictureViewModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  photoUrl: string | null;
}

const PictureViewModal = ({ isModalVisible, toggleModal, photoUrl }: PictureViewModalProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  if (!photoUrl) return;

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal}
      backdropColor={Colors.black}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={300}
      animationOutTiming={300}
    >
      <View style={styles.modal}>
        {!isLoaded && (
          <View style={{ position: "absolute", top: 150 }}>
            <ActivityIndicator size="large" color={Colors.lightGray} />
          </View>
        )}
        <Image onLoad={() => setIsLoaded(true)} source={{ uri: photoUrl }} style={styles.image} />
      </View>
    </Modal>
  );
};

export default PictureViewModal;

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  image: {
    height: 300,
    width: 300,
    borderRadius: 5,
    marginTop: 10,
    aspectRatio: 1,
  },
});
