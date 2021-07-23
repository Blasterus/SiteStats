/* document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      d = document;

      //var f = d.createElement('form');
      //f.action = 'http://gtmetrix.com/analyze.html?bm';
      //f.method = 'post';
      //var i = d.createElement('input');
      //i.type = 'hidden';
      //i.name = 'url';
      //i.value = tab.url;
      //f.appendChild(i);
      //d.body.appendChild(f);
      //f.submit();

    });
  }, false);
}, false);
 */


// Readability (Mashape) API Key for testing: PQ4FOFuaR6mshI6qpnQKQvkDZQXjp1o6Zcqjsnug7GvNggTzUE

"use strict";
var input = document.querySelectorAll('textarea')[0],
  characterCount = document.querySelector('#characterCount'),
  wordCount = document.querySelector('#wordCount'),
  readingTime = document.querySelector('#readingTime'),
  readability = document.querySelector('#readability'),

// updating the displayed stats after every keypress
input.addEventListener('keyup', function() {

  //keeping the console clean to make only the latest data visible
  console.clear();

  // character count
  // just displaying the input length as everything is a character
  characterCount.innerHTML = input.value.length;


  var words = input.value.match(/\b[-?(\w+)?]+\b/gi);
  // console.log(words);
  if (words) {
    wordCount.innerHTML = words.length;
  } else {
    wordCount.innerHTML = 0;
  }

  // reading time based on 275 words/minute
  if (words) {
    var seconds = Math.floor(words.length * 60 / 275);
    // need to convert seconds to minutes and hours
    if (seconds > 59) {
      var minutes = Math.floor(seconds / 60);
      seconds = seconds - minutes * 60;
      readingTime.innerHTML = minutes + "m " + seconds + "s";
    } else {
      readingTime.innerHTML = seconds + "s";
    }
  } else {
    readingTime.innerHTML = "0s";

  }
} );


// readability level using readability-metrics API from Mashape
readability.addEventListener('click', function() {

  // placeholder until the API returns the score
  readability.innerHTML = "Fetching score...";

  var requestUrl = "https://ipeirotis-readability-metrics.p.mashape.com/getReadabilityMetrics?text=";
  var data = input.value;

  var request = new XMLHttpRequest();
  request.open('POST', encodeURI(requestUrl + data), true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.setRequestHeader("X-Mashape-Authorization", "PQ4FOFuaR6mshI6qpnQKQvkDZQXjp1o6Zcqjsnug7GvNggTzUE");
  request.send();

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      readability.innerHTML = readingEase(JSON.parse(this.response).FLESCH_READING);
    } else {
      // We reached our target server, but it returned an error
      readability.innerHTML = "Not available.";
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    readability.innerHTML = "Not available.";
  };
});

// function to convert FLESCH READING SCORE into meaningful string.
function readingEase(num) {
  switch (true) {
    case (num <= 30):
      return "Readability: College graduate.";
      break;
    case (num > 30 && num <= 50):
      return "Readability: College level.";
      break;
    case (num > 50 && num <= 60):
      return "Readability: 10th - 12th grade.";
      break;
    case (num > 60 && num <= 70):
      return "Readability: 8th - 9th grade.";
      break;
    case (num > 70 && num <= 80):
      return "Readability: 7th grade.";
      break;
    case (num > 80 && num <= 90):
      return "Readability: 6th grade.";
      break;
    case (num > 90 && num <= 100):
      return "Readability: 5th grade.";
      break;
    default:
      return "Not available.";
      break;
  }
}
