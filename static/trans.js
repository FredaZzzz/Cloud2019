function preParseDate(datestr){
  /**
   * Convert a string of date to an array.
   * Add year to datestr with format "mm-dd".
   * This function is separated from the parseDate(datestr) function 
   * in order for postEvent() function to validate the format of input date.
   * @param {datestr} var A string in the format of "yyyy-mm-dd" or "mm-dd"
   * @return {arr} array The converted array [y,m,d]
   */
  var arr = datestr.split('-');
  if(arr.length == 2){ //arr[0]=month, arr[1]=date
    var today = new Date();
    if(today.getMonth()+1 >= arr[0] && today.getDate() > arr[1]){
      arr.unshift(today.getFullYear() + 1);
    }
    else arr.unshift(today.getFullYear());
  }
  else if(arr.length != 3)//arr[0]=year, arr[1]=month, arr[2]=date
    return [-1,-1,-1];
  return arr;
}

function parseDate(datestr) {
  /**
   * With reference to the instruction document.
   * Convert a string of date to the Date object.
   * @param {datestr} var A string in the format of "yyyy-mm-dd" or "mm-dd"
   * @return {Date} obj The converted Date object
   */
  var arr = preParseDate(datestr);//arr[0]=year, arr[1]=month, arr[2]=date
  return new Date(Number.parseInt(arr[0]), Number.parseInt(arr[1]-1), Number.parseInt(arr[2]));
}


function getRemainingTime(datestr){
  /**
   * Takes in a date (in string with format "yyyy-mm-dd" or "mm-dd"),
   *  calculates the time left until that date, 
   *  and return the count down (in string with format "xxdays xxhrs xxmins xxsecs").
   * @param {datestr} var A string in the format of "yyyy-mm-dd" or "mm-dd"
   * @return {str} A string indicating the time interval
   */
  var date = parseDate(datestr);
  let seconds = Math.floor((+date - new Date()) / 1000);
  if (seconds<0) return "Expired";
  var days2go = parseInt(seconds/86400, 10);
  var rest = seconds % 86400;
  var hours2go = parseInt(rest/3600, 10);
  rest = rest % 3600;
  var mins2go = parseInt(rest/60,10);
  rest = rest % 60;
  var secs2go = rest;
  return `${days2go}days ${hours2go}hrs ${mins2go}mins ${secs2go}secs`;	
}


function postEvent(){  
  /**
   * Read event name and event date from html input,
   *  send to server via XMLHttpRequest()
   *  by making a POST request to url '/event'.
   */
  var x = document.getElementById("frm1");
  var arr = preParseDate(x.elements[1].value);
  var date = parseDate(x.elements[1].value);
  if (date.getFullYear() != arr[0]
    || date.getMonth()!= arr[1]-1
    || date.getDate()!=arr[2]){
    alert("Invalid Date Format");
    return False;
    }
  var obj = {name:x.elements[0].value, date:x.elements[1].value};
  var Json = JSON.stringify(obj);
  var xmlhttp = new XMLHttpRequest();   
  var url = "event";
  xmlhttp.open("POST", url);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify(Json));
  location.reload(forceGet);
}


function reqJSON(method, url, payload) {
  /**
   * Taken from instruction document.
   * Sends a request to server and store the result in ${data} 
   * ${data} is expected to be json. 
   * @param {method} string Such as "POST" or "GET"
   * @param {url} string Such as "/" or "/events"
   * @param {payload} string The payload to send to the server
   */
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({status: xhr.status, data: xhr.response});
      } else {
        reject({status: xhr.status, data: xhr.response});
      }
    };
    xhr.onerror = () => {
      reject({status: xhr.status, data: xhr.response});
    };
    xhr.send(payload);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  /**
   * Taken from instruction document.
   * Loading the event information from server 
   *  by making a GET request to url '/events' 
   */
  reqJSON('GET', 'events')
  .then(({status, data}) => {
    let html = '<tr><th> Event Name </th><th> Event Date </th><th> Count Down </th></tr>';
    for (let event of data.events) {
      var str = getRemainingTime(event.date);
      if(str == "Expired")continue;
      html += `<tr><td> ${event.name} </td><td> ${event.date} </td><td> ${str} </td></tr>`;
    }
    document.getElementById('list').innerHTML = html;
  })
  .catch(({status, data}) => {
    // Display an error.
    document.getElementById('events').innerHTML = 'ERROR: ' + JSON.stringify(data);
  });
});


//Lab2 functions
function login(){
  var x = document.getElementById("login_form");
  var username = x.elements[0].value;
  var password = x.elements[1].value
  var obj = {username:x.elements[0].value, password:x.elements[1].value};
  var Json = JSON.stringify(obj);
  var xmlhttp = new XMLHttpRequest(); 
  xmlhttp.responseType = "document";  
  xmlhttp.onreadystatechange = function() {
    
      // Here we go on the new page
      console.log(xmlhttp.status);
      console.log(xmlhttp.responseText);
      //window.location = xmlhttp.responseText;
    
  };
  var url = "login";
  xmlhttp.open("POST", url);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify(Json));
  console.log("2");
  console.log(xmlhttp.responseText);
  //location.reload(forceGet);
}

