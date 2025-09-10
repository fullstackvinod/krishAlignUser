import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Alert, Platform, ToastAndroid } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/BottomBar';
import { useCart } from '../contexts/CartContext';
import type { CartComboItem, CartItemIngredient } from '../contexts/CartContext';

type ComboDetailRoute = RouteProp<RootStackParamList, 'ComboDetail'>;
type ComboDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ComboDetail'>;

const { width: screenWidth } = Dimensions.get('window');

const ComboDetailScreen: React.FC = () => {
  const navigation = useNavigation<ComboDetailNavigationProp>();
  const route = useRoute<ComboDetailRoute>();
  const combo = route.params?.combo;
  const { cartCount, addOrUpdateCombo, removeCombo } = useCart();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'nutrition' | 'cooking' | 'farmer'>('overview');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [localQuantities, setLocalQuantities] = useState<{[key: string]: number}>({});
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [comboInCart, setComboInCart] = useState(false);
  const [comboQuantity, setComboQuantity] = useState(0);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  // Initialize local ingredient quantities to 1 by default (not added to cart yet)
  React.useEffect(() => {
    const initialQuantities: {[key: string]: number} = {};
    comboDetails.ingredients.forEach(ingredient => {
      initialQuantities[ingredient.name] = 1;
    });
    setLocalQuantities(initialQuantities);
  }, []);

  // Default select first farmer
  React.useEffect(() => {
    if (!selectedFarmer && comboDetails.farmers && comboDetails.farmers.length > 0) {
      setSelectedFarmer(comboDetails.farmers[0]);
    }
  }, [selectedFarmer]);

  // Sample detailed combo data
  const comboDetails = {
    id: combo?.id || '1',
    name: combo?.name || 'Green Boost',
    tagline: combo?.tagline || 'Iron & folate',
    image: combo?.image || 'https://www.bing.com/th/id/OIP.Py4eRbJ0WIFjs51eUrIErAHaEo?w=273&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
    price: 249,
    weight: '500g',
    category: 'KidPack',
    description: 'A nutrient-dense combination of leafy greens, iron-rich vegetables, and folate-packed ingredients designed to boost energy and support healthy development.',
    
    // Nutritional Information
    nutrition: {
      calories: 85,
      protein: '4.2g',
      carbs: '12.8g',
      fiber: '5.2g',
      fat: '1.8g',
      iron: '3.2mg',
      folate: '180mcg',
      vitaminA: '450mcg',
      vitaminC: '65mg',
      calcium: '120mg',
      potassium: '380mg'
    },
    
    // Items
    ingredients: [
      { name: 'Spinach', amount: '150g', benefit: 'Rich in iron and folate', price: 25, unit: 'bunch' },
      { name: 'Broccoli', amount: '100g', benefit: 'High in vitamin C and fiber', price: 30, unit: 'head' },
      { name: 'Carrots', amount: '80g', benefit: 'Beta-carotene for eye health', price: 20, unit: 'kg' },
      { name: 'Green Beans', amount: '70g', benefit: 'Protein and B vitamins', price: 35, unit: 'kg' },
      { name: 'Bell Peppers', amount: '50g', benefit: 'Vitamin C and antioxidants', price: 40, unit: 'kg' },
      { name: 'Sweet Corn', amount: '50g', benefit: 'Natural sweetness and fiber', price: 15, unit: 'piece' }
    ],
    
    // Health Benefits
    benefits: [
      'Boosts iron levels and prevents anemia',
      'Supports healthy brain development',
      'Strengthens immune system',
      'Promotes healthy vision',
      'Aids in digestion and gut health',
      'Provides sustained energy throughout the day'
    ],
    
    // Cooking Instructions
    cookingInstructions: [
      {
        step: 1,
        title: 'Preparation',
        description: 'Wash all vegetables thoroughly under running water. Pat dry with a clean towel.',
        duration: '5 minutes',
        tips: 'Use cold water to maintain crispness'
      },
      {
        step: 2,
        title: 'Steam Cooking',
        description: 'Place vegetables in a steamer basket over boiling water. Steam for 8-10 minutes until tender but still crisp.',
        duration: '10 minutes',
        tips: 'Don\'t overcook to preserve nutrients'
      },
      {
        step: 3,
        title: 'Light Seasoning',
        description: 'Add a pinch of salt, a drizzle of olive oil, and a squeeze of lemon juice.',
        duration: '2 minutes',
        tips: 'Lemon juice helps with iron absorption'
      },
      {
        step: 4,
        title: 'Serve Fresh',
        description: 'Serve immediately while warm to maximize nutrient retention and flavor.',
        duration: '1 minute',
        tips: 'Best consumed within 30 minutes of cooking'
      }
    ],
    
    // Storage Instructions
    storage: {
      fresh: 'Store in refrigerator for up to 3 days',
      cooked: 'Consume within 24 hours of cooking',
      freezing: 'Not recommended for best quality'
    },
    
    // Best Time to Consume
    bestTime: 'Morning or early afternoon for maximum nutrient absorption',
    
    // Allergens
    allergens: 'None - 100% natural vegetables',
    
    // Certifications
    certifications: ['Organic Certified', 'Farm Fresh', 'No Pesticides'],
    
    // Multiple Farmers Information
    farmers: [
      {
        id: '1',
        name: 'Rajesh Kumar',
        farmName: 'Green Valley Organic Farm',
        location: 'Punjab, India',
        experience: '15+ years',
        speciality: 'Leafy Greens & Root Vegetables',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
        rating: 4.8,
        totalOrders: 1250,
        farmImages: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=1200&auto=format&fit=crop'
        ],
        certificates: [
          {
            name: 'IBF Certification',
            issuer: 'KrishAlign Report center (National Programme for Organic Production)',
            validFrom: '2022-01-15',
            validUntil: '2025-01-15',
            certificateNumber: 'NPOP/ORG/2022/001234',
            status: 'Active'
          }
        ],
        achievements: [        
          'Zero Pesticide Usage for 5+ years',
          'Supports 50+ local families',
          'Exports to 3 countries'
        ]
      },
      {
        id: '2',
        name: 'Priya Sharma',
        farmName: 'Sunrise Organic Gardens',
        location: 'Himachal Pradesh, India',
        experience: '12+ years',
        speciality: 'Mountain Vegetables & Herbs',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1200&auto=format&fit=crop',
        rating: 4.9,
        totalOrders: 980,
        farmImages: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop'
        ],
        certificates: [
          {
            name: 'Organic Certification',
            issuer: 'Organic Certification Agency',
            validFrom: '2021-06-01',
            validUntil: '2024-06-01',
            certificateNumber: 'OCA/ORG/2021/005678',
            status: 'Active'
          }
        ],
        achievements: [        
          'Award for Best Organic Farm 2023',
          'Supports 30+ local families',
          'Zero Waste Farming Practice'
        ],
      },
      {
        id: '3',
        name: 'Amit Patel',
        farmName: 'Fresh Fields Co-op',
        location: 'Gujarat, India',
        experience: '18+ years',
        speciality: 'Desert Vegetables & Spices',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop',
        rating: 4.7,
        totalOrders: 2100,
        farmImages: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop'
        ],
        certificates: [
          {
            name: 'Fair Trade Certification',
            issuer: 'Fair Trade India',
            validFrom: '2020-03-15',
            validUntil: '2025-03-15',
            certificateNumber: 'FTI/FAIR/2020/009876',
            status: 'Active'
          }
        ],
        achievements: [        
          'Community Leader Award 2022',
          'Supports 75+ local families',
          'Sustainable Water Management'
        ],
      },
      {
        id: '4',
        name: 'Sunita Devi',
        farmName: 'Women Farmers Collective',
        location: 'Rajasthan, India',
        experience: '10+ years',
        speciality: 'Traditional Vegetables & Grains',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop',
        rating: 4.9,
        totalOrders: 750,
        farmImages: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop'
        ],
        certificates: [
          {
            name: 'Women Empowerment Certification',
            issuer: 'Ministry of Agriculture',
            validFrom: '2023-01-01',
            validUntil: '2026-01-01',
            certificateNumber: 'MOA/WOMEN/2023/001234',
            status: 'Active'
          }
        ],
        achievements: [        
          'Women Farmer of the Year 2023',
          'Supports 40+ women farmers',
          'Traditional Seed Preservation'
        ]
      }
    ]
  };

  // Similar ingredients for replacement
  const similarIngredients = {
    'Spinach': [
      { name: 'Kale', amount: '150g', benefit: 'Rich in iron and vitamin K', price: 30, unit: 'bunch' },
      { name: 'Swiss Chard', amount: '150g', benefit: 'High in iron and magnesium', price: 28, unit: 'bunch' },
      { name: 'Amaranth Leaves', amount: '150g', benefit: 'Iron-rich and protein-packed', price: 22, unit: 'bunch' }
    ],
    'Broccoli': [
      { name: 'Cauliflower', amount: '100g', benefit: 'High in vitamin C and fiber', price: 25, unit: 'head' },
      { name: 'Brussels Sprouts', amount: '100g', benefit: 'Vitamin C and antioxidants', price: 35, unit: 'kg' },
      { name: 'Cabbage', amount: '100g', benefit: 'Fiber and vitamin C', price: 18, unit: 'head' }
    ],
    'Carrots': [
      { name: 'Sweet Potatoes', amount: '80g', benefit: 'Beta-carotene and fiber', price: 30, unit: 'kg' },
      { name: 'Pumpkin', amount: '80g', benefit: 'Beta-carotene for eye health', price: 25, unit: 'kg' },
      { name: 'Butternut Squash', amount: '80g', benefit: 'Vitamin A and antioxidants', price: 40, unit: 'kg' }
    ],
    'Green Beans': [
      { name: 'Snap Peas', amount: '70g', benefit: 'Protein and vitamin C', price: 45, unit: 'kg' },
      { name: 'Asparagus', amount: '70g', benefit: 'Folate and vitamin K', price: 60, unit: 'bunch' },
      { name: 'Okra', amount: '70g', benefit: 'Fiber and vitamin C', price: 35, unit: 'kg' }
    ],
    'Bell Peppers': [
      { name: 'Tomatoes', amount: '50g', benefit: 'Vitamin C and lycopene', price: 30, unit: 'kg' },
      { name: 'Red Cabbage', amount: '50g', benefit: 'Antioxidants and vitamin C', price: 25, unit: 'head' },
      { name: 'Red Onions', amount: '50g', benefit: 'Quercetin and antioxidants', price: 20, unit: 'kg' }
    ],
    'Sweet Corn': [
      { name: 'Baby Corn', amount: '50g', benefit: 'Fiber and natural sweetness', price: 25, unit: 'pack' },
      { name: 'Peas', amount: '50g', benefit: 'Protein and fiber', price: 40, unit: 'kg' },
      { name: 'Edamame', amount: '50g', benefit: 'Complete protein and fiber', price: 50, unit: 'pack' }
    ]
  };

  // Local quantity functions (not added to cart yet)
  const addLocalQuantity = (ingredientName: string) => {
    setLocalQuantities(prev => ({
      ...prev,
      [ingredientName]: (prev[ingredientName] || 1) + 1
    }));
  };

  const removeLocalQuantity = (ingredientName: string) => {
    if (localQuantities[ingredientName] > 1) {
      setLocalQuantities(prev => ({
        ...prev,
        [ingredientName]: prev[ingredientName] - 1
      }));
    } else {
      // Don't allow quantity to go below 1, show replacement options
      setSelectedIngredient(ingredientName);
      setShowBottomSheet(true);
    }
  };

  const replaceIngredient = (originalName: string, newName: string) => {
    const quantity = localQuantities[originalName] || 1;
    setLocalQuantities(prev => {
      const newItems = { ...prev };
      delete newItems[originalName];
      newItems[newName] = quantity;
      return newItems;
    });
    setShowBottomSheet(false);
  };

  const handleFarmerPress = (farmer: any) => {
    setSelectedFarmer(farmer);
  };

  // Combo-level cart functions
  const addComboToCart = () => {
    const items: CartItemIngredient[] = comboDetails.ingredients.map((ingredient, idx) => ({
      id: `${comboDetails.id}-${idx + 1}`,
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      price: ingredient.price,
      quantity: localQuantities[ingredient.name] || 1,
    }));

    const comboPayload: CartComboItem = {
      id: comboDetails.id,
      type: 'combo',
      name: comboDetails.name,
      tagline: comboDetails.tagline,
      price: comboDetails.price,
      quantity: 1,
      image: comboDetails.image,
      items,
    };

    // store in context as source of truth (increments cartCount for new combo id)
    addOrUpdateCombo(comboPayload);

    setComboInCart(true);
    setComboQuantity(prev => prev + 1);

    Alert.alert(
      'Added to Cart',
      `Added ${comboDetails.name} with ${items.length} items`,
      [{ text: 'OK' }]
    );
  };

  const removeComboFromCart = () => {
    removeCombo(comboDetails.id);
    setComboInCart(false);
    setComboQuantity(0);
  };

  const buyNow = () => {
    const totalIngredientItems = Object.values(localQuantities).reduce((sum, qty) => sum + qty, 0);
    
    Alert.alert(
      'Buy Now',
      `Add ${comboDetails.name} and ${totalIngredientItems} ingredient items to cart and proceed to checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy Now', 
          onPress: () => {
            if (!comboInCart) {
              addComboToCart();
            }
            // Navigate to checkout
            Alert.alert('Success', 'Redirecting to checkout...');
          }
        }
      ]
    );
  };

  // Use shared cart count
  const totalCartItems = cartCount;

  // Calculate total price including ingredients
  const calculateTotalPrice = () => {
    const comboPrice = comboDetails.price;
    const ingredientPrice = comboDetails.ingredients.reduce((total, ingredient) => {
      const quantity = localQuantities[ingredient.name] || 1;
      return total + (ingredient.price * quantity);
    }, 0);
    return comboPrice + ingredientPrice;
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'information-outline' },
    { key: 'nutrition', label: 'Nutrition', icon: 'chart-line' },
    { key: 'cooking', label: 'How to Cook', icon: 'chef-hat' },
    { key: 'farmer', label: 'Farmer', icon: 'account-circle-outline' }
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{comboDetails.description}</Text>
      </View>

      {/* Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.itemsScrollArea}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.itemsScrollContent}
          >
            {comboDetails.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientCard}>
                <View style={styles.ingredientHeader}>
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                    <Text style={styles.ingredientPrice}>
                      ₹{ingredient.price}/{ingredient.unit} × {localQuantities[ingredient.name] || 1} = ₹{ingredient.price * (localQuantities[ingredient.name] || 1)}
                    </Text>
                  </View>
                  <View style={styles.ingredientActions}>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        style={styles.quantityBtn}
                        onPress={() => removeLocalQuantity(ingredient.name)}
                      >
                        <Icon name="minus" size={16} color="#ef4444" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{localQuantities[ingredient.name] || 1}</Text>
                      <TouchableOpacity 
                        style={styles.quantityBtn}
                        onPress={() => addLocalQuantity(ingredient.name)}
                      >
                        <Icon name="plus" size={16} color="#22c55e" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text style={styles.ingredientBenefit}>{ingredient.benefit}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>


      {/* Price Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Combo Base Price:</Text>
            <Text style={styles.priceValue}>₹{comboDetails.price}</Text>
          </View>
          {comboDetails.ingredients.map((ingredient, index) => {
            const quantity = localQuantities[ingredient.name] || 1;
            const totalPrice = ingredient.price * quantity;
            return (
              <View key={index} style={styles.priceRow}>
                <Text style={styles.priceLabel}>{ingredient.name}</Text>
                <Text style={styles.priceValue}>
                  ₹{ingredient.price}/{ingredient.unit} × {quantity} = ₹{totalPrice}
                </Text>
              </View>
            );
          })}
          <View style={[styles.priceRow, styles.totalPriceRow]}>
            <Text style={styles.totalPriceLabel}>Total:</Text>
            <Text style={styles.totalPriceValue}>₹{calculateTotalPrice()}</Text>
          </View>
        </View>
      </View>

      
      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        <View style={styles.certificationsContainer}>
          <View style={styles.certificationPills}>
            <View style={[styles.certificationPill, { backgroundColor: '#fef3c7' }]}>
              <Icon name="leaf" size={16} color="#d97706" />
              <Text style={styles.certificationText}>Organic Certified</Text>
            </View>
            <View style={[styles.certificationPill, { backgroundColor: '#dbeafe' }]}>
              <Icon name="shield-check" size={16} color="#2563eb" />
              <Text style={styles.certificationText}>IBF Certified</Text>
            </View>
            <View style={[styles.certificationPill, { backgroundColor: '#f0fdf4' }]}>
              <Icon name="check-circle" size={16} color="#16a34a" />
              <Text style={styles.certificationText}>Farm Fresh</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Health Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Benefits</Text>
        {comboDetails.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Icon name="check-circle" size={16} color="#22c55e" />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      {/* Storage & Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage & Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Best Time:</Text>
            <Text style={styles.infoValue}>{comboDetails.bestTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="fridge-outline" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Fresh Storage:</Text>
            <Text style={styles.infoValue}>{comboDetails.storage.fresh}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="shield-check" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Allergens:</Text>
            <Text style={styles.infoValue}>{comboDetails.allergens}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNutrition = () => (
    <View style={styles.tabContent}>
      {/* Nutritional Facts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutritional Facts (per 100g)</Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{comboDetails.nutrition.calories}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{comboDetails.nutrition.protein}</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{comboDetails.nutrition.carbs}</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{comboDetails.nutrition.fiber}</Text>
            <Text style={styles.nutritionLabel}>Fiber</Text>
          </View>
        </View>
      </View>

      {/* Vitamins & Minerals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vitamins & Minerals</Text>
        <View style={styles.vitaminGrid}>
          <View style={styles.vitaminItem}>
            <Icon name="circle" size={12} color="#f59e0b" />
            <Text style={styles.vitaminLabel}>Iron</Text>
            <Text style={styles.vitaminValue}>{comboDetails.nutrition.iron}</Text>
          </View>
          <View style={styles.vitaminItem}>
            <Icon name="circle" size={12} color="#22c55e" />
            <Text style={styles.vitaminLabel}>Folate</Text>
            <Text style={styles.vitaminValue}>{comboDetails.nutrition.folate}</Text>
          </View>
          <View style={styles.vitaminItem}>
            <Icon name="circle" size={12} color="#ef4444" />
            <Text style={styles.vitaminLabel}>Vitamin A</Text>
            <Text style={styles.vitaminValue}>{comboDetails.nutrition.vitaminA}</Text>
          </View>
          <View style={styles.vitaminItem}>
            <Icon name="circle" size={12} color="#3b82f6" />
            <Text style={styles.vitaminLabel}>Vitamin C</Text>
            <Text style={styles.vitaminValue}>{comboDetails.nutrition.vitaminC}</Text>
          </View>
          <View style={styles.vitaminItem}>
            <Icon name="circle" size={12} color="#8b5cf6" />
            <Text style={styles.vitaminLabel}>Calcium</Text>
            <Text style={styles.vitaminValue}>{comboDetails.nutrition.calcium}</Text>
          </View>
          <View style={styles.vitaminItem}>
            <Icon name="circle" size={12} color="#f97316" />
            <Text style={styles.vitaminLabel}>Potassium</Text>
            <Text style={styles.vitaminValue}>{comboDetails.nutrition.potassium}</Text>
          </View>
        </View>
      </View>

      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        <View style={styles.certificationList}>
          {comboDetails.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <Icon name="certificate" size={16} color="#22c55e" />
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCooking = () => (
    <View style={styles.tabContent}>
      {/* Cooking Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Cook for Maximum Benefits</Text>
        <Text style={styles.cookingIntro}>
          Follow these steps to preserve maximum nutrients and get the best flavor from your fresh produce.
        </Text>
        
        {comboDetails.cookingInstructions.map((instruction, index) => (
          <View key={index} style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{instruction.step}</Text>
              </View>
              <View style={styles.instructionTitleContainer}>
                <Text style={styles.instructionTitle}>{instruction.title}</Text>
                <Text style={styles.instructionDuration}>{instruction.duration}</Text>
              </View>
            </View>
            <Text style={styles.instructionDescription}>{instruction.description}</Text>
            <View style={styles.instructionTip}>
              <Icon name="lightbulb-outline" size={14} color="#f59e0b" />
              <Text style={styles.instructionTipText}>{instruction.tips}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Cooking Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pro Tips for Maximum Benefits</Text>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Icon name="thermometer" size={16} color="#22c55e" />
            <Text style={styles.tipText}>Steam at medium heat to preserve water-soluble vitamins</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="timer" size={16} color="#22c55e" />
            <Text style={styles.tipText}>Cook for minimum time to maintain crispness and nutrients</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="water" size={16} color="#22c55e" />
            <Text style={styles.tipText}>Use minimal water to prevent nutrient loss</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="lemon" size={16} color="#22c55e" />
            <Text style={styles.tipText}>Add lemon juice to enhance iron absorption</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFarmer = () => (
    <View style={styles.tabContent}>
      {/* Farmers Avatar Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Farmers</Text>
        <Text style={styles.sectionSubtitle}>Tap a farmer to view details</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.avatarList}
        >
          {comboDetails.farmers.map((farmer) => {
            const isSelected = selectedFarmer && selectedFarmer.id === farmer.id;
            return (
              <TouchableOpacity
                key={farmer.id}
                style={[styles.avatarItem, isSelected && styles.avatarItemSelected]}
                onPress={() => handleFarmerPress(farmer)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: farmer.profileImage }}
                  style={[styles.avatarImage, isSelected && styles.avatarImageSelected]}
                />
                <Text style={[styles.avatarLabel, isSelected && styles.avatarLabelSelected]} numberOfLines={1}>
                  {farmer.name.split(' ')[0]}
                </Text>
                {isSelected && (
                  <View style={styles.avatarTriangle} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Selected Farmer Details */}
      {selectedFarmer && (
        <View style={[styles.section, styles.selectedFarmerCard]}>
          <View style={styles.selectedBadgeRow}>
            <View style={styles.selectedBadge}>
              <Icon name="check-decagram" size={14} color="#16a34a" />
              <Text style={styles.selectedBadgeText}>Selected</Text>
            </View>
          </View>
          {/* Profile Card */}
          <View style={styles.farmerProfileCard}>
            <Image source={{ uri: selectedFarmer.profileImage }} style={styles.farmerImage} />
            <View style={styles.farmerInfo}>
              <Text style={styles.farmerName}>{selectedFarmer.name}</Text>
              <Text style={styles.farmName}>{selectedFarmer.farmName}</Text>
              <View style={styles.statChips}>
                <View style={[styles.statChip, { backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' }]}>
                  <Icon name="star" size={14} color="#f59e0b" />
                  <Text style={styles.statChipText}>{selectedFarmer.rating}</Text>
                </View>
                <View style={[styles.statChip, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                  <Icon name="package-variant-closed" size={14} color="#2563eb" />
                  <Text style={styles.statChipText}>{selectedFarmer.totalOrders} orders</Text>
                </View>
              </View>
              <View style={[styles.farmerMeta, { marginTop: 8 }]}>
                <View style={styles.metaRow}>
                  <Icon name="map-marker" size={14} color="#64748b" />
                  <Text style={styles.metaText}>{selectedFarmer.location}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Icon name="clock-outline" size={14} color="#64748b" />
                  <Text style={styles.metaText}>{selectedFarmer.experience}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Icon name="leaf" size={14} color="#64748b" />
                  <Text style={styles.metaText}>{selectedFarmer.speciality}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Farm Gallery */}
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Farm Gallery</Text>
            <View style={styles.farmGrid}>
              {selectedFarmer.farmImages.map((image: string, index: number) => (
                <Image key={index} source={{ uri: image }} style={styles.farmImage} />
              ))}
            </View>
          </View>

          {/* Certificates */}
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Certificates & Licenses</Text>
            {selectedFarmer.certificates.map((cert: any, index: number) => (
              <View key={index} style={styles.certificateCard}>
                <View style={styles.certificateHeader}>
                  <View style={styles.certificateIcon}>
                    <Icon name="certificate" size={20} color="#22c55e" />
                  </View>
                  <View style={styles.certificateInfo}>
                    <Text style={styles.certificateName}>{cert.name}</Text>
                    <Text style={styles.certificateIssuer}>{cert.issuer}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: cert.status === 'Active' ? '#dcfce7' : '#fee2e2' }]}>
                    <Text style={[styles.statusText, { color: cert.status === 'Active' ? '#166534' : '#dc2626' }]}>
                      {cert.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.certificateDetails}>
                  <View style={styles.certDetailRow}>
                    <Text style={styles.certDetailLabel}>Certificate No:</Text>
                    <Text style={styles.certDetailValue}>{cert.certificateNumber}</Text>
                  </View>
                  <View style={styles.certDetailRow}>
                    <Text style={styles.certDetailLabel}>Valid From:</Text>
                    <Text style={styles.certDetailValue}>{cert.validFrom}</Text>
                  </View>
                  <View style={styles.certDetailRow}>
                    <Text style={styles.certDetailLabel}>Valid Until:</Text>
                    <Text style={styles.certDetailValue}>{cert.validUntil}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Achievements & Recognition</Text>
            <View style={styles.achievementsList}>
              {selectedFarmer.achievements.map((achievement: string, index: number) => (
                <View key={index} style={styles.achievementItem}>
                  <Icon name="trophy" size={16} color="#f59e0b" />
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      )}

      {/* Why Choose Our Farmers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Our Farmers?</Text>
        <View style={styles.benefitsGrid}>
          <View style={styles.benefitCard}>
            <Icon name="shield-check" size={24} color="#22c55e" />
            <Text style={styles.benefitTitle}>Certified Organic</Text>
            <Text style={styles.benefitDescription}>All farmers are certified organic with verified credentials</Text>
          </View>
          <View style={styles.benefitCard}>
            <Icon name="heart" size={24} color="#ef4444" />
            <Text style={styles.benefitTitle}>Community Support</Text>
            <Text style={styles.benefitDescription}>Supporting local farming communities and families</Text>
          </View>
          <View style={styles.benefitCard}>
            <Icon name="leaf" size={24} color="#16a34a" />
            <Text style={styles.benefitTitle}>Sustainable Practices</Text>
            <Text style={styles.benefitDescription}>Environmentally friendly and sustainable farming methods</Text>
          </View>
          <View style={styles.benefitCard}>
            <Icon name="trophy" size={24} color="#f59e0b" />
            <Text style={styles.benefitTitle}>Quality Assured</Text>
            <Text style={styles.benefitDescription}>Regular quality checks and customer satisfaction</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Combo Details</Text>
        <TouchableOpacity 
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Icon name="cart" size={24} color="#111827" />
          {totalCartItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Combo Image & Basic Info */}
        <View style={styles.comboHeader}>
          <Image source={{ uri: 'https://www.bing.com/th/id/OIP.Py4eRbJ0WIFjs51eUrIErAHaEo?w=273&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2' }} style={styles.comboImage} />
          <View style={styles.comboInfo}>
            <Text style={styles.comboName}>{comboDetails.name}</Text>
            <Text style={styles.comboTagline}>{comboDetails.tagline}</Text>
            <View style={styles.comboMeta}>
              <View style={styles.metaItem}>
                <Icon name="weight" size={16} color="#64748b" />
                <Text style={styles.metaText}>{comboDetails.weight}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="currency-inr" size={16} color="#64748b" />
                <Text style={styles.metaText}>₹{calculateTotalPrice()}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="tag" size={16} color="#64748b" />
                <Text style={styles.metaText}>{comboDetails.category}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Combo Action Buttons */}
        <View style={styles.comboActions}>
          <View style={styles.comboButtons}>
            {comboInCart ? (
              <TouchableOpacity 
                style={[styles.addToCartBtn, { backgroundColor: '#fee2e2' }]}
                onPress={() => {
                  removeComboFromCart();
                  if (Platform.OS === 'android') {
                    ToastAndroid.show('Removed from cart', ToastAndroid.SHORT);
                  } else {
                    Alert.alert('Removed from cart');
                  }
                }}
                activeOpacity={0.9}
              >
                <Icon name="cart-remove" size={20} color="#b91c1c" />
                <Text style={[styles.addToCartBtnText, { color: '#b91c1c' }]}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.addToCartBtn}
                onPress={() => {
                  addComboToCart();
                  if (Platform.OS === 'android') {
                    ToastAndroid.show('Added to cart', ToastAndroid.SHORT);
                  } else {
                    Alert.alert('Added to cart');
                  }
                }}
                activeOpacity={0.9}
              >
                <Icon name="cart-plus" size={20} color="#ffffff" />
                <Text style={styles.addToCartBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.buyNowBtn}
              onPress={buyNow}
            >
              <Icon name="flash" size={20} color="#ffffff" />
              <Text style={styles.buyNowBtnText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <Icon 
                name={tab.icon} 
                size={14} 
                color={selectedTab === tab.key ? '#2E7D32' : '#64748b'} 
              />
              <Text style={[
                styles.tabText, 
                selectedTab === tab.key && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'nutrition' && renderNutrition()}
        {selectedTab === 'cooking' && renderCooking()}
        {selectedTab === 'farmer' && renderFarmer()}
      </ScrollView>

      {/* Bottom Sheet for Similar Items */}
      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>
                Replace {selectedIngredient}
              </Text>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setShowBottomSheet(false)}
              >
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.bottomSheetSubtitle}>
              Choose a similar nutrient-rich alternative:
            </Text>
            
            <ScrollView style={styles.similarIngredientsList}>
              {selectedIngredient && similarIngredients[selectedIngredient as keyof typeof similarIngredients]?.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.similarIngredientItem}
                  onPress={() => replaceIngredient(selectedIngredient, ingredient.name)}
                >
                  <View style={styles.similarIngredientInfo}>
                    <Text style={styles.similarIngredientName}>{ingredient.name}</Text>
                    <Text style={styles.similarIngredientAmount}>{ingredient.amount}</Text>
                    <Text style={styles.similarIngredientPrice}>₹{ingredient.price}/{ingredient.unit}</Text>
                  </View>
                  <Text style={styles.similarIngredientBenefit}>{ingredient.benefit}</Text>
                  <Icon name="arrow-right" size={20} color="#22c55e" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      
      
      {/* Bottom Bar */}
      <BottomBar active="Shop" cartCount={totalCartItems} />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cartBtn: {
    padding: 6,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    paddingBottom: 20,
  },
  comboHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  comboImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  comboInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  comboName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  comboTagline: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  comboMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  comboActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  comboButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  addToCartBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  buyNowBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  selectedFarmerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  ingredientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  itemsScrollArea: {
    maxHeight: 220,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  itemsScrollContent: {
    padding: 8,
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  ingredientAmount: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  ingredientPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  ingredientActions: {
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  quantityBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    minWidth: 20,
    textAlign: 'center',
  },
  ingredientBenefit: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  certificationsContainer: {
    marginBottom: 8,
  },
  certificationPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certificationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  certificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  benefitText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    minWidth: 80,
  },
  infoValue: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: (screenWidth - 64) / 2,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  vitaminGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitaminItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    width: (screenWidth - 80) / 2,
    gap: 6,
  },
  vitaminLabel: {
    fontSize: 12,
    color: '#111827',
    flex: 1,
  },
  vitaminValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  certificationList: {
    gap: 8,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cookingIntro: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  instructionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  instructionTitleContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  instructionDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  instructionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  instructionTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    padding: 8,
    gap: 6,
  },
  instructionTipText: {
    fontSize: 12,
    color: '#92400e',
    flex: 1,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  farmerProfileCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  farmerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  farmName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  farmerMeta: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  farmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  farmImage: {
    width: (screenWidth - 80) / 3,
    height: (screenWidth - 80) / 3,
    borderRadius: 8,
  },
  certificateCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  certificateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  certificateIssuer: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  certificateDetails: {
    gap: 6,
  },
  certDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  certDetailValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
 
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  // Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    padding: 4,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#64748b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    lineHeight: 20,
  },
  similarIngredientsList: {
    paddingHorizontal: 20,
  },
  similarIngredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  similarIngredientInfo: {
    flex: 1,
  },
  similarIngredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  similarIngredientAmount: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  similarIngredientPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  similarIngredientBenefit: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 16,
  },
  // Price Breakdown Styles
  priceBreakdown: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalPriceRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22c55e',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  farmersList: {
    paddingRight: 16,
  },
  avatarList: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  avatarItem: {
    alignItems: 'center',
    marginRight: 12,
    width: 64,
    position: 'relative',
  },
  avatarItemSelected: {
    transform: [{ scale: 1.05 }],
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarImageSelected: {
    borderColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarLabel: {
    marginTop: 6,
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  avatarLabelSelected: {
    color: '#111827',
    fontWeight: '700',
  },
  avatarTriangle: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#22c55e',
  },
  
  selectedBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 6,
  },
  selectedBadgeText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  statChips: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  statChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.1,
  },
  farmerCard: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  farmerCardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 12,
  },
  farmerCardInfo: {
    alignItems: 'center',
  },
  farmerCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  farmerCardFarm: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  farmerCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  ordersText: {
    fontSize: 11,
    color: '#64748b',
  },
  farmerCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 10,
    color: '#64748b',
  },
  specialityText: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
    textAlign: 'center',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitCard: {
    width: (screenWidth - 64) / 2,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  farmerDetailModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  farmerDetailHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },
  farmerDetailImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  farmerDetailInfo: {
    flex: 1,
  },
  farmerDetailName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  farmerDetailFarm: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  farmerDetailMeta: {
    marginBottom: 8,
  },
  farmerDetailLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  farmerDetailContent: {
    flex: 1,
    padding: 20,
  },
  farmerDetailSection: {
    marginBottom: 24,
  },
  farmerDetailSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  farmerDetailCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  farmerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  farmerDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    minWidth: 80,
  },
  farmerDetailValue: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  farmerDetailFarmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  farmerDetailFarmImage: {
    width: (screenWidth - 80) / 3,
    height: (screenWidth - 80) / 3,
    borderRadius: 8,
  },
  farmerDetailCertificateCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  farmerDetailCertificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  farmerDetailCertificateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  farmerDetailCertificateInfo: {
    flex: 1,
  },
  farmerDetailCertificateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  farmerDetailCertificateIssuer: {
    fontSize: 12,
    color: '#64748b',
  },
  farmerDetailStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  farmerDetailStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  farmerDetailCertificateDetails: {
    gap: 6,
  },
  farmerDetailCertDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmerDetailCertDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  farmerDetailCertDetailValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  farmerDetailAchievementsList: {
    gap: 12,
  },
  farmerDetailAchievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  farmerDetailAchievementText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  farmerDetailContactCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  farmerDetailContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  farmerDetailContactText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
});

export default ComboDetailScreen;
