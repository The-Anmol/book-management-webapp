// console.log("inside home");

const img = 'https://via.placeholder.com/192x192';
// const text = `HEY! Your task "${title}" is now overdue.`;
const text = `HEY! Your task title is now overdue.`;
const notification = new Notification('To do list', {body: text, icon: img});

if (localStorage.getItem('email') !== null || localStorage.getItem('email') !== undefined || localStorage.getItem('email') !== '') {
	// window.location.pathname = '/';
	// alert('Pleaselogin');
}

const getLocation = () => {
	navigator.geolocation.getCurrentPosition((dataObj) => {
		console.log(document.querySelectorAll('span.display-location'));
		document.querySelectorAll('span.display-location')[0].innerText = `with latitude ${dataObj.coords.latitude} & longitude ${dataObj.coords.longitude}`;
	});
};

if ('Notification' in window && 'serviceWorker' in navigator) {
	switch (Notification.permission) {
		case 'denied':
			alert('notification denied ');
			break;

		case 'default':
			requestUserPermission();
			break;

		case 'granted':
			displayNotification();
			break;
	}
} else alert('notification denied ');

function requestUserPermission() {
	Notification.requestPermission().then((permission) => {
		if (permission === 'granted') displayNotification();
		else alert('notification denied ');
	});
}
function displayNotification() {
	const title = 'Title';
	const body = 'Body';

	if (title != '') {
		const options = {
			body: body,
			// icon: '/images/logo.png',
			actions: [
				{
					action: 'confirm',
					title: 'Agree',
				},
				{
					action: 'cancel',
					title: 'Disagree',
				},
			],
		};
		navigator.serviceWorker.ready.then((registration) => {
			registration.showNotification(title, options);
			console.log('registration', registration);
		});
	}
	navigator.serviceWorker.addEventListener('message', (message) => {
		const notificationMessage = document.getElementById('broadcast');
		notificationMessage.innerHTML = message.data;
	});
}

// Notification.requestPermission();

// // Let's check if the browser supports notifications
// if (!('Notification' in window)) alert('This browser does not support notifications.');
// else if (checkNotificationPromise()) Notification.requestPermission().then((permission) => {});
// else Notification.requestPermission((permission) => {});

// function checkNotificationPromise() {
// 	try {
// 		Notification.requestPermission().then((result) => {
// 			console.log(result);
// 		});
// 	} catch (e) {
// 		return false;
// 	}

// 	return true;
// }
