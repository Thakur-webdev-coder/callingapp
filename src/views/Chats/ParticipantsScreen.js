import { View, Text, Image, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { CommonHeader } from "../../components";
import { ic_avatar, ic_contact_avatar } from "../../routes/imageRoutes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import styles from "./styles";
import AppStyle from "../../components/AppStyle";

const ParticipantsScreen = ({ navigation, route }) => {
  const { participants } = route.params;

  const { kokoaContacts = [], loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );

  let senderID = loginDetails.username;

  const renderItem = ({ item }) => {
    const contact = kokoaContacts.find(
      (myItem) =>
        myItem?.phoneNumbers[0]?.number.replace(/[^0-9]/g, "") === item
    );

    return (
      <View>
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

          <View style={styles.nameTextColoumn}>
            {contact ? (
              <Text style={styles.nameTxtStyle}>
                {contact?.givenName + " " + contact?.familyName}
              </Text>
            ) : null}

            <Text numberOfLines={1} style={styles.msgTxtStyle}>
              {senderID === item ? "You" : item}
            </Text>
          </View>
        </View>
        <View style={styles.horizontalLine}></View>
      </View>
    );
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
         <View style={AppStyle.homeMainView}>
      <CommonHeader
        headerText={"All Participants"}
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={participants}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      </View>
    </SafeAreaView>
  );
};
export default ParticipantsScreen;
