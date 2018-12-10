// Initialize Firebase
var config = {
    apiKey: "AIzaSyBnKaz97Ae8XTn03c5KV-uKbAPFluF6NAc",
    authDomain: "intro-to-firebase-98eac.firebaseapp.com",
    databaseURL: "https://intro-to-firebase-98eac.firebaseio.com",
    projectId: "intro-to-firebase-98eac",
    storageBucket: "intro-to-firebase-98eac.appspot.com",
    messagingSenderId: "164243903301"
};
firebase.initializeApp(config);
var database = firebase.database();
var name = "";
var role = "";
var startDate = "";
var monthsWorked = "";
var monthlyRate = "";
var totalBilled = "";
// var randomDate = "02/23/1999";
// var randomFormat = "DD/MM/YYYY";
// var convertedDate = moment(randomDate, rendomFormat);
$("#add-user").on("click", function (event) {
    event.preventDefault();
    console.log(name)
    console.log(role)
    console.log(startDate);
    console.log(monthsWorked);
    console.log(monthlyRate);
    console.log(totalBilled);
    name = $("#name-input").val().trim();
    role = $("#role-input").val().trim();
    startDate = $("#startDate-input").val().trim();
    monthsWorked = 0;
    monthlyRate = $("#monthlyRate-input").val().trim();
    totalBilled = 0;
    $("#tableBody").append("<tr> <td>" + name + "</td> <td>" + role + "</td> <td>" + startDate + "</td> <td>" + monthsWorked + "</td> <td>" + monthlyRate + "</td> <td>" + totalBilled + "</td> </tr>");
    database.ref().push({
        name: name,
        role: role,
        startDate: startDate,
        monthsWorked: monthsWorked,
        monthlyRate: monthlyRate,
        totalBilled: totalBilled,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("#name-input, #role-input, #startDate-input, #monthsWorked-input, #monthlyRate-input, #totalBilled-input").val('');
});
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().role);
    console.log(childSnapshot.val().startDate);
    console.log(childSnapshot.val().monthsWorked);
    console.log(childSnapshot.val().monthlyRate);
    console.log(childSnapshot.val().totalBilled);
    // // Change the HTML to reflect
    // $("#name-input").text(childSnapshot.name);
    // $("#role-input").text(childSnapshot.role);
    // $("#startDate-input").text(childSnapshot.startDate);
    // $("#monthsWorked-input").text(childSnapshot.monthsWorked);
    // $("#monthlyRate-input").text(childSnapshot.monthlyRate);
    // $("#totalBilled-input").text(childSnapshot.totalBilled);
    $("#tableBody").append(
        "<tr class='well'><td class='member-name'> " + childSnapshot.val().name +
        " </td><td class='member-role'> " + childSnapshot.val().role +
        " </td><td class='member-startDate'> " + childSnapshot.val().startDate +
        " </td><td class='member-monthsWorked'> " + childSnapshot.val().monthsWorked +
        " </td><td class='member-monthlyRate'> " + childSnapshot.val().monthlyRate +
        " </td><td class='member-totalBilled'> " + childSnapshot.val().totalBilled +
        " </td></tr>");
    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
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