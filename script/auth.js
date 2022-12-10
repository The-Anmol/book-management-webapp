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
  console.log(doPassHaveSpaces(pass));
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
      redirect("");
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

// const arrOfObj = [
//   { title: "Title 1", status: "finishe 1" },
//   { title: "Title 2", status: "finished 2" },
// ];
// const newArr = [
//   { title: "Title new 1", status: "finishe 1" },
//   { title: "Title new 2", status: "finished 2" },
// ];

// const arr = [...arrOfObj, ...newArr];

// var data = database
//   .collection("books")
//   .doc("CKP7sY9sH4QLa13b8UJKIB9CR5K2")
//   .set({ arr })
//   .then(() => console.log("Pushed Successfully"))
//   .catch((err) => console.error(err));

// database
//   .collection("books")
//   .doc("CKP7sY9sH4QLa13b8UJKIB9CR5K2")
//   .get()
//   .then((doc) => {
//     const dataArr = [];
//     const data =
//       doc?._delegate?._document?.data?.partialValue?.mapValue?.fields?.arr?.arrayValue?.values?.map(
//         (eachElement) => dataArr.push(eachElement.mapValue.fields)
//       );
//     console.log(dataArr);
//   })
//   .catch((err) => console.error(err));

function writeUserData(uid) {
  database.collection("books").doc(uid).set({ exampleArrOfObj });
}

// getBooksData(localStorage.getItem("uid"));

//        Working Setting getting array of Obj from firebase and storing in array
function getBooksData(uid) {
  const dataArr = [];
  database
    .collection("books")
    .doc(uid)
    .get()
    .then((doc) => {
      const data =
        doc._delegate._document.data.partialValue.mapValue.fields.arr.arrayValue.values.map(
          (eachElement) => dataArr.push(eachElement.mapValue.fields)
        );
      cacheBooks(dataArr);
      // return dataArr;
    })
    .catch((err) => console.error(err));
  // return dataArr;
}

function setBooksData(uid, prevData, newData) {
  const updatedData = [...prevData, ...newData];
  database
    .collection("books")
    .doc(uid)
    .set({ updatedData })
    .then(() => console.log("Pushed Successfully"))
    .catch((err) => console.error(err));
}

function displayBooks(data) {
  data.map((eachBook) => {
    var books_container = document.getElementById("books-container");
    // Create Div Element
    var divElem = document.createElement("div");
    const classAttr = document.createAttribute("class");
    classAttr.value = "book";
    divElem.setAttributeNode(classAttr);
    var titleElem = document.createElement("p");
    var statusElem = document.createElement("p");
    titleElem.innerHTML = eachBook.title.stringValue;
    statusElem.innerHTML = eachBook.status.stringValue;
    divElem.appendChild(titleElem);
    divElem.appendChild(statusElem);
    books_container.appendChild(divElem);
  });
}

function updateBooks(uid) {}

console.log(getBooksData(localStorage.getItem("uid")));

// function syncBooks() {}
function cacheBooks(data) {
  console.log(data);
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }

  // 2
  const request = indexedDB.open("CarsDatabase");

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = function () {
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id" });
  };

  request.onsuccess = function () {
    console.log("Database opened successfully");
    const db = request.result;
    const transaction = db.transaction("cars", "readwrite");
    const store = transaction.objectStore("cars");

    data?.map((eachBook) => console.log(eachBook));
    data?.map((eachBook, i) =>
      store.put({
        id: i,
        title: eachBook.title.stringValue || eachBook.title,
        status: eachBook.status.stringValue || eachBook.status,
      })
    );

    transaction.oncomplete = function () {
      db.close();
    };
  };
}

cacheBooks();
function isUserOnline() {
  return navigator.onLine;
}
