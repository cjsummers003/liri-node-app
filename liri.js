//Initialize
require("dotenv").config();

//Import API keys & NPM Packages
var keys = require("./keys")
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');
var spotify = new Spotify(keys.spotify);

//Import FS package for read/write.
var fs = require('fs');

//Take input as first argument and remove the dashes
var input = process.argv[2]
for (var i = 0; i < input.length; i++) {
    input = input.replace("-", "")
}
//Take query as second argument
var query = []
for (var k = 3; k < process.argv.length; k++) {
    query.push(process.argv[k])
}
query = query.toString()
for (var j = 0; j < query.length; j++) {
    query = query.replace(",", " ")
}

//Set up a methods object to take all of the commands and run the functions
var methods = {
    //  ------------------ BANDS IN TOWN ------------------
    concertthis: function () {
        if (!query) {
            query = "Beartooth"
        }
        var queryUrl = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp"

        request(queryUrl, function (error, response, data) {

            if (!error && response.statusCode === 200) {
                var bandReturn = JSON.parse(data)

                for (let i = 0; i < bandReturn.length; i++) {
                    var event = bandReturn[i]
                    console.log("\n" + query + "\nVenue: " + event.venue.name + "\nCity: " + event.venue.city + "\nDate: " + moment(event.datetime).format("MM/DD/YYYY"))
                }
            }
        });
    },
    //  ------------------ SPOTIFY ------------------
    spotifythissong: function (query) {
        if (!query) {
            query = "The Sign"
        }
        spotify.search({
            type: 'track',
            query: query
        }, function (error, data) {
            if (!error) {
                var spotifyReturn = data.tracks.items

                for (let i = 0; i < spotifyReturn.length; i++) {
                    console.log("\nArtist: " + spotifyReturn[i].album.artists[0].name + "\nSong: " + spotifyReturn[i].name + "\nPreview Link: " + spotifyReturn[i].external_urls.spotify + "\nAlbum: " + spotifyReturn[i].album.name)
                }

            } else {
                return console.log('Error occurred: ' + error);
            }
        });
    },
    //  ------------------ OMDB ------------------
    moviethis: function () {
        if (!query) {
            query = "Mr. Nobody"
        }
        var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + query 

        request(queryUrl, function (error, response, data) {

            if (!error && response.statusCode === 200) {
                var omdbReturn = JSON.parse(data)

                console.log("\nTitle: " + omdbReturn.Title + "\nYear: " + omdbReturn.Year + "\nIMDB Rating: " + omdbReturn.Ratings[0].Value + "\nRotten Tomatoes Rating: " + omdbReturn.Ratings[1].Value + "\nCountry: " + omdbReturn.Country + "\nLanguage: " + omdbReturn.Language + "\nActors: " + omdbReturn.Actors + "\nPlot: " + omdbReturn.Plot)
            }
        });
    },
    dowhatitsays: function () {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error) {
                var dwis = data.split(",")
                var command = dwis[0]
                var request = dwis[1]
                if (command === "spotify-this-song") {
                    methods.spotifythissong(request)
                }
            } else {
                console.log(error)
            }

        });
    }
}
//Run the methods based on the input
methods[input](query)