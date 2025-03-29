
import appointment_img from './appointment_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './user.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import Dermatologist from "./dermatology.png"
import Gastroenterologist from './stomach.png'
import Dentist from './tooth.png'
import Gynecologist from './pregnancy.png'
import Neurologist from './medicine.png'
import Pediatricians from './pediatrician.png'


export const assets = {
    appointment_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'Dentist',
        image: Dentist
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: '/assets/doc1.png',
        speciality: 'General physician',
        hospital:'Asiri Hospital',
        availableTime: "9.00AM-5.00PM",
        availableDate: "2025-03-20",
        city:'Colombo',
        phone:'0745684596',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: '/assets/doc2.png',
        speciality: 'Pediatricians',
        hospital:'Navaloka Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-03-21",
        phone:'0745684596',
        city:'Colombo',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: '/assets/doc3.png',
        speciality: 'Dermatologist',
        hospital:'Ahamed Ali Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-03-22",
        phone:'0745684596',
        city:'Kalmunai',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: '/assets/doc4.png',
        speciality: 'Pediatricians',
        hospital:'Appolo Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-03-23",
        phone:'0745684596',
        city:'Colombo',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: '/assets/doc5.png',
        speciality: 'Pediatricians',
        hospital:'Navaloka Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-03-24",
        phone:'0745684596',
        city:'Colombo',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6.00AM-8.00AM',
        shift_time_2:'1.00PM-4.30PM',
        shift_time_3:'6.30PM-10.00PM'
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: '/assets/doc6.png',
        speciality: 'Neurologist',
        hospital:'Navaloka Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-04-20",
        phone:'0745684596',
        city:'Jaffna',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        
        speciality: 'General physician',
        hospital:'Asiri Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-04-23",
        phone:'0745684596',
        city:'Galle',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: '/assets/doc8.png',
        speciality: 'Gynecologist',
        hospital:'Aliyaminas Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-03-28",
        phone:'0745684596',
        city:'Sammanthurai',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: '/assets/doc9.png',
        speciality: 'Dermatologist',
        hospital:'Ahamed Ali Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-03-15",
        phone:'0745684596',
        city:'Kalmunai',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: '/assets/doc10.png',
        speciality: 'Pediatricians',
        hospital:'Lanka Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-03-14",
        phone:'0745684596',
        city:'Colombo',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: '/assets/doc11.png',
        speciality: 'Neurologist',
        hospital:'Aliyaminas Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-05-20",
        phone:'0745684596',
        city:'Sammanthurai',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: '/assets/doc12.png',
        speciality: 'Neurologist',
        hospital:'Ahamed Ali Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-05-20",
        phone:'0745684596',
        city:'Kalmunai',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: '/assets/doc13.png',
        speciality: 'General physician',
        hospital:'Royal Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-05-20",
        phone:'0745684596',
        city:'Kurunagala',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Unavailable',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: '/assets/doc14.png',
        speciality: 'Dentist',
        hospital:'Asiri Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-05-20",
        phone:'0745684596',
        city:'Kattankudy',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Available',
        shift_time_1:'6AM-8AM',
        shift_time_2:'1PM-4.30PM',
        shift_time_3:'6.30PM-9.300PM'
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: '/assets/doc15.png',
        speciality: 'Dermatologist',
        hospital:'Aliyaminas Hospital',
        availableTime: "9.00AM - 5.00PM",
        availableDate: "2025-05-20",
        phone:'0745684596',
        city:'Maruthmunai',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        status:'Unavailable',
        shift_time_1:'6.00AM-8AM',
        shift_time_2:'1.00PM-4.30PM',
        shift_time_3:'6.30PM-9.30PM'
    },
]

