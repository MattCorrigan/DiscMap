const database = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();
const databaseRef = database.ref("/");
const connectedRef = database.ref(".info/connected");
var isConnected = true;

connectedRef.on("value", function (snapshot) {
    if (snapshot.val() == true) {
        isConnected = true;
        console.log("Connected")
    } else {
        isConnected = false;
        console.log("Disconnected")
    }
});



function register() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      firstName = firebase.auth().currentUser.displayName.split(" ")[0]
      checkForFirstTime(firebase.auth().currentUser.uid);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(errorCode)
    });   
}

function checkForFirstTime(userId) {
    databaseRef.child('users').child(userId).once('value', function (snapshot) {
        var exists = (snapshot.val() !== null);
        userFirstTimeCallback(userId, exists);
    });
}

function userFirstTimeCallback(userId, exists) {
    if (!exists)
        addNewUser(userId);
    else
        openDashboard();
}
function addNewUser(userId) {
    var newUserRef = database.ref("/users/" + userId)
    newUserRef.set({
        name: firebase.auth().currentUser.displayName,
        session: null
    });
    openDashboard();
}

function openDashboard() {
    location.href="dashboard.html"
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("logged in")
    } else {
        console.log("logged out");
    }
});

function joinSession() {
    if(isConnected){
        var code = parseInt(document.getElementById("code").value);
        var UserName = document.getElementById("name").value;
        if(code == "" || UserName == "") {
          databaseRef.child("codes").orderByChild("code").equalTo(code).once("value",snapshot => {
              const userData = snapshot.val();
              if (userData){
                  var data = userData[Object.keys(userData)[0]];
                  var uid = data.uid;
                  var suid = data.sessionUid;
                  var code = data.code;
                  loadMindMaps(uid,suid,UserName,code)
              }
          });
        }
    }else{
        console.log("Not Connected to the Internet");
    }
}

function loadMindMaps(userUid,sessionUid,userName,code) {
    console.log(userUid)
    console.log(sessionUid)
    database.ref('/users/'+userUid+"/session/"+sessionUid).once('value', function(snapshot){
      var data = snapshot.val();
       document.cookie="uid=" + userUid;
       document.cookie="suid=" + sessionUid;
       document.cookie="name=" + data.name;
       document.cookie="userName=" + userName;
       document.cookie="code=" + code;
       location.href = "mindmap.html";
    });
}