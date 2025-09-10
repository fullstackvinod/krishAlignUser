import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {useTranslation} from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import i18n from '../utils/i18n';

type RootStackParamList = {
  Language: undefined;
  PhoneNumber: undefined;
};

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'kn', label: 'Kannada' },
];

const LanguageScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Language'>>();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    navigation.navigate('PhoneNumber');
  };

  return (
    <View style={styles.container}>
      <Text>{t('sendOTP')}</Text>
      <Text style={styles.title}>Select Language</Text>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={styles.button}
          onPress={() => handleLanguageSelect(lang.code)}
        >
          <Text style={styles.buttonText}>{lang.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginVertical: 8,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LanguageScreen; 