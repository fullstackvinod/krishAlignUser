import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, OrderItem } from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type OrderDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetail'>;
type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;



const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailScreenNavigationProp>();
  const route = useRoute<OrderDetailRouteProp>();
  const order = route.params?.order;

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#22c55e';
      case 'In Progress': return '#f59e0b';
      case 'Cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'check-circle';
      case 'In Progress': return 'clock-outline';
      case 'Cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'Delivered': return 'Your order has been successfully delivered';
      case 'In Progress': return 'Your order is being prepared and will be delivered soon';
      case 'Cancelled': return 'This order has been cancelled';
      default: return 'Order status unknown';
    }
  };

  // Mock weekly plan data for the order
  const weeklyPlan = [
    { day: 1, combo: 'Green Boost', quantity: 2, price: 249 },
   
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: getStatusColor(order.status) }]}>
              <Icon name={getStatusIcon(order.status)} size={24} color="#ffffff" />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{order.status}</Text>
              <Text style={styles.statusDescription}>{getStatusDescription(order.status)}</Text>
            </View>
          </View>
        </View>

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Number:</Text>
              <Text style={styles.infoValue}>{order.orderNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Date:</Text>
              <Text style={styles.infoValue}>{order.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{order.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Packs:</Text>
              <Text style={styles.infoValue}>{order.totalPacks}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Amount:</Text>
              <Text style={[styles.infoValue, styles.amountValue]}>₹{order.totalAmount}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Plan</Text>
          <View style={styles.planCard}>
            {weeklyPlan.map((day, index) => (
              <View key={index} style={styles.dayRow}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayLabel}>Day {day.day}</Text>
                  <Text style={styles.comboName}>
                    {day.quantity > 1 ? `${day.quantity}x ` : ''}{day.combo}
                  </Text>
                </View>
                <Text style={styles.dayPrice}>₹{day.price * day.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryHeader}>
              <Icon name="map-marker" size={20} color="#2E7D32" />
              <Text style={styles.deliveryTitle}>Delivery Address</Text>
            </View>
            <Text style={styles.deliveryAddress}>{order.deliveryAddress}</Text>
            <View style={styles.deliveryTime}>
              <Icon name="clock-outline" size={16} color="#64748b" />
              <Text style={styles.deliveryTimeText}>Every day within 7 AM - 9 AM (Morning)</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {order.status === 'Delivered' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.reorderBtn}>
              <Icon name="refresh" size={20} color="#2E7D32" />
              <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rateBtn}>
              <Icon name="star-outline" size={20} color="#f59e0b" />
              <Text style={styles.rateText}>Rate Order</Text>
            </TouchableOpacity>
          </View>
        )}

        {order.status === 'In Progress' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.trackBtn}>
              <Icon name="map-marker-path" size={20} color="#ffffff" />
              <Text style={styles.trackText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    padding: 16,
    paddingBottom: 32,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  statusDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dayInfo: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  comboName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dayPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryTimeText: {
    fontSize: 14,
    color: '#64748b',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  reorderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  reorderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  rateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  trackBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  trackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default OrderDetailScreen;
