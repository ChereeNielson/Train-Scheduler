// Initialize Firebase //
let config = {
    apiKey: "AIzaSyAjzWICVCt8OM8QB-U-ZFFPO930amTcoz4",
    authDomain: "train-scheduler-5fdce.firebaseapp.com",
    databaseURL: "https://train-scheduler-5fdce.firebaseio.com",
    projectId: "train-scheduler-5fdce",
    storageBucket: "train-scheduler-5fdce.appspot.com",
    messagingSenderId: "512269028262"
  };
  
firebase.initializeApp(config);

// Variable to reference the database //
let database = firebase.database();


let name = "";
let destination = "";
let time = "";
let frequency = "";
let nextArrival = "";
let minutesAway = "";
// var convertedDate = moment(randomDate, rendomFormat);

// Run Time //
setInterval(function(startTime) {
    $("#timer").html(moment().format('hh:mm a'))
  }, 1000);

$("#add-train").on("click", function(event) {
    // Don't refresh the page //
    event.preventDefault();
    console.log(name);
    console.log(destination);
    console.log(time);
    console.log(frequency);
    console.log(nextArrival);
    console.log(minutesAway);
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    time = $("#time-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    nextArrival = 0;
    minutesAway = 0;
    $("#tableBody").append("<tr> <td>" + name + "</td> <td>" + destination + "</td> <td>" + time + "</td> <td>" + frequency + "</td> <td>" + nextArrival + "</td> <td>" + minutesAway + "</td> </tr>");
    database.ref().push({
        name: name,
        destination: destination,
        time: time,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("#name-input, #destination-input, #time-input, #frequency-input").val('');
});

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().time);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().nextArrival);
    console.log(childSnapshot.val().minutesAway);

    // // Change the HTML to reflect
    // $("#name-input").text(childSnapshot.name);
    // $("#role-input").text(childSnapshot.role);
    // $("#startDate-input").text(childSnapshot.startDate);
    // $("#monthsWorked-input").text(childSnapshot.monthsWorked);
    // $("#monthlyRate-input").text(childSnapshot.monthlyRate);
    // $("#totalBilled-input").text(childSnapshot.totalBilled);
    $("#tableBody").append(
        "<tr class='well'><td class='train-name'> " + childSnapshot.val().name +
        " </td><td class='train-destination'> " + childSnapshot.val().destination +
        " </td><td class='train-time'> " + childSnapshot.val().time +
        " </td><td class='train-frequency'> " + childSnapshot.val().frequency +
        " </td><td class='train-nextArrival'> " + childSnapshot.val().nextArrival +
        " </td><td class='train-minutesAway'> " + childSnapshot.val().minutesAway +
        " </td></tr>");
    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    //   // Change the HTML to reflect
    // $("#name-input").text(snapshot.val().name);
    // $("#role-input").text(snapshot.val().role);
    // $("#startDate-input").text(snapshot.val().startDate);
    // $("#monthsWorked-input").text(snapshot.val().monthsWorked);
    // $("#monthlyRate-input").text(snapshot.val().monthlyRate);
    // $("#totalBilled-input").text(snapshot.val().totalBilled);
});
// console.log(moment().format("DD/MM/YYYY"));
// //date math
// moment('2016-03-12 13:00:00').add(1, 'day').format('LLL')
// "March 13, 2016 1:00 PM"