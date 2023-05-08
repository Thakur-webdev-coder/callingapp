import { View, FlatList, SafeAreaView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../../assets/colors';
import CustomText from '../../components/CustomText';
import styles from './styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CommonHeader } from '../../components';
import {
  hitGetCallDetailsApi,
  hitTransferHistoryApi,
} from '../../constants/APi';
import { useSelector } from 'react-redux';
import Loading from 'react-native-whc-loading';
import AppStyle from "../../components/AppStyle";
const TransferHistory = ({ navigation }) => {
  const [state, setState] = useState({
    callDetailRes: '',
    isLoading: false,
  });

  const DATA = [
    {
      date: '2022-11-11',
      called_user: '0987890987',
      duration: 'USD 0.50',
    },
    {
      date: '2022-11-11',
      called_user: '0987890987',
      duration: 'USD 0.50',
    },
    {
      date: '2022-11-11',
      called_user: '0987890987',
      duration: 'USD 0.50',
    },
  ];

  const { encrypt_detail, loginDetails } = useSelector(
    (store) => store.sliceReducer
  );

  useEffect(() => {
    hitCallDetail();
  }, []);

  const hitCallDetail = async () => {
    setState({ isLoading: true });
    const data = new FormData();
    data.append('cust_id', loginDetails?.did);

    hitTransferHistoryApi(data)
      .then((response) => {
        console.log('hitTransferHistoryApi----res---->>', response.data);
        setState({ isLoading: false });
        if (response.data.result == 'success') {
          setState({
            callDetailRes: response.data.msg,
          });
        }
      })
      .catch((err) => {
        console.log('reeeeeeeeerrrrrrrr====>>>>>>', err);
        setState({ isLoading: false });
      });
  };

  const EmptyListMessage = ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.emptyListStyle}>No Data Found</Text>
    );
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.listView}>
        <CustomText
          // width={wp(22)}
          text={item.date}
          textSize={14}
          textColor={colors.black}
        />
        <CustomText
          text={item.reciever}
          textSize={14}
          textColor={colors.black}
        />
        {/* <CustomText
          text={item.duration.slice(0, 4)}
          textSize={14}
          textColor={colors.black}
        /> */}
        <CustomText
          text={item.currency + ' ' + item.amount}
          textSize={14}
          textColor={colors.black}
        />
        {/* <CustomText text={item.cost} textSize={14} textColor={colors.black} /> */}
      </View>
      <View style={styles.listHorizontalLine}></View>
    </View>
  );

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.homeMainView}>
      <CommonHeader
        headerText={'Transfer History '}
        paddingHorizontal={20}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.listContainer}>
        <View style={styles.horizontalLine}></View>
        <View style={styles.titleView}>
          <CustomText
            width={wp(16)}
            text={'Date'}
            textSize={16}
            textColor={colors.black}
          />
          <CustomText
            width={wp(16)}
            text={'Receiver'}
            textSize={16}
            textColor={colors.black}
          />
          <CustomText text={'Amount'} textSize={16} textColor={colors.black} />

          {/* <CustomText text={"Cost"} textSize={16} textColor={colors.black} /> */}
        </View>
        <View style={styles.horizontalLine}></View>

        <FlatList
          data={state?.callDetailRes}
          //data={DATA}
          renderItem={renderItem}
          ListEmptyComponent={EmptyListMessage}
        />
      </View>
      <Loading loading={state.isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default TransferHistory;
