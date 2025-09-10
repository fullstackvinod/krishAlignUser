import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BottomBar from '../components/BottomBar';

const { width } = Dimensions.get('window');

const CAROUSEL_HEIGHT = 180;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const heroSlides = useMemo(
    () => [
      { key: 'hero-1', title: 'Fresh from Farm Today', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop' },
      { key: 'hero-2', title: 'KidPack – Boost Nutrition', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1600&auto=format&fit=crop' },
      { key: 'hero-3', title: 'BrainPack – Sharpen Focus', image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1600&auto=format&fit=crop' },
    ],
    []
  );

  const categories = useMemo(
    () => [
      { key: 'kid', name: 'KidPack', benefit: 'Growing kids', color: '#E6F7E9', image: 'https://images.unsplash.com/photo-1580933883539-1ff4b3c89a4b?q=80&w=1200&auto=format&fit=crop' },
      { key: 'brain', name: 'BrainPack', benefit: 'Focus & memory', color: '#FFF4D6', image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop' },
      { key: 'diabetic', name: 'DiabeticPack', benefit: 'Low GI', color: '#FFEFE6', image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda6f?q=80&w=1200&auto=format&fit=crop' },
      { key: 'fitness', name: 'FitnessPack', benefit: 'Active days', color: '#E6F6FF', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop' },
      { key: 'immunity', name: 'ImmunityPack', benefit: 'Daily defense', color: '#F3FFE6', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop' },
    ],
    []
  );

  const trending = useMemo(
    () => [
      { key: 't1', name: 'KidPack', benefit: 'Balanced vitamins', price: '₹249', weight: '1.2 kg', badge: 'Trending', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop' },
      { key: 't2', name: 'BrainPack', benefit: 'Omega & folate', price: '₹299', weight: '1.0 kg', badge: 'New', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop' },
      { key: 't3', name: 'DiabeticPack', benefit: 'Low sugar load', price: '₹279', weight: '1.1 kg', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop' },
    ],
    []
  );

  const heroRef = useRef<FlatList<any> | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.logo}>🌱</Text>
          <Text style={styles.appName}>KrishAlign</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="account-circle-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sticky Search */}
      <View style={styles.searchBar}>
        <Icon name="magnify" size={20} color="#64748b" />
        <TextInput placeholder="Search packs or crops" placeholderTextColor="#94a3b8" style={styles.searchInput} />
        <TouchableOpacity>
          <Icon name="tune-variant" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Hero Carousel */}
        <FlatList
          ref={heroRef}
          data={heroSlides}
          keyExtractor={(i) => i.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.heroCard, { width: width - 32 }]}>              
              <Image source={{ uri: item.image }} style={styles.heroImage} />
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <TouchableOpacity style={styles.heroCta}>
                  <Text style={styles.heroCtaText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          style={styles.heroList}
        />

        {/* Categories */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity><Text style={styles.link}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {categories.map(cat => (
            <TouchableOpacity key={cat.key} style={[styles.categoryCard, { backgroundColor: cat.color }]} onPress={() => navigation.navigate('CategoryPlanner', { category: cat.name })}>              
              <Image source={{ uri: cat.image }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryBenefit}>{cat.benefit}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Packs */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trending Packs</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
          {trending.map(item => (
            <View key={item.key} style={styles.packCard}>
              {!!item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Image source={{ uri: item.image }} style={styles.packImage} />
              <Text style={styles.packName}>{item.name}</Text>
              <Text style={styles.packBenefit}>{item.benefit}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.weight}>{item.weight}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Balanced Farming Info */}
        <View style={styles.infoCard}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop' }} style={styles.infoImage} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Balanced Farming, Nutrient-Rich</Text>
            <Text style={styles.infoBody}>Grown without deficiencies for better health.</Text>
            <View style={styles.nutrientRow}>
              {['Vitamin A', 'Iron', 'Folate'].map(n => (
                <View key={n} style={styles.nutrientPill}><Text style={styles.nutrientText}>{n}</Text></View>
              ))}
            </View>
          </View>
        </View>

        {/* Offers */}
        <View style={styles.offerCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.offerTitle}>Buy 2 Packs, Get 1 Free</Text>
            <Text style={styles.offerBody}>Limited time farm-fresh offer.</Text>
            <TouchableOpacity style={styles.offerCta}><Text style={styles.offerCtaText}>Grab Now</Text></TouchableOpacity>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200&auto=format&fit=crop' }} style={styles.offerImage} />
        </View>

        {/* Benefits / How it works */}
        <Text style={styles.sectionTitle}>Why KrishAlign?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.benefitsRow}>
          {[
            { icon: 'truck-delivery-outline', title: 'Easy Delivery' },
            { icon: 'account-group-outline', title: 'Support Farmers' },
            { icon: 'leaf', title: 'Direct from Farm' },
            { icon: 'food-apple-outline', title: 'Nutrient-Rich' },
          ].map((b, i) => (
            <View key={i} style={styles.benefitCard}>
              <Icon name={b.icon} size={22} color="#2E7D32" />
              <Text style={styles.benefitText}>{b.title}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomBar active="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
  },
  scrollBody: {
    paddingBottom: 100,
  },
  heroList: {
    paddingHorizontal: 16,
  },
  heroCard: {
    height: CAROUSEL_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#E6F7E9',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroTextWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroCta: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9800',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  heroCtaText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  link: {
    color: '#22c55e',
    fontWeight: '600',
  },
  categoriesRow: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  categoryCard: {
    width: 120,
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: 70,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryName: {
    fontWeight: '800',
    color: '#1f2937',
  },
  categoryBenefit: {
    fontSize: 12,
    color: '#64748b',
  },
  trendingRow: {
    paddingHorizontal: 12,
  },
  packCard: {
    width: 180,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  packImage: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
  },
  packName: {
    fontWeight: '800',
    color: '#111827',
  },
  packBenefit: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    color: '#111827',
    fontWeight: '800',
  },
  weight: {
    color: '#64748b',
    fontSize: 12,
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoImage: {
    width: '100%',
    height: 120,
  },
  infoTextWrap: {
    padding: 12,
    gap: 6,
  },
  infoTitle: {
    fontWeight: '800',
    color: '#14532d',
  },
  infoBody: {
    color: '#166534',
  },
  nutrientRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  nutrientPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  nutrientText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  offerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  offerTitle: {
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  offerBody: {
    color: '#78350F',
    marginBottom: 8,
  },
  offerCta: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  offerCtaText: {
    color: '#fff',
    fontWeight: '700',
  },
  offerImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  benefitsRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  benefitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitText: {
    color: '#111827',
    fontWeight: '700',
  },
});

export default HomeScreen;


