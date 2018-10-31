import React, {Component} from 'react'

import Geonames from "geonames.js"
import Awesomplete from "awesomplete"
import Moment from "moment"
import './style.css'

class Results extends Component {

    constructor(props) {
        super(props)
        this.state = {
            result: '',
            geonames: new Geonames({username: 'temp1fsgafg', lan: 'ru', encoding: 'JSON'}),
            minutesLastValue: 0
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
            let date = new Date()
            this.updateTime(date)
        }, 200)
    }

    async updateTime(date) {
        let result = this.state.result
        let results = document.getElementById('results')
        let res1 = document.querySelectorAll('h1')[0].innerText
        let res2 = document.querySelectorAll('h1')[1].innerText
        if (result) {
            let dateTime = Moment(result, 'HH:mm:ss DD.MM.YYYY')
            dateTime.set("second", date.getSeconds())
            dateTime.set("minutes", date.getMinutes())
            this.setState({result: dateTime.format('HH:mm:ss DD.MM.YYYY')})
        }
        if (!isBlank(res1) && !isBlank(res2)) {
            let dateTime1 = Moment(res1, 'HH:mm:ss DD.MM.YYYY')
            let dateTime2 = Moment(res2, 'HH:mm:ss DD.MM.YYYY')
            results.innerText = Math.abs(Moment.duration(dateTime2.diff(dateTime1)).asHours().toFixed(0));
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
