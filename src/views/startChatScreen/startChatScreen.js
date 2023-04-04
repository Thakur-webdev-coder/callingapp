import React, { useEffect, useState } from "react";
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
import { Text } from "react-native";
import colors from "../../../assets/colors";
import LinearGradient from "react-native-linear-gradient";
import { ic_back, ic_contact_avatar } from "../../routes/imageRoutes";
import { hitGetRegisteredNumberApi } from "../../constants/APi";
const StartChatScreen = ({ navigation }) => {
  const [state, setState] = useState({
    chatData: [],
  });
  const chatData = [
    {
      name: "Banoj Tripathy",
      number: "918800810156",
    },
    {
      name: "Banoj Tripathy",
      number: "918800810156",
    },
    {
      name: "Banoj Tripathy",
      number: "918800810156",
    },
    {
      name: "Banoj Tripathy",
      number: "918800810156",
    },
  ];

  useEffect(() => {
    getRegisteredNumberList();
  }, []);

  const getRegisteredNumberList = async () => {
    const myResponse = await hitGetRegisteredNumberApi();
    // console.log('---res-->>>>>',myResponse)
    if (myResponse.data.result == "success") {
      console.log("---sucess->>>>>", myResponse.data.response);
      setState({ chatData: myResponse.data.response });
    } else {
      Show_Toast(myResponse.data.msg);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UserChatsScreen", {
          callData: item?.receiver_phone,
        });
      }}
    >
      <View style={styles.flatListStyle}>
        <Image style={styles.imgstyle} source={ic_contact_avatar} />

        <View style={styles.nameTextColoumn}>
          {/* <Text style={styles.nameTxtStyle}>{item?.name}</Text> */}
          <Text numberOfLines={1} style={styles.msgTxtStyle}>
            {item?.receiver_phone}
          </Text>
        </View>
      </View>
      <View style={styles.horizontalLine}></View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommonHeader headerText={"Start Chat"} />
      <FlatList
        //style={{ marginTop: hp(2) }}
        data={state?.chatData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
export default StartChatScreen;
