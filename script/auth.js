var firebaseConfig = {
  apiKey: "AIzaSyBxLnV5NnAbpW2YjbrR7CsjyI408Rt9174",
  authDomain: "login-signup-2279.firebaseapp.com",
  databaseURL: "https://login-signup-2279-default-rtdb.firebaseio.com",
  projectId: "login-signup-2279",
  storageBucket: "login-signup-2279.appspot.com",
  messagingSenderId: "201799203618",
  appId: "1:201799203618:web:a836ad60bf2657adc4837b",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var database = firebase.firestore();
var isLoggedIn;
//signup function
function register() {
  var email = document.getElementById("email").value.toLowerCase().trim();
  var pass = document.getElementById("password").value;
  var c_pass = document.getElementById("c-password").value;
  var pass_help_text = document.querySelector(".pass-helper");
  var c_pass_help_text = document.querySelector(".c-pass-helper");

  if (isPassEmpty(pass)) {
    if (comparePass(pass, c_pass)) {
      if (doPassHaveSpaces(pass)) {
        auth
          .createUserWithEmailAndPassword(email, pass)
          .then((userCred) => {
            writeUserData(userCred.user.uid);
            localStorage.setItem("uid", userCred.user.uid);
            isLoggedIn = true;
          })
          .catch((e) => alert(e.message));
        pass_help_text.innerHTML = "";
      } else {
        pass_help_text.innerHTML = "Passwords shouldn't have spaces in them";
      }
      c_pass_help_text.innerHTML = "";
    } else {
      c_pass_help_text.innerHTML = "Passwords do not match";
    }
    pass_help_text.innerHTML = "";
  } else {
    pass_help_text.innerHTML = "Passwords cant be Empty";
  }
  redirect("home.html");
}

const exampleArrOfObj = [{ title: "Example Title", status: "Finished" }];

var local_email, local_uid;
window.addEventListener(
  "storage",
  function (e) {
    local_email = localStorage.getItem("email");
    local_uid = localStorage.getItem("uid");
    console.log("storage changed");
  },
  false
);

// comparePass should be true
// isPassEmpty should be false
// doPassHaveSpaces should be true

// //signIN function
function signIn() {
  var email = document.getElementById("login-email").value;
  var pass = document.getElementById("login-pass").value;
  auth
    .signInWithEmailAndPassword(email, pass)
    .then((e) => {
      alert(e.message);
      redirect("home.html");
    })
    .catch((e) => alert(e.message));
}

//signOut
function signOut() {
  auth.signOut();
  alert("Sign Out Successfully from System");
  localStorage.clear();
}

// active user to homepage
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    localStorage.setItem("email", user.email);
    isLoggedIn = true;
  } else {
    localStorage.clear();
    isLoggedIn = false;
  }
});

function redirect(to) {
  window.location.pathname = "/" + to;
}

function formChange() {
  console.log("Form changed");
}

function togglePassVis() {
  var pass_checkbox = document.querySelector(".show-pass-checkbox");
  var passInputs = document.querySelectorAll(".password-input");
  passInputs.forEach((passInput) => {
    if (pass_checkbox.checked) passInput.type = "text";
    else passInput.type = "password";
  });
}

function comparePass(pass, c_pass) {
  return pass == c_pass;
}

function isPassEmpty(pass) {
  return pass !== "";
}
function doPassHaveSpaces(pass) {
  return pass == pass.trim();
}

function writeUserData(uid) {
  database.collection("books").doc(uid).set({ exampleArrOfObj });
}
function getBooksData(uid) {
  const dataArr = [];
  database
    .collection("books")
    .doc(uid)
    .get()
    .then((doc) => {
      const data =
        doc._delegate._document.data.partialValue.mapValue.fields.data?.arrayValue.values.map(
          (eachElement) => dataArr.push(eachElement.mapValue.fields)
        );
      console.log("Fetch Books Data from Firebase");
      cacheBooks(dataArr);
    })
    .catch((err) => console.error(err.message));
}
function cacheBooks(data) {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }
  const request = indexedDB.open("CarsDatabase");

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = function () {
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id" });
  };
  console.log("data reached to CacheBooks fn" + data);
  request.onsuccess = function () {
    console.log("Database opened successfully");
    const db = request.result;
    const transaction = db.transaction("cars", "readwrite");
    const store = transaction.objectStore("cars");
    data.map((eachBook) => console.log(eachBook));
    data.map((eachBook, i) =>
      store.put({
        id: i,
        title: eachBook.title.stringValue || eachBook.title,
        status: eachBook.status.stringValue || eachBook.status,
      })
    );

    transaction.oncomplete = function () {
      console.log("Books Cached to IndexedDB");
      setBooksData(localStorage.getItem("uid"), data);
      db.close();
    };
  };
}
function setBooksData(uid, data) {
  console.log("Set Books Data:");
  if (data.length !== 0) {
    database
      .collection("books")
      .doc(uid)
      .set({ data })
      .then(() => {
        console.log("Set Books Data in Firebase");
        getCachedData();
      })
      .catch((err) => console.error(err));
  } else console.log("Data is Empty");
}

function getCachedData(data) {
  const cachedData = [];

  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  const request = indexedDB.open("CarsDatabase");

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("cars", "readwrite");
    const store = transaction.objectStore("cars");
    const cursor = store.openCursor();
    cursor.onsuccess = function () {
      const cursorRes = cursor.result;
      if (cursorRes) {
        cachedData.push(cursorRes.value);
        cursorRes.continue();
      }
    };
    data?.map((eachBook) => console.log(eachBook));
    data?.map((eachBook, i) =>
      store.put({
        id: i,
        title: eachBook.title.stringValue || eachBook.title,
        status: eachBook.status.stringValue || eachBook.status,
      })
    );

    transaction.oncomplete = function () {
      console.log("Books Cached to IndexedDB");
      displayData(cachedData);
      db.close();
    };
  };
}

function displayData(data) {
  data.map((eachBook) => {
    var books_container = document.getElementById("books-container");
    // Create Div Element
    var divElem = document.createElement("div");
    const classAttr = document.createAttribute("class");
    classAttr.value = "book";
    divElem.setAttributeNode(classAttr);
    var titleElem = document.createElement("p");
    var statusElem = document.createElement("p");
    titleElem.innerHTML = eachBook.title;
    statusElem.innerHTML = eachBook.status;
    divElem.appendChild(titleElem);
    divElem.appendChild(statusElem);
    books_container.appendChild(divElem);
  });
  console.log(" Data Displayed from IndexedDB");
}

getBooksData(localStorage.getItem("uid"));

// const add-book-button = document.getElementById("add-book-button")
function cacheNewBook(event) {
  event.preventDefault();

  const dataArr = [];
  database
    .collection("books")
    .doc(localStorage.getItem("uid"))
    .get()
    .then((doc) => {
      const data =
        doc._delegate._document.data.partialValue.mapValue.fields.data.arrayValue.values.map(
          (eachElement) => dataArr.push(eachElement.mapValue.fields)
        );
    })
    .catch((err) => console.error(err));

  const title = document.getElementById("book-title-input").value;
  const status = document.getElementById("book-status-select").value;

  console.log("Previus Books are",dataArr)
  console.log("new Books is", { id: dataArr.length + 1, title, status });


  const updatedData = [...dataArr, { id: dataArr.length + 1, title, status }];
  cacheBooks(updatedData);
}

function isUserOnline() {
  return navigator.onLine;
}