import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  PhoneCall,
  Sparkles,
  Coins,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { getSafeImage } from '../utils/image';

// Complete 64 Districts of Bangladesh with Divisions & Coordinates
export const BD_DISTRICTS = [
  // Dhaka Division
  { name: 'Dhaka', bn: 'ঢাকা', division: 'Dhaka', lat: 23.8103, lng: 90.4125, zone: 'inside_dhaka' },
  { name: 'Gazipur', bn: 'গাজীপুর', division: 'Dhaka', lat: 24.0023, lng: 90.4267, zone: 'outside_dhaka' },
  { name: 'Narayanganj', bn: 'নারায়ণগঞ্জ', division: 'Dhaka', lat: 23.6238, lng: 90.5000, zone: 'outside_dhaka' },
  { name: 'Tangail', bn: 'টাঙ্গাইল', division: 'Dhaka', lat: 24.2513, lng: 89.9167, zone: 'outside_dhaka' },
  { name: 'Narsingdi', bn: 'নরসিংদী', division: 'Dhaka', lat: 23.9322, lng: 90.7154, zone: 'outside_dhaka' },
  { name: 'Faridpur', bn: 'ফরিদপুর', division: 'Dhaka', lat: 23.6071, lng: 89.8429, zone: 'outside_dhaka' },
  { name: 'Manikganj', bn: 'মানিকগঞ্জ', division: 'Dhaka', lat: 23.8644, lng: 90.0047, zone: 'outside_dhaka' },
  { name: 'Munshiganj', bn: 'মুন্সীগঞ্জ', division: 'Dhaka', lat: 23.5422, lng: 90.5305, zone: 'outside_dhaka' },
  { name: 'Gopalganj', bn: 'গোপালগঞ্জ', division: 'Dhaka', lat: 23.0051, lng: 89.8266, zone: 'outside_dhaka' },
  { name: 'Madaripur', bn: 'মাদারীপুর', division: 'Dhaka', lat: 23.1641, lng: 90.1897, zone: 'outside_dhaka' },
  { name: 'Rajbari', bn: 'রাজবাড়ী', division: 'Dhaka', lat: 23.7574, lng: 89.6445, zone: 'outside_dhaka' },
  { name: 'Shariatpur', bn: 'শরীয়তপুর', division: 'Dhaka', lat: 23.2423, lng: 90.4348, zone: 'outside_dhaka' },
  { name: 'Kishoreganj', bn: 'কিশোরগঞ্জ', division: 'Dhaka', lat: 24.4449, lng: 90.7766, zone: 'outside_dhaka' },

  // Chattogram Division
  { name: 'Chattogram', bn: 'চট্টগ্রাম', division: 'Chattogram', lat: 22.3569, lng: 91.7832, zone: 'outside_dhaka' },
  { name: "Cox's Bazar", bn: 'কক্সবাজার', division: 'Chattogram', lat: 21.4272, lng: 92.0058, zone: 'outside_dhaka' },
  { name: 'Cumilla', bn: 'কুমিল্লা', division: 'Chattogram', lat: 23.4682, lng: 91.1788, zone: 'outside_dhaka' },
  { name: 'Feni', bn: 'ফেনী', division: 'Chattogram', lat: 23.0186, lng: 91.3966, zone: 'outside_dhaka' },
  { name: 'Noakhali', bn: 'নোয়াখালী', division: 'Chattogram', lat: 22.8696, lng: 91.0994, zone: 'outside_dhaka' },
  { name: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', lat: 23.9571, lng: 91.1115, zone: 'outside_dhaka' },
  { name: 'Chandpur', bn: 'চাঁদপুর', division: 'Chattogram', lat: 23.2333, lng: 90.6667, zone: 'outside_dhaka' },
  { name: 'Lakshmipur', bn: 'লক্ষ্মীপুর', division: 'Chattogram', lat: 22.9425, lng: 90.8412, zone: 'outside_dhaka' },
  { name: 'Rangamati', bn: 'রাঙ্গামাটি', division: 'Chattogram', lat: 22.7324, lng: 92.2985, zone: 'outside_dhaka' },
  { name: 'Bandarban', bn: 'বান্দরবান', division: 'Chattogram', lat: 22.1953, lng: 92.2184, zone: 'outside_dhaka' },
  { name: 'Khagrachhari', bn: 'খাগড়াছড়ি', division: 'Chattogram', lat: 23.1193, lng: 91.9847, zone: 'outside_dhaka' },

  // Sylhet Division
  { name: 'Sylhet', bn: 'সিলেট', division: 'Sylhet', lat: 24.8949, lng: 91.8687, zone: 'outside_dhaka' },
  { name: 'Moulvibazar', bn: 'মৌলভীবাজার', division: 'Sylhet', lat: 24.4829, lng: 91.7774, zone: 'outside_dhaka' },
  { name: 'Habiganj', bn: 'হবিগঞ্জ', division: 'Sylhet', lat: 24.3749, lng: 91.4155, zone: 'outside_dhaka' },
  { name: 'Sunamganj', bn: 'সুনামগঞ্জ', division: 'Sylhet', lat: 25.0658, lng: 91.3950, zone: 'outside_dhaka' },

  // Rajshahi Division
  { name: 'Rajshahi', bn: 'রাজশাহী', division: 'Rajshahi', lat: 24.3745, lng: 88.6042, zone: 'outside_dhaka' },
  { name: 'Bogura', bn: 'বগুড়া', division: 'Rajshahi', lat: 24.8465, lng: 89.3777, zone: 'outside_dhaka' },
  { name: 'Pabna', bn: 'পাবনা', division: 'Rajshahi', lat: 24.0064, lng: 89.2372, zone: 'outside_dhaka' },
  { name: 'Sirajganj', bn: 'সিরাজগঞ্জ', division: 'Rajshahi', lat: 24.4534, lng: 89.7008, zone: 'outside_dhaka' },
  { name: 'Naogaon', bn: 'নওগাঁ', division: 'Rajshahi', lat: 24.7936, lng: 88.9318, zone: 'outside_dhaka' },
  { name: 'Natore', bn: 'নাটোর', division: 'Rajshahi', lat: 24.4206, lng: 89.0003, zone: 'outside_dhaka' },
  { name: 'Chapai Nawabganj', bn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', lat: 24.5965, lng: 88.2775, zone: 'outside_dhaka' },
  { name: 'Joypurhat', bn: 'জয়পুরহাট', division: 'Rajshahi', lat: 25.1015, lng: 89.0270, zone: 'outside_dhaka' },

  // Khulna Division
  { name: 'Khulna', bn: 'খুলনা', division: 'Khulna', lat: 22.8456, lng: 89.5403, zone: 'outside_dhaka' },
  { name: 'Jashore', bn: 'যশোর', division: 'Khulna', lat: 23.1664, lng: 89.2081, zone: 'outside_dhaka' },
  { name: 'Kushtia', bn: 'কুষ্টিয়া', division: 'Khulna', lat: 23.9013, lng: 89.1205, zone: 'outside_dhaka' },
  { name: 'Satkhira', bn: 'সাতক্ষীরা', division: 'Khulna', lat: 22.7185, lng: 89.0705, zone: 'outside_dhaka' },
  { name: 'Jhenaidah', bn: 'ঝিনাইদহ', division: 'Khulna', lat: 23.5448, lng: 89.1539, zone: 'outside_dhaka' },
  { name: 'Bagerhat', bn: 'বাগেরহাট', division: 'Khulna', lat: 22.6516, lng: 89.7859, zone: 'outside_dhaka' },
  { name: 'Chuadanga', bn: 'চুয়াডাঙ্গা', division: 'Khulna', lat: 23.6402, lng: 88.8418, zone: 'outside_dhaka' },
  { name: 'Magura', bn: 'মাগুরা', division: 'Khulna', lat: 23.4873, lng: 89.4199, zone: 'outside_dhaka' },
  { name: 'Narail', bn: 'নড়াইল', division: 'Khulna', lat: 23.1725, lng: 89.5127, zone: 'outside_dhaka' },
  { name: 'Meherpur', bn: 'মেহেরপুর', division: 'Khulna', lat: 23.7622, lng: 88.6318, zone: 'outside_dhaka' },

  // Barishal Division
  { name: 'Barishal', bn: 'বরিশাল', division: 'Barishal', lat: 22.7010, lng: 90.3535, zone: 'outside_dhaka' },
  { name: 'Patuakhali', bn: 'পটুয়াখালী', division: 'Barishal', lat: 22.3596, lng: 90.3299, zone: 'outside_dhaka' },
  { name: 'Bhola', bn: 'ভোলা', division: 'Barishal', lat: 22.6859, lng: 90.6481, zone: 'outside_dhaka' },
  { name: 'Pirojpur', bn: 'পিরোজপুর', division: 'Barishal', lat: 22.5841, lng: 89.9720, zone: 'outside_dhaka' },
  { name: 'Barguna', bn: 'বরগুনা', division: 'Barishal', lat: 22.0953, lng: 90.1121, zone: 'outside_dhaka' },
  { name: 'Jhalokati', bn: 'ঝালকাঠি', division: 'Barishal', lat: 22.6406, lng: 90.1987, zone: 'outside_dhaka' },

  // Rangpur Division
  { name: 'Rangpur', bn: 'রংপুর', division: 'Rangpur', lat: 25.7439, lng: 89.2752, zone: 'outside_dhaka' },
  { name: 'Dinajpur', bn: 'দিনাজপুর', division: 'Rangpur', lat: 25.6217, lng: 88.6355, zone: 'outside_dhaka' },
  { name: 'Gaibandha', bn: 'গাইবান্ধা', division: 'Rangpur', lat: 25.3288, lng: 89.5403, zone: 'outside_dhaka' },
  { name: 'Kurigram', bn: 'কুড়িগ্রাম', division: 'Rangpur', lat: 25.8054, lng: 89.6362, zone: 'outside_dhaka' },
  { name: 'Nilphamari', bn: 'নীলফামারী', division: 'Rangpur', lat: 25.9318, lng: 88.8560, zone: 'outside_dhaka' },
  { name: 'Thakurgaon', bn: 'ঠাকুরগাঁও', division: 'Rangpur', lat: 26.0337, lng: 88.4617, zone: 'outside_dhaka' },
  { name: 'Panchagarh', bn: 'পঞ্চগড়', division: 'Rangpur', lat: 26.3411, lng: 88.5542, zone: 'outside_dhaka' },
  { name: 'Lalmonirhat', bn: 'লালমনিরহাট', division: 'Rangpur', lat: 25.9923, lng: 89.2847, zone: 'outside_dhaka' },

  // Mymensingh Division
  { name: 'Mymensingh', bn: 'ময়মনসিংহ', division: 'Mymensingh', lat: 24.7471, lng: 90.4203, zone: 'outside_dhaka' },
  { name: 'Jamalpur', bn: 'জামালপুর', division: 'Mymensingh', lat: 24.9375, lng: 89.9378, zone: 'outside_dhaka' },
  { name: 'Netrokona', bn: 'নেত্রকোণা', division: 'Mymensingh', lat: 24.8709, lng: 90.7279, zone: 'outside_dhaka' },
  { name: 'Sherpur', bn: 'শেরপুর', division: 'Mymensingh', lat: 25.0205, lng: 90.0153, zone: 'outside_dhaka' },
];

// Comprehensive Thanas / Upazilas Dictionary for 64 Districts of Bangladesh
export const BD_THANAS: Record<string, { en: string[]; bn: string[] }> = {
  Dhaka: {
    en: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Motijheel', 'Badda', 'Khilgaon', 'Savar', 'Keraniganj', 'Dhamrai', 'Tejgaon', 'Paltan', 'Rampura', 'Malibagh', 'Jatrabari', 'Lalbagh', 'Shahbagh', 'Cantonment', 'Khilkhet', 'Basundhara R/A', 'Hazaribagh', 'Wari', 'Kamrangirchar'],
    bn: ['ধানমন্ডি', 'গুলশান', 'বনানী', 'উত্তরা', 'মিরপুর', 'মোহাম্মদপুর', 'মতিঝিল', 'বাড্ডা', 'খিলগাঁও', 'সাভার', 'কেরানীগঞ্জ', 'ধামরাই', 'তেজগাঁও', 'পল্টন', 'রামপুরা', 'মালিবাগ', 'যাত্রাবাড়ী', 'লালবাগ', 'শাহবাগ', 'ক্যান্টনমেন্ট', 'খিলক্ষেত', 'বসুন্ধরা আ/এ', 'হাজারীবাগ', 'ওয়ারী', 'কামরাঙ্গীরচর']
  },
  Gazipur: {
    en: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
    bn: ['গাজীপুর সদর', 'টঙ্গী', 'কালিয়াকৈর', 'কাপাসিয়া', 'শ্রীপুর', 'কালীগঞ্জ']
  },
  Narayanganj: {
    en: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar', 'Siddhirganj', 'Fatullah'],
    bn: ['নারায়ণগঞ্জ সদর', 'বন্দর', 'রূপগঞ্জ', 'সোনারগাঁও', 'আড়াইহাজার', 'সিদ্ধিরগঞ্জ', 'ফতুল্লা']
  },
  Tangail: {
    en: ['Tangail Sadar', 'Mirzapur', 'Madhupur', 'Ghatail', 'Kalihati', 'Sakhipur', 'Bhuapur', 'Gopalpur', 'Delduar', 'Nagarpur', 'Dhanbari', 'Basail'],
    bn: ['টাঙ্গাইল সদর', 'মির্জাপুর', 'মধুপুর', 'ঘাটাইল', 'কালিহাতী', 'সখিপুর', 'ভূঞাপুর', 'গোপালপুর', 'দেলদুয়ার', 'নাগরপুর', 'ধনবাড়ী', 'বাসাইল']
  },
  Narsingdi: {
    en: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Monohardi', 'Belabo', 'Raipura'],
    bn: ['নরসিংদী সদর', 'পলাশ', 'শিবপুর', 'মনোহরদী', 'বেলাবো', 'রায়পুরা']
  },
  Chattogram: {
    en: ['Kotwali', 'Panchlaish', 'Pahartali', 'Double Mooring', 'Halishahar', 'Khulshi', 'Bayezid', 'Patenga', 'Bakalia', 'Chandgaon', 'Hathazari', 'Sitakunda', 'Mirsharai', 'Patiya', 'Raozan', 'Rangunia', 'Anwara', 'Boalkhali', 'Banshkhali', 'Fatikchhari', 'Lohagara', 'Sandwip'],
    bn: ['কোতোয়ালী', 'পাঁচলাইশ', 'পাহাড়তলী', 'ডবলমুরিং', 'হালিশহর', 'খুলশী', 'বায়েজিদ', 'পতেঙ্গা', 'বাকলিয়া', 'চান্দগাঁও', 'হাটহাজারী', 'সীতাকুণ্ড', 'মীরসরাই', 'পটিয়া', 'রাউজান', 'রাঙ্গুনিয়া', 'আনোয়ারা', 'বোয়ালখালী', 'বাঁশখালী', 'ফটিকছড়ি', 'লোহাগাড়া', 'সন্দ্বীপ']
  },
  "Cox's Bazar": {
    en: ["Cox's Bazar Sadar", 'Ramu', 'Chakaria', 'Teknaf', 'Ukhia', 'Pekua', 'Kutubdia', 'Maheshkhali'],
    bn: ['কক্সবাজার সদর', 'রামু', 'চকরিয়া', 'টেকনাফ', 'উখিয়া', 'পেকুয়া', 'কুতুবদিয়া', 'মহেশখালী']
  },
  Cumilla: {
    en: ['Cumilla Adarsha Sadar', 'Cumilla Sadar Dakshin', 'Laksam', 'Debidwar', 'Burichang', 'Brahmanpara', 'Chandina', 'Chauddagram', 'Daudkandi', 'Homna', 'Muradnagar', 'Barura', 'Meghna', 'Titas', 'Monohargonj', 'Lalmai'],
    bn: ['কুমিল্লা আদর্শ সদর', 'কুমিল্লা সদর দক্ষিণ', 'লাকসাম', 'দেবীদ্বার', 'বুড়িচং', 'ব্রাহ্মণপাড়া', 'চান্দিনা', 'চৌদ্দগ্রাম', 'দাউদকান্দি', 'হোমনা', 'মুরাদনগর', 'বরুড়া', 'মেঘনা', 'তিতাস', 'মনোহরগঞ্জ', 'লালমাই']
  },
  Sylhet: {
    en: ['Sylhet Sadar', 'Kotwali', 'South Surma', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Kanaighat', 'Jaintiapur', 'Gowainghat', 'Companiganj', 'Balaganj', 'Fenchuganj', 'Osmani Nagar'],
    bn: ['সিলেট সদর', 'কোতোয়ালী', 'দক্ষিণ সুরমা', 'বিয়ানীবাজার', 'গোলাপগঞ্জ', 'জকিগঞ্জ', 'কানাইঘাট', 'জৈন্তাপুর', 'গোয়াইনঘাট', 'কোম্পানীগঞ্জ', 'বালাগঞ্জ', 'ফেঞ্চুগঞ্জ', 'ওসমানী নগর']
  },
  Rajshahi: {
    en: ['Boalia', 'Rajpara', 'Motihar', 'Shah Makhdum', 'Paba', 'Godagari', 'Tanore', 'Mohanpur', 'Bagmara', 'Durgapur', 'Puthia', 'Charghat', 'Bagha'],
    bn: ['বোয়ালিয়া', 'রাজপাড়া', 'মতিহার', 'শাহ মখদুম', 'পবা', 'গোদাগাড়ী', 'তানোর', 'মোহনপুর', 'বাগমারা', 'দুর্গাপুর', 'পুঠিয়া', 'চারঘাট', 'বাঘা']
  },
  Bogura: {
    en: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Kahaloo', 'Nandigram', 'Dhunat', 'Sariakandi', 'Sonatala', 'Adamdighi', 'Dupchanchia'],
    bn: ['বগুড়া সদর', 'শাজাহানপুর', 'শেরপুর', 'শিবগঞ্জ', 'গাবতলী', 'কাহালু', 'নন্দীগ্রাম', 'ধুনট', 'সারিয়াকান্দি', 'সোনাতলা', 'আদমদীঘি', 'দুপচাঁচিয়া']
  },
  Khulna: {
    en: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsha', 'Terokhada'],
    bn: ['খুলনা সদর', 'সোনাডাঙ্গা', 'খালিশপুর', 'দৌলতপুর', 'খান জাহান আলী', 'বটিয়াঘাটা', 'দাকোপ', 'ডুমুরিয়া', 'দিঘলিয়া', 'কয়রা', 'পাইকগাছা', 'ফুলতলা', 'রূপসা', 'তেরখাদা']
  },
  Barishal: {
    en: ['Barishal Sadar', 'Kotwali', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Hizla'],
    bn: ['বরিশাল সদর', 'কোতোয়ালী', 'বাকেরগঞ্জ', 'বাবুগঞ্জ', 'উজিরপুর', 'বানারীপাড়া', 'গৌরনদী', 'আগৈলঝাড়া', 'মেহেন্দিগঞ্জ', 'মুলাদী', 'হিজলা']
  },
  Rangpur: {
    en: ['Rangpur Sadar', 'Kotwali', 'Gangachhara', 'Taraganj', 'Badarganj', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Kaunia'],
    bn: ['রংপুর সদর', 'কোতোয়ালী', 'গঙ্গাচড়া', 'তারাগঞ্জ', 'বদরগঞ্জ', 'মিঠাপুকুর', 'পীরগাছা', 'পীরগঞ্জ', 'কাউনিয়া']
  },
  Mymensingh: {
    en: ['Mymensingh Sadar', 'Kotwali', 'Muktagachha', 'Trishal', 'Fulbaria', 'Gafargaon', 'Bhaluka', 'Ishwarganj', 'Nandail', 'Gouripur', 'Haluaghat', 'Dhobaura', 'Tara Khanda'],
    bn: ['ময়মনসিংহ সদর', 'কোতোয়ালী', 'মুক্তাগাছা', 'ত্রিশাল', 'ফুলবাড়িয়া', 'গফরগাঁও', 'ভালুকা', 'ঈশ্বরগঞ্জ', 'নান্দাইল', 'গৌরীপুর', 'হালুয়াঘাট', 'ধোবাউড়া', 'তারাখন্দা']
  },
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const {
    items,
    getSubTotal,
    getDeliveryFee,
    getTotal,
    deliveryZone,
    setDeliveryZone,
    couponCode,
    discount,
    clearCart,
  } = useCartStore();
  const { user } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.addresses?.find((a: any) => a.isDefault)?.street || '');
  const [selectedDistrict, setSelectedDistrict] = useState(BD_DISTRICTS[0]);
  const [thana, setThana] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'upay' | 'rocket' | 'sslcommerz'>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [useCoins, setUseCoins] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>({
    lat: BD_DISTRICTS[0].lat,
    lng: BD_DISTRICTS[0].lng,
  });
  const [isLocating, setIsLocating] = useState(false);

  const [allowManualMfs, setAllowManualMfs] = useState(false);
  const [merchantNumber, setMerchantNumber] = useState('01942791004');

  useEffect(() => {
    api.get('/settings/public')
      .then((res) => {
        if (res.data?.success && res.data?.settings) {
          const allowed = res.data.settings.allowManualMfsPayment === true;
          setAllowManualMfs(allowed);
          if (!allowed && ['bkash', 'nagad', 'upay', 'rocket'].includes(paymentMethod)) {
            setPaymentMethod('cod');
          }
          if (res.data.settings.merchantBkashNumber) {
            setMerchantNumber(res.data.settings.merchantBkashNumber);
          }
        }
      })
      .catch(() => {});
  }, []);

  const copyMerchantNumber = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  // GPS Auto-Detect Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'bn' ? 'আপনার ব্রাউজারে লোকেশন সার্ভিস সমর্থিত নয়।' : 'Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoLocation({ lat: latitude, lng: longitude });

        // Calculate nearest district
        let nearest = BD_DISTRICTS[0];
        let minDist = 999999;
        BD_DISTRICTS.forEach((d) => {
          const dist = Math.hypot(d.lat - latitude, d.lng - longitude);
          if (dist < minDist) {
            minDist = dist;
            nearest = d;
          }
        });

        setSelectedDistrict(nearest);
        setDeliveryZone(nearest.zone as any);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert(lang === 'bn' ? 'লোকেশন অনুমতি পাওয়া যায়নি। ড্রপডাউন থেকে আপনার জেলা নির্বাচন করুন।' : 'Location permission denied. Please select your district from the dropdown.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleDistrictChange = (districtName: string) => {
    const dist = BD_DISTRICTS.find((d) => d.name === districtName) || BD_DISTRICTS[0];
    setSelectedDistrict(dist);
    setDeliveryZone(dist.zone as any);
    setGeoLocation({ lat: dist.lat, lng: dist.lng });
  };

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!phone) setPhone(user.phone || '');
      if (!email) setEmail(user.email || '');
      const defaultAddr = user.addresses?.find((a: any) => a.isDefault)?.street;
      if (defaultAddr && !address) setAddress(defaultAddr);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">
          {lang === 'bn' ? 'আপনার শপিং কার্ট খালি রয়েছে' : 'Your Shopping Cart is Empty'}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          {lang === 'bn' ? 'অর্ডার করার জন্য প্রথমে আপনার পছন্দের পণ্য কার্টে যুক্ত করুন।' : 'Add your desired flagships, gadgets or organic foods to cart first.'}
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-md transition"
        >
          {lang === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping Now'}
        </button>
      </div>
    );
  }

  const subTotal = getSubTotal();
  const deliveryFee = getDeliveryFee();
  const baseTotal = getTotal();

  const userCoins = user?.loyaltyCoins || 0;
  const coinsToUse = Math.min(userCoins, 250);
  const coinsDiscount = useCoins && userCoins >= 10 ? Math.min(25, Math.floor(coinsToUse / 10)) : 0;
  const payableTotal = Math.max(0, baseTotal - coinsDiscount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert(lang === 'bn' ? 'অর্ডার সম্পন্ন করতে প্রথমে আপনার অ্যাকাউন্টে লগইন বা সাইন আপ করুন।' : 'Please login or sign up to your account to place an order.');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে নাম, ফোন নম্বর এবং সম্পূর্ণ ঠিকানা পূরণ করুন।' : 'Please fill in your full name, phone number, and delivery address.');
      return;
    }

    const isMobileBanking = ['bkash', 'nagad', 'upay', 'rocket'].includes(paymentMethod);
    if (isMobileBanking && (!senderNumber.trim() || !transactionId.trim())) {
      alert(lang === 'bn' ? `অনুগ্রহ করে ${paymentMethod.toUpperCase()} সেন্ড মানি করার পর যে নম্বর থেকে টাকা পাঠিয়েছেন এবং TrxID (ট্রানজেকশন আইডি) লিখুন।` : `Please enter the sender phone number and TrxID for ${paymentMethod.toUpperCase()} payment.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        customerInfo: {
          name: name.trim(),
          phone: phone.trim(),
          altPhone: altPhone.trim() || undefined,
          email: email.trim() || undefined,
          address: address.trim(),
          city: selectedDistrict.name,
          district: selectedDistrict.name,
          division: selectedDistrict.division,
          thana: thana.trim() || selectedDistrict.name,
          deliveryZone,
          geoLocation: {
            lat: geoLocation?.lat || selectedDistrict.lat,
            lng: geoLocation?.lng || selectedDistrict.lng,
            address: `${address.trim()}, ${selectedDistrict.name}`,
          },
        },
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
          variant: i.selectedVariant,
        })),
        paymentMethod,
        senderNumber: senderNumber.trim() || undefined,
        transactionId: transactionId.trim() || undefined,
        couponCode: couponCode || undefined,
        coinsUsed: useCoins ? coinsToUse : 0,
        notes: notes.trim() || undefined,
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        const order = res.data.data;
        clearCart();

        if (paymentMethod === 'sslcommerz') {
          try {
            const payRes = await api.post('/payment/sslcommerz/init', { orderId: order.orderId });
            if (payRes.data.success && payRes.data.gatewayUrl) {
              window.location.href = payRes.data.gatewayUrl;
              return;
            } else {
              alert(payRes.data?.message || (lang === 'bn' ? 'অনলাইন পেমেন্ট গেটওয়েতে সংযোগ করতে ব্যর্থ হয়েছে।' : 'Failed to connect to online payment gateway.'));
            }
          } catch (payErr: any) {
            alert(payErr.response?.data?.message || (lang === 'bn' ? 'পেমেন্ট গেটওয়ে সংযোগে ত্রুটি হয়েছে।' : 'Payment gateway connection error.'));
          }
        }

        navigate(`/order-success?orderId=${order.orderId}&status=confirmed`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (lang === 'bn' ? 'অর্ডার প্রক্রিয়াধীন করতে সমস্যা হয়েছে।' : 'Failed to place order. Please try again.');
      alert(msg);
      if (err.response?.status === 400 && (msg.includes('পণ্য') || msg.includes('কার্ট') || msg.includes('Product') || msg.includes('Cart'))) {
        const shouldClear = window.confirm(
          lang === 'bn'
            ? 'আপনার কার্টে পুরনো বা মেয়াদোত্তীর্ণ পণ্য রয়েছে। আপনি কি কার্টটি রিসেট করতে চান?'
            : 'Your cart contains outdated items. Would you like to reset your cart?'
        );
        if (shouldClear) {
          clearCart();
          navigate('/products');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lang === 'bn' ? 'নিরাপদ ও দ্রুত চেকআউট' : 'Secure & Fast Checkout'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'bn' ? '৬৪ জেলায় ক্যাশ অন ডেলিভারি ও ভেরিফাইড মোবাইল ব্যাংকিং সুবিধা' : 'Cash on Delivery across all 64 districts & verified Mobile Banking'}
        </p>
      </div>

      {/* Mandatory Auth Alert Banner if guest */}
      {!user && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border-2 border-amber-400 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md mb-6 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm">
              🔒
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                {lang === 'bn' ? 'অর্ডার সম্পন্ন করতে লগইন বা সাইন আপ আবশ্যক' : 'Account Login or Sign Up is Required to Order'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {lang === 'bn' ? 'আপনার ডেলিভারি হিস্ট্রি, ২০ কয়েন ক্যাশব্যাক ও লাইভ জিপিএস ট্র্যাকিং সংরক্ষণ করতে লগইন করুন।' : 'Login to secure your order, earn 20 coins cashback, and access live GPS rider tracking.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/login?redirect=/checkout"
              className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition shadow-sm"
            >
              {lang === 'bn' ? '🔑 লগইন করুন' : '🔑 Login'}
            </Link>
            <Link
              to="/register?redirect=/checkout"
              className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-sm"
            >
              {lang === 'bn' ? '✨ সাইন আপ' : '✨ Sign Up'}
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping & Location Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer & Address Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <span>{lang === 'bn' ? '১. ডেলিভারি ঠিকানা ও তথ্য' : '1. Delivery Address & Information'}</span>
              </h2>

              {/* GPS Auto-Detect Button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 transition shadow-sm"
              >
                <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? (lang === 'bn' ? 'লোকেশন ট্র্যাক হচ্ছে...' : 'Tracking GPS...') : (lang === 'bn' ? '📍 GPS অটো-লোকেশন' : '📍 Auto-Detect GPS')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'আপনার নাম' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'bn' ? 'সম্পূর্ণ নাম লিখুন' : 'Enter your full name'}
                  required
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  required
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'বিকল্প ফোন নম্বর (ঐচ্ছিক)' : 'Alternative Phone (Optional)'}
                </label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder={lang === 'bn' ? 'বিকল্প ফোন নম্বর' : 'Alternative phone number'}
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ইমেইল অ্যাড্রেস (ইনভয়েসের জন্য)' : 'Email Address (For Invoice)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none transition"
                />
              </div>
            </div>

            {/* District Selector across all 64 Districts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'জেলা নির্বাচন করুন (৬৪ জেলা)' : 'Select District (64 Districts)'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDistrict.name}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 font-bold outline-none transition"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {lang === 'bn' ? `${d.bn} (${d.division} বিভাগ)` : `${d.name} (${d.division} Div)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'থানা / উপজেলা (নির্বাচন করুন)' : 'Thana / Upazila'} <span className="text-red-500">*</span>
                </label>
                {BD_THANAS[selectedDistrict.name] ? (
                  <select
                    value={thana}
                    onChange={(e) => setThana(e.target.value)}
                    required
                    className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 font-medium outline-none transition"
                  >
                    <option value="">{lang === 'bn' ? '-- থানা / উপজেলা বাছুন --' : '-- Select Thana / Upazila --'}</option>
                    {BD_THANAS[selectedDistrict.name][lang === 'bn' ? 'bn' : 'en'].map((th, idx) => (
                      <option key={idx} value={BD_THANAS[selectedDistrict.name].en[idx]}>
                        {th}
                      </option>
                    ))}
                    <option value="other">{lang === 'bn' ? 'অন্যান্য / ম্যানুয়াল লিখুন...' : 'Other (Manual Entry)...'}</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={thana}
                    onChange={(e) => setThana(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: সদর, পৌরসভা, ইউনিয়ন' : 'e.g. Sadar, Thana, Upazila'}
                    required
                    className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none transition"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা)' : 'Full Street Address (House/Road/Area)'} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={lang === 'bn' ? 'বাড়ি নং, রোড নং, এলাকা এবং ডেলিভারির নির্দেশিকা...' : 'House number, road number, area landmarks...'}
                rows={2}
                required
                className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none transition"
              />
            </div>

            {/* Geolocation status pill */}
            {geoLocation && (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
                <Compass className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {lang === 'bn' ? 'জিপিএস স্থানাঙ্ক সংযুক্ত:' : 'GPS Coordinates Attached:'}{' '}
                  <strong className="font-mono">{geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}</strong>{' '}
                  ({selectedDistrict.zone === 'inside_dhaka' ? (lang === 'bn' ? 'ঢাকার ভেতরে ৬০ টাকা' : 'Inside Dhaka ৳60') : (lang === 'bn' ? 'ঢাকার বাইরে ১২০ টাকা' : 'Outside Dhaka ৳120')})
                </span>
              </div>
            )}
          </div>

          {/* 2. Payment Gateway Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-emerald-700" />
              <span>{lang === 'bn' ? '২. পেমেন্ট পদ্ধতি নির্বাচন করুন' : '2. Select Payment Method'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* SSLCommerz Instant Online Payment */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between col-span-1 sm:col-span-2 ${
                  paymentMethod === 'sslcommerz'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="sslcommerz"
                    checked={paymentMethod === 'sslcommerz'}
                    onChange={() => setPaymentMethod('sslcommerz')}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {lang === 'bn' ? 'অনলাইন অটো পেমেন্ট (SSLCommerz Gateway)' : 'Instant Online Payment (SSLCommerz Gateway)'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-white tracking-wide shadow-xs">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {lang === 'bn'
                        ? 'বিকাশ, নগদ, রকেট, ভিসা/মাস্টারকার্ড ও ইন্টারনেট ব্যাংকিং (স্বয়ংক্রিয় ভেরিফাইড পেমেন্ট)'
                        : 'bKash, Nagad, Rocket, Visa, Mastercard, AMEX & Net Banking automated instant payment'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 font-black text-[10px] rounded-lg border border-pink-200">bKash</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-black text-[10px] rounded-lg border border-amber-200">Nagad</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-black text-[10px] rounded-lg border border-indigo-200">Cards</span>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {lang === 'bn' ? 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন' : 'Pay in cash upon doorstep delivery'}
                    </p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-emerald-600" />
              </label>

              {/* Fraud-Proof Payment Security Badge when manual MFS is off */}
              {!allowManualMfs && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-emerald-900 leading-tight">
                    <p className="font-bold">
                      {lang === 'bn' ? '🔒 ১০০% ভেরিফাইড ও সুরক্ষিত পেমেন্ট গেটওয়ে' : '🔒 100% Verified & Fraud-Proof Escrow'}
                    </p>
                    <p className="text-emerald-700 mt-0.5">
                      {lang === 'bn'
                        ? 'ভুয়া TrxID ও প্রতারণামূলক অর্ডার প্রতিরোধে শুধুমাত্র অটোমেটিক গেটওয়ে (SSLCommerz) এবং হোম ডেলিভারি ক্যাশ অন ডেলিভারি (COD) প্রযোজ্য।'
                        : 'To eliminate fake TrxID transactions, only automated verified payment gateways (SSLCommerz) and Cash on Delivery (COD) are active.'}
                    </p>
                  </div>
                </div>
              )}

              {/* bKash / Nagad / Rocket Manual Send Money (Disabled when allowManualMfs is false) */}
              {allowManualMfs && (
                <>
                  {/* bKash Send Money */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                      paymentMethod === 'bkash'
                        ? 'border-[#e2136e] bg-[#fdf2f7] shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="bkash"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="w-4 h-4 text-[#e2136e]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {lang === 'bn' ? 'বিকাশ সেন্ড মানি' : 'bKash Send Money'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {lang === 'bn' ? 'পার্সোনাল বিকাশ থেকে সরাসরি পেমেন্ট' : 'Direct MFS Personal Transfer'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#e2136e]">bKash</span>
                  </label>

                  {/* Nagad Payment */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                      paymentMethod === 'nagad'
                        ? 'border-[#f7941d] bg-[#fef8f0] shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="nagad"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="w-4 h-4 text-[#f7941d]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {lang === 'bn' ? 'নগদ সেন্ড মানি' : 'Nagad Send Money'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {lang === 'bn' ? 'নগদ অ্যাপ বা ইউএসএসডি কোড' : 'Instant Nagad MFS transfer'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#f7941d]">Nagad</span>
                  </label>

                  {/* Rocket / Cards */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                      paymentMethod === 'rocket'
                        ? 'border-[#8c3494] bg-[#faf3fb] shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="rocket"
                        checked={paymentMethod === 'rocket'}
                        onChange={() => setPaymentMethod('rocket')}
                        className="w-4 h-4 text-[#8c3494]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {lang === 'bn' ? 'রকেট / কার্ডস' : 'Rocket / DBBL'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {lang === 'bn' ? 'ডাচ বাংলা রকেট একাউন্ট' : 'Dutch-Bangla Rocket Wallet'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#8c3494]">Rocket</span>
                  </label>
                </>
              )}
            </div>

            {/* Mobile Banking Transfer Instructions */}
            {allowManualMfs && ['bkash', 'nagad', 'upay', 'rocket'].includes(paymentMethod) && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    {lang === 'bn' ? `১. ${paymentMethod.toUpperCase()} পার্সোনাল নম্বর (Send Money):` : `1. ${paymentMethod.toUpperCase()} Personal Number (Send Money):`}
                  </span>
                  <button
                    type="button"
                    onClick={copyMerchantNumber}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg shadow-sm hover:bg-emerald-50"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'নম্বর কপি' : 'Copy Number')}</span>
                  </button>
                </div>

                <div className="text-center bg-white p-2.5 rounded-xl border border-amber-200 font-mono font-black text-lg text-slate-900 tracking-wider">
                  {merchantNumber}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন' : 'Sender Phone Number'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl p-2 text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      TrxID (ট্রানজেকশন আইডি) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 9J83KL4M"
                      required
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl p-2 text-xs font-mono uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Review (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 sticky top-28">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>{lang === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}</span>
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {items.length} {lang === 'bn' ? 'টি আইটেম' : 'Items'}
              </span>
            </h2>

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
              {items.map((item, idx) => (
                <div key={`${item.product._id}-${idx}`} className="flex items-center gap-3 pt-2">
                  <img
                    src={getSafeImage(item.product.thumbnail || item.product.images?.[0])}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {lang === 'bn' && item.product.banglaTitle ? item.product.banglaTitle : item.product.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {formatPrice(item.price)} × {item.quantity}
                      {item.selectedVariant && ` (${item.selectedVariant})`}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold font-mono text-slate-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coins Redemption Box */}
            {userCoins >= 10 && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {lang === 'bn' ? 'ShopX কয়েন রিডিম করুন' : 'Redeem ShopX Coins'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {userCoins} {lang === 'bn' ? 'কয়েন আছে' : 'coins available'} ({lang === 'bn' ? 'সর্বোচ্চ ৳২৫ ছাড়' : 'Max ৳25 off'})
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'পণ্যের মোট মূল্য (Subtotal):' : 'Item Subtotal:'}</span>
                <span className="font-mono font-bold text-slate-800">{formatPrice(subTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>{lang === 'bn' ? `ডেলিভারি চার্জ (${selectedDistrict.name}):` : `Delivery Fee (${selectedDistrict.name}):`}</span>
                <span className="font-mono font-bold text-slate-800">{formatPrice(deliveryFee)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{lang === 'bn' ? `ভাউচার ডিসকাউন্ট (${couponCode}):` : `Voucher Discount (${couponCode}):`}</span>
                  <span className="font-mono">-{formatPrice(discount)}</span>
                </div>
              )}

              {coinsDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'bn' ? `কয়েন ডিসকাউন্ট (${coinsToUse} Coins):` : `Coins Discount (${coinsToUse} Coins):`}</span>
                  </span>
                  <span className="font-mono">-{formatPrice(coinsDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>{lang === 'bn' ? 'সর্বমোট প্রদেয় বিল:' : 'Total Payable Amount:'}</span>
                <span className="font-mono text-emerald-800 text-lg">{formatPrice(payableTotal)}</span>
              </div>
            </div>

            {/* Order Note */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'ডেলিভারি নোট বা স্পেশাল ইন্সট্রাকশন (ঐচ্ছিক)' : 'Delivery Note or Instructions (Optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: গেটে ফোন দিন, নির্দিষ্ট সময়ে ডেলিভারি ইত্যাদি' : 'e.g. Call before delivery, deliver in afternoon'}
                className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2 text-xs text-slate-800 outline-none"
              />
            </div>

            {/* Submit Order CTA */}
            {user ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 hover:scale-[1.01]"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>{isSubmitting ? (lang === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...') : (lang === 'bn' ? `অর্ডার নিশ্চিত করুন (${formatPrice(payableTotal)})` : `Place Order Now (${formatPrice(payableTotal)})`)}</span>
              </button>
            ) : (
              <Link
                to="/login?redirect=/checkout"
                className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm hover:scale-[1.01]"
              >
                <span>🔒 {lang === 'bn' ? 'অর্ডার করতে প্রথমে লগইন করুন' : 'Login to Complete Order'}</span>
              </Link>
            )}

            {/* Trust badge */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'bn' ? '১০০% নিরাপদ ডেলিভারি ও মানি-ব্যাক গ্যারান্টি' : '100% Secure Transaction & Doorstep Inspection'}</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
