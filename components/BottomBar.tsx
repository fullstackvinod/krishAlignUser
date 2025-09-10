import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { RootStackParamList } from '../types/navigation';

type TabKey = 'Home' | 'Shop' | 'Orders' | 'Profile';

interface BottomBarProps {
  active: TabKey;
  ordersCount?: number;
  cartCount?: number;
}

const TAB_ICON: Record<TabKey, string> = {
  Home: 'home-outline',
  Shop: 'shopping-outline',
  Orders: 'clipboard-list-outline',
  Profile: 'account-outline',
};

const ACTIVE_COLOR = '#22c55e';
const INACTIVE_COLOR = '#64748b';

const BottomBar: React.FC<BottomBarProps> = ({ 
  active, 
  ordersCount = 0,
  cartCount = 0
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const tabs: Array<{ 
    key: TabKey; 
    label: string; 
    badge?: number; 
    route: keyof RootStackParamList;
    icon: string;
  }> = [
    { 
      key: 'Home', 
      label: 'Home', 
      route: 'Home', 
      icon: 'home-outline' 
    },
    { 
      key: 'Shop', 
      label: 'Shop', 
      route: 'Shop', 
      icon: 'shopping-outline' 
    },
    { 
      key: 'Orders', 
      label: 'Orders', 
      badge: ordersCount, 
      route: 'Orders', 
      icon: 'clipboard-list-outline' 
    },
    { 
      key: 'Profile', 
      label: 'Profile', 
      route: 'Profile', 
      icon: 'account-outline' 
    },
  ];

  const handlePress = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      {/* Left Side Tabs */}
      <View style={styles.leftTabs}>
        {tabs.slice(0, 2).map(tab => {
          const isActive = active === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => handlePress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  name={tab.icon}
                  size={24}
                  color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text 
                style={[
                  styles.tabLabel, 
                  { 
                    color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                    fontWeight: isActive ? '700' : '500'
                  }
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Center Cart Button */}
      <View style={styles.centerSection}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleCartPress}
          activeOpacity={0.8}
        >
          <View style={styles.cartIconWrapper}>
            <Icon name="cart" size={24} color="#ffffff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Right Side Tabs */}
      <View style={styles.rightTabs}>
        {tabs.slice(2).map(tab => {
          const isActive = active === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => handlePress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  name={tab.icon}
                  size={24}
                  color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text 
                style={[
                  styles.tabLabel, 
                  { 
                    color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                    fontWeight: isActive ? '700' : '500'
                  }
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 12,
    paddingBottom: 20,
    height: 80,
  },
  leftTabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  rightTabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 80,
    height: '100%',
  },
  cartButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#ffffff',
    marginTop: -12,
  },
  cartIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 3,
    position: 'relative',
    height: '100%',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
});

export default BottomBar;