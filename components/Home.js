import { useState } from 'react';
import { Text, View, TextInput, Pressable, Keyboard, useWindowDimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Metrics, { moderateScale } from './Metrics'
import Header from './Header'
import Footer from './Footer'
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MAX_SPOT,
    MIN_SPOT,
    BONUS_POINTS,
    BONUS_POINT_LIMIT,
} from '../constants/Game'
import styles from '../style/style';
import HideWithKeyboard from 'react-native-hide-with-keyboard';


export default function Home({ navigation }) {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <View style={styles.container}>
            <Header />
            <View >
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons
                        name="information"
                        size={moderateScale(60)}
                        color={"orange"}

                    />

                </View>
                {!hasPlayerName ?
                    <>
                        <Text style={[{textAlign: 'center'}, styles.mainText]}>Enter your name for scoreboard.</Text>
                        <TextInput
                            onChangeText={setPlayerName}
                            autoFocus={true}
                            style={{ color: 'white', alignSelf: 'center',  }}
                        />
                        <View style={{ alignSelf: 'center' }}>
                            <Pressable
                                onPress={() => handlePlayerName(playerName)}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>OK</Text>
                            </Pressable>
                        </View>
                    </>
                    :
                    <>
                        <Text style={[{textAlign: 'center'}, styles.mainText]}>Rules of the game</Text>
                        <Text multiline="true" style={[styles.gameinfo, styles.mainText]}>
                            THE GAME: Upper section of the classic Yahtzee
                            dice game. You have {NBR_OF_DICES} dices and
                            for the every dice you have {NBR_OF_THROWS} {""}
                            throws. After each throw you can keep dices in
                            order to get same dice spot counts as many as
                            possible. In the end of the turn you must select
                            your points from {MIN_SPOT} to {MAX_SPOT}.
                            Game ends when all points have been selected.
                            The order for selecting those is free.{"\n"}
                            POINTS: After each turn game calculates the sum
                            for the dices you selected. Only the dices having
                            the same spot count are calculated. Inside the
                            game you can not select same points from{" "}
                            {MIN_SPOT} to {MAX_SPOT} again.{"\n"}
                            GOAL: To get points as much as possible.{" "}
                             {BONUS_POINT_LIMIT} points is the limit of
                            getting bonus which gives you {BONUS_POINTS}{" "}
                            points more.
                        </Text>
                        <Text style={[styles.gameinfo, styles.mainText]}>Good luck, {playerName}</Text>
                        <View style={{ alignSelf: 'center' }}>
                            <Pressable
                                onPress={() => navigation.navigate('Gameboard', { player: playerName })}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>PLAY</Text>
                            </Pressable>
                        </View>
                    </>
                }
            </View>
            <HideWithKeyboard>
                <Footer />
            </HideWithKeyboard>
        </View>
    )
}