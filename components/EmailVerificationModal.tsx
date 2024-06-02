import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import Modal from "react-native-modal";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import CustomLoadingButton from "./CustomLoadingButton";

interface EmailVerificationModalProps {
  isModalVisible: boolean;
  title: string;
  body: string;
  toggleModal: () => void;
  onResend: () => void;
  loading: boolean;
}

const EmailVerificationModal = ({
  isModalVisible,
  toggleModal,
  title,
  body,
  loading,
  onResend,
}: EmailVerificationModalProps) => {
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
        <View style={styles.modal}>
          <Text style={styles.modalHeaderText}>{title}</Text>
          <Text style={styles.modalBodyText}>{body}</Text>

          {/* <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
            <Text style={{ color: "white" }}>Resend</Text>
          </TouchableOpacity> */}
          <CustomLoadingButton
            text="Resend"
            onPress={onResend}
            textStyle={{ color: "white" }}
            loading={loading}
            buttonStyle={styles.modalButton}
          />

          <Ionicons
            name="close"
            size={24}
            color={Colors.black}
            style={styles.closeIcon}
            onPress={toggleModal}
            suppressHighlighting
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalHeaderText: {
    fontSize: Font.medium,
    fontFamily: "nm-b",
    marginBottom: 10,
    color: Colors.black,
  },
  modalBodyText: {
    fontSize: Font.small,
    color: Colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },

  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default EmailVerificationModal;
