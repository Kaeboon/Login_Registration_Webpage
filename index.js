import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import {
  getDatabase,
  ref as refdb,
  child,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

import {
  getStorage,
  ref as refimg,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js";

// Initialize Firebase(2)
var firebaseConfig = {
  apiKey: "AIzaSyCUvzWcATvhVhv4NBNjOtHNj2bDBAdUfdE",
  authDomain: "commit-simple-login.firebaseapp.com",
  databaseURL:
    "https://commit-simple-login-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "commit-simple-login",
  storageBucket: "commit-simple-login.appspot.com",
  messagingSenderId: "617543928683",
  appId: "1:617543928683:web:23caedae11ae144d2cda2e",
  measurementId: "G-FQ7KGSDFVL",
};

const app = initializeApp(firebaseConfig);
var database = getDatabase(app);
var uniqueuserid = "placeholder";
var usercredentials = { name: "", email: "", password: "", DOB: "" };

//login_page_const
var email_login = document.getElementById("email_login");
var password_login = document.getElementById("password_login");

var RegisterButton = document.getElementById("RegisterButton");
var LoginForm = document.getElementById("LoginForm");

//registration_page_cont
var SubmitButton = document.getElementById("SubmitButton");
var imageinput = document.getElementById("imageinput");
var SubmitForm = document.getElementById("SubmitForm");
var name_reg = document.getElementById("name_reg");
var email_reg = document.getElementById("email_reg");
var DOB_reg = document.getElementById("DOB_reg");
var password_reg = document.getElementById("password_reg");

//homepage_const
var imagedisplay = document.getElementById("imagedisplay");
var SignoutButton = document.getElementById("SignoutButton");
var name_home = document.getElementById("name_home");
var DOB_home = document.getElementById("DOB_home");
var email_home = document.getElementById("email_home");

if (RegisterButton) {
  RegisterButton.addEventListener("click", function () {
    LoginForm.reset();
    location.href = "./registration.html";
  });
}

if (LoginForm) {
  LoginForm.addEventListener("submit", function (e) {
    e.preventDefault(); //prevent instant submission
    refresh_login();
    const loginid = loginidprocessing();
    get(child(refdb(database), `users/${loginid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          //verify if identity is correct
          //user input data(email, pwd) == database data (snapshot.email, pwd) allow login, reject
          if (
            email_login.value == snapshot.val().email &&
            password_login.value == snapshot.val().password
          ) {
            console.log("User granted access");
            localStorage.setItem(
              "PassOverCredentials",
              JSON.stringify(snapshot.val())
            );
            location.href = "./index.html";
          } else {
            console.log("User Credentials do not match");
          }
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

const reachhome = document.querySelector(".homepage");

if (reachhome) {
  console.log("testing.dfadjklfdsajkldsds");
  refresh_home();
  const fetchedcredentials = JSON.parse(
    localStorage.getItem("PassOverCredentials")
  );
  localStorage.removeItem("PassOverCredentials");
  console.log(fetchedcredentials);
  displayimage(
    fetchedcredentials.email.toString().replace("@", "_").replaceAll(".", "_")
  );

  refresh_home();
  console.log(fetchedcredentials);
  name_home.innerText = fetchedcredentials.name;
  email_home.innerText = fetchedcredentials.email;
  DOB_home.innerText = fetchedcredentials.DOB;
}

if (SignoutButton) {
  SignoutButton.addEventListener("click", function () {
    location.href = "./login.html";
  });
}

if (SubmitForm) {
  SubmitForm.addEventListener("submit", function (e) {
    e.preventDefault();

    refresh_reg;
    uniqueuserid = idprocessing();

    usercredentials = {
      name: name_reg.value,
      email: email_reg.value,
      password: password_reg.value,
      DOB: DOB_reg.value,
    };

    refresh_reg;

    uploadimage(uniqueuserid, imageinput.files[0]).then((e) => {
      set(refdb(database, `users/${uniqueuserid}`), usercredentials).then(
        (res) => {
          location.href = "./login.html";
        }
      );
    });

    //SubmitForm.reset();
  });
}

function uploadimage(id, img) {
  const storage = getStorage();
  const storageRef = refimg(storage, id + ".jpg");
  console.log(img);
  return uploadBytes(storageRef, img);
}

function displayimage(id) {
  const storage = getStorage();
  getDownloadURL(refimg(storage, id + ".jpg")).then((url) => {
    //'url' is the download URL for the image file.
    console.log(url);
    imagedisplay.setAttribute("src", url);
  });
}

//process email to unique id
function idprocessing() {
  return document.getElementById("email_reg")
    ? document
        .getElementById("email_reg")
        .value.toString()
        .replace("@", "_")
        .replaceAll(".", "_")
    : null;
}

function loginidprocessing() {
  email_login = document.getElementById("email_login");
  return document.getElementById("email_login")
    ? document
        .getElementById("email_login")
        .value.toString()
        .replace("@", "_")
        .replaceAll(".", "_")
    : null;
}

//read from db

//refresh_reg
function refresh_reg() {
  SubmitButton = document.getElementById("SubmitButton");
  imageinput = document.getElementById("imageinput");
  SubmitForm = document.getElementById("SubmitForm");
  name_reg = document.getElementById("name_reg");
  email_reg = document.getElementById("email_reg");
  DOB_reg = document.getElementById("DOB_reg");
  password_reg = document.getElementById("password_reg");
}

//refresh_login
function refresh_login() {
  email_login = document.getElementById("email_login");
  password_login = document.getElementById("password_login");
  RegisterButton = document.getElementById("RegisterButton");
  LoginForm = document.getElementById("LoginForm");
}

//refresh_home
function refresh_home() {
  imagedisplay = document.getElementById("imagedisplay");
  SignoutButton = document.getElementById("SignoutButton");
  name_home = document.getElementById("name_home");
  DOB_home = document.getElementById("DOB_home");
  email_home = document.getElementById("email_home");
}
