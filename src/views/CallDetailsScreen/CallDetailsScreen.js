import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import AppStyle from "../../components/AppStyle";
import {
  ic_contact_avatar,
  ic_double_chat,
  ic_phone,
  ic_phoneforward,
  ic_rightArror,
  ic_video,
} from "../../routes/imageRoutes";
import CommonHeader from "../../components/Header/commonHeader";
import { useSelector } from "react-redux";
import Sip from "@khateeb00/react-jssip";
import { Show_Toast } from "../../utils/toast";
import { hitCallRatesNewApi } from "../../constants/APi";
import Loading from "react-native-whc-loading";
import colors from "../../../assets/colors";
import CustomText from "../../components/CustomText";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import NetInfo from "@react-native-community/netinfo";
import InCallManager from "react-native-incall-manager";
import LinearGradient from "react-native-linear-gradient";

const CallDetailsScreen = ({ navigation, route }) => {
  //  const [ratesModal,setRatesModal]= useState(false)
  const [state, setState] = useState({
    isLoading: false,
    ratesModal: false,
    ratesData: [],
  });
  const { Name, phoneNumber, isKokaContact, avatarImg } = route.params;

  const { balanceDetail = {} } = useSelector((store) => store.sliceReducer);
  console.log("route.params--->0", route.params);

  const cameraPermissions =
    Platform.OS == "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  const micPermissions =
    Platform.OS == "ios"
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

  const openAppSettings = () => {
    if (Platform.OS === "android") {
      Linking.openSettings();
    } else {
      Linking.openURL("app-settings:");
    }
  };

  const CallRatesMethod = async () => {
    console.log("-----nnnnnnn----", phoneNumber);
    const data = new FormData();
    data.append("search_number", phoneNumber);

    setState({ isLoading: true });
    hitCallRatesNewApi(data)
      .then((myResponse) => {
        setState({
          isLoading: false,
          ratesModal: true,
          ratesData: myResponse?.data?.rates,
        });
        // setRatesModal(true)

        console.log("---res-->>>>>", myResponse.data.rates);

        // let txt = Rate[0]
        // console.log('------aa-----',Rate[0])
        // Alert.alert('',Rate[0])
      })
      .catch((err) => {
        setState({ isLoading: false });
        console.log("---res-->>>>>", err);
      });
  };

  const checkPeermission = (callType) => {
    console.log("checkPeermission------->>>", callType);
    requestMultiple([cameraPermissions, micPermissions])
      .then((result) => {
        console.log(
          result[cameraPermissions],
          result[micPermissions],
          "result--------->>>",
          result
        );

        if (
          result[cameraPermissions] !== "granted" ||
          result[micPermissions] !== "granted"
        ) {
          Alert.alert(
            "Insufficient permissions!",
            "You need to grant camera and Microphone access permissions to use this app.",
            [{ text: "Okay", onPress: () => openAppSettings() }]
          );
          return false;
        } else {
          NetInfo.fetch().then((status) => {
            if (status.isConnected) {
              console.log("status.isConnected------>>>", status.isConnected);
              callType == "voiceCall"
                ? navigation.navigate("CallScreen", {
                    voiceCall: true,
                    callData: phoneNumber,
                  })
                : navigation.navigate("CallScreen", {
                    voiceCall: false,
                    callData: phoneNumber,
                  });
            } else {
              Show_Toast("Check your data connection and try again.");
            }
          });
        }
      })
      .catch((error) => {
        console.log("errr----", error);
      });
  };

  const renderItem = ({ item }) => {
    const { rate, destination } = item;
    console.log("item-------", item);
    // const {callprefix,dialprefix,rates}=item
    return (
      <View>
        <View style={styles.ratesTxtStyle}>
          <CustomText
            text={"Destination :"}
            textSize={18}
            fontWeight={"bold"}
            textColor={colors.appColor}
          />
          <CustomText
            text={destination}
            textSize={16}
            fontWeight={"500"}
            textColor={colors.appColor}
            marginLeft={wp(2)}
          />
        </View>
        <View style={[styles.ratesTxtStyle, { paddingTop: hp(1) }]}>
          <CustomText
            text={"Rates :"}
            textSize={18}
            fontWeight={"bold"}
            textColor={colors.appColor}
          />
          <CustomText
            text={rate}
            textSize={16}
            fontWeight={"500"}
            textColor={colors.appColor}
            marginLeft={wp(14)}
          />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.homeMainView}>
        <CommonHeader
          headerText={"Contacts Details"}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.mainView}>
          <View style={styles.container_view}>
            <Image
              style={styles.imgstyle}
              source={avatarImg ? { uri: avatarImg } : ic_contact_avatar}
            />
            <Text style={styles.textStyle}>{Name}</Text>
          </View>

          <View style={styles.container_view2}>
            <View>
              <TouchableOpacity
                onPress={() => checkPeermission("voiceCall")}
                disabled={isKokaContact}
              >
                {/*  <View style={[styles.imgBoxStyle, { backgroundColor: !isKokaContact ? '#4D3E3E' : 'rgba(77, 62, 62, 0.6)' }]}>
                  <Image source={ic_phone} />
              </View>*/}
                <LinearGradient
                  colors={["#FD2A46", "#F8B502"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradient}
                >
                  <View
                    style={[
                      styles.imgBoxStyle,
                      // { backgroundColor: !isKokaContact ? '#4D3E3E' : 'rgba(77, 62, 62, 0.6)' }
                    ]}
                  >
                    <Image source={ic_phone} />
                  </View>
                </LinearGradient>
                <Text style={styles.iconTilteStle}>Call</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => checkPeermission("videoCall")}
                disabled={isKokaContact}
              >
                <LinearGradient
                  colors={["#FD2A46", "#F8B502"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradient}
                >
                  <View
                    style={[
                      styles.imgBoxStyle,
                      // { backgroundColor: !isKokaContact ? "#4D3E3E" : 'rgba(77, 62, 62, 0.6)' }
                    ]}
                  >
                    <Image source={ic_video} />
                  </View>
                </LinearGradient>

                <Text style={styles.iconTilteStle}>Video</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("UserChatsScreen", {
                    Name: Name,
                    callData: phoneNumber,
                  })
                }
                disabled={isKokaContact}
              >
                <LinearGradient
                  colors={["#FD2A46", "#F8B502"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradient}
                >
                  <View
                    style={[
                      styles.imgBoxStyle,
                      // { backgroundColor: !isKokaContact ? "#4D3E3E" : 'rgba(77, 62, 62, 0.6)' }
                    ]}
                  >
                    <Image source={ic_double_chat} />
                  </View>
                </LinearGradient>
                <Text style={styles.iconTilteStle}>Chat</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  NetInfo.fetch().then((status) => {
                    if (status.isConnected) {
                      if (balanceDetail.credit > 0) {
                        if (Sip.isRegistered) {
                          InCallManager.startRingback();
                          console.log("inhererrere------->>>><<<<<");
                          Sip.makeCall(phoneNumber.replace(/ /g, ""));
                          navigation.navigate("CallingScreen", {
                            callData: { name: Name },
                            avatarImg: avatarImg,
                          });
                        } else {
                          Show_Toast("Something went wrong. Please wait...");
                        }
                      } else {
                        Show_Toast(
                          "Insufficient balance. Please recharge your account."
                        );
                      }
                    } else {
                      Show_Toast("Check your data connection and try again.");
                    }
                  });
                }}
              >
              <LinearGradient
              colors={['#FD2A46', '#F8B502']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}>
                <View style={styles.imgBoxStyle}>
                  <Image source={ic_phoneforward} />
                </View>
                </LinearGradient>
                <Text style={styles.iconTilteStle}> paid call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.ratesContainer}>
          <View style={styles.numBox}>
            <Text style={styles.mobileNumberText}>{phoneNumber}</Text>
            <Text style={styles.mobileNumberText}>Mobile</Text>
          </View>
          <TouchableOpacity
            style={styles.arrowRatesBox}
            onPress={() => CallRatesMethod()}
          >
            <Text style={styles.textStyle}>Rates</Text>
            <Image style={{ marginTop: 5 }} source={ic_rightArror} />
          </TouchableOpacity>
        </View>
        {/* <Modal
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropColor={colors.white}
          transparent={true}
          isVisible={state.ratesModal}
        >
          <View style={styles.ratesModalStyle}>
           <FlatList
             data={state?.ratesData}
             // keyExtractor={keyExtractor}
             renderItem={renderItem}/>
          </View>
        </Modal> */}

        {state.ratesModal && (
          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropColor={colors.white}
            transparent={true}
            isVisible={state.ratesModal}
          >
            <View style={styles.ratesModalStyle}>
              <FlatList
                data={state?.ratesData}
                // keyExtractor={keyExtractor}
                renderItem={renderItem}
              />
              <TouchableOpacity onPress={() => setState({ ratesModal: false })}>
                <CustomText
                  text={"OK"}
                  textSize={16}
                  fontWeight={"600"}
                  textColor={colors.dodgeBlue}
                  marginTop={10}
                  textAlign={"right"}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
        <Loading loading={state.isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default CallDetailsScreen;
