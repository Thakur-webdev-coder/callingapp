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
import {
  ic_back,
  ic_contact_avatar,
  logo_contact_kokoa,
} from "../../routes/imageRoutes";
import { hitGetRegisteredNumberApi } from "../../constants/APi";
import { useSelector } from "react-redux";
const StartChatScreen = ({ navigation }) => {
  const { kokoaContacts = [] } = useSelector((store) => store.sliceReducer);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleLongPress = (item) => {
    console.log("itemmmm", item);
    setSelectedItems([...selectedItems, item]);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item);

    return (
      <TouchableOpacity
        onPress={() => {
          selectedItems.length > 0
            ? isSelected
              ? setSelectedItems(
                  selectedItems.filter((selectedItem) => selectedItem !== item)
                )
              : handleLongPress(item)
            : navigation.navigate("UserChatsScreen", {
                Name: item?.givenName + " " + item?.familyName,
                callData: item?.phoneNumbers[0]?.number,
              });
        }}
        onLongPress={() => handleLongPress(item)}
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
          {isSelected ? (
            <Image
              source={logo_contact_kokoa}
              style={{ alignSelf: "center" }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <CommonHeader headerText={"Start Chat"} /> */}
      <View style={styles.toolBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_back} />
        </TouchableOpacity>

        {/* {!state?.search ? <View style={styles.nameContainer}>
          <Text style={styles.textStyleToolbar}>Contacts</Text>
        </View> : */}
        <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 20 }}>
          Start Chat
        </Text>
        {/* } */}

        {selectedItems.length > 0 ? (
          <TouchableOpacity
          // onPress={() =>
          //   navigation.navigate("UserChatsScreen", {
          //     Name:  selectedItems.map((item) => item?.givenName + " " + item?.familyName),
          //     callData:selectedItems.map((item) => item?.phoneNumbers[0]?.number)
          //   })
          // }
          >
            <Text style={{ color: colors.white }}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </View>
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
            No KokoaFone Users Found!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
export default StartChatScreen;
