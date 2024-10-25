import { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import styles from '../style/style'
import { MAX_NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from '../constants/Game'
import Metrics, { moderateScale } from './Metrics'
import Header from './Header'
import Footer from './Footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DataTable } from 'react-native-paper'

export default function Scoreboard({ navigation }) {

  const [scores, setScores] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScoreboardData();
    })
    return unsubscribe;
  }, [navigation])

  const getScoreboardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      if (jsonValue !== null) {
        const tmpScores = JSON.parse(jsonValue);
        tmpScores.sort((a, b) => b.points - a.points); 
        setScores(tmpScores);
        console.log('Scoreboard: Read succesful');
        console.log('Scoreboard: Number of scores: ' + tmpScores.length);
      }
    } catch (e) {
      console.log("Scoreboard Error: " + e);
    }
  }


  const clearScoreBoard = async () => {
    try {
      await AsyncStorage.removeItem(SCOREBOARD_KEY);
      setScores([]);
    } catch (e) {
      console.log("Error clearing scoreboard" + e)
    }
  }




  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.scoreboard}>
        <Text style={[styles.mainText,{fontSize: moderateScale(40)}]}>Top 7</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title textStyle={styles.mainText}>Name</DataTable.Title>
            <DataTable.Title textStyle={styles.mainText}>Date</DataTable.Title>
            <DataTable.Title textStyle={styles.mainText}>Time</DataTable.Title>
            <DataTable.Title numeric textStyle={styles.mainText}>Score</DataTable.Title>
          </DataTable.Header>

        {scores.slice(0, MAX_NBR_OF_SCOREBOARD_ROWS).map((score) => (
          <DataTable.Row key={score.key}>
            <DataTable.Cell textStyle={styles.mainText}>{score.name}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.mainText}>{score.date}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.mainText}>{score.time}</DataTable.Cell>
            <DataTable.Cell numeric textStyle={styles.mainText}>{score.points}</DataTable.Cell>
          </DataTable.Row>
        ))}
        </DataTable>
      </View>
      <Footer />
    </View>
  )
}