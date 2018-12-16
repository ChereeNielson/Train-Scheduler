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

    // Provide initial data to your Firebase database //
    let trainInfo = {
        trainName: name,
        trainDestination: destination,
        firstTrainTime: firstTime,
        trainFrequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };
    // Push to add the most recent train info to browser //
    database.ref('train').push(trainInfo);
    console.log(trainInfo.trainName);
    console.log(trainInfo.trainDestination);
    console.log(trainInfo.firstTrainTime);
    console.log(trainInfo.trainFrequency);

    // Clear all text fields //
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#frequency-input").val("");
});

// Firebase initial DataSnapshot load of data from the Database //
database.ref('train').on("child_added", function(childSnapshot, prevChildKey) {
    // console.log("childSnapshot", childSnapshot.ref);
    let id = childSnapshot.key;
    let name = childSnapshot.val().trainName;
    let destination = childSnapshot.val().trainDestination;
    let firstTime = childSnapshot.val().firstTrainTime;
    let frequency = childSnapshot.val().trainFrequency;
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDestination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().trainFrequency);

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
    $("#train-table > tbody").append("<tr><td>" + '<i id=' + id + ' class="fas fa-trash-alt" id="trashcan" aria-hidden="true"></i>' + "</td><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");


// Delete Train on-click function //
$("body").on("click", ".fa-trash-alt", function() {
    $(this).closest("tr").remove(); 
    // alert("Confirm Delete");
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
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDestination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().trainFrequency);
    
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
    $("#train-table > tbody").append("<tr><td>" + '<i id=' + id + ' class="fas fa-trash-alt" aria-hidden="true"></i>' + "</td><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
    
    })
};

// Log any Errors to Console //
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// Function to remove data from Firebase //
let remove = function(e){
    e.preventDefault();
    // e.stopPropogation();
    let key = $(this).attr("id");
    console.log(key)
    console.log(firebase.database());
    
    if(confirm('Are you sure?')){
      database.ref('train/' + key).remove();
    }
}
$('#train-table > tbody').on("click", ".fa-trash-alt", remove);
