const updateTournamentRef = database.ref("/");
const updateMindMapRef = ""




function updateModel(mindmap) {
    var model = new go.TreeModel(mindmap);
    myDiagram.model = model;
    save();
}

function saveMindMapState(){
    var dataT = myDiagram.model.toJSON();
    var updateStartRef = database.ref("/users/"+ getCookie("uid") + "/session/" + getCookie("suid") + "/");
    var updates = {};
    updates['/mapString'] = dataT;
    updateStartRef.update(updates);
}

function listenForCurrentBracketUpdates(key){
    console.log("listen")
    updateBracketRef = database.ref("/users/"+ getCookie("uid") + "/session/" + getCookie("suid"));
    updateBracketRef.on('child_changed', function(snapshot) {
      if(myDiagram.model.toJSON() != snapshot.val())
      {
          updateModel(JSON.parse(snapshot.val()).nodeDataArray);
      }
    });
}

function getMindMapString() {
    updateBracketRef = database.ref("/users/"+ getCookie("uid") + "/session/" + getCookie("suid") + "/mapString/")
    updateBracketRef.once("value", function(snapshot){
       init(snapshot.val());
    });
}
listenForCurrentBracketUpdates();