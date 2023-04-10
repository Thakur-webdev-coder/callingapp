import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ic_back,
  ic_chat_search,
  ic_contact_avatar,
  ic_menu,
  logo_contact_kokoa,
} from "../../routes/imageRoutes";
import styles from "./styles";
import ContactList from "react-native-contacts";
import { useDispatch, useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { request, RESULTS, PERMISSIONS } from "react-native-permissions";
import { CommonHeader } from "../../components";
import { hitSyncContactApi } from "../../constants/APi";
import { omitSpecialCharacters } from "../../utils/commonUtils";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import colors from "../../../assets/colors";
import { saveContacts } from "../../redux/reducer";
import Sip from "@khateeb00/react-jssip";
import { Show_Toast } from "../../utils/toast";
import Loading from "react-native-whc-loading";

const { Popover } = renderers;

const Contacts = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [commonKokacontact, setCommonKokacontact] = useState([]);
  const [state, setState] = useState({
    contacts: [],
    numberList: " ",
    kokaContact: [],
    // commonKokacontact:[]
  });
  const [searchTxt, setSearchTxt] = useState("");

  const {
    balanceDetail = {},
    encrypt_detail = {},
    loginDetails = {},
    allContacts = [],
  } = useSelector((store) => store.sliceReducer);
  const { encryptPassword, encryptUser } = encrypt_detail;

  console.log("detailsssss====", allContacts);
  // useEffect(()=>{ ̰
  //   checkPeermission();
  // },[])
  useEffect(() => {
    console.log("---useEffect---");
    checkPeermission();
    // syncContacts();
    const unsubscribe = navigation.addListener("blur", () => {
      setSearchTxt("");
      // syncContacts();
      // filterContacts("");
    });
    return unsubscribe;
  }, []);
  const permissions =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.READ_CONTACTS
      : PERMISSIONS.ANDROID.READ_CONTACTS;

  // const filterContacts = (txt) => {
  //   setSearchTxt(txt);
  //   ContactList?.getContactsMatchingString(txt)?.then((contact) => {
  //     setState({ contacts: contact });
  //   });
  // };
  const syncContacts = (contactNumber) => {
    console.log("inApi======");
    setIsLoading(true);
    const mapContact = (contactNumber || allContacts)?.map((l) =>
      // l.phoneNumbers[0]?.number
      omitSpecialCharacters(l.phoneNumbers[0]?.number)
    );
    console.log("mapContact------", mapContact.toString());
    setState({
      numberList: mapContact.toString(),
    });
    const data = new FormData();
    data.append("username", encryptUser);
    data.append("password", encryptPassword);
    data.append("phonenos", mapContact.toString());

    console.log("datattattatatta>>>", data);

    hitSyncContactApi(data)
      .then((response) => {
        console.log("res====>>>>>>>>", response.data.phonenos);
        if (response.data.result == "success") {
          setIsLoading(false);

          if (response?.data?.phonenos) {
            setState({ kokaContact: response.data.phonenos });

            var contacts_list = response?.data?.phonenos
              .map((_item, index) => {
                const contact = (contactNumber || allContacts).find((item) => {
                  return item.phoneNumbers.find((number) => {
                    return (
                      // console.log(
                      //   "comparre======>",
                      //   _item == omitSpecialCharacters(number.number)
                      // ),
                      _item == omitSpecialCharacters(number.number)
                    );
                  });
                });
                if (contact)
                  return {
                    ...contact,
                    name: `${contact.givenName} ${contact.familyName}`.trim(),
                  };
                return undefined;
              })
              .filter((item) => item);

            setCommonKokacontact(contacts_list);
            console.log("contacts_list======>", contacts_list);
          }

          // setState({
          //   commonKokacontact: contacts_list,
          // });

          //   setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("errrror------", err);
        Alert.alert("Something went wrong herreee");
        setState({ isLoading: false });
        setIsLoading(false);
      });
  };

  const checkPeermission = () => {
    request(permissions)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable",
              RESULTS.DENIED
            );
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("granted------");
            ContactList?.getAll()?.then((contact) => {
              dispatch(saveContacts(contact));
              syncContacts(contact);

              setState({
                contacts: contact,
              });
            });

            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            break;
        }
      })
      .catch((error) => {
        console.log("errr----", error);
      });
  };

  const onInviteBackdropPress = () => {
    setState({ isInvitePopupMenu: false });
  };
  const onInviteOptionSelect = (value) => {
    // console.log('item_________:)', item)

    if (value == 1) {
      syncContacts();
    } else {
      console.log("inmenu----e---", value);
    }
  };

  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };

  const { kokaContact = [], contacts } = state;
  let commonGivenNames = commonKokacontact.map((l) => l.givenName);
  console.log("commonKokacontact------", commonKokacontact);

  const renderItem = ({ item }) => {
    // console.log("item============", item?.phoneNumbers[0]?.number);
    // console.log('find============', commonGivenNames.find(el => el== item?.givenName))
    const onPressCall = () => {
      if (balanceDetail.credit > 0) {
        Sip.makeCall(item?.phoneNumbers[0]?.number);

        navigation.navigate("CallingScreen", {
          callData: item,
        });
      } else {
        Show_Toast("Insufficient balance. Please recharge your account.");
      }
    };
    const onPressNextPage = () => {
      console.log("callDetail--------", item?.phoneNumbers[0]?.number);
      navigation.navigate("CallDetailsScreen", {
        Name: item.givenName,
        phoneNumber: item?.phoneNumbers[0]?.number,
      });
    };

    return (
      <TouchableOpacity
        style={styles.flatListStyle}
        onPress={() => {
          commonGivenNames.includes(item?.givenName)
            ? onPressNextPage()
            : onPressCall();
        }}
      >
        <View style={styles.imgBox}>
          <Image
            style={styles.imgstyle}
            source={
              item?.hasThumbnail
                ? { uri: item?.thumbnailPath }
                : ic_contact_avatar
            }
          />
        </View>
        <Text style={styles.nameTxtStyle}>{item?.givenName}</Text>
        {commonGivenNames.includes(item?.givenName) ? (
          <Image source={logo_contact_kokoa} />
        ) : null}
        {/* <Text style={styles.nameTxtStyle}>
            {item?.phoneNumbers[0]?.number}
          </Text> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      {/* <View style={{justifyContent:'center',flex:1}}>
      <Text style={{color:colors.black,textAlign:'center',fontSize:20}}>Not implemented yet</Text>
      </View> */}

      <View style={styles.toolBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_back} />
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          <Text style={styles.textStyleToolbar}>Contacts</Text>
        </View>
        <View style={styles.headerComponent}>
          <TouchableOpacity>
            <Image source={ic_chat_search} />
          </TouchableOpacity>
          <View
            style={{ marginHorizontal: 25 }}
            // onPress={() => navigation.navigate("SelectScreen")}
          >
            {/* <Image source={ic_menu} /> */}

            <Menu
              renderer={Popover}
              rendererProps={{ placement: "bottom" }}
              onBackdropPress={() => onInviteBackdropPress()}
              onSelect={(value) => onInviteOptionSelect(value)}
            >
              <MenuTrigger
                customStyles={{
                  TriggerTouchableComponent: ({ onPress }) => (
                    <TouchableOpacity onPress={onPress}>
                      <Image
                        // resizeMode="center"

                        source={ic_menu}
                      />
                      {/* <Text style={{ fontSize: wp('2.8%'), color: "#00B9AB", textAlign: 'center', marginLeft: 2, fontWeight: 'bold' }}
                                    numberOfLines={0} textBreakStrategy={'simple'}>{translate_Language("Start") + "  "}</Text> */}
                    </TouchableOpacity>
                  ),
                }}
              />

              <MenuOptions>
                <MenuOption
                  style={{ paddingVertical: hp(1), paddingHorizontal: wp(10) }}
                  value={1}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black,
                      fontWeight: "bold",
                    }}
                  >
                    {"Sync Contacts"}
                  </Text>
                  {/* <Text style={{ fontSize: 14, color: colors.black,fontWeight:'bold'  }}>{'Kokoafone Contacts'}</Text> */}
                </MenuOption>
                {/* <MenuOption style={{ paddingVertical: hp(1), paddingHorizontal: wp(10), }} value={2}>
                  <Text style={{ fontSize: 14, color: colors.black, fontWeight: 'bold' }}>{'Kokoafone Contacts'}</Text>
                </MenuOption> */}
              </MenuOptions>
            </Menu>
          </View>
          <TouchableOpacity>
            {/* <Image source={ic_menu} /> */}
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.containerStyle}
        data={allContacts}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
      />
      <Loading loading={isLoading} />
    </SafeAreaView>
  );
};
export default Contacts;
