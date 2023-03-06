import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../../assets/colors";
import {
  logo_smallfrog,
  ic_setting,
  ic_app_logo,
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

import {
  hitEncryptionApi,
  hitFetchUserBalanceApi,
  hitVoucherApi,
} from "../../constants/APi";
import {
  saveBalanceData,
  saveEncrLoginDetails,
  saveLoginDetails,
} from "../../redux/reducer";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import CommonHeader from "../../components/Header/commonHeader";

let myBalanceData = null;
let usernameEncryptedCode = null;
let passwordEncryptedCode = null;
let activeScreen = true;
const Home = ({ navigation }) => {
  const [state, setState] = useState({
    voucherNum: "",
  });
  const [voucherModal, setVoucherModal] = useState(false);
  const [rechargeModal, setRechargerModal] = useState(false);
  const [LogoutModal, setLogOutModal] = useState(false);
  const { loginDetails = {}, balanceDetail = {} } = useSelector(
    (store) => store
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // hitBalanceAPi();
  }, []);

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
      image: ic_money,
    },
    {
      id: 3,
      name: "Transfer Credit",
      image: ic_money,
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
      name: "Mobile Money",
      image: ic_money,
    },
    {
      id: 8,
      name: "Mobile Topup",
      image: ic_popup,
    },
    {
      id: 9,
      name: "Data Bundle",
      image: ic_databundle,
    },
    {
      id: 10,
      name: "Electricity Bill Pay",
      image: ic_electricity,
    },
    {
      id: 11,
      name: "TV Recharge",
      image: ic_money,
    },
    {
      id: 12,
      name: "Logout",
      image: ic_logout,
    },
  ];

  const ViewItemClicked_Method = (name) => {
    switch (name) {
      case "Call":
        // navigation.navigate("Keypad");
        break;

      case "Invite Friends":
        //navigation.navigate("InviteScreen");
        break;

      case "Buy Credits":
        //  navigation.navigate("BuyCredit");
        break;

      case "Call Rates":
        // navigation.navigate("CallRatesScreen");
        break;

      case "Call Details Reports":
        //navigation.navigate("CallReportsScreen");
        break;
      case "Directory":
        //navigation.navigate("Directory");
        break;
      case "Redeem Voucher":
        setVoucherModal(true);
        break;
      case "Logout":
        LogoutMethod();
        break;
      default:
        console.log("Redeem Voucher");
    }
  };

  const hitBalanceAPi = async () => {
    console.log("herrreee=========");
    const { username, password } = loginDetails;

    // setIsLoading(true);

    const data = new FormData();
    data.append("source", username);
    const myResponse = await hitEncryptionApi(data);

    if (myResponse.data.result == "success") {
      usernameEncryptedCode = myResponse.data.value;
      hitPhoneEncryptionAPi();
    } else {
      alert("Please Enter a Valid Phone Number");
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
      Alert.alert("", "Please enter a voucher number");
    }

    //setRechargerModal(true);
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
    setRechargerModal(false);
    Show_Toast("Successfully recharged by Voucher");
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
  };

  const RenderList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => ViewItemClicked_Method(item.name)}
        style={styles.linearGradient}
      >
        <Image source={item.image} />
        <CustomText
          textColor={colors.secondary}
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
      <View style={AppStyle.secondWrapper}>
        <CommonHeader headerText={"Home"} />

        <View style={styles.cardStyle}>
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
                    ? "€" + "0.00"
                    : "€" + balanceDetail?.credit
                }
                textSize={18}
                textColor={colors.white}
              />
            </View>
            <View style={styles.imgView}>
              <Image source={logo_small_kokoa} />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.wrapper2}>
        <CustomText
          text={" Services"}
          textSize={20}
          fontWeight={"bold"}
          textColor={colors.black}
          marginTop={wp(2)}
          marginLeft={wp(2)}
        />

        <FlatList
          columnWrapperStyle={{ justifyContent: "space-between" }}
          data={DATA}
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
              text={"Redeem Voucher"}
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
          isVisible={rechargeModal}
        >
          <View style={styles.rechargeModalStyle}>
            <CustomText
              text={"Froggy"}
              textSize={20}
              fontWeight={"bold"}
              textColor={colors.appColor}
            />
            <CustomText
              text={"Balance : Euro 4.00"}
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
      </View>

      {/* <Loading
        style={{
          flex: 1,
          justifyContent: "center",
        }}
        loading={isLoading}
      /> */}
    </SafeAreaView>
  );
};
export default Home;
