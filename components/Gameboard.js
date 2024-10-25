import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Metrics, { moderateScale } from './Metrics'
import moment from 'moment';
import Header from './Header';
import Footer from './Footer'
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MAX_SPOT,
  MIN_SPOT,
  BONUS_POINTS,
  BONUS_POINT_LIMIT,
  SCOREBOARD_KEY,
} from '../constants/Game'
import { Container, Row, Col } from 'react-native-flex-grid';
import styles from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';

let board = [];

export default function Gameboard({ navigation, route }) {

  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState('Start round');
  const [pointsSelected, setPointsSelected] = useState(false);
  const [gameEndStatus, setGameEndStatus] = useState(false);
  const [roundNmbr, setRoundNbr] = useState(1); // 6 kierrosta, aloitetaan 1
  const [points, setPoints] = useState(0);
  const [bonusAdded, setBonusAdded] = useState(false);

  //If dices are selected or not
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
  //Dice spots
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
  //If dice points are selected or not for spots
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
  //Total points for different spots
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));

  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, [])

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
        setScores(tmpScores);
        console.log('Gameboard: Read succesful');
        console.log('Gameboard: Number of scores: ' + tmpScores.length);
      }
    } catch (e) {
      console.log("Gameboard Error: " + e);
    }
  }

  const savePlayerPoints = async () => {
    const now = moment();
    const formattedDate = now.format('DD/MM/YYYY');
    const formattedTime = now.format('HH:mm');
    const newKey = scores.length + 1;
    const playerPoints = {
      key: newKey,
      name: playerName,
      date: formattedDate, // hae tänne actual date ja time
      time: formattedTime,
      points: points // tänne real score
    }
    try {
      const newScore = [...scores, playerPoints];
      const jsonValue = JSON.stringify(newScore);
      await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
      console.log("Gameboard: save succesful, points: " + points);
      console.log(newScore)
    } catch (e) {
      console.log("Gameboard Error: " + e);
    }
  }

  //Invoke round handler if no throws left, and points have been selected
  useEffect(() => {
    if (nbrOfThrowsLeft === 0 && pointsSelected === true) {
      roundHandler();
      //console.log("UseEffect meni läpi");
    } else {
      //console.log("UseEffect ei mennyt läpi, status: " + pointsSelected + " sekä throws left: " + nbrOfThrowsLeft);
    }
  }, [pointsSelected, nbrOfThrowsLeft]);

  function throwDices() {
    if (nbrOfThrowsLeft > 0) {
      let spots = [...diceSpots];
      for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
          let randomNumber = Math.floor(Math.random() * MAX_SPOT + 1);
          spots[i] = randomNumber;
          board[i] = 'dice-' + randomNumber;
          setStatus("Keep throwing");
        }
      }
      console.log("Throw dices: " + points + " Round NBR: " + roundNmbr);
      setDiceSpots(spots);
      setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    } else if (nbrOfThrowsLeft === 0 && pointsSelected === false) {
      setStatus("Select your points before the next throw.");
    }
  }

  //Function for handling rounds
  function roundHandler() {

    if (roundNmbr < 6) {
      console.log("Threw dices");
      let totalPoints = 0;
      setSelectedDices(new Array(MAX_SPOT).fill(false));
      setNbrOfThrowsLeft(NBR_OF_THROWS);
      setRoundNbr(roundNmbr + 1);
      setGameEndStatus(false);
      setPointsSelected(false);
      setStatus("Start the round");

      console.log(points);
      for (i = 0; i < dicePointsTotal.length; i++) {
        if (dicePointsTotal[i] !== 0) {
          totalPoints += dicePointsTotal[i];
        } else {
          //console.log("No points in this part")
        }

      }
      if (bonusAdded) {
        totalPoints += BONUS_POINTS
      }
      setPoints(totalPoints);
    } else {
      let totalPoints = 0;
      for (i = 0; i < dicePointsTotal.length; i++) {
        if (dicePointsTotal[i] !== 0) {
          totalPoints += dicePointsTotal[i];
        }
      }
      if (bonusAdded) {
        totalPoints += BONUS_POINTS
      }
      setPoints(totalPoints);
      setGameEndStatus(true);
    }

  }




  //Function for restarting game
  function restart() {
    //console.log("Restarted the thing");
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setDiceSpots(new Array(NBR_OF_DICES).fill(0));
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    setDicePointsTotal(new Array(MAX_SPOT).fill(0));
    setRoundNbr(1);
    setPointsSelected(false);
    setStatus('Start round');
    setPoints(0);
    setGameEndStatus(false);
    setBonusAdded(false);
  }

  //Add the bonuspoints
  function bonusPoints() {
    if (points >= BONUS_POINT_LIMIT && bonusAdded != true) {
      setPoints(points + BONUS_POINTS)
      setBonusAdded(true);
      console.log("Bonuspoints if: " + points + " round number: " + roundNmbr);
      return (
        <View>
          <Text style={styles.mainText}>You gained the bonus points!</Text>
        </View>
      )
    } else if (points < BONUS_POINT_LIMIT && bonusAdded === false) {
      console.log("Bonuspoints else if: " + points + " round number: " + roundNmbr);
      return (
        <View>
          <Text style={styles.mainText}>Points needed for bonus: {BONUS_POINT_LIMIT - points}</Text>
        </View>
      )
    } else {
      console.log("Bonuspoints else: " + points + " round number: " + roundNmbr);
      return (
        <View>
          <Text style={styles.mainText}>Congratulations! bonus points were added!</Text>
        </View>
      )
    }
  }


  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }

  //Set dice colors
  function getDiceColor(i) {
    return selectedDices[i] ? "orange" : "red"
  }

  function getDicePointColor(i) {
    return selectedDicePoints[i] ? "orange" : "red"
  }

  const selectDicePoints = (i) => {
    console.log(nbrOfThrowsLeft)
    if (nbrOfThrowsLeft === 0) {
      let selected = [...selectedDices];
      let selectedPoints = [...selectedDicePoints];
      let points = [...dicePointsTotal];
      if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
        setDicePointsTotal(points);
        setSelectedDicePoints(selectedPoints);
        setPointsSelected(true);
        return points[i];
      } else {
        setStatus('You already selected points for ' + (i + 1));
      }


    } else {
      setStatus("Throw " + nbrOfThrowsLeft + " more times before setting points.")
    }
  }

  function selectDice(i) {
    console.log();
    if (nbrOfThrowsLeft !== 3) {
      let dices = [...selectedDices];
      dices[i] = selectedDices[i] ? false : true;
      setSelectedDices(dices);
    } else {
      setStatus("Throw the dices first.");
    }
  }


  const row = [];
  for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
      <Col key={"row" + i} style={{ paddingBottom: 40 }}>
        <Pressable
          key={"row" + i}
          onPress={() => selectDice(i)}
        >
          <MaterialCommunityIcons
            name={board[i]}
            key={"row" + i}
            size={moderateScale(50)}
            color={getDiceColor(i)}
          >
          </MaterialCommunityIcons>
        </Pressable>
      </Col>
    );
  }

  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot}>
        <Text key={"pointsRow" + spot} style={styles.mainText}>{getSpotTotal(spot)}</Text>
      </Col>
    );
  }

  const pointsToSelectRow = [];
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
      <Col key={"buttonRow" + diceButton}>
        <Pressable
          key={"buttonRow" + diceButton}
          onPress={() => selectDicePoints(diceButton)}
        >
          <MaterialCommunityIcons
            key={"buttonRow" + diceButton}
            name={"numeric-" + (diceButton + 1) + "-circle"}
            size={moderateScale(35)}
            color={getDicePointColor(diceButton)}
          />
        </Pressable>
      </Col>
    )
  }

  return (
    <View style={styles.container}>

      <Header />
      {!gameEndStatus ?
        <>
          <View style={styles.gameboard}>
            <Container>
              {status === 'Start round' ?
                <View style={styles.gameboard}>
                  <MaterialCommunityIcons
                    name={"dice-multiple"}
                    size={moderateScale(80)}
                    color={'red'}
                  />
                </View>
                :
                <>
                  <Row>
                    {row}
                  </Row>
                </>
              }
            </Container>
            <Text style={styles.mainText}>Round: {roundNmbr} of 6</Text>
            <Text style={styles.mainText}>Throw left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.mainText}>{status}</Text>
            <Text style={[styles.mainText, { fontSize: moderateScale(20), fontWeight: 'bold' }]}> Total: {points}</Text>
            <Pressable
              onPress={() => throwDices()}
              style={[styles.button,]}
            >
              <Text style={styles.buttonText}>Throw dices</Text>
            </Pressable>
            <Text >{bonusPoints()}</Text>
            <Container>
              <Row>
                {pointsRow}
              </Row>
            </Container>
            <Container>
              <Row>
                {pointsToSelectRow}
              </Row>
            </Container>
            <Text style={styles.mainText}>Player name: {playerName}</Text>
          </View>

        </>
        :
        <>
          <View style={styles.gameboard}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Round over</Text>
            <Text style={styles.mainText}>Points: {points}</Text>
            <Text style={styles.mainText}>{bonusPoints()}</Text>
            <Pressable
              onPress={() => savePlayerPoints()}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Save points</Text>
            </Pressable>
            <Text style={styles.mainText}>Do you want to restart?</Text>
            <Pressable
              onPress={() => restart()}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Restart</Text>
            </Pressable>
          </View>
        </>
      }
      <Footer />
    </View >
  )
}