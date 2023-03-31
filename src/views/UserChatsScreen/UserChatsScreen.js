import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  Modal,
} from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import {
  ic_audiocall,
  ic_back,
  ic_chat_attach,
  ic_chat_bg,
  ic_chat_call,
  ic_chat_search,
  ic_menu,
  ic_small_plus,
  ic_videocall,
} from "../../routes/imageRoutes";
import colors from "../../../assets/colors";
import CustomText from "../../components/CustomText";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const UserChatsScreen = ({ navigation, route }) => {
  const [state, setState] = useState({
    callModal: false,
  });

  const callData = route.params;

  console.log("callData---->", callData?.callData);

  //const [callModal,setCallModal]=useState(false)
  return (
    <SafeAreaView>
      <View style={styles.toolBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_back} />
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          <Text style={[styles.textStyleToolbar, { fontWeight: "700" }]}>
            Banoj Tri....
          </Text>
          <Text style={styles.textStyleToolbar}>Last Seen</Text>
        </View>
        <View style={styles.headerComponent}>
          <TouchableOpacity>
            <Image source={ic_chat_search} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginHorizontal: 25 }}
            onPress={() => navigation.navigate("SelectScreen")}
          >
            <Image source={ic_small_plus} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={ic_menu} />
          </TouchableOpacity>
        </View>
      </View>

      <ImageBackground source={ic_chat_bg}>
        <View style={styles.dateBg}>
          <Text style={{ color: colors.black, fontWeight: "bold" }}>
            Thu , 12 Jan 2023
          </Text>
        </View>
        <View style={styles.sendMessageImg}>
          <View style={styles.searchTnputStyle}>
            <TextInput
              style={styles.searchTnputStyleee}
              placeholder="Type  message here"
              placeholderTextColor={colors.searchBarTxt}
            />

            <TouchableOpacity style={{ justifyContent: "center" }}>
              <Image source={ic_chat_attach} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => setState({ callModal: true })}
            >
              <Image source={ic_chat_call} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.arrowStyle}>
            <Image
              style={{ transform: [{ rotate: "180deg" }], alignSelf: "center" }}
              source={ic_back}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor={colors.white}
        transparent={true}
        visible={state.callModal}
      >
        <View style={styles.callModalStyle}>
          <TouchableOpacity
            style={styles.callBoxStyle}
            onPress={() => {
              navigation.navigate("CallScreen", {
                voiceCall: true,
              });
              setState({ callModal: false });
            }}
          >
            <Image source={ic_audiocall} />

            <CustomText
              //fontWeight={"bold"}
              text={"Voice Call"}
              textColor={colors.secondary}
              textSize={22}
              marginLeft={wp(6)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("CallScreen", {
                voiceCall: false,
                callData: callData?.callData,
              });
              setState({ callModal: false });
            }}
          >
            <Image source={ic_videocall} />
            <CustomText
              //fontWeight={"bold"}
              text={"Video Call"}
              textColor={colors.secondary}
              textSize={22}
              marginLeft={wp(3)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => setState({ callModal: false })}
          >
            <CustomText
              //fontWeight={"bold"}
              text={"CANCEL"}
              textColor={colors.secondary}
              textSize={20}
              //textAlign={'center'}
              //marginLeft={wp(50)}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserChatsScreen;
