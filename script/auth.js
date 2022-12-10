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
            console.log(userCred.user.uid);
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

// comparePass should be true
// isPassEmpty should be false
// doPassHaveSpaces should be true

// //signIN function
function signIn() {
  var email = document.getElementById("login-email").value;
  var pass = document.getElementById("login-pass").value;
  auth
    .signInWithEmailAndPassword(email, pass)
    .then((res) => {
      console.log(res.user.uid);
      localStorage.setItem("email", res.user.email);
      localStorage.setItem("uid", res.user.uid);

      redirect("home.html");
    })
    .catch((e) => alert(e.message));
}

//signOut
function signOut() {
  auth.signOut();
  localStorage.clear();
  redirect("");
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

if (localStorage.getItem("uid")) {
  const books = [
    {
      title: {
        stringValue: "Book 1",
      },
      status: {
        stringValue: "started",
      },
    },
    {
      title: {
        stringValue: "Book 1",
      },
      status: {
        stringValue: "started",
      },
    },
  ];

  //   books.map((book) => console.log(book));
    books.map((book) => {
      for (val in book) {
        var key = val;
        var value = book[val];
        console.log(value);
        // for (prop in val) {
        //   var key = prop;
        //   var value = val[prop];
        //   console.log(value);
        // }
      }
    });

  // for (variable in object) statement;

  //   database
  //     .collection("books")
  //     .doc(localStorage.getItem("uid"))
  //     .get()
  //     .then((res) => {
  //       const array =
  //         res._delegate._document.data.partialValue.mapValue.fields.data
  //           .arrayValue.values;

  //       //         0  mapValue fields status
  //       array.map((eachField) => {
  //         console.log(eachField.mapValue.fields);
  //       });
  //     })
  //     .catch((err) => console.error(err));

  function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("book-title-input").value;
    const status = document.getElementById("book-status-select").value;

    const newBook = { title, status };
    books.push(newBook);
    displayBooks();
    updateBooks(books);
  }

  function displayBooks() {
    var books_container = document.querySelector(".all-books");
    books_container.innerHTML = "";

    books.map((eachBook) => {
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
  }
  function updateBooks(data) {
    const uid = localStorage.getItem("uid");
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

  displayBooks();
}