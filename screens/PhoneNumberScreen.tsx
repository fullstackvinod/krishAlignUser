import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';

type RootStackParamList = {
  Language: undefined;
  PhoneNumber: undefined;
  ProfileSetup: undefined;
};

const PhoneNumberScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PhoneNumber'>>();
  const [phone, setPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setShowOTP(true);
      // Focus first OTP input after showing
      requestAnimationFrame(() => inputRefs.current[0]?.focus());
    }
  };

  const handleOTPChange = (value: string, idx: number) => {
    const sanitized = value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOTP = [...otp];
    newOTP[idx] = sanitized;
    setOTP(newOTP);

    if (sanitized && idx < newOTP.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }

    const code = newOTP.join('');
    if (code.length === newOTP.length) {
      // Simulate submit success and navigate
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('otpLogin')}</Text>
      {!showOTP ? (
        <>
          <TextInput
            style={globalStyles.input}
            placeholder={t('enterMobile')}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
          <TouchableOpacity style={globalStyles.button} onPress={handleSendOTP}>
            <Text style={globalStyles.buttonText}>{t('sendOTP')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.otpContainer}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(val) => handleOTPChange(val, idx)}
              autoFocus={idx === 0}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  if (otp[idx] === '' && idx > 0) {
                    inputRefs.current[idx - 1]?.focus();
                    const prev = [...otp];
                    prev[idx - 1] = '';
                    setOTP(prev);
                  }
                }
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  otpBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8356',
    marginHorizontal: 6,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#fff',
  },
});

export default PhoneNumberScreen; 