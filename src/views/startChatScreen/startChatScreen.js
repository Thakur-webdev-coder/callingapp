import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppStyle from "../../components/AppStyle";
import { CommonHeader } from "../../components";
import styles from "./styles";
import { Text } from "react-native";
import colors from "../../../assets/colors";
import LinearGradient from "react-native-linear-gradient";
import {
  ic_AddGroup,
  ic_add,
  ic_back,
  ic_contact_avatar,
  ic_tick,
} from "../../routes/imageRoutes";
import { hitGetRegisteredNumberApi } from "../../constants/APi";
import { useSelector } from "react-redux";
import CustomText from "../../components/CustomText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { _addGroup, getSocket } from "../../utils/socketManager";
import {
  generateRandomId,
  omitSpecialCharacters,
} from "../../utils/commonUtils";

const StartChatScreen = ({ navigation }) => {
  const { kokoaContacts = [], loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );
  let senderID = loginDetails.username;

  const socket = getSocket();

  const renderItem = ({ item }) => {
    return item?.phoneNumbers[0]?.number !== senderID ? (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("UserChatsScreen", {
            Name: item?.givenName + " " + item?.familyName,
            callData: item?.phoneNumbers[0]?.number,
          });
        }}
      >
        <View style={styles.flatListStyle}>
          <View style={styles.kokaImgBox}>
            <Image
              style={styles.imgstyle}
              source={
                item?.hasThumbnail
                  ? { uri: item?.thumbnailPath }
                  : ic_contact_avatar
              }
            />
          </View>
          <View>
            <Text style={styles.nameTxtStyle}>
              {item?.givenName + " " + item?.familyName}
            </Text>
            <Text
              style={[styles.nameTxtStyle, { fontSize: 14, fontWeight: "400" }]}
            >
              {item?.phoneNumbers[0]?.number}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : null;
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
        <View style={AppStyle.homeMainView}>
      <View style={styles.toolBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_back} />
        </TouchableOpacity>

        <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 20 }}>
          Start Chat
        </Text>
        <View></View>
      </View>
      {kokoaContacts.length > 0 ? (
        <FlatList
          data={kokoaContacts}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: colors.black,
            }}
          >
            No KokoaFone Users Found!
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.newBtnStyle}
        onPress={() => navigation.navigate("CreateGroup")}
      >
        <Image
          style={{
            alignSelf: "center",
            height: 30,
            width: 30,
          }}
          source={ic_AddGroup}
        />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default StartChatScreen;
