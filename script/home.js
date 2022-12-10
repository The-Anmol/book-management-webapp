console.log("inside home");

const img = "https://via.placeholder.com/192x192";
// const text = `HEY! Your task "${title}" is now overdue.`;
const text = `HEY! Your task title is now overdue.`;
const notification = new Notification("To do list", { body: text, icon: img });

if (
  localStorage.getItem("email") !== null ||
  localStorage.getItem("email") !== undefined ||
  localStorage.getItem("email") !== ""
) {
  // window.location.pathname = '/';
  // alert('Pleaselogin');
}

const getLocation = () => {
  navigator.geolocation.getCurrentPosition((dataObj) => {
    console.log("getLocation", dataObj);
    document.getElementById("display-location").innerHTML =
      localStorage.getItem("email");
  });
  Notification.requestPermission().then((result) => {
    console.log(result);
  });
  Notification.requestPermission();
};

function askNotificationPermission() {
  // function to actually ask the permissions
  function handlePermission(permission) {
    // set the button to shown or hidden, depending on what the user answers
    // notificationBtn.style.display = Notification.permission === 'granted' ? 'none' : 'block';
  }

  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
  } else if (checkNotificationPromise()) {
    Notification.requestPermission().then((permission) => {
      handlePermission(permission);
    });
  } else {
    Notification.requestPermission((permission) => {
      handlePermission(permission);
    });
  }
}
function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}

// notification

if ("Notification" in window && "serviceWorker" in navigator) {
  switch (Notification.permission) {
    case "denied":
      notificationNotAllowed();
      break;

    case "default":
      requestUserPermission();
      break;

    case "granted":
      displayNotification();
      break;
  }
} else {
  notificationNotAllowed();
}

function notificationNotAllowed() {
  mainDiv.style.display = "none";
  button.style.display = "block";
}

function requestUserPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      displayNotification();
      button.style.display = "none";
      mainDiv.style.display = "block";
    } else {
      notificationNotAllowed();
      mainDiv.style.display = "none";
      button.style.display = "block";
    }
  });
}
function displayNotification() {
  show.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const errorView = document.getElementById("message");
    if (title != "") {
      const options = {
        body: body,
        icon: "/images/logo.png",
        actions: [
          {
            action: "confirm",
            title: "Agree",
          },
          {
            action: "cancel",
            title: "Disagree",
          },
        ],
      };
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
        errorView.style.display = "none";
      });
    } else {
      errorView.style.display = "block";
    }
  });

  navigator.serviceWorker.addEventListener("message", (message) => {
    const notificationMessage = document.getElementById("broadcast");
    notificationMessage.innerHTML = message.data;
  });
}

function displayNotification() {
  show.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const errorView = document.getElementById("message");
    if (title != "") {
      const options = {
        body: body,
        icon: "/images/logo.png",
        actions: [
          {
            action: "confirm",
            title: "Agree",
          },
          {
            action: "cancel",
            title: "Disagree",
          },
        ],
      };
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
        errorView.style.display = "none";
      });
    } else {
      errorView.style.display = "block";
    }
  });

  navigator.serviceWorker.addEventListener("message", (message) => {
    const notificationMessage = document.getElementById("broadcast");
    notificationMessage.innerHTML = message.data;
  });
}
