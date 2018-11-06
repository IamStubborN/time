import React, {Component} from 'react'

import Geonames from "geonames.js"
import Moment from "moment"
import './style.css'

class Results extends Component {

    constructor(props) {
        super(props)
        this.state = {
            result: '',
            geonames: new Geonames({username: 'temp1fsgafg', lan: 'ru', encoding: 'JSON'}),
            bool: true
        }
        this.generateResult = this.generateResult.bind(this)
        this.initAwesomplete = this.initAwesomplete.bind(this)
        this.refactorResponse = this.refactorResponse.bind(this)
        this.findCity = this.findCity.bind(this)
        this.getTimezone = this.getTimezone.bind(this)
        this.updateTime = this.updateTime.bind(this)
    }

    componentDidMount() {
        this.initAwesomplete()
    }

    async initAwesomplete() {
        let self = this
        let input = document.getElementById(this.props.id)
        input.addEventListener('awesomplete-selectcomplete', async function (event) {
            self.setState({result: await self.generateResult(event.target.value)})
        })
        if (input.value) {
            self.setState({result: await self.generateResult(input.value)})
        }
        setInterval(() => {
            this.updateTime()
        }, 1000)
        setInterval(() => {
            this.updateResult()
        }, 100)
    }

    async updateTime() {
        let result = this.state.result
        if (result) {
            let dateTime = Moment(result, 'HH:mm:ss DD.MM.YYYY')
            dateTime.add(1, 'seconds')
            this.setState({result: dateTime.format('HH:mm:ss DD.MM.YYYY')})
        }
    }

    sleep(seconds) {
        var e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) {}
    }
    
    async updateResult() {
        let res1 = document.querySelectorAll('h1')[0].innerText
        let res2 = document.querySelectorAll('h1')[1].innerText
        let results = document.getElementById('results')
        if (!isBlank(res1) && !isBlank(res2)) {
            let dateTime1 = Moment(res1, 'HH:mm:ss DD.MM.YYYY')
            let dateTime2 = Moment(res2, 'HH:mm:ss DD.MM.YYYY')
            let diff = Moment.duration(dateTime2.diff(dateTime1)).asHours().toFixed(0)
            if (Math.abs(diff) === 0) {
                results.innerText = Math.abs(diff);
            } else {
                results.innerText = diff
            }
            results.style.display = 'block'
        }

        function isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }
    }

    async generateResult(e) {
        return await this.refactorResponse(await this.findCity(e))
    }

    refactorResponse(str) {
        let date, time
        try {
            let d = new Date()
            date = str.split(" ")[0].split('-').reverse().join('.')
            time = str.split(" ")[1] + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds()
        } catch (e) {
            console.error(e);
            alert("Город не найден =(")
            return;
        }
        return time + "\n" + date
    }

    findCity(question) {
        return this.state.geonames.search({q: question})
            .then(resp => {
                return resp.geonames
            })
            .then(geonames => {
                return this.getTimezone(geonames[0].lng, geonames[0].lat)
            })
            .then(res => res.time)
            .catch(err => console.error(err))

    }

    getTimezone(lng, lat) {
        return this.state.geonames.timezone({lat: lat, lng: lng})
            .then(resp => {
                return resp
            })
    }

    render() {
        return (
            <h1> {this.state.result}</h1>
        )
    }
}

export default Results
