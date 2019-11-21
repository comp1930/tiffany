//-----------------------------------------------------------------------------------
// This code creates a user document in firestore, 
// using the "uid" that came with the authenticated user.
//-----------------------------------------------------------------------------------
function createUser() {

    // if the current user logged in user
    // is authenticated, then grab "uid" "displayName" and "email"
    // use "set()" with merge (if document did not exist it will be created)
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("users").doc(user.uid).set({
            "name": user.displayName,
            "email": user.email,
        }, {
            merge: true
        });
    });
}

//-----------------------------------------------------------------------------------
// This code listens for the submit button on form, grabs the text that user typed
// then writes this value (converted to int first) into firestore 
// as a new document in the assignments collection.
//-----------------------------------------------------------------------------------
function setFormListener(form) {
    document.getElementById("myform").addEventListener("submit", function (e) {
        e.preventDefault();
        var q0 = document.getElementById("q0").value;
        var q1 = document.getElementById("q1").value;
        var q2 = document.getElementById("q2").value;
        console.log(q0);
        console.log("inside setFormListener ..." + q0 + q1 + q2);
        processForm(q0, q1, q2);
    })
}

function processForm(q0, q1, q2) {
    console.log("inside processAndSaveAnswers..." + q0 + q1 + q2);
    firebase.auth().onAuthStateChanged(function (user) {
        //write the answers, then generate recommendations
        console.log (user.uid);
        db.collection("users").doc(user.uid).set({
                answers: [q0, q1, q2]
            }, {
                merge: true
            })
            .then(function () {
                getAndSaveRecommendation(q0, q1, q2);
            })
    })
}

//-------------------------------------------------------------------------
//
// This function generates results based on a very simple alogorithm
// based on the results from 3 questions.
//
// Q1:  “what type of school work will you mainly be using the device for?”
// Choices:  a)  mostly coding;  b)mostly word or excel;  c)mostly browser based applications
//
// Q2:  “how frequently will you bring this device to school?”   
// Choices:  a) once a week, if any; b)  2-3 times a week;  c)daily;
//
// Q3:  Will you be using the device more heavily for (hobbies outside of school work)?
// Choices:   a) Gaming;  b) Video Editing;   c)Photography;   d)Not much.
//
//-------------------------------------------------------------------------
function getAndSaveRecommendation(q0, q1, q2) {

    // defaults 
    var ram = 0; //4, 8, 16 MB
    var drive = 0; //32, 64, 128, 256 GB
    var cpu = "n/a"; //i3, i5, i7 core
    var type = "n/a"; // laptop, tablet
    var message = "n/a";

    console.log("inside getAndSaveRecommendations..." + q0 + q1 + q2);
    // the power coding student who games or video-edits
    if (q0.localeCompare("a") &&
        q1.localeCompare("c") &&
        (q2.localeCompare("a") || q2.localeCompare("b"))) {
        ram = 16;
        drive = 512;
        cpu = "i7";
        type = "laptop";
        message = "You need a powerful machine to ace your school, and keep up your hobbies"
    }

    // the casual stay home web surfer
    if (q0.localeCompare("c") &&
        q1.localeCompare("a") &&
        q2.localeCompare("d")) {
        ram = 4;
        drive = 64;
        cpu = "i3";
        type = "desktop";
        message = "You need just a basic computer on your desk."
    }

    // write the recommendations into the database for this user. 
    firebase.auth().onAuthStateChanged(function (user) {
        //console.log(user.uid);
        // write a new document of grade value
        db.collection("users").doc(user.uid).set({
            ram: ram,
            drive: drive,
            cpu: cpu,
            type: type,
            message: message
        }, {
            merge: true
        });
    });

    //getAnswers();
    //generateResults();

}