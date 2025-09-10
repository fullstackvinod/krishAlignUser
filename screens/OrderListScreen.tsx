import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, OrderItem } from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/BottomBar';

type OrderListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;



const OrderListScreen: React.FC = () => {
  const navigation = useNavigation<OrderListScreenNavigationProp>();

  const orders: OrderItem[] = useMemo(() => [
    {
      id: 'order-1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'Delivered',
      totalAmount: 2490,
      totalPacks: 10,
      category: 'KidPack',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
      deliveryAddress: '123 Green Valley Apartments, Gurgaon'
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-14',
      status: 'In Progress',
      totalAmount: 3290,
      totalPacks: 10,
      category: 'BrainPack',
      image: 'https://images.unsplash.com/photo-1549575810-396f1a7c1d1b?q=80&w=1200&auto=format&fit=crop',
      deliveryAddress: '123 Green Valley Apartments, Gurgaon'
    },
    {
      id: 'order-3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-13',
      status: 'Delivered',
      totalAmount: 2590,
      totalPacks: 10,
      category: 'DiabeticPack',
      image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop',
      deliveryAddress: '123 Green Valley Apartments, Gurgaon'
    },
    {
      id: 'order-4',
      orderNumber: 'ORD-2024-004',
      date: '2024-01-12',
      status: 'Cancelled',
      totalAmount: 3490,
      totalPacks: 10,
      category: 'FitnessPack',
      image: 'https://images.unsplash.com/photo-1524594224032-ccda0f0a211a?q=80&w=1200&auto=format&fit=crop',
      deliveryAddress: '123 Green Valley Apartments, Gurgaon'
    },
    {
      id: 'order-5',
      orderNumber: 'ORD-2024-005',
      date: '2024-01-11',
      status: 'Delivered',
      totalAmount: 2990,
      totalPacks: 10,
      category: 'ImmunityPack',
      image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop',
      deliveryAddress: '123 Green Valley Apartments, Gurgaon'
    },
  ], []);

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Delivered' | 'In Progress' | 'Cancelled'>('All');

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'All') return orders;
    return orders.filter(order => order.status === selectedFilter);
  }, [orders, selectedFilter]);

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

  const handleOrderPress = (order: OrderItem) => {
    navigation.navigate('OrderDetail', { order });
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Icon name={getStatusIcon(item.status)} size={12} color="#ffffff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <Image source={{ uri: item.image }} style={styles.orderImage} />
        <View style={styles.orderDetails}>
          <Text style={styles.categoryName}>{item.category}</Text>
          <Text style={styles.packCount}>{item.totalPacks} packs</Text>
          <Text style={styles.deliveryAddress}>{item.deliveryAddress}</Text>
        </View>
        <View style={styles.orderAmount}>
          <Text style={styles.amountText}>₹{item.totalAmount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: 'All' | 'Delivered' | 'In Progress' | 'Cancelled') => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Icon name="magnify" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('All')}
        {renderFilterButton('Delivered')}
        {renderFilterButton('In Progress')}
        {renderFilterButton('Cancelled')}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Bottom Navigation */}
      <BottomBar active="Orders" ordersCount={orders.length} />
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  filterButtonActive: {
    backgroundColor: '#22c55e',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for bottom bar
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  orderDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  packCount: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 11,
    color: '#9ca3af',
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
});

export default OrderListScreen;
