import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import Colors from "@/constants/Colors";

interface ModalProps {
  isModalVisible: boolean;
  children: React.ReactNode;
}

const CustomModal = ({ children, isModalVisible }: ModalProps) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        isVisible={isModalVisible}
        // onBackdropPress={toggleModal}
        backdropColor={Colors.black}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={300}
        animationOutTiming={300}
      >
        {children}
      </Modal>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
