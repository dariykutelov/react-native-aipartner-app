import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';

import { AIAgent } from '~/types/AIAgent';
import { getImageUrl } from '~/utils/getImageFromSupabaseStorage';
const screenWidth = Dimensions.get('screen').width;
export const cardWidth = screenWidth * 0.95;

type MatchCardType = {
  user: AIAgent;
  numOfCards: number;
  index: number;
  activeIndex: SharedValue<number>;
  onResponse: (a: boolean) => void;
};

export function MatchCard({ user, numOfCards, index, activeIndex, onResponse }: MatchCardType) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(index === 0);
  const tutorialOpacity = useSharedValue(0);

  useEffect(() => {
    if (showTutorial) {
      tutorialOpacity.value = withDelay(
        500,
        withSequence(
          withTiming(1, { duration: 500 }),
          withDelay(2000, withTiming(0, { duration: 500 }))
        )
      );
    }
  }, [showTutorial]);

  const tutorialStyle = useAnimatedStyle(() => ({
    opacity: tutorialOpacity.value,
  }));

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const publicUrl = await getImageUrl('ai-agent-avatars', user.imageurl);
        setImageUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };
    fetchImageUrl();
  }, [user.imageurl]);

  const translationX = useSharedValue(0);
  const animatedCard = useAnimatedStyle(() => ({
    opacity: interpolate(activeIndex.value, [index - 1, index, index + 1], [1 - 1 / 5, 1, 1]),
    transform: [
      {
        scale: interpolate(activeIndex.value, [index - 1, index, index + 1], [0.95, 1, 1]),
      },
      {
        translateY: interpolate(activeIndex.value, [index - 1, index, index + 1], [-30, 0, 0]),
      },
      {
        translateX: translationX.value,
      },
      {
        rotateZ: `${interpolate(
          translationX.value,
          [-screenWidth / 2, 0, screenWidth / 2],
          [-15, 0, 15]
        )}deg`,
      },
    ],
  }));

  const gesture = Gesture.Pan()
    .onChange((event) => {
      translationX.value = event.translationX;
      activeIndex.value = interpolate(Math.abs(translationX.value), [0, 500], [index, index + 0.8]);
    })
    .onEnd((event) => {
      if (Math.abs(event.velocityX) > 400) {
        translationX.value = withSpring(Math.sign(event.velocityX) * 900, {
          velocity: event.velocityX,
        });
        activeIndex.value = withSpring(index + 1);

        // event.velocityX > 0 means swipe right
        // event.velocityX < 0 means swipe left
        const isSwipeRight = event.velocityX > 0;
        runOnJS(onResponse)(isSwipeRight);
      } else {
        translationX.value = withSpring(0);
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className="bg-white"
        style={[
          styles.card,
          animatedCard,
          {
            zIndex: numOfCards - index,
          },
        ]}>
        {imageUrl && (
          <Image
            className="rounded-md"
            style={StyleSheet.absoluteFillObject}
            source={{ uri: imageUrl }}
          />
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)']}
          style={[StyleSheet.absoluteFillObject, styles.overlay]}
        />

        {index === Math.floor(activeIndex.value) && (
          <>
            <View className="absolute -bottom-20 left-0 right-0 items-center justify-center gap-1">
              <Text className="font-InterBold text-2xl text-black">{user.name}</Text>
              <Text className="font-Inter text-md text-gray-800">{user.personality}</Text>
            </View>

            {showTutorial && (
              <Animated.View
                style={[tutorialStyle]}
                className="absolute -bottom-14 left-0 right-0 flex-row items-center justify-between gap-12">
                <View className="items-center">
                  <Ionicons name="close" size={32} color="red" />
                  <Text className="text-gray-700">Swipe Left</Text>
                </View>
                <View className="items-center">
                  <Ionicons name="checkmark" size={32} color="green" />
                  <Text className="text-gray-700">Swipe Right</Text>
                </View>
              </Animated.View>
            )}
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    aspectRatio: 1 / 1.67,
    borderRadius: 6,
    justifyContent: 'flex-end',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  overlay: {
    top: '50%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
