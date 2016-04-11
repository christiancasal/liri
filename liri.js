//globals
var fs = require('fs');
var req = require('request');
var keyFile = require('./keys.js');
var prompt = require('prompt');

//liri commands and variables
var liriCmdObj = {
	twitter: 'my-tweets',
	spotify: 'spotify-this-song',
	omdb: 'movie-this',
	random: 'do-what-it-says',
	exit: 'exit'
}

var queryUrl;


//twitter variables
var key, token, reqName;

//spotify variables
var reqSong, reqType;

//omdb variables
var reqMovie;

//text variables
var dataArr;

//program launch
liriPrompter();


function liriPrompter(){

	var terminalCall = '';
	var terminalVar = '';

	prompt.start();

	prompt.message = 'liri';
	prompt.get(['do'], function (err, result) {

	    //console.log('Command-line input received:');
	    if(err){
	    	console.log(err);
	    	return 0;
	    }

		terminalCall = result.do;
	    //console.log(terminalCall);
	    if(terminalCall === liriCmdObj.exit){
	    	console.log('\ngoodbye!\n');
	    	return 0;
	    }

	    
	    if(terminalCall === liriCmdObj.twitter || terminalCall === liriCmdObj.spotify || terminalCall === liriCmdObj.omdb || terminalCall === liriCmdObj.random){
		    if(terminalCall === liriCmdObj.random){
		    	terminalVar = '';
		    	//console.log(terminalCall);
		    	liri(terminalCall, terminalVar);
		    }
		    else{
		    	if(terminalCall == liriCmdObj.twitter){
				    prompt.message = 'screen_name';
				    prompt.get(['do'], function (err, handle) {

				        // console.log('Command-line input received:');

				        terminalVar = handle.do;
				        liri(terminalCall, terminalVar);
				    });
				}
		    	if(terminalCall == liriCmdObj.spotify){
				    prompt.message = 'song';
				    prompt.get(['do'], function (err, song) {

				        // console.log('Command-line input received:');

				        terminalVar = song.do;
				        liri(terminalCall, terminalVar);
				    });
				}
		    	if(terminalCall == liriCmdObj.omdb){
				    prompt.message = 'movie';
				    prompt.get(['do'], function (err, movie) {

				        // console.log('Command-line input received:');

				        terminalVar = movie.do;
				        liri(terminalCall, terminalVar);
				    });
				}
			}
		}
		else{
			console.log('bad command!');
			return 0;
		}
	});
}

function liri(liriCmd, liriVar){
	log(liriCmd,liriVar);

	if(liriCmd === 'my-tweets'){
		//uncomment below for error checking
		//console.log('my-tweets');
		twitter(liriVar);
	}
	else if(liriCmd === 'spotify-this-song'){
		//uncomment for error checking
		//console.log('spotify-this-song');
		reqSong = liriVar; 
		reqType = keyFile.spotify.track;


		//blank argument check
		if(!liriVar){
			reqSong = "What's my age again?";
		}
		
		spotify(keyFile.spotify.url, reqSong, reqType)

	}
	else if(liriCmd === 'movie-this'){
		//uncomment below for error checking
		//console.log('movie-this');
		reqMovie = liriVar;

		//blank argument check
		if(!liriVar){
			reqMovie = "Mr. Nobody";
		}

		omdb(keyFile.omdb.url, reqMovie, keyFile.omdb.includeRotten)

	}
	else if(liriCmd === 'do-what-it-says'){
		//uncomment below for error checking
		//console.log('do-what-it-says');s

		fs.readFile('random.txt', 'utf8', function(error,response){
			if(error){
				console.log(error);
			}
			else{
				//console.log(response);
				dataArr = response.split(",");
				//console.log(dataArr) 

				liri(dataArr[0], dataArr[1]);
			}

		});
	}
}

function twitter(reqTwitterName){

	var Twitter = require('twitter');

	var client = new Twitter({
	  consumer_key: keyFile.twitterKeys.consumer_key,
	  consumer_secret: keyFile.twitterKeys.consumer_secret,
	  access_token_key: keyFile.twitterKeys.access_token_key,
	  access_token_secret: keyFile.twitterKeys.access_token_secret
	});

	var params = {screen_name: reqTwitterName , count:20};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  	//uncomment below for error checking
	  	//console.log(tweets)
	    if (!error) {
	      console.log("\n---------------------------------------\n");
	  	  for(i = 0; i < params.count; i++){  	  	
		      console.log("@" + tweets[i].user.screen_name);
		      console.log("Tweet " + "#" + (i + 1) + ": " + tweets[i].text);
		      console.log("Created: " + tweets[i].created_at + "\n");
		  }
		  console.log("\n---------------------------------------\n");
	  	liriPrompter();
	  	}

	});

}

function spotify(url, song, type){

	queryUrl = url+ song + type;

	req(queryUrl, function(error, response, body){
		if (!error && response.statusCode == 200) {
			//uncomment below for error checking
			//console.log(response.body)
			var data = JSON.parse(body)
		    
		    var songData = {
		    	artist: data.tracks.items[0].artists[0].name,
		    	song: data.tracks.items[0].name,
				preview: data.tracks.items[0].preview_url,
				album: data.tracks.items[0].album.name
			}
			console.log("\n---------------------------------------\n");
			console.log("Artist: " + songData.artist);
			console.log("Song: " + songData.song);
			console.log("Preview: " + songData.preview);
			console.log("Album: " + songData.album);
	   		console.log("\n---------------------------------------\n");
	   		liriPrompter();
	   	}
	});	
}

function omdb(url, movie, type){

	queryUrl = url+ movie + type;

	req(queryUrl, function(error,response,body){
		if (!error && response.statusCode == 200){
			//uncomment below for error checking
			//console.log(response)
			var data = JSON.parse(body);
			//console.log(data);
			console.log("\n---------------------------------------\n");
			console.log("Title: " + data.Title);
			console.log("Year: " + data.Year);
			console.log("IMDB Rating: " + data.imdbRating);
			console.log("Country: " + data.Country + "\n");
			console.log("Plot: " + data.Plot);	
			console.log("Starring: " + data.Actors + "\n");

			console.log("Tomato Score: " + data.tomatoUserMeter);
			console.log("Tomato URL: " + data.tomatoURL);
			console.log("\n---------------------------------------\n");
			liriPrompter();
		}
	});
}

function log(liriCmd, liriVar){
	fs.appendFile('log.txt', liriCmd + "," + liriVar + "\n", function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log("\nLogged");
		}
	});
}