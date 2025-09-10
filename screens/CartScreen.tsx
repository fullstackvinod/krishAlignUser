import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../contexts/CartContext';
import type { CartComboItem } from '../contexts/CartContext';

type CartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavigationProp>();
  const { cartCount, setCartCount, cartCombos, updateItemQuantity, removeItemFromCombo } = useCart();
  
  // source of truth now from context
  const cartItems: CartComboItem[] = cartCombos;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      // update combo-level quantity if needed in future
      // currently combos quantity is fixed to 1 per requirements
    }
  };

  const [altSheetVisible, setAltSheetVisible] = useState(false);
  const [altContext, setAltContext] = useState<{comboId: string; ingredientId: string; ingredientName: string} | null>(null);

  const alternativeMap: {[key: string]: string[]} = {
    'Spinach': ['Kale', 'Amaranth Leaves', 'Swiss Chard'],
    'Broccoli': ['Cauliflower', 'Cabbage', 'Brussels Sprouts'],
    'Carrots': ['Pumpkin', 'Sweet Potatoes', 'Butternut Squash'],
    'Green Beans': ['Snap Peas', 'Okra', 'Asparagus'],
  };

  const updateIngredientQuantity = (comboId: string, ingredientId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const combo = cartItems.find(c => c.id === comboId);
      const ing = combo?.items.find(i => i.id === ingredientId);
      setAltContext({ comboId, ingredientId, ingredientName: ing?.name || 'Item' });
      setAltSheetVisible(true);
    } else {
      updateItemQuantity(comboId, ingredientId, newQuantity);
    }
  };

  const removeIngredient = (comboId: string, ingredientId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from the combo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            removeItemFromCombo(comboId, ingredientId);
          }
        }
      ]
    );
  };

  const removeItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            // Removing an entire combo not handled via context yet; keep count in sync
            setCartCount(prev => Math.max(0, prev - 1));
          }
        }
      ]
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Calculate combo price
      const comboPrice = item.price * item.quantity;
      
      // Calculate ingredient prices
      const ingredientPrice = item.items.reduce((ingredientTotal, ingredient) => {
        return ingredientTotal + (ingredient.price * ingredient.quantity);
      }, 0);
      
      return total + comboPrice + ingredientPrice;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.05; // 5% tax
    return subtotal + deliveryFee + tax;
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    Alert.alert(
      'Proceed to Checkout',
      `Total: ₹${calculateTotal().toFixed(0)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Checkout', 
          onPress: () => {
            // Navigate to HomeScreen
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.headerRight}>
          <Text style={styles.itemCount}>{getTotalItems()} items</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Icon name="cart-outline" size={80} color="#d1d5db" />
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtitle}>Add some fresh ingredients to get started</Text>
            <TouchableOpacity 
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate('Shop')}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items */}
            <View style={styles.cartItems}>
              {cartItems.map((combo) => (
                <View key={combo.id} style={styles.comboCard}>
                  {/* Combo Header */}
                  <View style={styles.comboHeader}>
                    <Image source={{ uri: combo.image }} style={styles.comboImage} />
                    
                    <View style={styles.comboInfo}>
                      <Text style={styles.comboName}>{combo.name}</Text>
                      <Text style={styles.comboTagline}>{combo.tagline}</Text>
                      <Text style={styles.comboPrice}>₹{combo.price}</Text>
                    </View>

                    <View style={styles.comboActions}>
                      <View style={styles.quantityControls}>
                        <Text style={styles.quantityText}>{combo.quantity}</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.removeBtn}
                        onPress={() => removeItem(combo.id)}
                      >
                        <Icon name="trash-can-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Items List */}
                  <View style={styles.ingredientsList}>
                    <Text style={styles.ingredientsTitle}>Items ({combo.items.length})</Text>
                    {combo.items.map((ingredient) => (
                      <View key={ingredient.id} style={styles.ingredientItem}>
                        {ingredient.image ? (
                          <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
                        ) : (
                          <View style={[styles.ingredientImage, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }]}>
                            <Icon name="food-apple" size={18} color="#94a3b8" />
                          </View>
                        )}
                        
                        <View style={styles.ingredientInfo}>
                          <Text style={styles.ingredientName}>{ingredient.name}</Text>
                          <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                          <Text style={styles.ingredientPrice}>
                            ₹{ingredient.price}/{ingredient.unit} × {ingredient.quantity} = ₹{ingredient.price * ingredient.quantity}
                          </Text>
                        </View>

                        <View style={styles.ingredientActions}>
                        <TouchableOpacity 
                            style={styles.ingredientRemoveBtn}
                            onPress={() => removeIngredient(combo.id, ingredient.id)}
                          >
                            <Icon name="trash-can-outline" size={14} color="#ef4444" />
                          </TouchableOpacity>
                          <View style={styles.ingredientQuantityControls}>
                            <TouchableOpacity 
                              style={styles.ingredientQuantityBtn}
                              onPress={() => updateIngredientQuantity(combo.id, ingredient.id, ingredient.quantity - 1)}
                            >
                              <Icon name="minus" size={14} color="#ef4444" />
                            </TouchableOpacity>
                            <Text style={styles.ingredientQuantityText}>{ingredient.quantity}</Text>
                            <TouchableOpacity 
                              style={styles.ingredientQuantityBtn}
                              onPress={() => updateIngredientQuantity(combo.id, ingredient.id, ingredient.quantity + 1)}
                            >
                              <Icon name="plus" size={14} color="#22c55e" />
                            </TouchableOpacity>
                          </View>                          
                          
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary */}
            <View style={styles.orderSummary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{calculateSubtotal()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  {calculateSubtotal() > 500 ? 'Free' : '₹50'}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (5%)</Text>
                <Text style={styles.summaryValue}>₹{(calculateSubtotal() * 0.05).toFixed(0)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{calculateTotal().toFixed(0)}</Text>
              </View>
            </View>

            {/* Delivery Info */}
            <View style={styles.deliveryInfo}>
              <Icon name="truck-delivery" size={20} color="#22c55e" />
              <View style={styles.deliveryText}>
                <Text style={styles.deliveryTitle}>Free delivery on orders above ₹500</Text>
                <Text style={styles.deliverySubtitle}>Estimated delivery: Today, 60 minutes</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutAmount}>₹{calculateTotal().toFixed(0)}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={altSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAltSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.altBottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Choose an alternative</Text>
              <TouchableOpacity onPress={() => setAltSheetVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.bottomSheetSubtitle}>
              Replace {altContext?.ingredientName} with one of these similar items
            </Text>
            <ScrollView style={styles.alternativesList}>
              {(alternativeMap[altContext?.ingredientName || ''] || ['Similar Item A','Similar Item B','Similar Item C']).map((name, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.alternativeItem}
                  onPress={() => {
                    if (!altContext) return;
                    const { comboId, ingredientId } = altContext;
                    // Replace via context not implemented for rename; fallback to quantity reset only
                    updateItemQuantity(comboId, ingredientId, 1);
                    setAltSheetVisible(false);
                  }}
                >
                  <View style={styles.altInfo}>
                    <Text style={styles.altName}>{name}</Text>
                    <Text style={styles.altMeta}>Similar nutrients</Text>
                  </View>
                  <Icon name="arrow-right" size={20} color="#22c55e" />
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  headerRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  itemCount: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  body: {
    paddingBottom: 100,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  emptyCartSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  shopNowBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  shopNowText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cartItems: {
    padding: 16,
  },
  comboCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  comboHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  comboImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  comboTagline: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  comboPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22c55e',
    letterSpacing: -0.2,
  },
  comboActions: {
    alignItems: 'center',
    gap: 8,
  },
  ingredientsList: {
    padding: 20,
    backgroundColor: '#fafbfc',
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  ingredientImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  ingredientAmount: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  ingredientBenefit: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 16,
    fontWeight: '400',
  },
  ingredientActions: {
    alignItems: 'center',
    gap: 8,
  },
  ingredientQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  ingredientQuantityBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  ingredientQuantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    minWidth: 20,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  ingredientRemoveBtn: {
    padding: 6,
  },
  ingredientPrice: {
    fontSize: 13,
    color: '#22c55e',
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: -0.1,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  quantityBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  removeBtn: {
    padding: 8,
  },
  orderSummary: {
    backgroundColor: '#ffffff',
    margin: 16,
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
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.1,
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    marginTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22c55e',
    letterSpacing: -0.3,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#dcfce7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  deliveryText: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  deliverySubtitle: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtn: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  checkoutAmount: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  altBottomSheet: {
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
    marginBottom: 10,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 8,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  alternativesList: {
    paddingHorizontal: 20,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    gap: 12,
  },
  altInfo: {
    flex: 1,
  },
  altName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  altMeta: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default CartScreen;
