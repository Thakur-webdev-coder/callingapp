import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { CommonHeader } from "../../components";
import { ic_avatar, ic_contact_avatar } from "../../routes/imageRoutes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ParticipantsScreen = ({ navigation }) => {
  //   const { kokoaContacts = [], loginDetails = {} } = useSelector(
  //     (store) => store.sliceReducer
  //   );
  //   let senderID = loginDetails.username;
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

  const renderItem = ({ item }) => {
    return (
      <View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Image source={ic_contact_avatar} />
          <View style={{ alignSelf: "center", marginStart: 10 }}>
            <Text>{item?.name}</Text>
            <Text>{item?.number}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommonHeader headerText={"All Participants"} />

      <FlatList
        style={{ marginVertical: hp(2), paddingHorizontal: 20 }}
        data={chatData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
export default ParticipantsScreen;
