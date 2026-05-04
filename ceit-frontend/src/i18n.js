import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Login": "Login",
      "Register": "Register",
      "Upload Project": "Upload Project",
      "Search projects": "Search projects...",
      "Latest": "Latest",
      "Top Rated": "Top Rated",
      "Views": "views"
    }
  },
  lo: {
    translation: {
      "Home": "ໜ້າຫຼັກ",
      "Login": "ເຂົ້າສູ່ລະບົບ",
      "Register": "ລົງທະບຽນ",
      "Upload Project": "ອັບໂຫຼດໂຄງການ",
      "Search projects": "ຄົ້ນຫາໂຄງການ...",
      "Latest": "ຫຼ້າສຸດ",
      "Top Rated": "ຄະແນນສູງສຸດ",
      "Views": "ຍອດເຂົ້າຊົມ"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", 
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;