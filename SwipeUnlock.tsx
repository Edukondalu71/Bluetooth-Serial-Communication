import React, { useRef } from 'react';
import { Alert, Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SwipeUnlock({
    lockWidth = width * 0.75,
    lockHeight = 60,
    onUnlock = () => Alert.alert('Unlocked', 'You can now proceed!'),
    lockColor = '#555',
    buttonColor = '#fff',
    textColor = '#fff',
}) {
    const smallGap = 4;
    const finalPosition = lockWidth - lockHeight;
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const translateBtn = pan.x.interpolate({
        inputRange: [0, finalPosition],
        outputRange: [0, finalPosition],
        extrapolate: 'clamp',
    });

    const textOpacity = pan.x.interpolate({
        inputRange: [0, lockWidth / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const translateText = pan.x.interpolate({
        inputRange: [0, lockWidth / 2],
        outputRange: [0, lockWidth / 4],
        extrapolate: 'clamp',
    });

    // Declare `reset` before using it
    const reset = () => {
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
        }).start();
    };

    // Declare `unlock` before using it
    const unlock = () => {
        Animated.spring(pan, {
            toValue: { x: finalPosition, y: 0 },
            useNativeDriver: true,
        }).start();
        setTimeout(() => onUnlock(), 300);
    };

    // Use `reset` and `unlock` inside PanResponder after declaring them
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan.x }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (e, g) => {
                if (g.dx > lockWidth / 2) {
                    unlock();
                } else {
                    reset();
                }
            },
            onPanResponderTerminate: reset,
        }),
    ).current;

    return (
        <View style={styles.container}>
            <View style={[styles.lockContainer, { width: lockWidth, height: lockHeight, backgroundColor: lockColor }]}>
                <Animated.Text
                    style={[
                        styles.txt,
                        { color: textColor, opacity: textOpacity, transform: [{ translateX: translateText }] },
                    ]}
                >
                    {'Connect ->'}
                </Animated.Text>
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            width: lockHeight - smallGap * 2,
                            height: lockHeight - smallGap * 2,
                            backgroundColor: buttonColor,
                            transform: [{ translateX: translateBtn }],
                        },
                    ]}
                    {...panResponder.panHandlers}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 100,
    },
    lockContainer: {
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    txt: {
        letterSpacing: 2,
    },
    bar: {
        position: 'absolute',
        borderRadius: 30,
        left: 4,
    },
});
