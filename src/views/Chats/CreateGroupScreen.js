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
import styles from "./CreateGroupStyles";
import { Text } from "react-native";
import colors from "../../../assets/colors";
import LinearGradient from "react-native-linear-gradient";
import {
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

const CreateGroup = ({ navigation }) => {
  const { kokoaContacts = [], loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );
  let senderID = loginDetails.username;

  const socket = getSocket();

  const [selectedItems, setSelectedItems] = useState([]);

  const handleLongPress = (item) => {
    console.log("itemmmm", item);
    setSelectedItems([...selectedItems, item]);
  };

  const navigateToGroupChat = () => {
    const uniqueId = generateRandomId();

    const allParticipant = selectedItems
      .map((item) => omitSpecialCharacters(item?.phoneNumbers[0]?.number))
      .concat(senderID);
    console.log("allParticipant", uniqueId, allParticipant);
    const data = {
      id: senderID,
      group_id: uniqueId,
      group_name: state.voucherNum,
      participants: allParticipant,
    };

    console.log("datattatatat", data);

    _addGroup(data);

    navigation.navigate("UserChatsScreen", {
      created: true,
      groupName: state.voucherNum,
      participants: allParticipant,
      uniqueId: uniqueId,
    });
  };

  const [state, setState] = useState({
    voucherNum: "",
  });

  const [voucherModal, setVoucherModal] = useState(false);

  console.log("voucherMoadlalll", voucherModal);

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item);

    return item?.phoneNumbers[0]?.number !== senderID ? (
      <TouchableOpacity
        onPress={() => {
          selectedItems.length > 0
            ? isSelected
              ? setSelectedItems(
                  selectedItems.filter((selectedItem) => selectedItem !== item)
                )
              : handleLongPress(item)
            : handleLongPress(item);
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
          {isSelected ? (
            <Image source={ic_tick} style={{ alignSelf: "center" }} />
          ) : null}
        </View>
      </TouchableOpacity>
    ) : null;
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
        <View style={AppStyle.homeMainView}>
      {/* <CommonHeader headerText={"Start Chat"} /> */}

      <View style={styles.toolBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_back} />
        </TouchableOpacity>

        {/* {!state?.search ? <View style={styles.nameContainer}>
          <Text style={styles.textStyleToolbar}>Contacts</Text>
        </View> : */}
        <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 20 }}>
          Create Group
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

            onPress={() => setVoucherModal(true)}
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
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor={colors.white}
        transparent={true}
        visible={voucherModal}
      >
        <View style={styles.voucherModalStyle}>
          <CustomText
            text={"Create New Group"}
            textSize={20}
            fontWeight={"bold"}
            textColor={colors.appColor}
          />
          <CustomText text={"Enter Group Name"} textColor={colors.appColor} />
          <TextInput
            style={styles.textInputStyle}
            //placeholder="Search Destination"
            placeholderTextColor={colors.appColor}
            onChangeText={(txt) => setState({ voucherNum: txt })}
            maxLength={30}
          />
          <View style={styles.btnStyle}>
            <TouchableOpacity onPress={() => setVoucherModal(false)}>
              <CustomText
                text={"Cancel"}
                textSize={16}
                fontWeight={"600"}
                textColor={colors.dodgeBlue}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToGroupChat}>
              <CustomText
                text={"Create"}
                textSize={16}
                fontWeight={"600"}
                textColor={colors.dodgeBlue}
                marginLeft={wp(10)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};
export default CreateGroup;
