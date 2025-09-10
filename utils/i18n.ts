import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      otpLogin: 'OTP-Based Login',
      enterMobile: 'Enter Mobile Number',
      sendOTP: 'Send OTP',
    },
  },
  hi: {
    translation: {
      otpLogin: 'ओटीपी-आधारित लॉगिन',
      enterMobile: 'मोबाइल नंबर दर्ज करें',
      sendOTP: 'ओटीपी भेजें',
    },
  },
  ta: {
    translation: {
      otpLogin: 'OTP அடிப்படையிலான உள்நுழைவு',
      enterMobile: 'மொபைல் எண்ணை உள்ளிடவும்',
      sendOTP: 'OTP அனுப்பு',
    },
  },
  te: {
    translation: {
      otpLogin: 'OTP ఆధారిత లాగిన్',
      enterMobile: 'మొబైల్ నంబర్ నమోదు చేయండి',
      sendOTP: 'OTP పంపండి',
    },
  },
  kn: {
    translation: {
      otpLogin: 'OTP ಆಧಾರಿತ ಲಾಗಿನ್',
      enterMobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      sendOTP: 'OTP ಕಳುಹಿಸಿ',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 