const database = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();
const databaseRef = database.ref("/");
var isConnected = true;
const connectedRef = database.ref(".info/connected");

function createProject(code) {
    var title = document.getElementById("title").value;
    var initialT = document.getElementById("initial").value;

    var projectsRef = database.ref("/users/" + firebase.auth().currentUser.uid + "/session/")
    var newMapString = '{"class":"go.TreeModel","nodeDataArray":[{"key":0,"text":"' + initialT + '","loc":"-35 -43"}]}'
    if (isConnected) {
            if (firebase.auth().currentUser != null) {
                var newProjectRef = projectsRef.push();
                var sessionUID = newProjectRef.key
                newProjectRef.set({
                    name: title,
                    mapString: newMapString,
                    code: code,//code,
                    initialTopic: initialT,
                    uid: firebase.auth().currentUser.uid,
                });
                var addSocrativeCode = database.ref("/codes").push();
                addSocrativeCode.set({
                    code: code,//code
                    uid: firebase.auth().currentUser.uid,
                    sessionUid: sessionUID
                });
                loadMindMaps(firebase.auth().currentUser.uid,sessionUID,firebase.auth().currentUser.displayName.split(" ")[0],code,title)
            }
            else {
                toastr.error("You are not logged in... Cheater!");
            }
    } else {
        //Mingjie work some css magic or something
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("logged in")
    } else {
        console.log("logged out")
    }
});

connectedRef.on("value", function (snapshot) {
    if (snapshot.val() == true) {
        isConnected = true;
    } else {
        isConnected = false;
    }
});

function checkCode(code) {
    databaseRef.child("codes").orderByChild("code").equalTo(code).once("value",snapshot => {
        const userData = snapshot.val();
        if (!userData){
            createProject(code)
        }
    });
}

function loadMindMaps(userUid,sessionUid,userName,code,title) {
       document.cookie="uid=" + userUid;
       document.cookie="suid=" + sessionUid;
       document.cookie="name=" + title;
       document.cookie="userName=" + userName;
       document.cookie="code=" + code;
       document.cookie="admin=true";
       location.href = "mindmap.html"
}

function generateCode() {
    if(isConnected){
        genCode = Math.floor(Math.random() * 100000);
        checkCode(genCode)
    }
}

function getSessions(){
    var node = document.getElementById("particles-js")
    database.ref("/users/" + firebase.auth().currentUser.uid + "/session/").once('value', function(snapshot){
        if(snapshot.val() != null){
            var val = snapshot.val();
            var main = document.getElementById("particles-js");
            var props = Object.keys(val);
            for (var i = 0; i < props.length; i++) {
                var uid = val[props[i]].uid
                var key = Object.keys(snapshot.val())
                var name = firebase.auth().currentUser.displayName.split(" ")[0]
                var code = val[props[i]].code
                var title = val[props[i]].name;
                main.innerHTML = '<div class="disc"><h3 onclick="loadMindMaps(\'' + uid + "\',\'" + key[i]+ "\',\'" + name + "\',\'" + code + "\',\'" + title + '\')">' + title + '</h3><i class="fa fa-trash fa-2x"></i></div>' + main.innerHTML;
            }
        }else{
            console.log("No Existing Mindmaps")
        }
    });
}
