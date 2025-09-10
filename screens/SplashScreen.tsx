import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, Animated, TouchableOpacity } from 'react-native';

type Slide = {
  key: string;
  headline: string;
  benefit: string;
  imageUri: string;
  backgroundColor: string;
};

type SplashScreenProps = {
  onDone?: () => void;
  onSkip?: () => void;
};

const { width } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ onDone, onSkip }) => {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: 'fresh-farm',
        headline: 'Fresh from the Farm',
        benefit: 'Direct farm-fresh',
        imageUri:
          'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1600&auto=format&fit=crop',
        backgroundColor: '#E8F8EC',
      },
      {
        key: 'health-packs',
        headline: 'Health & Nutrition Packs',
        benefit: 'Tailored for family',
        imageUri:
          'https://images.unsplash.com/photo-1543332164-6e82f355bad8?q=80&w=1600&auto=format&fit=crop',
        backgroundColor: '#FFF7E6',
      },
      {
        key: 'balanced-farming',
        headline: 'Balanced Farming, Nutrient-Rich',
        benefit: 'Nutrient dense crops',
        imageUri:
          'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1600&auto=format&fit=crop',
        backgroundColor: '#FFF1E8',
      },
      {
        key: 'convenient-local',
        headline: 'Convenient & Support Farmers',
        benefit: 'Easy delivery, support local',
        imageUri:
          'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop',
        backgroundColor: '#E9F8FF',
      },
    ],
    []
  );

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Slide> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      const index = viewableItems[0].index ?? 0;
      setCurrentIndex(index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    else if (onDone) onDone();
  };

  const handleGetStarted = () => {
    if (onDone) onDone();
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.backgroundColor, width }]}>            
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: item.imageUri }}
                style={styles.image}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.headline}>{item.headline}</Text>
              <Text style={styles.benefit}>{item.benefit}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.bottomBar}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />
            );
          })}
        </View>

        {currentIndex < slides.length - 1 ? (
          <View style={styles.ctaRow}>
            <TouchableOpacity onPress={handleSkip} style={[styles.button, styles.skip]}>              
              <Text style={[styles.buttonText, { color: '#2E7D32' }]}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goNext} style={[styles.button, styles.next]}>              
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ctaRow}>
            <TouchableOpacity onPress={handleGetStarted} style={[styles.button, styles.start]}>              
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Get Started</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  imageWrap: {
    width: '100%',
    height: '50%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textWrap: {
    alignItems: 'center',
    gap: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center',
  },
  benefit: {
    fontSize: 16,
    color: '#5D4037',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginHorizontal: 4,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  skip: {
    backgroundColor: '#C8E6C9',
  },
  next: {
    backgroundColor: '#2E7D32',
  },
  start: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SplashScreen;