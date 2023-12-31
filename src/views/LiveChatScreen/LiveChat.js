import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
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
import { ic_add, ic_back, ic_contact_avatar } from "../../routes/imageRoutes";
import { useSelector } from "react-redux";
import { getSocket } from "../../utils/socketManager";
import {
  formatAccordingTimestamp,
  timestampToDate,
} from "../../utils/commonUtils";
import { useFocusEffect } from "@react-navigation/native";
const LiveChat = ({ navigation }) => {
  const { kokoaContacts = [], loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );
  let senderID = loginDetails.username;
  const socket = getSocket();
  const [chatList, setChatList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getUsersList();
      onUserListReceived();
    }, [])
  );

  const getUsersList = () => {
    console.log("herere", "herer");
    const data = {
      sid: senderID,
    };

    console.log("dattaa", data);
    socket.emit("chat-list", data);
    console.log("suessfull_emit", data);
  };

  const onUserListReceived = () => {
    socket.on("chat-list", (data) => {
      console.log("_getChatListt=======>", data);
      setChatList(data.reverse());
    });
  };

  const renderItem = ({ item }) => {
    const contact = kokoaContacts.find(
      (myItem) =>
        myItem?.phoneNumbers[0]?.number.replace(/[^0-9]/g, "") === item?.id
    );

    return (
      <TouchableOpacity
        onPress={() => {
   
          item?.type === "group"
            ? navigation.navigate("UserChatsScreen", {
                groupName: item?.name,
                uniqueId: item?.id,
                participants: item?.participants,
              })
            : contact
            ? navigation.navigate("UserChatsScreen", {
                Name: contact?.givenName + " " + contact?.familyName,
                callData: item?.id,
              })
            : navigation.navigate("UserChatsScreen", {
                callData: item?.id,
              });
          // navigation.navigate("UserChatsScreen");
        }}
      >
        <View style={styles.flatListStyle}>
          <Image
            style={styles.imgstyle}
            source={
              contact
                ? contact?.hasThumbnail
                  ? { uri: contact?.thumbnailPath }
                  : ic_contact_avatar
                : ic_contact_avatar
            }
          />
          <View style={{flexDirection:'row',justifyContent:'space-between',width:wp(80)}}>
          <View style={styles.nameTextColoumn}>
            <Text style={styles.nameTxtStyle}>
              {item?.name
                ? item?.name
                : contact
                ? contact?.givenName + " " + contact?.familyName
                : item?.id}
            </Text>
            <Text numberOfLines={1} style={styles.msgTxtStyle}>
              {item?.msg}
            </Text>
          </View>

          <Text style={styles.dateTxtStyle}>
            {formatAccordingTimestamp(item?.timestamp)}
          </Text>
          </View>
        </View>
        <View style={styles.horizontalLine}></View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.homeMainView}>
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" hidden />} 
      <CommonHeader 
      headerText={"Chat"}
      onPress={() => navigation.goBack()} />
      {chatList.length > 0 ? (
        <FlatList
          //style={{ marginTop: hp(2) }}
          data={chatList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.black,
              textAlign: "center",
            }}
          >
            (Please click on + button to start chatting)
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.btnStyle}
        onPress={() => navigation.navigate("startChatScreen")}
      >
        <Image
          style={{
            alignSelf: "center",
          }}
          source={ic_add}
        />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default LiveChat;
