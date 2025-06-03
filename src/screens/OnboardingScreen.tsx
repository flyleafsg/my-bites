import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  { key: '1', image: require('../../assets/onboarding1.png') },
  { key: '2', image: require('../../assets/onboarding2.png') },
  { key: '3', image: require('../../assets/onboarding3.png') },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDone = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    navigation.navigate('Home');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      handleDone();
    }
  };

  const handleSkip = () => {
    handleDone();
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.footerText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : {},
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.footerText}>
            {currentIndex === slides.length - 1 ? 'Done' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: { width, height, justifyContent: 'center', alignItems: 'center' },
  image: { width: 300, height: 300, resizeMode: 'contain' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  footerText: { fontSize: 16, color: '#000' },
  dotsContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: '#bbb' },
  activeDot: { backgroundColor: '#000' },
});

export default OnboardingScreen;
