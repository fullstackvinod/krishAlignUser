import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ComboItem = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  nutrientsCount: number;
  price: number;
  quantity: number;
  badge?: 'New' | 'Trending';
};

type DayPlan = {
  day: number;
  combos: ComboItem[];
};

type OrderReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderReview'>;

const OrderReviewScreen: React.FC = () => {
  const navigation = useNavigation<OrderReviewScreenNavigationProp>();
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7]));

  const weeklyPlan = useMemo<DayPlan[]>(() => [
    {
      day: 1,
      combos: [
        { id: 'd1-c1', name: 'Green Boost', tagline: 'Iron & folate', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', nutrientsCount: 9, price: 249, quantity: 2, badge: 'New' },
      ]
    },
    {
      day: 2,
      combos: [
        { id: 'd2-c1', name: 'Orange Glow', tagline: 'Beta-carotene', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop', nutrientsCount: 7, price: 279, quantity: 1, badge: 'Trending' },
      ]
    },
    {
      day: 3,
      combos: [
        { id: 'd3-c1', name: 'Brain Fuel', tagline: 'Omega & folate', image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop', nutrientsCount: 11, price: 329, quantity: 3 },
      ]
    },
    {
      day: 4,
      combos: [
        { id: 'd4-c1', name: 'Low GI Pack', tagline: 'Balanced sugar', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop', nutrientsCount: 8, price: 259, quantity: 1 },
      ]
    },
    {
      day: 5,
      combos: [
        { id: 'd5-c1', name: 'Fitness Fuel', tagline: 'Active days', image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop', nutrientsCount: 13, price: 349, quantity: 2 },
      ]
    },
    {
      day: 6,
      combos: [
        { id: 'd6-c1', name: 'Green Boost', tagline: 'Iron & folate', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', nutrientsCount: 9, price: 249, quantity: 1 },
      ]
    },
    {
      day: 7,
      combos: [
        { id: 'd7-c1', name: 'Vital Crunch', tagline: 'Fiber rich', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop', nutrientsCount: 12, price: 299, quantity: 1 },
      ]
    },
  ], []);

  const [plan, setPlan] = useState<DayPlan[]>(weeklyPlan);

  const toggleDayExpansion = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const updateQuantity = (dayIndex: number, comboIndex: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    const updatedPlan = [...plan];
    updatedPlan[dayIndex].combos[comboIndex].quantity = newQuantity;
    setPlan(updatedPlan);
  };

  const removeCombo = (dayIndex: number, comboIndex: number) => {
    const updatedPlan = [...plan];
    updatedPlan[dayIndex].combos.splice(comboIndex, 1);
    setPlan(updatedPlan);
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Placed Successfully! 🎉',
      'Your weekly pack order has been confirmed. You will receive fresh produce every morning between 7 AM - 9 AM.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home screen
            navigation.navigate('Home');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const orderSummary = useMemo(() => {
    const totalPacks = plan.reduce((sum, day) => sum + day.combos.reduce((daySum, combo) => daySum + combo.quantity, 0), 0);
    const totalPrice = plan.reduce((sum, day) => sum + day.combos.reduce((daySum, combo) => daySum + (combo.price * combo.quantity), 0), 0);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    
    return {
      totalPacks,
      totalPrice,
      deliveryDate: deliveryDate.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    };
  }, [plan]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Review</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Weekly Plan Summary */}
        <Text style={styles.sectionTitle}>Weekly Plan Summary</Text>
        
        {plan.map((dayPlan, dayIndex) => (
          <View key={dayPlan.day} style={styles.daySection}>
            <TouchableOpacity 
              style={styles.dayHeader}
              onPress={() => toggleDayExpansion(dayPlan.day)}
            >
              <Text style={styles.dayTitle}>Day {dayPlan.day}</Text>
                             <View style={styles.dayHeaderRight}>
                 <Text style={styles.comboCount}>
                   {dayPlan.combos.reduce((sum, combo) => sum + combo.quantity, 0)} pack{dayPlan.combos.reduce((sum, combo) => sum + combo.quantity, 0) !== 1 ? 's' : ''}
                 </Text>
                 <Icon 
                   name={expandedDays.has(dayPlan.day) ? "chevron-up" : "chevron-down"} 
                   size={20} 
                   color="#64748b" 
                 />
               </View>
            </TouchableOpacity>

            {expandedDays.has(dayPlan.day) && (
              <View style={styles.combosContainer}>
                {dayPlan.combos.map((combo, comboIndex) => (
                  <View key={combo.id} style={styles.comboCard}>
                    <View style={styles.comboImageContainer}>
                      <Image source={{ uri: combo.image }} style={styles.comboImage} />
                      {combo.badge && (
                        <View style={[styles.badge, { backgroundColor: combo.badge === 'New' ? '#22c55e' : '#f59e0b' }]}>
                          <Text style={styles.badgeText}>{combo.badge}</Text>
                        </View>
                      )}
                    </View>
                    
                                         <View style={styles.comboInfo}>
                       <Text style={styles.comboName}>
                         {combo.quantity > 1 ? `${combo.quantity}x ` : ''}{combo.name}
                       </Text>
                       <Text style={styles.comboTagline}>{combo.tagline}</Text>
                      <View style={styles.nutrientPills}>
                        <View style={[styles.nutrientPill, { backgroundColor: '#dcfce7' }]}>
                          <Text style={styles.nutrientPillText}>Vit A</Text>
                        </View>
                        <View style={[styles.nutrientPill, { backgroundColor: '#dcfce7' }]}>
                          <Text style={styles.nutrientPillText}>Iron</Text>
                        </View>
                        <View style={[styles.nutrientPill, { backgroundColor: '#fee2e2' }]}>
                          <Text style={styles.nutrientPillText}>{combo.nutrientsCount}+</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.comboActions}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity 
                          style={styles.quantityBtn}
                          onPress={() => updateQuantity(dayIndex, comboIndex, combo.quantity - 1)}
                        >
                          <Icon name="minus" size={16} color="#64748b" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{combo.quantity}</Text>
                        <TouchableOpacity 
                          style={styles.quantityBtn}
                          onPress={() => updateQuantity(dayIndex, comboIndex, combo.quantity + 1)}
                        >
                          <Icon name="plus" size={16} color="#64748b" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{combo.price * combo.quantity}</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.removeBtn}
                        onPress={() => removeCombo(dayIndex, comboIndex)}
                      >
                        <Icon name="trash-can-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        
        {/* Delivery Address Section */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Icon name="map-marker" size={20} color="#2E7D32" />
              <Text style={styles.addressTitle}>Home Address</Text>
              <TouchableOpacity style={styles.editAddressBtn}>
                <Icon name="pencil" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.addressText}>
              123 Green Valley Apartments{'\n'}
              Sector 15, Gurgaon{'\n'}
              Haryana - 122001{'\n'}
              India
            </Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Icon name="phone" size={16} color="#64748b" />
                <Text style={styles.contactText}>+91 98765 43210</Text>
              </View>
              <View style={styles.contactRow}>
                <Icon name="account" size={16} color="#64748b" />
                <Text style={styles.contactText}>John Doe</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Order Summary - Sticky Bottom */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Packs:</Text>
            <Text style={styles.summaryValue}>{orderSummary.totalPacks}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Price:</Text>
            <Text style={styles.summaryPrice}>₹{orderSummary.totalPrice}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery:</Text>
            <Text style={styles.summaryValue}>Every day within 7 AM - 9 AM (Morning)</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.placeOrderBtn}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: '#111827',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 200, // Space for sticky summary
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  daySection: {
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e2f5e7',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  comboCount: {
    fontSize: 14,
    color: '#64748b',
  },
  combosContainer: {
    padding: 16,
    gap: 12,
  },
  comboCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  comboImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  comboImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  comboInfo: {
    flex: 1,
    marginRight: 12,
  },
  comboName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  comboTagline: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  nutrientPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  nutrientPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nutrientPillText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#166534',
  },
  comboActions: {
    alignItems: 'center',
    gap: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 12,
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  removeBtn: {
    padding: 4,
  },
  deliverySection: {
    marginTop: 24,
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  editAddressBtn: {
    padding: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactInfo: {
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#64748b',
  },
  orderSummary: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  summaryContent: {
    marginBottom: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveDraftBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  saveDraftText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  placeOrderBtn: {
    flex: 2,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default OrderReviewScreen;
