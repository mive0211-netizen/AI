// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyD_MWnowzDd-msmF0Rmnt3q47jsiWZtd9Q",
    authDomain: "cursor-practice-3baec.firebaseapp.com",
    projectId: "cursor-practice-3baec",
    storageBucket: "cursor-practice-3baec.firebasestorage.app",
    messagingSenderId: "636992276490",
    appId: "1:636992276490:web:27dab7557ffab84714f7f3",
    measurementId: "G-01PE1P6RWR"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 데이터베이스 참조
const db = firebase.firestore(); 