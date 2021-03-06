// addAnimal == addEntry
// getAnimal == getData

const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = ',us&units=metric&appid=57a2177ab4043fe02d0ceb4845a9b1dc';

// Search via City code, for SG
// http://api.openweathermap.org/data/2.5/weather?id=1880252&appid=57a2177ab4043fe02d0ceb4845a9b1dc
// ✅ Works

document.getElementById("generate").addEventListener('click', performAction);

// document.getElementsByClassName("nav-btn")[0].addEventListener('click', updateUI);



function performAction(e) {
    if (document.getElementById('feelings').value.length > 0 && document.getElementsByClassName("button-selected").length == 1 && document.getElementById('zip').value.length > 0) {
      printValidationText();
      const emoji = document.querySelector('.button-selected').firstElementChild.innerHTML
      const feelings = document.getElementById('feelings').value;
      const zipcode = document.getElementById('zip').value;
      let date = getDate();
      let entry;
      getData(baseURL, zipcode, apiKey)
      .then(function(data) {
          postData('/addEntry', {date: date, emoji: emoji, feelings: feelings, zipcode: zipcode, weather: `${data.weather[0].description.charAt(0).toUpperCase()}${data.weather[0].description.slice(1)}, ${data.main.temp.toFixed(1)}°C`})
      .then(
          updateUI()
      )
      })
    } else {
      printValidationText();
    }
}

function getDate() {
  let a = new Date();
  let d = a.getUTCDate();
  let m = a.toLocaleString('default', {month:'short'});
  let date = `${d} ${m}`;
  return date;
}

function printValidationText() {
  let isemojiValid = (document.getElementsByClassName("button-selected").length == 1);
  let isfeelingsValid = (document.getElementById('feelings').value.length > 0);
  let isZipcodeValid = (document.getElementById('zip').value.length > 0);
  let isemojiWarningAppeared = (document.getElementsByClassName('emoji-warning').length > 0);
  let isfeelingsWarningAppeared = (document.getElementsByClassName('feelings-warning').length > 0);
  let isZipcodeWarningAppeared = (document.getElementsByClassName('zipcode-warning').length > 0);

  if (isemojiValid == false && isemojiWarningAppeared == false) {
    let validationText = document.c
    document.getElementById("emoji-validation-text").innerHTML = '<p class="emoji-warning">Please select your emoji!</p>';
  }

  if (isemojiValid == true && isemojiWarningAppeared == true) {
    document.getElementById("emoji-validation-text").removeChild(document.getElementsByClassName('emoji-warning')[0]);
  }

  if (isfeelingsValid == false && isfeelingsWarningAppeared == false) {
    document.getElementById("feelings-validation-text").innerHTML = `<p class="feelings-warning">Please fill in your feelings!</p>`;
  }

  if (isfeelingsValid == true && isfeelingsWarningAppeared == true) {
    document.getElementById("feelings-validation-text").removeChild(document.getElementsByClassName('feelings-warning')[0]);
  }

  if (isZipcodeValid == false && isZipcodeWarningAppeared == false) {
    document.getElementById("zipcode-validation-text").innerHTML = '<p class="zipcode-warning">Please fill in your zipcode!</p>';
  }

  if (isZipcodeValid == true && isZipcodeWarningAppeared == true) {
    document.getElementById("zipcode-validation-text").removeChild(document.getElementsByClassName('zipcode-warning')[0]);
  }
}

const updateUI = async() => {
    const request = await fetch('/all');
    try {
      const allData = await request.json();
      console.log(allData);
      console.log(allData.length);
      console.log(allData[0].emoji);
      console.log(allData[0].feelings);
      console.log(allData[0].zipcode);
      toggleSelectedMenu();
      updateContent();
      updateWeather(allData);
    } catch(error) {
      console.log("error")
    }
}

// Attempt to use API
const getData = async (baseURL, zipcode, apiKey) => {
  // 1. This is the actual code to run if we want to simulate how actual server data is like
  const res = await fetch(baseURL+zipcode+apiKey)
  // 2. As we are not using a real API, we are simulating 
  // const res = await fetch('/fakedata')
  try {
      const data = await res.json();
      console.log(`---------------------------------------------`);
      console.log(`Raw weather data:`);
      console.log(data);
      console.log(`---------------------------------------------`);
      console.log(`Temperature:`);
      console.log(`${data.main.temp}°C`);
      console.log(`---------------------------------------------`);
      weather = `${data.weather[0].description.charAt(0).toUpperCase()}${data.weather[0].description.slice(1)}, ${data.main.temp.toFixed(1)}°C`;
      return data;
  } catch(error) {
      console.log("error", error)
      // handle the error
  }
}

const postData = async ( url = '', data = {})=>{
  console.log(data);
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },    
    body: JSON.stringify(data), 
  });

    try {
      const newData = await response.json();
      console.log(newData);
      return newData;
    }catch(error) {
      console.log("error", error);
    }
}

function updateWeather(x) {
  let fragment = document.createDocumentFragment();
  let entry = "";
  for (i=0; i<x.length; i++){
    let newEntry = `
                  <div class="diary-entry" id="entryHolder">
                    <h1 class="diary-entry-header" id="date">${x[i].date}</h1>
                    <p class="dairy-entry-weather" id="temp">${x[i].weather}</p>
                    <div class="entry-feelings" id="content">
                      <div class="entry-emoji">${x[i].emoji}</div>
                      <p>“${x[i].feelings}”</p>
                    </div>
                  </div>
                  `
    entry = newEntry + entry;
  }
  fragment = entry;
  document.getElementById('resultsReplace').innerHTML = fragment;
  return;
}

// Makes the emoji emojis clickable
let emojiButtons = document.getElementsByClassName("button-emoji-group");

for (let i = 0; i < emojiButtons.length ; i++) {
  emojiButtons[i].addEventListener('click', emojisClicked);
}

function updateContent() {
  let addEntryHTML = `  
                    <div class="content-add-entry">
                      <div class="illustration-space">
                          <img src="img/top-illustration-01.svg">
                          <h1>Welcome back, Andrew</h1>
                      </div>
                      <form>
                          <label><h1>How are you emoji today?</h1></label>
                          <div class="emotionSelection">
                              <button type="button" class="button-emoji-group">
                                  <div class="button-emoji">😃</div>
                                  Happy!
                              </button>
                              <button type="button" class="button-emoji-group">
                                  <div class="button-emoji">😐</div>
                                  Meh
                              </button>
                              <button type="button" class="button-emoji-group">
                                  <div class="button-emoji">😩</div>
                                  Sigh
                              </button>
                              <button type="button" class="button-emoji-group">
                                  <div class="button-emoji">😡</div>
                                  #@&*!
                              </button>
                              <button type="button" class="button-emoji-group">
                                  <div class="button-emoji">😱</div>
                                  OMG
                              </button>
                          </div>
                          <div id="emoji-validation-text"></div>
                          <label for="feelings"><h1>Any thoughts to add?</h1></label>
                          <input type="text" id="feelings" name="feelings" placeholder="I feel...">
                          <div id="feelings-validation-text"></div>
                          <label for="zipcode"><h1>Let us fetch your weather</h1></label>
                          <input type="text" id="zip" name="zip" placeholder="My zipcode is..."><br>
                          <div id="zipcode-validation-text"></div>
                          <button type="button" class="generate" id="generate">Submit</button>
                      </form>
                    </div>
                    `;
  let viewDiaryHTML = `
                    <div class="content-view-diary">
                      <div id="resultsReplace"></div>
                      <div class="illustration-space">
                          <img src="img/bottom-illustration-01.svg">
                          <h1>Have something on your mind?</h1>
                          <button type="button" class="button-enourage-submission">Submit An Entry</button>
                      </div> 
                    </div>
                    `;
  if (document.getElementsByClassName("nav-btn")[0].classList.length = 2) {
    document.getElementById("content-div").innerHTML = viewDiaryHTML;
  } else {
    document.getElementById("content-div").innerHTML = addEntryHTML;
  }
}

function emojisClicked(evt) {
  // console.log(`You've just clicked ${evt.target.classList}`);
  // console.log(`The parenst clicked ${evt.target.textContent}`);
  // console.log(`You've jut node's class list is; ${evt.target.parentNode.classList}`);
  if (evt.target.classList.contains("button-emoji-group")) {
    if (document.getElementsByClassName("button-selected").length == 1) {
      document.querySelector(".button-selected").classList.toggle("button-selected");
    }
    evt.target.classList.toggle("button-selected");
  } else {
    if (document.getElementsByClassName("button-selected").length == 1) {
      document.querySelector(".button-selected").classList.toggle("button-selected");
    }
    evt.target.parentNode.classList.toggle("button-selected");
  }
}

function toggleSelectedMenu() {
  document.querySelectorAll(".nav-btn")[0].classList.toggle("selected");
  document.querySelectorAll(".nav-btn")[1].classList.toggle("selected");
}