import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/BottomBar';

type ShopScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Shop'>;

type PackItem = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  price: number;
  nutrientsCount: number;
  badge?: 'New' | 'Trending' | 'Popular';
  category: string;
};

const ShopScreen: React.FC = () => {
  const navigation = useNavigation<ShopScreenNavigationProp>();

  const allPacks: PackItem[] = [
    // KidPack Category - 10 packs
    { id: 'kid-1', name: 'Green Boost', tagline: 'Iron & folate', description: 'Perfect for growing kids', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', price: 249, nutrientsCount: 9, badge: 'New', category: 'KidPack' },
    { id: 'kid-2', name: 'Vital Crunch', tagline: 'Fiber rich', description: 'Essential nutrients for children', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop', price: 299, nutrientsCount: 12, category: 'KidPack' },
    { id: 'kid-3', name: 'Orange Glow', tagline: 'Beta-carotene', description: 'Vitamin A powerhouse', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop', price: 279, nutrientsCount: 7, badge: 'Trending', category: 'KidPack' },
    { id: 'kid-4', name: 'Tiny Tots', tagline: 'Growing strong', description: 'Complete nutrition for toddlers', image: 'https://images.unsplash.com/photo-1580933883539-1ff4b3c89a4b?q=80&w=1200&auto=format&fit=crop', price: 269, nutrientsCount: 10, category: 'KidPack' },
    { id: 'kid-5', name: 'Smart Kids', tagline: 'Brain development', description: 'Cognitive support for children', image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop', price: 319, nutrientsCount: 11, badge: 'Popular', category: 'KidPack' },
    { id: 'kid-6', name: 'Energy Kids', tagline: 'Active play', description: 'Fuel for active children', image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda6f?q=80&w=1200&auto=format&fit=crop', price: 289, nutrientsCount: 8, category: 'KidPack' },
    { id: 'kid-7', name: 'Healthy Start', tagline: 'Morning boost', description: 'Perfect breakfast companion', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 259, nutrientsCount: 9, category: 'KidPack' },
    { id: 'kid-8', name: 'Growth Plus', tagline: 'Height & strength', description: 'Support physical development', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', price: 329, nutrientsCount: 13, badge: 'New', category: 'KidPack' },
    { id: 'kid-9', name: 'Bright Eyes', tagline: 'Vision support', description: 'Eye health for kids', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', price: 299, nutrientsCount: 10, category: 'KidPack' },
    { id: 'kid-10', name: 'Super Kids', tagline: 'All-round nutrition', description: 'Complete daily nutrition', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', price: 349, nutrientsCount: 14, badge: 'Trending', category: 'KidPack' },
    
    // BrainPack Category - 10 packs
    { id: 'brain-1', name: 'Brain Fuel', tagline: 'Omega & folate', description: 'Boost cognitive function', image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop', price: 329, nutrientsCount: 11, category: 'BrainPack' },
    { id: 'brain-2', name: 'Focus Plus', tagline: 'Mental clarity', description: 'Enhanced concentration', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', price: 349, nutrientsCount: 13, badge: 'Popular', category: 'BrainPack' },
    { id: 'brain-3', name: 'Memory Boost', tagline: 'Cognitive support', description: 'Improve memory retention', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', price: 299, nutrientsCount: 10, category: 'BrainPack' },
    { id: 'brain-4', name: 'Smart Focus', tagline: 'Study support', description: 'Perfect for students', image: 'https://images.unsplash.com/photo-1580933883539-1ff4b3c89a4b?q=80&w=1200&auto=format&fit=crop', price: 319, nutrientsCount: 12, badge: 'New', category: 'BrainPack' },
    { id: 'brain-5', name: 'Mental Edge', tagline: 'Peak performance', description: 'Optimize brain function', image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop', price: 369, nutrientsCount: 14, category: 'BrainPack' },
    { id: 'brain-6', name: 'Clarity Pack', tagline: 'Clear thinking', description: 'Mental sharpness', image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda6f?q=80&w=1200&auto=format&fit=crop', price: 289, nutrientsCount: 9, badge: 'Trending', category: 'BrainPack' },
    { id: 'brain-7', name: 'Neuro Plus', tagline: 'Brain health', description: 'Support nervous system', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 339, nutrientsCount: 11, category: 'BrainPack' },
    { id: 'brain-8', name: 'Think Smart', tagline: 'Intelligence boost', description: 'Enhance mental capacity', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', price: 309, nutrientsCount: 10, category: 'BrainPack' },
    { id: 'brain-9', name: 'Mind Power', tagline: 'Cognitive enhancement', description: 'Boost mental energy', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', price: 329, nutrientsCount: 12, badge: 'Popular', category: 'BrainPack' },
    { id: 'brain-10', name: 'Brain Max', tagline: 'Maximum focus', description: 'Ultimate brain support', image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop', price: 389, nutrientsCount: 15, badge: 'New', category: 'BrainPack' },
    
    // DiabeticPack Category - 10 packs
    { id: 'diabetic-1', name: 'Low GI Pack', tagline: 'Balanced sugar', description: 'Blood sugar management', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 259, nutrientsCount: 8, category: 'DiabeticPack' },
    { id: 'diabetic-2', name: 'Sugar Control', tagline: 'Diabetic friendly', description: 'Maintain healthy glucose', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', price: 279, nutrientsCount: 9, badge: 'New', category: 'DiabeticPack' },
    { id: 'diabetic-3', name: 'Balanced Choice', tagline: 'Stable energy', description: 'Sustained blood sugar', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop', price: 249, nutrientsCount: 7, category: 'DiabeticPack' },
    { id: 'diabetic-4', name: 'Glucose Guard', tagline: 'Sugar management', description: 'Control blood sugar levels', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop', price: 269, nutrientsCount: 8, badge: 'Trending', category: 'DiabeticPack' },
    { id: 'diabetic-5', name: 'Sweet Balance', tagline: 'Natural sweetness', description: 'Healthy sugar alternatives', image: 'https://images.unsplash.com/photo-1580933883539-1ff4b3c89a4b?q=80&w=1200&auto=format&fit=crop', price: 289, nutrientsCount: 10, category: 'DiabeticPack' },
    { id: 'diabetic-6', name: 'Insulin Support', tagline: 'Metabolic health', description: 'Support insulin function', image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop', price: 299, nutrientsCount: 9, badge: 'Popular', category: 'DiabeticPack' },
    { id: 'diabetic-7', name: 'Sugar Free', tagline: 'Zero added sugar', description: 'Completely sugar-free option', image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda6f?q=80&w=1200&auto=format&fit=crop', price: 319, nutrientsCount: 11, category: 'DiabeticPack' },
    { id: 'diabetic-8', name: 'Diabetic Care', tagline: 'Specialized nutrition', description: 'Designed for diabetics', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 279, nutrientsCount: 8, category: 'DiabeticPack' },
    { id: 'diabetic-9', name: 'Metabolic Plus', tagline: 'Metabolism support', description: 'Boost metabolic health', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', price: 309, nutrientsCount: 10, badge: 'New', category: 'DiabeticPack' },
    { id: 'diabetic-10', name: 'Health Guard', tagline: 'Diabetes prevention', description: 'Preventive care pack', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', price: 329, nutrientsCount: 12, badge: 'Trending', category: 'DiabeticPack' },
    
    // FitnessPack Category - 10 packs
    { id: 'fitness-1', name: 'Fitness Fuel', tagline: 'Active days', description: 'Energy for workouts', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 349, nutrientsCount: 13, category: 'FitnessPack' },
    { id: 'fitness-2', name: 'Power Pack', tagline: 'Muscle support', description: 'Post-workout recovery', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop', price: 329, nutrientsCount: 11, badge: 'Trending', category: 'FitnessPack' },
    { id: 'fitness-3', name: 'Endurance Plus', tagline: 'Long-lasting energy', description: 'Sustained performance', image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop', price: 299, nutrientsCount: 10, category: 'FitnessPack' },
    { id: 'fitness-4', name: 'Muscle Max', tagline: 'Strength building', description: 'Build lean muscle', image: 'https://images.unsplash.com/photo-1580933883539-1ff4b3c89a4b?q=80&w=1200&auto=format&fit=crop', price: 369, nutrientsCount: 14, badge: 'Popular', category: 'FitnessPack' },
    { id: 'fitness-5', name: 'Cardio Boost', tagline: 'Heart health', description: 'Cardiovascular support', image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop', price: 319, nutrientsCount: 12, category: 'FitnessPack' },
    { id: 'fitness-6', name: 'Recovery Pack', tagline: 'Post-workout', description: 'Faster muscle recovery', image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda6f?q=80&w=1200&auto=format&fit=crop', price: 339, nutrientsCount: 11, badge: 'New', category: 'FitnessPack' },
    { id: 'fitness-7', name: 'Athlete Pro', tagline: 'Professional grade', description: 'For serious athletes', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 389, nutrientsCount: 15, category: 'FitnessPack' },
    { id: 'fitness-8', name: 'Energy Rush', tagline: 'Pre-workout', description: 'Boost workout energy', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', price: 309, nutrientsCount: 10, badge: 'Trending', category: 'FitnessPack' },
    { id: 'fitness-9', name: 'Lean Machine', tagline: 'Fat burning', description: 'Support weight loss', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', price: 329, nutrientsCount: 12, category: 'FitnessPack' },
    { id: 'fitness-10', name: 'Ultimate Fit', tagline: 'Complete fitness', description: 'All-in-one fitness pack', image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop', price: 399, nutrientsCount: 16, badge: 'New', category: 'FitnessPack' },
    
    // ImmunityPack Category - 10 packs
    { id: 'immunity-1', name: 'Immunity Mix', tagline: 'Daily defense', description: 'Boost immune system', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', price: 299, nutrientsCount: 10, category: 'ImmunityPack' },
    { id: 'immunity-2', name: 'Defense Shield', tagline: 'Immune support', description: 'Protect against illness', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', price: 279, nutrientsCount: 9, badge: 'Popular', category: 'ImmunityPack' },
    { id: 'immunity-3', name: 'Wellness Pack', tagline: 'Overall health', description: 'Complete wellness support', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 329, nutrientsCount: 12, category: 'ImmunityPack' },
    { id: 'immunity-4', name: 'Vital Guard', tagline: 'Protection plus', description: 'Enhanced immune defense', image: 'https://images.unsplash.com/photo-1580933883539-1ff4b3c89a4b?q=80&w=1200&auto=format&fit=crop', price: 319, nutrientsCount: 11, badge: 'New', category: 'ImmunityPack' },
    { id: 'immunity-5', name: 'Health Fortress', tagline: 'Strong immunity', description: 'Build strong defenses', image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop', price: 309, nutrientsCount: 10, category: 'ImmunityPack' },
    { id: 'immunity-6', name: 'Resistance Plus', tagline: 'Fight infections', description: 'Natural infection fighter', image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda6f?q=80&w=1200&auto=format&fit=crop', price: 289, nutrientsCount: 9, badge: 'Trending', category: 'ImmunityPack' },
    { id: 'immunity-7', name: 'Antioxidant Power', tagline: 'Free radical defense', description: 'Fight oxidative stress', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', price: 339, nutrientsCount: 13, category: 'ImmunityPack' },
    { id: 'immunity-8', name: 'Seasonal Shield', tagline: 'Weather protection', description: 'Protect from seasonal changes', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', price: 299, nutrientsCount: 10, category: 'ImmunityPack' },
    { id: 'immunity-9', name: 'Super Immunity', tagline: 'Maximum protection', description: 'Ultimate immune support', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', price: 359, nutrientsCount: 14, badge: 'Popular', category: 'ImmunityPack' },
    { id: 'immunity-10', name: 'Immune Max', tagline: 'Complete defense', description: 'All-round immune support', image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop', price: 379, nutrientsCount: 15, badge: 'New', category: 'ImmunityPack' },
  ];

  const handlePackPress = (category: string) => {
    navigation.navigate('CategoryPlanner', { category });
  };

  const renderPackItem = ({ item }: { item: PackItem }) => (
    <TouchableOpacity 
      style={styles.packCard}
      onPress={() => handlePackPress(item.category)}
      activeOpacity={0.8}
    >
      <View style={styles.packImageContainer}>
        <Image source={{ uri: item.image }} style={styles.packImage} />
        {item.badge && (
          <View style={[styles.badge, { 
            backgroundColor: item.badge === 'New' ? '#22c55e' : 
                           item.badge === 'Trending' ? '#f59e0b' : '#ef4444' 
          }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.packInfo}>
        <Text style={styles.packName}>{item.name}</Text>
        <Text style={styles.packTagline}>{item.tagline}</Text>
        <Text style={styles.packDescription}>{item.description}</Text>
        
        <View style={styles.packFooter}>
          <View style={styles.nutrientInfo}>
            <Icon name="leaf" size={14} color="#22c55e" />
            <Text style={styles.nutrientText}>{item.nutrientsCount}+ nutrients</Text>
          </View>
          <Text style={styles.packPrice}>₹{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop Packs</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Icon name="magnify" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Packs List */}
      <FlatList
        data={allPacks}
        renderItem={renderPackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      
      {/* Bottom Navigation */}
      <BottomBar active="Shop" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  searchBtn: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for bottom bar
  },
  row: {
    justifyContent: 'space-between',
  },
  packCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  packImageContainer: {
    position: 'relative',
    height: 120,
  },
  packImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  packInfo: {
    padding: 12,
  },
  packName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  packTagline: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  packDescription: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
    lineHeight: 14,
  },
  packFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutrientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nutrientText: {
    fontSize: 10,
    color: '#22c55e',
    fontWeight: '500',
  },
  packPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
});

export default ShopScreen;
