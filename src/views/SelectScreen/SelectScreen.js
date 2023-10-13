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
import { ic_back, ic_contact_avatar } from "../../routes/imageRoutes";
import { useSelector } from "react-redux";
import { _addGroup } from "../../utils/socketManager";
import { Show_Toast } from "../../utils/toast";
import { omitSpecialCharacters } from "../../utils/commonUtils";
const SelectScreen = ({ navigation, route }) => {
  const { kokoaContacts = [], loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );

  let senderID = loginDetails.username;

  const { groupName, uniqueId, participants } = route.params;

  const handleAddNumber = (selectedNumber) => {
    if (!myArray.includes(selectedNumber)) {
      setMyArray([...myArray, selectedNumber]);
    }
  };

  const navigateToGroupChat = (item) => {
    const newParticipants = participants.concat(item);
    const data = {
      id: senderID,
      group_id: uniqueId,
      group_name: groupName,
      participants: newParticipants,
    };

    console.log("datattatatat", data);

    _addGroup(data);

    navigation.navigate("UserChatsScreen", {
      added: true,
      groupName: groupName,
      participants: newParticipants,
      uniqueId: uniqueId,
    });
  };

  const renderItem = ({ item }) => {
    return item?.phoneNumbers[0]?.number !== senderID ? (
      <TouchableOpacity
        onPress={() => {
          participants.includes(
            omitSpecialCharacters(item?.phoneNumbers[0]?.number)
          )
            ? Show_Toast("Already a Member of this group")
            : navigateToGroupChat(
                omitSpecialCharacters(item?.phoneNumbers[0]?.number)
              );
        }}
      >
        <View style={styles.flatListStyle}>
          <Image
            style={styles.imgstyle}
            source={
              item?.hasThumbnail
                ? { uri: item?.thumbnailPath }
                : ic_contact_avatar
            }
          />

          <View style={styles.nameTextColoumn}>
            <Text style={styles.nameTxtStyle}>
              {" "}
              {item?.givenName + " " + item?.familyName}
            </Text>
            <Text numberOfLines={1} style={styles.msgTxtStyle}>
              {item?.phoneNumbers[0]?.number}
            </Text>
          </View>
        </View>
        <View style={styles.horizontalLine}></View>
      </TouchableOpacity>
    ) : null;
  };

  return (
    <SafeAreaView style={AppStyle.wrapper} >
    <View style={AppStyle.homeMainView}>
      <CommonHeader headerText={"Add Members"}
           onPress={() => navigation.goBack()}
       />
      {kokoaContacts.length > 0 ? (
        <FlatList
          //style={{ marginTop: hp(2) }}
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
            No NG Voice Users Found!
          </Text>
        </View>
      )}
      {/* <FlatList
        //style={{ marginTop: hp(2) }}
        data={kokoaContacts}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      /> */}
      </View>
    </SafeAreaView>
  );
};
export default SelectScreen;
