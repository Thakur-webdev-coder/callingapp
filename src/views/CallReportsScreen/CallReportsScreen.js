import { View, FlatList, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../../assets/colors";
import CustomText from "../../components/CustomText";
import styles from "./styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { CommonHeader } from "../../components";
import { hitGetCallDetailsApi } from "../../constants/APi";
import { useSelector } from "react-redux";
// import Loading from "react-native-whc-loading";

const CallReportsScreen = () => {
  const [state, setState] = useState({
    callDetailRes: "",
  });

  const { encrypt_detail } = useSelector((store) => store);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    hitCallDetail();
  }, []);

  const hitCallDetail = async () => {
    // setIsLoading(true);
    const data = new FormData();
    data.append("cust_id", encrypt_detail?.encryptUser);
    const myResponse = await hitGetCallDetailsApi(data);

    if (myResponse.data.result == "success") {
      setState({
        callDetailRes: myResponse.data.msg,
      });

      // setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.listView}>
        <CustomText
          width={wp(22)}
          text={item.date}
          textSize={14}
          textColor={colors.white}
        />
        <CustomText
          text={item.called_user}
          textSize={14}
          textColor={colors.white}
        />
        <CustomText
          text={item.duration.slice(0, 4)}
          textSize={14}
          textColor={colors.white}
        />
        <CustomText text={item.cost} textSize={14} textColor={colors.white} />
      </View>
      <View style={styles.listHorizontalLine}></View>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <CommonHeader
        headerText={"Call Details Reports"}
        paddingHorizontal={20}
      />

      <View style={styles.listContainer}>
        <View style={styles.horizontalLine}></View>
        <View style={styles.titleView}>
          <CustomText
            width={wp(22)}
            text={"Date"}
            textSize={16}
            textColor={colors.darkGreenText}
          />
          <CustomText
            text={"Destination"}
            textSize={16}
            textColor={colors.darkGreenText}
          />
          <CustomText
            text={"Duration"}
            textSize={16}
            textColor={colors.darkGreenText}
          />

          <CustomText
            text={"Cost"}
            textSize={16}
            textColor={colors.darkGreenText}
          />
        </View>
        <View style={styles.horizontalLine}></View>

        <FlatList data={state?.callDetailRes} renderItem={renderItem} />
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

export default CallReportsScreen;
