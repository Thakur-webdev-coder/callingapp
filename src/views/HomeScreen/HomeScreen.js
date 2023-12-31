import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../../assets/colors";
import {
  logo_smallfrog,
  ic_call,
  ic_callrate,
  ic_phonebook,
  ic_voucher,
  ic_buycredit,
  ic_calldetails,
  ic_users,
  logo_small_kokoa,
  ic_logout,
  ic_popup,
  ic_databundle,
  ic_electricity,
  ic_transfer,
  logo_small_kokoaa,
  ic_mybalance,
  ic_money,
  ic_transfer_credit,
  ic_tvrecharge,
  ic_whyus,
  logo_small_ngvoice
} from "../../routes/imageRoutes";
import styles from "./styles";
import AppStyle from "../../components/AppStyle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomText from "../../components/CustomText";
import Modal from "react-native-modal";
import { Show_Toast } from "../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import InCallManager from "react-native-incall-manager";
import notifee from "@notifee/react-native";
import {
  hitCreditTransferApi,
  hitEncryptionApi,
  hitFetchUserBalanceApi,
  hithangUpCallApi,
  hitVoucherApi,
} from "../../constants/APi";
import {
  saveBalanceData,
  saveEncrLoginDetails,
  saveLoginDetails,
  saveNotificationData,
} from "../../redux/reducer";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import CommonHeader from "../../components/Header/commonHeader";
import { removeLocalParticipant } from "../../redux/participants";
import {
  changelCreated,
  navigateScreen,
} from "../../utils/notificationHandler";
import PushNotification from "react-native-push-notification";
import LinearGradient from "react-native-linear-gradient";

let myBalanceData = null;
let usernameEncryptedCode = null;
let passwordEncryptedCode = null;
let activeScreen = true;
const Home = ({ navigation }) => {
  const [recepientNum, setRecepientNum] = useState("");
  const [transfreAmt, setTransferAmt] = useState("");

  const [state, setState] = useState({
    voucherNum: "",
  });
  const [voucherModal, setVoucherModal] = useState(false);
  const [balanceModal, setBalanceModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);

  const [LogoutModal, setLogOutModal] = useState(false);
  const {
    loginDetails = {},
    balanceDetail = {},
    saveStatus = {},
  } = useSelector((store) => store.sliceReducer);

  const { conference } = useSelector((state) => state);

  const { username, password, did } = loginDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    notifee.onForegroundEvent(async ({ type, detail }) => {
      const { notification_type } = detail?.notification?.data;
      const { id } = detail?.pressAction;
      console.log("INHOMESCREEN=============", notification_type);

      if (id === "decline") {
        InCallManager.stopRingtone();
        const data = new FormData();
        data.append("receiver_number", detail.notification?.data?.sender_phone);

        console.log("data -->", data);
        hithangUpCallApi(data).then((response) => {
          Store.dispatch(hangupMeeting());
        });
      } else if (id === "accept") {
        InCallManager.stopRingtone();
        navigation.navigate("CallScreen", {
          voiceCall: detail?.notification?.data?.Type == "A" ? true : false,
          fromNotification: true,
          callData: detail?.notification?.data?.sender_phone,
          meetimgUrl: detail?.notification?.data?.Meeting_url,
        });
      } else if (notification_type === "call" && id === "default") {
        console.log("inc=============2222", detail);
        navigation.navigate("IncomingScreen", {
          callData: detail?.notification?.data,
        });
      } else if (notification_type === "SINGLE_CHAT") {
        console.log("hererrerererNotiitiitit----------");
        setTimeout(() => {
          navigation.navigate("UserChatsScreen", {
            callData: detail?.notification?.data.sid,
          });
        }, 200);
      } else if (notification_type === "GROUP_CHAT") {
        let participants = detail?.notification?.data.participants;

        let result = participants.split(",").map(function (value) {
          return value.trim();
        });
        setTimeout(() => {
          navigation.navigate("UserChatsScreen", {
            groupName: detail?.notification?.data.group_name,
            uniqueId: detail?.notification?.data.group_id,
            participants: result,
          });
        }, 200);
      }
    });

    navigateScreen(navigation);
  }, []);

  useEffect(() => {
    hitBalanceAPi();
    const unsubscribe = navigation.addListener("focus", () => {
      hitBalanceAPi();
    });
    return unsubscribe;
  }, [navigation]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    }
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, [isFocused]);

  function handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  const DATA = [
    {
      id: 0,
      name: "Invite Friends",
      image: ic_users,
    },
    {
      id: 1,
      name: "My Balance",
      image: ic_mybalance,
    },
    {
      id: 2,
      name: "Buy Credits",
      image: ic_buycredit,
    },
    {
      id: 3,
      name: "Transfer Credit",
      image: ic_transfer_credit,
    },
    {
      id: 4,
      name: "Transfer History",
      image: ic_transfer,
    },
    {
      id: 5,
      name: "Voucher Recharge",
      image: ic_voucher,
    },
    {
      id: 6,
      name: "Call Details Report",
      image: ic_calldetails,
    },
    {
      id: 7,
      name: "Call Rates",
      image: ic_callrate,
    },
    {
      id: 8,
      name: "Mobile Money",
      image: ic_money,
    },
    {
      id: 9,
      name: "Mobile Topup",
      image: ic_popup,
    },
    {
      id: 10,
      name: "Data Bundle",
      image: ic_databundle,
    },
    {
      id: 11,
      name: "Electricity Bill Pay",
      image: ic_electricity,
    },
    {
      id: 12,
      name: "TV Recharge",
      image: ic_tvrecharge,
    },
    {
      id: 13,
      name: "Why Us",
      image: ic_whyus,
    },
    {
      id: 14,
      name: "Logout",
      image: ic_logout,
    },
  ];

  const DATA2 = [
    {
      id: 0,
      name: "Invite Friends",
      image: ic_users,
    },
    {
      id: 1,
      name: "My Balance",
      image: ic_mybalance,
    },

    {
      id: 2,
      name: "Transfer Credit",
      image: ic_transfer_credit,
    },
    {
      id: 3,
      name: "Transfer History",
      image: ic_transfer,
    },
    {
      id: 4,
      name: "Voucher Recharge",
      image: ic_voucher,
    },
    {
      id: 5,
      name: "Call Details Report",
      image: ic_calldetails,
    },
    {
      id: 6,
      name: "Call Rates",
      image: ic_callrate,
    },
    {
      id: 7,
      name: "Data Bundle",
      image: ic_databundle,
    },
    {
      id: 8,
      name: "Why Us",
      image: ic_whyus,
    },
    {
      id: 9,
      name: "Logout",
      image: ic_logout,
    },
    {
      id: 10,
      name: "Delete Account",
      image: ic_logout,
    },
  ];
  const ViewItemClicked_Method = (name) => {
    switch (name) {
      case "Invite Friends":
        // navigation.navigate("InviteScreen");
        navigation.navigate("InviteScreen");
        break;

      case "My Balance":
        setBalanceModal(true);
        break;

      case "Buy Credits":
        navigation.navigate("WebViewScreen", {
          url: `https://billing.nextgen.ng/billing/customer/mobile_payment.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`,
          title: "Buy Credit",
        });
        break;

      case "Transfer Credit":
        setTransferModal(true);
        break;

      case "Transfer History":
        navigation.navigate("TransferHistory");
        break;

      case "Call Details Report":
        navigation.navigate("CallReportsScreen");
        break;
      case "Call Rates":
        navigation.navigate("WebViewScreen", {
          url: `https://billing.nextgen.ng/billing/customer/billing_mobile_money.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`,
          title: "Call Rates",
        });
        break;
      case "Mobile Money":
        navigation.navigate("WebViewScreen", {
          url: `https://billing.nextgen.ng/billing/customer/billing_mobile_money.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`,
          title: "Mobile Money",
        });
        break;

      case "Mobile Topup":
        navigation.navigate("WebViewScreen", {
          url: `https://billing.nextgen.ng/billing/customer/billing_airtime.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`,
          title: "Mobile Topup",
        });
        break;

      case "Data Bundle":
        navigation.navigate("WebViewScreen", {
          url: ` https://billing.nextgen.ng/billing/customer/billing_data.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`,
          title: "Data Bundle",
        });
        break;
      case "Electricity Bill Pay":
        navigation.navigate("WebViewScreen", {
          url: `https://billing.nextgen.ng/billing/customer/billing_electricity.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`,
          title: "Electricity Bill Pay",
        });
        break;
      case "TV Recharge":
        navigation.navigate("WebViewScreen", {
          url: `https://billing.nextgen.ng/billing/customer/billing_television.php?pr_login=${did}&pr_password=${password}&mobiledone=submit_log`,
          title: "TV Recharge",
        });
        break;
      case "Why Us":
        navigation.navigate("WebViewScreen", {
          // url: `https://billing.nextgen.ng/billing/customer/billing_mobile_money.php?pr_login=[login]&pr_password=${password}&mobiledone=submit_log`,
          url: `https://www.nextgen.ng/`,

          title: "Why Us",
        });
        break;
      case "Voucher Recharge":
        setVoucherModal(true);
        break;

      case "Logout":
        LogoutMethod();
        break;
      case "Delete Account":
        DeleteAccountMethod();
        break;
      default:
        console.log("Voucher Recharge");
    }
  };

  const hitBalanceAPi = async () => {
    console.log("herrreee=========");

    // setIsLoading(true);

    const data = new FormData();
    data.append("source", did);
    const myResponse = await hitEncryptionApi(data);

    if (myResponse.data.result == "success") {
      usernameEncryptedCode = myResponse.data.value;
      hitPhoneEncryptionAPi();
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const hitPhoneEncryptionAPi = async () => {
    const { username, password } = loginDetails;

    const data = new FormData();
    data.append("source", password);

    const myResponse = await hitEncryptionApi(data);

    if (myResponse.data.result == "success") {
      passwordEncryptedCode = myResponse?.data?.value;
      dispatch(
        saveEncrLoginDetails({
          encryptUser: usernameEncryptedCode,
          encryptPassword: passwordEncryptedCode,
        })
      );

      if (usernameEncryptedCode || passwordEncryptedCode) hitFetchBalanceApi();
    }
  };
  const hitFetchBalanceApi = async () => {
    console.log("myDtaaaa___", usernameEncryptedCode, passwordEncryptedCode);

    // setIsLoading(false);

    const data = new FormData();
    data.append("cust_id", usernameEncryptedCode);
    data.append("cust_pass", passwordEncryptedCode);
    console.log("myResponseData=====", data);

    myBalanceData = await hitFetchUserBalanceApi(data);
    console.log("myResponseData=====", myBalanceData.data);
    dispatch(saveBalanceData(myBalanceData.data));
  };

  const RechargeMethod = async () => {
    const { voucherNum } = state;
    console.log("aaaaaa", voucherNum);
    if (voucherNum.length != 0) {
      setVoucherModal(false);
      // setIsLoading(true);

      const data = new FormData();
      data.append("source", voucherNum);
      const myResponse = await hitEncryptionApi(data);

      if (myResponse.data.result == "success") {
        // setIsLoading(false);
        const vouchereEncryptedCode = myResponse.data.value;
        hitVoucherApi_Method(vouchereEncryptedCode);
      } else {
        // setIsLoading(false);
      }
      setState({ voucherNum: "" });
    } else {
      Alert.alert("", "Please enter a voucher number.");
    }

    //setRechargerModal(true);
  };

  const TransferCreditMethod = async () => {
    console.log("rrrrrrrr--------", recepientNum);
    if (recepientNum.length >= 6 && transfreAmt.length > 0) {
      console.log("numberr", recepientNum);

      setTransferModal(false);
      const data = new FormData();
      data.append("source", recepientNum);
      const myResponse = await hitEncryptionApi(data);

      console.log("myResponse", myResponse.data);

      if (myResponse.data.result == "success") {
        const recepientEncryptedNumber = myResponse.data.value;
        hitTransferCreditApi(recepientEncryptedNumber);
      } else {
      }
    } else {
      Alert.alert("", "Please enter valid recepient number or amount.");
    }
  };

  const hitTransferCreditApi = async (recepientAccount) => {
    const { transfreAmt } = state;

    const data = new FormData();
    data.append("cust_id", usernameEncryptedCode);
    data.append("cust_pass", passwordEncryptedCode);
    data.append("credit", transfreAmt);
    data.append("transferaccount", recepientAccount);
    const myResponse = await hitCreditTransferApi(data);

    if (myResponse.data.result == "sucess") {
      Show_Toast(myResponse.data.msg);
    } else {
      Show_Toast(myResponse.data.msg);
    }
  };

  const hitVoucherApi_Method = async (vouchereCode) => {
    const data = new FormData();
    data.append("username", usernameEncryptedCode);
    data.append("password", passwordEncryptedCode);
    data.append("voucher", vouchereCode);
    const myResponse = await hitVoucherApi(data);

    if (myResponse.data.result == "success") {
      // setIsLoading(false);
      Show_Toast(myResponse.data.msg);
    } else {
      // setIsLoading(false);
      Show_Toast(myResponse.data.msg);
    }
  };

  const RechargeDoneMethod = () => {
    setBalanceModal(false);
  };
  const LogoutMethod = () => {
    // setLogOutModal(false);
    navigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Verify Screen" }],
      })
    );
    dispatch(saveLoginDetails(null));
    dispatch(saveBalanceData(null));
    dispatch(removeLocalParticipant());
  };
  const DeleteAccountMethod = () => {
    Alert.alert("Delete Account", "Are you sure you want to Delete Account?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          setTimeout(() => {
            navigation?.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Boarding Screen" }],
              })
            );
          }, 100);
          // dispatch(saveLoginDetails(null));
          // dispatch(saveBalanceData(null));
        },
      },
    ]);
  };

  const RenderList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => ViewItemClicked_Method(item.name)}
        style={styles.linearGradient}
      >
      <Image source={item.image} style={{tintColor:'#FD2A46'}}/>
      <CustomText
          textColor={colors.secondaryText}
          textAlign={"center"}
          marginTop={hp(1)}
          text={item.name}
          fontWeight={"600"}
          textSize={13}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.homeMainView}>
        <View style={AppStyle.secondWrapper}>
          <View style={styles.headerStyle}>
            <CustomText
              fontWeight={"bold"}
              text={"Home"}
              textColor={colors.white}
              textSize={20}
            />
          </View>
          <LinearGradient
          colors={['#FD2A46', '#F8B502']}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1.2 }}
          style={styles.cardStyle}>
            <CustomText
              text={"Registered Number"}
              textColor={colors.white}
              fontWeight={700}
            />
            <CustomText
              text={`+${loginDetails?.username}`}
              textSize={20}
              textColor={colors.white}
            />
            <View style={styles.balanceStyle}>
              <View>
                <CustomText
                  text={"Balance"}
                  textSize={18}
                  textColor={colors.white}
                />

                <CustomText
                  text={
                    balanceDetail?.credit == "0"
                      ? "₦" + "0.00"
                      : "₦" + balanceDetail?.credit
                  }
                  textSize={18}
                  textColor={colors.white}
                />
              </View>
              <View style={styles.imgView}>
              <Image source={logo_small_ngvoice} />
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.wrapper2}>
          {/* <TouchableOpacity onPress={()=>shownote()}> */}

          <CustomText
            text={" Services"}
            textSize={20}
            fontWeight={"bold"}
            textColor={colors.black}
            marginTop={wp(2)}
            marginLeft={wp(2)}
          />
          {/* </TouchableOpacity> */}
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-between" }}
            // data={DATA2}
            data={
              Platform.OS == "ios"
                ? saveStatus && saveStatus == 0
                  ? DATA2
                  : DATA
                : DATA
            }
            renderItem={RenderList}
            keyExtractor={(item, index) => item.name}
            numColumns={3}
          />
          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            isVisible={voucherModal}
          >
            <View style={styles.voucherModalStyle}>
              <CustomText
                text={"Voucher Recharge"}
                textSize={20}
                fontWeight={"bold"}
                textColor={colors.appColor}
              />
              <CustomText
                text={"Enter the Voucher Number"}
                textColor={colors.appColor}
              />
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
                <TouchableOpacity onPress={() => RechargeMethod()}>
                  <CustomText
                    text={"Redeem"}
                    textSize={16}
                    fontWeight={"600"}
                    textColor={colors.dodgeBlue}
                    marginLeft={wp(10)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            isVisible={balanceModal}
          >
            <View style={styles.rechargeModalStyle}>
              <CustomText
                text={"NG voice"}
                textSize={20}
                fontWeight={"bold"}
                textColor={colors.appColor}
              />
              <CustomText
                text={"Balance : " + "₦" + balanceDetail?.credit}
                textColor={colors.appColor}
                paddingVertical={hp(3)}
              />
              <TouchableOpacity onPress={() => RechargeDoneMethod()}>
                <CustomText
                  text={"OK"}
                  textSize={16}
                  fontWeight={"600"}
                  textColor={colors.dodgeBlue}
                  marginLeft={wp(10)}
                  textAlign={"right"}
                />
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            isVisible={transferModal}
          >
            <View style={styles.voucherModalStyle}>
              <CustomText
                text={"Transfer Credit"}
                textSize={20}
                fontWeight={"bold"}
                textColor={colors.appColor}
              />

              <TextInput
                style={styles.textInputStyle}
                placeholder="Enter the Recepient Number"
                placeholderTextColor={colors.appColor}
                keyboardType="numeric"
                onChangeText={(txt) => {
                  setRecepientNum(txt);
                }}
                maxLength={20}
              />

              <TextInput
                style={styles.textInputStyle}
                placeholder="Enter Amount"
                placeholderTextColor={colors.appColor}
                onChangeText={(txt) => setTransferAmt(txt)}
                maxLength={10}
                keyboardType="numeric"
              />
              <View style={styles.btnStyle}>
                <TouchableOpacity onPress={() => setTransferModal(false)}>
                  <CustomText
                    text={"Cancel"}
                    textSize={16}
                    fontWeight={"600"}
                    textColor={colors.dodgeBlue}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => TransferCreditMethod()}>
                  <CustomText
                    text={"Transfer"}
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

        {/* <Loading
        style={{
          flex: 1,
          justifyContent: "center",
        }}
        loading={isLoading}
      /> */}
      </View>
    </SafeAreaView>
  );
};
export default Home;
