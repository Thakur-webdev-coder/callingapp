import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import AppStyle from "../../components/AppStyle";
import {
  ic_contact_avatar,
  ic_double_chat,
  ic_free_call,
  ic_free_msg,
  ic_free_video,
  ic_paid_call,
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

const CallDetailsScreen = ({ navigation, route }) => {
  // const [newRatesData,setNewRatesData]= useEffect([])
  const [state,setState]=useState({
    isLoading:false
  });
  const { Name, phoneNumber,isKokaContact } = route.params;
  
  const { balanceDetail = {} } = useSelector((store) => store.sliceReducer);
  console.log("route.params--->0", route.params);


  const CallRatesMethod = async () => {
    console.log('-----nnnnnnn----',phoneNumber);
    const data = new FormData();
    data.append("search_number", phoneNumber);

    setState({isLoading:true})
     hitCallRatesNewApi(data).then((myResponse)=>{
      setState({isLoading:false})
      // console.log('---res-->>>>>',myResponse.data.rates.map((l)=>l.rate))
      // const Rate=myResponse?.data?.rates.map((l)=>l.rate)
      // let txt = Rate[0]
      // console.log('------aa-----',Rate[0])
      // Alert.alert('',Rate[0])
     })
     .catch((err)=>{
      setState({isLoading:false})
      console.log('---res-->>>>>',err)
     })
     
   
  }
  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <CommonHeader headerText={"Contacts Details"} />

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
               <View style={[styles.imgBoxStyle,{backgroundColor:!isKokaContact?'#4D3E3E': '#5E5152'}]}>
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
               <View style={[styles.imgBoxStyle,{backgroundColor:!isKokaContact?"#4D3E3E": '#5E5152'}]}>
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
               <View style={[styles.imgBoxStyle,{backgroundColor:!isKokaContact ?"#4D3E3E": '#5E5152'}]}>
              <Image  source={ic_double_chat} />
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
         onPress={()=>CallRatesMethod()}>
        <Text style={styles.textStyle}>Rates</Text>
        <Image style={{marginTop:5}} source={ic_rightArror}/>
        </TouchableOpacity>
      </View>
      <Loading loading={state.isLoading} />
    </SafeAreaView>
  );
};

export default CallDetailsScreen;
