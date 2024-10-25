import { StyleSheet } from 'react-native';
import Metrics, { horizontalScale, moderateScale, verticalScale } from '../components/Metrics'

const boardColor = "#00512C"
const textColor = "white"

export default StyleSheet.create({
  container: {
    height: verticalScale(775),
    width: horizontalScale(375),
    backgroundColor: boardColor
  },
  header: {
    backgroundColor: '#bb1818',
    flexDirection: 'row',
  },
  footer: {
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    backgroundColor: '#bb1818',
    flexDirection: 'row',
  },
  title: {
    color: '#Ffd700',
    fontFamily: 'CasinoFont',
    flex: 1,
    fontSize: moderateScale(25),
    textAlign: 'center',
    padding: verticalScale(8),
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: verticalScale(8),
  },
  gameboard: {
    paddingTop: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreboard: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: boardColor,
    justifyContent: 'center',
    paddingLeft: moderateScale(15),
    paddingRight: moderateScale(15),
    fontSize: moderateScale(15),
    marginTop: verticalScale(10)
  },
  mainText: {
    color: textColor,
    fontSize: moderateScale(15),
    paddingTop: verticalScale(3)
  },
  row: {
    marginTop: verticalScale(20),
    padding: verticalScale(10)
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: verticalScale(30),
    flexDirection: "row",
    padding: verticalScale(10),
    backgroundColor: "orange",
    width: horizontalScale(150),
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: "white",
    fontSize: moderateScale(20)
  }
});