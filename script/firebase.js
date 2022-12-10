import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
const firebaseConfig = {
	apiKey: 'AIzaSyDDPlyWu_YWCSQPaoGa3byIvB6kLV8y0CI',
	authDomain: 'login-89fde.firebaseapp.com',
	projectId: 'login-89fde',
	storageBucket: 'login-89fde.appspot.com',
	messagingSenderId: '411335699136',
	appId: '1:411335699136:web:ba091061fa937144849b25',
};
const app = initializeApp(firebaseConfig);
export const auth = app.auth();
