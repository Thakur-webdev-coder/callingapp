import { View, FlatList, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../../assets/colors";
import CustomText from "../../components/CustomText";
import styles from "./styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { CommonHeader } from "../../components";
import { hitGetCallDetailsApi } from "../../constants/APi";
import { useSelector } from "react-redux";
import Loading from "react-native-whc-loading";

const CallReportsScreen = () => {
  const [state, setState] = useState({
    callDetailRes: "",
    isLoading: false,
  });

  const { encrypt_detail } = useSelector((store) => store.sliceReducer);

  useEffect(() => {
    hitCallDetail();
  }, []);

  const hitCallDetail = async () => {
    setState({ isLoading: true });
    const data = new FormData();
    data.append("cust_id", encrypt_detail?.encryptUser);

    hitGetCallDetailsApi(data)
      .then((response) => {
        console.log("res------->>", response.data);
        setState({ isLoading: false });
        if (response.data.result == "success") {
          setState({
            callDetailRes: response.data.msg,
          });
        }
      })
      .catch((err) => {
        console.log("reeeeeeeeerrrrrrrr====>>>>>>", err);
        setState({ isLoading: false });
      });
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.listView}>
        <CustomText
          width={wp(22)}
          text={item.date}
          textSize={14}
          textColor={colors.black}
        />
        <CustomText
          text={item.called_user}
          textSize={14}
          textColor={colors.black}
        />
        <CustomText
          text={item.duration.slice(0, 4)}
          textSize={14}
          textColor={colors.black}
        />
        <CustomText text={item.cost} textSize={14} textColor={colors.black} />
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
            textColor={colors.black}
          />
          <CustomText
            text={"Destination"}
            textSize={16}
            textColor={colors.black}
          />
          <CustomText
            text={"Duration"}
            textSize={16}
            textColor={colors.black}
          />

          <CustomText text={"Cost"} textSize={16} textColor={colors.black} />
        </View>
        <View style={styles.horizontalLine}></View>

        <FlatList data={state?.callDetailRes} renderItem={renderItem} />
      </View>
      <Loading loading={state.isLoading} />
    </SafeAreaView>
  );
};

export default CallReportsScreen;
