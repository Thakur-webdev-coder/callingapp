import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CommonHeader } from "../../components";
import { ic_avatar, ic_contact_avatar } from "../../routes/imageRoutes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import styles from "./styles";

const ParticipantsScreen = ({ navigation, route }) => {
  const { participants } = route.params;

  const { kokoaContacts = [], loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );

  let senderID = loginDetails.username;

  useEffect(() => {
    // getKokoaContacts();
  }, []);

  const getKokoaContacts = () => {
    console.log("nammemmememem", kokoaContacts.map(participants));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UserChatsScreen");
      }}
    >
      <View style={styles.flatListStyle}>
        <Image style={styles.imgstyle} source={ic_contact_avatar} />

        <View style={styles.nameTextColoumn}>
          {/* <Text style={styles.nameTxtStyle}>{item?.name}</Text> */}
          <Text numberOfLines={1} style={styles.msgTxtStyle}>
            {item}
          </Text>
        </View>
      </View>
      <View style={styles.horizontalLine}></View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommonHeader headerText={"All Participants"} />
      <FlatList
        //style={{ marginTop: hp(2) }}
        data={participants}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
export default ParticipantsScreen;
