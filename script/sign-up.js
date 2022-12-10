import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.14.0vaa/firebase-app.js';
const firebaseConfig = {
	apiKey: 'AIzaSyDDPlyWu_YWCSQPaoGa3byIvB6kLV8y0CI',
	authDomain: 'login-89fde.firebaseapp.com',
	projectId: 'login-89fde',
	storageBucket: 'login-89fde.appspot.com',
	messagingSenderId: '411335699136',
	appId: '1:411335699136:web:ba091061fa937144849b25',
};
const firebase = initializeApp(firebaseConfig);
const auth = firebase.auth();

console.log('run!');
function register() {
	username = document.getElementById('username').value;
	email = document.getElementById('email').value;
	password = document.getElementById('password').value;
	c_password = document.getElementById('c-password').value;

	if (validate_email(email) == false || validate_password(password) == false) alert('Enter valid Email & password');
	else {
		if (check_passwords(password, c_password)) {
			console.log('try to create user');
		}
	}
}

function validate_email(email) {
	expression = /^[^@]+@\w+(\.\w+)+\w$/;
	return expression.test(email) == true;
}
function validate_password(password) {
	return !(password < 6);
}
function check_passwords(password, c_password) {
	return password == c_password;
}
