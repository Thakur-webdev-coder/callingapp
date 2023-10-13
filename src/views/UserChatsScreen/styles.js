import { StyleSheet,Dimensions } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";
const windowHeight =Dimensions.get('window').height
const windoWidth= Dimensions.get('window').width
export default StyleSheet.create({
  toolBar: {
    flexDirection: "row",
    backgroundColor:'#FF0000',

    // backgroundColor: colors.secondary,
    alignItems: "center",
    //justifyContent: "space-between",
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(5),
   
  },
  nameContainer: {
     width: wp(50),
    marginLeft: wp(5),
   
  },
  headerBox:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:wp(90)
  },
    


  textStyleToolbar: {
    color: colors.white,
    fontSize: 13,
    padding:7
  },

  searchTnputStyle: {
    borderRadius: 10,
    backgroundColor: colors.white,
   
    width: wp(80),
    borderWidth: 1,
    flexDirection: "row",
    justifyContent:'space-between'
  },

  sendMessageImg: {
    // flex:0,
     marginBottom: hp(1),
    marginTop: hp(2),
    flexDirection: "row",
    marginHorizontal: wp(3),
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchTnputStyleee: {
    
    width: wp(60),
     maxHeight: hp(12),
    color: colors.black,
    paddingTop:hp(1),
    alignSelf: "center",
    
  },
  arrowStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    // backgroundColor: colors.secondary,
    backgroundColor:'#FF0000',

    justifyContent: "center",
  },
  voucherModalStyle: {
    backgroundColor: colors.backColor,

    margin: 0,
    // paddingHorizontal:wp(3)
  },

  dateBg: {
    backgroundColor: colors.white,
    padding: 10,
  },
  callModalStyle: {
    padding: 15,
    marginHorizontal: wp(5),
    backgroundColor: "white",
    marginTop: hp(40),
    justifyContent: "center",

    elevation: 5,
  },
  callBoxStyle: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerComponent: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
  },
});
