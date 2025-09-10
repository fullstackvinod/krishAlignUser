import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, PanResponder, Dimensions, ScrollView, TextInput, Modal } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/BottomBar';
import { useCart } from '../contexts/CartContext';

type PlannerRoute = RouteProp<RootStackParamList, 'CategoryPlanner'>;

type DayPlan = {
  id: string;
  day: number;
  image: string;
  name: string;
  tagline: string;
  nutrientsCount: number;
  color: string;
  price: number;
  originalPrice: number;
  weight: string;
  badge: string;
  discount: string;
};

const CategoryPlannerScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<PlannerRoute>();
  const category = route.params?.category ?? 'Category';
  const { cartCount, addToCart } = useCart();

  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'all',
    nutrients: [] as string[],
    badges: [] as string[],
    sortBy: 'popular'
  });

  const categories = [
    { id: 'all', name: 'All', icon: 'view-grid-outline' },
    { id: 'immunity', name: 'Immunity Booster Pack', icon: 'shield-plus-outline' },
    { id: 'diabetes', name: 'Diabetes-Friendly Pack', icon: 'bottle-soda-outline' },
    { id: 'kids', name: 'Kids Growth Pack', icon: 'baby-face-outline' },
    { id: 'weight', name: 'Weight Management Pack', icon: 'scale-bathroom' },
    { id: 'detox', name: 'Detox Pack', icon: 'leaf' },
    { id: 'south-indian', name: 'South Indian Curry Pack', icon: 'food-variant' },
    { id: 'north-indian', name: 'North Indian Curry Pack', icon: 'food' },
    { id: 'salad', name: 'Salad Lovers Pack', icon: 'food-apple-outline' },
    { id: 'juice', name: 'Juice & Smoothie Pack', icon: 'cup-outline' },
    { id: 'weekend', name: 'Weekend Cooking Pack', icon: 'chef-hat' },
    { id: 'monsoon', name: 'Monsoon Immunity Box', icon: 'weather-rainy' },
    { id: 'summer', name: 'Summer Cooling Box', icon: 'weather-sunny' },
    { id: 'winter', name: 'Winter Warming Box', icon: 'weather-snowy' },
    { id: 'family', name: 'Weekly Family Pack', icon: 'home-group' },
    { id: 'couple', name: 'Couples Fresh Basket', icon: 'heart-outline' },
    { id: 'student', name: 'Student Quick Cook Pack', icon: 'school-outline' },
  ];

  const initialDays = useMemo<DayPlan[]>(() => [
    { id: 'd1', day: 1, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', name: 'Green Boost', tagline: 'Iron & folate', nutrientsCount: 9, color: '#DCFCE7', price: 249, originalPrice: 299, weight: '500g', badge: 'New', discount: '17% OFF' },
    { id: 'd2', day: 2, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop', name: 'Vital Crunch', tagline: 'Fiber rich', nutrientsCount: 12, color: '#FEF9C3', price: 329, originalPrice: 399, weight: '600g', badge: 'Popular', discount: '18% OFF' },
    { id: 'd3', day: 3, image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop', name: 'Orange Glow', tagline: 'Beta-carotene', nutrientsCount: 7, color: '#FFE4CC', price: 199, originalPrice: 249, weight: '450g', badge: 'Recommended', discount: '20% OFF' },
    { id: 'd4', day: 4, image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop', name: 'Brain Fuel', tagline: 'Omega & folate', nutrientsCount: 11, color: '#E0F2FE', price: 349, originalPrice: 399, weight: '550g', badge: 'Premium', discount: '13% OFF' },
    { id: 'd5', day: 5, image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop', name: 'Immunity Mix', tagline: 'Daily defense', nutrientsCount: 10, color: '#F0FDF4', price: 279, originalPrice: 329, weight: '500g', badge: 'Best Seller', discount: '15% OFF' },
    { id: 'd6', day: 6, image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', name: 'Low GI Pack', tagline: 'Balanced sugar', nutrientsCount: 8, color: '#FFE4E6', price: 229, originalPrice: 279, weight: '400g', badge: 'Healthy', discount: '18% OFF' },
    { id: 'd7', day: 7, image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', name: 'Fitness Fuel', tagline: 'Active days', nutrientsCount: 13, color: '#F5F3FF', price: 299, originalPrice: 349, weight: '650g', badge: 'Trending', discount: '14% OFF' },
  ], []);

  const [days, setDays] = useState<DayPlan[]>(initialDays);

  const filterOptions = {
    priceRanges: [
      { id: 'all', label: 'All Prices', min: 0, max: 1000 },
      { id: 'under200', label: 'Under ₹200', min: 0, max: 200 },
      { id: '200-300', label: '₹200 - ₹300', min: 200, max: 300 },
      { id: '300-400', label: '₹300 - ₹400', min: 300, max: 400 },
      { id: 'over400', label: 'Over ₹400', min: 400, max: 1000 },
    ],
    nutrients: ['Vit A', 'Iron', 'Folate', 'Vit C', 'Calcium', 'Protein', 'Fiber', 'Omega-3'],
    badges: ['New', 'Popular', 'Recommended', 'Premium', 'Best Seller', 'Healthy', 'Trending'],
    sortOptions: [
      { id: 'popular', label: 'Most Popular' },
      { id: 'price-low', label: 'Price: Low to High' },
      { id: 'price-high', label: 'Price: High to Low' },
      { id: 'newest', label: 'Newest First' },
      { id: 'name', label: 'Name A-Z' },
    ]
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      if (filterType === 'priceRange' || filterType === 'sortBy') {
        return { ...prev, [filterType]: value };
      } else {
        const currentArray = prev[filterType as keyof typeof prev] as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return { ...prev, [filterType]: newArray };
      }
    });
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    // Here you would apply the filters to your data
    // For now, we'll just close the modal
  };

  const clearFilters = () => {
    setSelectedFilters({
      priceRange: 'all',
      nutrients: [],
      badges: [],
      sortBy: 'popular'
    });
  };

  const onCardPress = (index: number) => {
    // Navigate to combo detail screen
    const combo = days[index];
    navigation.navigate('ComboDetail', {
      combo: {
        id: combo.id,
        name: combo.name,
        tagline: combo.tagline,
        image: combo.image
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
     

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color="#64748b" />
          <TextInput 
            placeholder="Search products..." 
            placeholderTextColor="#94a3b8" 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterBtn}
          onPress={() => setShowFilterModal(true)}
        >
          <Icon name="tune-variant" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Left Sidebar - Categories */}
        <View style={styles.sidebar}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="fast-forward" size={24} color="#22c55e" />
            </View>
            <Text style={styles.logoText}>EXPRESS{'\n'}DELIVERY</Text>
          </View>
          
          <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === cat.name && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Icon 
                  name={cat.icon} 
                  size={24} 
                  color={selectedCategory === cat.name ? '#8b5cf6' : '#64748b'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat.name && styles.selectedCategoryText
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Right Side - Products Grid */}
        <View style={styles.productsContainer}>
          <ScrollView contentContainerStyle={styles.productsGrid} showsVerticalScrollIndicator={false}>
            {days.map((d, index) => (
              <TouchableOpacity
                key={d.id}
                style={styles.productCard}
                onPress={() => onCardPress(index)}
                activeOpacity={0.8}
              >
                {/* Top Badges */}
                <View style={styles.badgeContainer}>
                  <View style={[styles.badge, { backgroundColor: '#22c55e' }]}>
                    <Text style={styles.badgeText}>{d.badge}</Text>
                  </View>
                  <View style={[styles.discountBadge, { backgroundColor: '#ec4899' }]}>
                    <Text style={styles.discountText}>{d.discount}</Text>
                  </View>
                </View>

                {/* Product Image */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: d.image }} style={styles.cardImage} />
                  <View style={styles.vegetarianDot} />
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                  <Text style={styles.weightText}>{d.weight}</Text>
                  <Text style={styles.productName}>{d.name}</Text>
                  <Text style={styles.productDescription}>{d.tagline}</Text>
                  
                  {/* Pricing */}
                  <View style={styles.pricingContainer}>
                    <Text style={styles.currentPrice}>₹{d.price}</Text>
                    <Text style={styles.originalPrice}>₹{d.originalPrice}</Text>
                  </View>

                  {/* Nutrients */}
                  <View style={styles.nutrientsContainer}>
                    <View style={styles.nutrientPills}>
                      {['Vit A', 'Iron', 'Folate'].slice(0, 2).map((p) => (
                        <View key={p} style={[styles.nutrientPill, { backgroundColor: '#dcfce7' }]}>                        
                          <Text style={styles.nutrientPillText}>{p}</Text>
                        </View>
                      ))}
                      {d.nutrientsCount > 2 && (
                        <View style={[styles.nutrientPill, { backgroundColor: '#fee2e2' }]}>                        
                          <Text style={styles.nutrientPillText}>{d.nutrientsCount}+</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Add Button */}
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={addToCart}
                  >
                    <Icon name="plus" size={16} color="#ffffff" />
                    <Text style={styles.addButtonText}>ADD</Text>
                  </TouchableOpacity>
                </View>

                {/* Delivery Info */}
                <View style={styles.deliveryInfo}>
                  <Icon name="truck-delivery" size={14} color="#64748b" />
                  <Text style={styles.deliveryText}>Today 60 minutes</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      {/* Bottom Bar */}
      <BottomBar active="Shop" cartCount={cartCount} />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity 
                onPress={() => setShowFilterModal(false)}
                style={styles.closeBtn}
              >
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                {filterOptions.priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.filterOption,
                      selectedFilters.priceRange === range.id && styles.selectedFilterOption
                    ]}
                    onPress={() => handleFilterChange('priceRange', range.id)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedFilters.priceRange === range.id && styles.selectedFilterOptionText
                    ]}>
                      {range.label}
                    </Text>
                    {selectedFilters.priceRange === range.id && (
                      <Icon name="check" size={16} color="#22c55e" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Nutrients */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Nutrients</Text>
                <View style={styles.filterGrid}>
                  {filterOptions.nutrients.map((nutrient) => (
                    <TouchableOpacity
                      key={nutrient}
                      style={[
                        styles.filterChip,
                        selectedFilters.nutrients.includes(nutrient) && styles.selectedFilterChip
                      ]}
                      onPress={() => handleFilterChange('nutrients', nutrient)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedFilters.nutrients.includes(nutrient) && styles.selectedFilterChipText
                      ]}>
                        {nutrient}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Badges */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Badges</Text>
                <View style={styles.filterGrid}>
                  {filterOptions.badges.map((badge) => (
                    <TouchableOpacity
                      key={badge}
                      style={[
                        styles.filterChip,
                        selectedFilters.badges.includes(badge) && styles.selectedFilterChip
                      ]}
                      onPress={() => handleFilterChange('badges', badge)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedFilters.badges.includes(badge) && styles.selectedFilterChipText
                      ]}>
                        {badge}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                {filterOptions.sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      selectedFilters.sortBy === option.id && styles.selectedFilterOption
                    ]}
                    onPress={() => handleFilterChange('sortBy', option.id)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedFilters.sortBy === option.id && styles.selectedFilterOptionText
                    ]}>
                      {option.label}
                    </Text>
                    {selectedFilters.sortBy === option.id && (
                      <Icon name="check" size={16} color="#22c55e" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearBtn}
                onPress={clearFilters}
              >
                <Text style={styles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyBtn}
                onPress={applyFilters}
              >
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
  },
  filterBtn: {
    padding: 8,
  },
  // Main Content
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  // Left Sidebar
  sidebar: {
    width: '25%',
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8b5cf6',
    textAlign: 'center',
    lineHeight: 12,
  },
  categoriesList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
  },
  selectedCategory: {
    backgroundColor: '#ffffff',
    borderRightWidth: 3,
    borderRightColor: '#8b5cf6',
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 12,
  },
  selectedCategoryText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  // Right Products
  productsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  productCard: {
    width: '48%',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    marginBottom: 8,
    overflow: 'hidden',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  imageContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  vegetarianDot: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  productInfo: {
    padding: 8,
  },
  weightText: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 6,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  originalPrice: {
    fontSize: 10,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  nutrientsContainer: {
    marginBottom: 8,
  },
  nutrientPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  nutrientPill: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  nutrientPillText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#166534',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 2,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#f8fafc',
    gap: 2,
  },
  deliveryText: {
    fontSize: 9,
    color: '#64748b',
  },
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedFilterOption: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: '#22c55e',
    fontWeight: '600',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedFilterChip: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  filterChipText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedFilterChipText: {
    color: '#166534',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default CategoryPlannerScreen;


