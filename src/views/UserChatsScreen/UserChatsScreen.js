import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import React from "react";
import styles from "./styles";
import {
  ic_back,
  ic_chat_attach,
  ic_chat_bg,
  ic_chat_call,
  ic_chat_search,
  ic_menu,
  ic_small_plus,
} from "../../routes/imageRoutes";
import colors from "../../../assets/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const UserChatsScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View style={styles.toolBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_back} />
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          <Text style={[styles.textStyleToolbar,{fontWeight:'700'}]}>Banoj Tri....</Text>
          <Text style={styles.textStyleToolbar}>Last Seen</Text>
        </View>
        <View style={styles.headerComponent}>
          <TouchableOpacity>
            <Image source={ic_chat_search} />
          </TouchableOpacity>
          <TouchableOpacity>
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
            <TouchableOpacity style={{ alignSelf: "center" }}>
              <Image source={ic_chat_call} />
            </TouchableOpacity>
          </View>
          <View style={styles.arrowStyle} >
            <Image style={{ transform: [{ rotate: '180deg' }], alignSelf: 'center' }} source={ic_back} />
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default UserChatsScreen;
