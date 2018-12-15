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

// Global variables that link to their $counterparts //
// let name = "";
// let destination = "";
// let firstTime = "";
// let frequency = "";
// let nextArrival = "";
// let minutesAway = "";

// Run Time //
setInterval(function(startTime) {
    $("#timer").html(moment().format('hh:mm a'))
  }, 1000);

// Add Train on-click function //
$("#add-train").on("click", function(event) {
    // Don't refresh the page //
    event.preventDefault();

    // Retrieve and store the most recent train information //
    let name = $("#name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let firstTime = $("#firstTime-input").val().trim();
    let frequency = $("#frequency-input").val().trim();
    // nextArrival = 0;
    // minutesAway = 0;

    // Provide initial data to your Firebase database (.set replaces old data) //
    let trainInfo = {
        trainName: name,
        trainDestination: destination,
        firstTrainTime: firstTime,
        trainFrequency: frequency,
        // nextArrival: nextArrival,
        // minutesAway: minutesAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };
    // Push to add the most recent train info to browser //
    database.ref().push(trainInfo);
    console.log(trainInfo.trainName);
    console.log(trainInfo.trainDestination);
    console.log(trainInfo.firstTrainTime);
    console.log(trainInfo.trainFrequency);
    // console.log(trainInfo.nextArrival);
    // console.log(trainInfo.minutesAway);

    // Clear all text fields //
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#frequency-input").val("");
});

// Firebase initial DataSnapshot load of data from the Database //
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    let name = childSnapshot.val().trainName;
    let destination = childSnapshot.val().trainDestination;
    let firstTime = childSnapshot.val().firstTrainTime;
    let frequency = childSnapshot.val().trainFrequency;
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTime);
    console.log(childSnapshot.val().frequency);
    // console.log(childSnapshot.val().nextArrival);
    // console.log(childSnapshot.val().minutesAway);

    // First Time (pushed back 1 year to make sure it comes before current time) //
    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Determine Current Time //
    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

    // Get Timer Functioning //
    $("#timer").text(currentTime.format("hh:mm a"));

    // Capture the Difference Between the Train Times //
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time Apart Modulus (remainder) //
    let tRemainder = diffTime % frequency;
    console.log("REMAINDER: " + tRemainder);

    // Determine Minutes Until Train Arrives //
    let minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Determine Next Train Arrival //
    let nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

    // Append the New Train Information to the Current Train Schedule List //
    $("#train-table > tbody").append("<tr><td>" + '<i class="fas fa-trash-alt" id="trashcan" aria-hidden="true"></i>' + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

    // Log any Errors to Console //
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// Delete Train on-click function //
$("body").on("click", ".fa-trash-alt", function() {
    $(this).closest("tr").remove(); 
    alert("Confirm Delete");
  });

// Update Minutes Away by Triggering Change in Firebase Child //
function timeUpdater() {
    // Empty tbody before appending new train information //
    $("#train-table > tbody").empty();

    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    let name = childSnapshot.val().trainName;
    let destination = childSnapshot.val().trainDestination;
    let firstTime = childSnapshot.val().firstTrainTime;
    let frequency = childSnapshot.val().trainFrequency;
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTime);
    console.log(childSnapshot.val().frequency);

    // First Time (pushed back 1 year to make sure it comes before current time) //
    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Determine Current Time //
    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

    // Get Timer Functioning //
    $("#timer").text(currentTime.format("hh:mm a"));

    // Capture the Difference Between the Train Times //
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time Apart Modulus (remainder) //
    let tRemainder = diffTime % frequency;
    console.log("REMAINDER: " + tRemainder);

    // Determine Minutes Until Train Arrives //
    let minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Determine Next Train Arrival //
    let nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

    // Append the New Train Information to the Current Train Schedule List //
    $("#train-table > tbody").append("<tr><td>" + '<i class="fas fa-trash-alt" id="trashcan" aria-hidden="true"></i>' + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

    })
};

setInterval(timeUpdater, 5000);



// $("#name-input, #destination-input, #firstTime-input, #frequency-input").val('');

    // $("#name-input").text(snapshot.val().name);
        // $("#role-input").text(snapshot.val().role);
        // $("#startDate-input").text(snapshot.val().startDate);
        // $("#monthsWorked-input").text(snapshot.val().monthsWorked);
        // $("#monthlyRate-input").text(snapshot.val().monthlyRate);
        // $("#totalBilled-input").text(snapshot.val().totalBilled);
   
    // $("#tableBody").append(
    //     "<tr class='well'><td class='train-name'> " + childSnapshot.val().name +
    //     " </td><td class='train-destination'> " + childSnapshot.val().destination +
    //     " </td><td class='train-firstTime'> " + childSnapshot.val().firstTime +
    //     " </td><td class='train-frequency'> " + childSnapshot.val().frequency +
    //     " </td><td class='train-nextArrival'> " + childSnapshot.val().nextArrival +
    //     " </td><td class='train-minutesAway'> " + childSnapshot.val().minutesAway +
    //     " </td></tr>");
    




