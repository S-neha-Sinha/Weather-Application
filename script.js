// http://api.weatherapi.com/v1/current.json?key=60514a03f9f8471185a94644252409&q=New Delhi&aqi=no

const tempratureElement = document.querySelector(".temp");
const locationElement = document.querySelector(".location p");
const dateandtimeElement = document.querySelector(".location span");
const conditionElement = document.querySelector(".condition p");
const searchElement = document.querySelector(".search");
const form = document.querySelector('form');
const body = document.body;
const navbar = document.querySelector(".navbar");
const searchInput = document.querySelector(".search");
const navButton = document.querySelector(".navbar button");

form.addEventListener('submit', search)

let loc = 'New Delhi'

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // Fetch weather using lat/lon
            fetchData(`${lat},${lon}`);
        },
        (error) => {
            console.log("Geolocation not available or denied. Using default location.");
            fetchData(loc); // fallback
        }
    );
} else {
    fetchData(loc); // fallback if geolocation not supported
}

const fetchData = async (location) => {
    let url = `http://api.weatherapi.com/v1/current.json?key=60514a03f9f8471185a94644252409&q=${location}&aqi=no`
    const res = await fetch(url)


    //to change the fetched data into json data
    const data = await res.json()
    let name = data.location.name //to get the name of the particular city's name from the data.
    let time = data.location.localtime //to get the time of the particular location from the data.
    let temp = data.current.temp_c //to get the temperature of the particualr location from the data (in celcius).
    let condition = data.current.condition.text //to get the weather condition of the particular location from the data.
    let isday = data.current.is_day

    updateData(temp, name, time, condition, isday)
};

function updateColors(isday) {

    searchInput.style.color = isday ? "black" : "white";
    searchInput.style.borderBottomColor = isday ? "black" : "white";
    navButton.style.color = isday ? "white" : "black";
    navButton.style.backgroundColor = isday ? "black" : "white";
    navbar.style.color = isday ? "black" : "white";

    tempratureElement.style.color = isday ? "black" : "white";
    locationElement.style.color = isday ? "black" : "white";
    dateandtimeElement.style.color = isday ? "black" : "white";
    conditionElement.style.color = isday ? "black" : "white";
};



function updateData(temp, name, time, condition, isday) {
    tempratureElement.innerText = temp;
    locationElement.innerText = name;
    dateandtimeElement.innerText = time;
    conditionElement.innerText = condition;

    const video = document.getElementById("bg-vdo");
    let videoSrc = "";

    if (condition.toLowerCase().includes("sunny") && isday) {
        videoSrc = "Src/clear_day.mp4";
    } else if (condition.toLowerCase().includes("clear") && !isday) {
        videoSrc = "Src/clear_night.mp4";
    } else if (condition.toLowerCase().includes("cloudy")) {
        videoSrc = isday ? "Src/cloudy_day.mp4" : "Src/cloudy_night.mp4";
    } else if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")) {
        videoSrc = isday ? "Src/rainy_day.mp4" : "Src/rainy_night.mp4";
    } else if (condition.toLowerCase().includes("snow") || condition.toLowerCase().includes("sleet")) {
        videoSrc = isday ? "Src/winter_day.mp4" : "Src/winter_night.mp4";
    } else {
        videoSrc = isday ? "Src/clear_day.mp4" : "Src/clear_night.mp4";
    }

    // Update video
    if (video.src !== videoSrc) {
        video.src = videoSrc;
        video.load();
        video.play();
    }

    updateColors(isday);

}

function search(e) {
    e.preventDefault()

    loc = searchElement.value.trim();
    if (loc) {
        fetchData(loc)
    }
}

fetchData(loc);