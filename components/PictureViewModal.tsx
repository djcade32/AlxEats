import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";

interface PictureViewModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
}

const PictureViewModal = ({ isModalVisible, toggleModal }: PictureViewModalProps) => {
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
        <Image
          source={require("@/assets/images/food-4.jpeg")}
          style={{ height: 300, width: 300, borderRadius: 5, marginTop: 10, aspectRatio: 1 }}
        />
      </View>
    </Modal>
  );
};

export default PictureViewModal;

const styles = StyleSheet.create({
  modal: {
    // backgroundColor: "white",
    // padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
