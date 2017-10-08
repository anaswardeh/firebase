$(document).ready(function() {



    var config = {
        apiKey: "AIzaSyAkDXbM85TBkjTI-tihGw5zz4-7UEJa0xs",
        authDomain: "train-schedule12.firebaseapp.com",
        databaseURL: "https://train-schedule12.firebaseio.com",
        projectId: "train-schedule12",
        storageBucket: "train-schedule12.appspot.com",
        messagingSenderId: "364250725892"
    };

    firebase.initializeApp(config);


    setInterval(function() {
        $('.current-time').html(moment().format('hh:mm:ss A'))
    }, 1000);



    var database = firebase.database();
    var trainName = '';
    var TrainDestination = '';
    var firstTrain = '';
    var frequency = '';
    var nextTrain = '';
    var nextTrainPretty = '';
    var firstTrainPretty = '';
    var minAway = '';
    var currentTime = '';
    var diffTime = '';
    var tRemainder = '';
    var key = '';
    var newTime;
    var newTrain;

    // 2. Button for adding trains
    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();

        // Grabs user input
        trainName = $("#train-name-input").val().trim();
        TrainDestination = $("#destination-input").val().trim();
        firstTrain = $("#first-train-input").val().trim();
        frequency = $("#frequency-input").val().trim();


        //Intial Time
        firstTrainPretty = moment(firstTrain, "hh:mm").subtract(1, "years");

        //Current time
        currentTime = moment();

        diffTime = moment().diff(moment(firstTrainPretty), "minutes");

        //Time Apart (remainder)
        tRemainder = diffTime % parseInt(frequency);

        //Minutes until Train

        minAway = parseInt(frequency) - tRemainder;


        //nextTrain
        nextTrain = moment().add(minAway, "minutes");

        nextTrainPretty = moment(nextTrain).format("hh:mm A");

        if (diffTime >= 0) {
            newTime = null;
            newTime = moment().add(minAway, 'minutes').format('hh:mm A');

        } else {
            newTime = null;
            newTime = firstTimeConverted.format('hh:mm A');
            minAway = Math.abs(timeDiff - 1);
        }


        // Creates local "temporary" object for holding train data
        newTrain = {
            trainName: trainName,
            TrainDestination: TrainDestination,
            firstTrain: firstTrain,
            frequency: frequency,
            nextTrainPretty: nextTrainPretty,
            minAway: minAway
        };


        // Uploads train data to the database
        database.ref().push(newTrain);




    });


    // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {

        // Store everything into a variable.
        key = childSnapshot.key;
        console.log(key);
        trainName = childSnapshot.val().trainName;
        TrainDestination = childSnapshot.val().TrainDestination;
        firstTrain = childSnapshot.val().firstTrain;
        frequency = childSnapshot.val().frequency;
        nextTrainPretty = childSnapshot.val().nextTrainPretty;
        minAway = childSnapshot.val().minAway;


        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");


        // Add each train's data into the table
        $("#train-table > tbody").append("<tr id=" + "'" + key + "'" + ">" + "<td>" +
            trainName + "</td><td>" +
            TrainDestination + "</td><td>" +
            frequency + "</td><td>" +
            nextTrainPretty + "</td><td>" +
            minAway + "</td><td> " +
            "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td><td>");


    });
    $("body").on("click", ".remove-train", function() {
        $(this).closest('tr').remove();
        getKey = $(this).parent().parent().attr('id');
        console.log("get key" + getKey);
        database.ref().child(getKey).remove();
    });



});