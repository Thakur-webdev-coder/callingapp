import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
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
  ic_video
} from "../../routes/imageRoutes";
import CommonHeader from "../../components/Header/commonHeader";
import { useSelector } from "react-redux";
import Sip from "@khateeb00/react-jssip";
import { Show_Toast } from "../../utils/toast";
import { hitCallRatesNewApi } from "../../constants/APi";
import Loading from "react-native-whc-loading";
import colors from "../../../assets/colors";
import CustomText from "../../components/CustomText";
import { FlatList } from "react-native-gesture-handler";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const CallDetailsScreen = ({ navigation, route }) => {
  //  const [ratesModal,setRatesModal]= useState(false)
  const [state, setState] = useState({
    isLoading: false,
     ratesModal:false,
     ratesData:[]
  });
  const { Name, phoneNumber, isKokaContact } = route.params;

  const { balanceDetail = {} } = useSelector((store) => store.sliceReducer);
  console.log("route.params--->0", route.params);


  const CallRatesMethod = async () => {
    console.log('-----nnnnnnn----', phoneNumber);
    const data = new FormData();
    data.append("search_number", phoneNumber);

    setState({ isLoading: true })
    hitCallRatesNewApi(data).then((myResponse) => {
      setState({
        isLoading: false,
         ratesModal: true,
         ratesData:myResponse?.data?.rates
      })
      // setRatesModal(true)

   console.log('---res-->>>>>',myResponse.data.rates)
       
      // let txt = Rate[0]
      // console.log('------aa-----',Rate[0])
      // Alert.alert('',Rate[0])
    })
      .catch((err) => {
        setState({ isLoading: false })
        console.log('---res-->>>>>', err)
      })
  }

  const renderItem = ({ item }) => {
    const {rate,destination} =item;
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
          <View style={[styles.ratesTxtStyle,{paddingTop:hp(1)}]}>
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
    
      <CommonHeader 
      headerText={"Contacts Details"}
      onPress={() => navigation.goBack()} />

      <View style={styles.mainView}>
        <View style={styles.container_view}>
          <Image source={ic_contact_avatar} />
          <Text style={styles.textStyle}>{Name}</Text>
        </View>

        <View style={styles.container_view2}>
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CallScreen", {
                  voiceCall: true,
                  callData: phoneNumber,
                })
              }
              disabled={isKokaContact}
              
            >
              <View style={[styles.imgBoxStyle, { backgroundColor: !isKokaContact ? '#4D3E3E' : 'rgba(77, 62, 62, 0.6)' }]}>
                <Image source={ic_phone} />
              </View>
              <Text style={styles.iconTilteStle}>Call</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CallScreen", {
                  voiceCall: false,
                  callData: phoneNumber,
                })
              }
              disabled={isKokaContact}
            >
              <View style={[styles.imgBoxStyle, { backgroundColor: !isKokaContact ? "#4D3E3E" : 'rgba(77, 62, 62, 0.6)' }]}>
                <Image source={ic_video} />
              </View>
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
              <View style={[styles.imgBoxStyle, { backgroundColor: !isKokaContact ? "#4D3E3E" : 'rgba(77, 62, 62, 0.6)' }]}>
                <Image source={ic_double_chat} />
              </View>

              <Text style={styles.iconTilteStle}>Chat</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                if (balanceDetail.credit > 0) {
                  Sip.makeCall(phoneNumber);
                  navigation.navigate("CallingScreen", {
                    callData: { name: Name },
                  });
                } else {
                  Show_Toast(
                    "Insufficient balance. Please recharge your account."
                  );
                }
              }}
            >
              <View style={styles.imgBoxStyle}>
                <Image source={ic_phoneforward} />
              </View>
              <Text style={styles.iconTilteStle}> Paid Call</Text>
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
          onPress={() => CallRatesMethod()}>
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

     {state.ratesModal &&
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
             renderItem={renderItem}/>
          <TouchableOpacity onPress={() => setState({ratesModal:false})}>
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
}
      <Loading loading={state.isLoading} />
      
    </SafeAreaView>
  );
};

export default CallDetailsScreen;
