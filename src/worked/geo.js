const Geonames = require('geonames.js');
const Awesomplete = require('awesomplete');
const Moment = require('moment');

const geonames = new Geonames({username: 'temp1fsgafg', lan: 'ru', encoding: 'JSON'});

const path = [
    './city.json',
    './country.json',
    './region.json',
];

function parseCities(paths) {
    let set = new Set();
    let fetches = [];
    paths.forEach(function (item) {
        fetches.push(fetch(item)
            .then(response => response.json())
            .then(data => data.forEach(function (item) {
                set.add(item.name)
            })))
    });
    Promise.all(fetches)
        .then(data => createInputs(Array.from(set)))


}

function createInputs(data) {
    let input1 = document.getElementById("myInput1");
    let input2 = document.getElementById("myInput2");
    let awesomplete = new Awesomplete(input1);
    awesomplete.list = data;
    awesomplete = new Awesomplete(input2);
    awesomplete.list = data;
    input1.addEventListener('awesomplete-selectcomplete', async function (e) {
        myResult1.innerHTML =refactorResponse(await findCity(e.target.value));
    });

    input2.addEventListener('awesomplete-selectcomplete', async function (e) {
        myResult2.innerHTML = refactorResponse(await findCity(e.target.value));
    });

}

function refactorResponse(str) {
    // 13:18:54
    // 29.10.2018
    // return time + "</br>" + date;
    let d = new Date();
    let date = str.split(" ")[0].split('-').reverse().join('.');
    let time = str.split(" ")[1] + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    return time + "</br>" + date;
}

function updateTime() {
    let time1, date1, time2, date2 = '';
    let minutesLastValue = 0;
    let dateTime1, dateTime2 = {};
    setInterval(function () {
        let bool1 = !(myResult1.innerHTML === '');
        let bool2 = !(myResult2.innerHTML === '');
        let d = new Date();
        if (bool1) {
            time1 = myResult1.innerText.split('\n')[0];
            date1 = myResult1.innerText.split('\n')[1];
            let hours1 = time1.split(':')[0];
            let minutes = ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
            if (minutesLastValue === 59 && +minutes.split(':')[1] === 0) {
                hours1++;
                minutesLastValue = +minutes.split(':')[1];
            } else {
                minutesLastValue = +minutes.split(':')[1];
            }
            let seconds = ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
            let timeRes1 = hours1 + minutes + seconds;
            myResult1.innerHTML = timeRes1 + "</br>" + date1;
            dateTime1 = Moment(timeRes1 + " " + date1, 'HH:mm:ss DD.MM.YYYY')
        }

        if (bool2) {
            time2 = myResult2.innerText.split('\n')[0];
            date2 = myResult2.innerText.split('\n')[1];
            let hours2 = time2.split(':')[0];
            let minutes = ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
            if (minutesLastValue === 59 && +minutes.split(':')[1] === 0) {
                hours2++;
            } else {
                minutesLastValue = +minutes.split(':')[1];
            }
            let seconds = ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
            let timeRes2 = hours2 + minutes + seconds;
            myResult2.innerHTML = timeRes2 + "</br>" + date2;
            dateTime2 = Moment(timeRes2 + " " + date2, 'HH:mm:ss DD.MM.YYYY')
        }
        if (bool1 && bool2) {
            // difference.innerText = Moment.duration(Moment(dateTime2.diff(dateTime1))).format('HH:mm:ss');
            difference.innerText = Moment.duration(dateTime2.diff(dateTime1)).asHours();
        }
    }, 100);
}

async function findCity(question) {
    return geonames.search({q: question})
        .then(resp => {
            return resp.geonames;
        })
        .then(geonames => {
            return getTimezone(geonames[0].lng, geonames[0].lat);
        })
        .then(res => res.time)
        .catch(err => console.error(err));

    function getTimezone(lng, lat) {
        return geonames.timezone({lat: lat, lng: lng})
            .then(resp => {
                return resp;
            })
    }
}


async function start() {
    parseCities(path);
    myResult1.innerHTML = refactorResponse(await findCity("Москва"));
    updateTime();
}

start();
