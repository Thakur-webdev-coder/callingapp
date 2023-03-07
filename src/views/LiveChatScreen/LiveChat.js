import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import AppStyle from "../../components/AppStyle";
import { CommonHeader } from "../../components";
import styles from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Text } from "react-native";
import colors from "../../../assets/colors";
import LinearGradient from "react-native-linear-gradient";
import { ic_back, ic_contact_avatar } from "../../routes/imageRoutes";
const LiveChat = ({ navigation }) => {
  const chatData = [
    {
      name: "Banoj Tripathy",
      msg: "918800810156  : Ho How are you ?",
      date: "12/01/2023",
    },
    {
      name: "Banoj Tripathy",
      msg: "918800810156  : Ho How are you ?",
      date: "12/01/2023",
    },
    {
      name: "Banoj Tripathy",
      msg: "918800810156  : Ho How are you ?",
      date: "12/01/2023",
    },
    {
      name: "Banoj Tripathy",
      msg: "918800810156  : Ho How are you ?",
      date: "12/01/2023",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UserChatsScreen");
      }}
    >
      <View style={styles.flatListStyle}>
        <Image style={styles.imgstyle} source={ic_contact_avatar} />

        <View style={styles.nameTextColoumn}>
          <Text style={styles.nameTxtStyle}>{item?.name}</Text>
          <Text numberOfLines={1} style={styles.msgTxtStyle}>
            {item?.msg}
          </Text>
        </View>

        <Text style={styles.dateTxtStyle}>{item?.date}</Text>
      </View>
      <View style={styles.horizontalLine}></View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommonHeader headerText={"Chat"} />
      <FlatList
        //style={{ marginTop: hp(2) }}
        data={chatData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("startChatScreen");
        }}
      >
        <View style={styles.btnStyle}>
          <Image
            style={{
              transform: [{ rotate: "180deg" }],
              alignSelf: "center",
            }}
            source={ic_back}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default LiveChat;
