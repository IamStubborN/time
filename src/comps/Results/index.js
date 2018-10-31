import React, {Component} from 'react'

import Geonames from "geonames.js"
import Awesomplete from "awesomplete"
import Moment from "moment"
import './style.css'

class Results extends Component {

    constructor(props) {
        super(props)
        this.state = {
            result1: '',
            result2: ''
        }
        this.generateResult = this.generateResult.bind(this)
        this.initAwesomplete = this.initAwesomplete.bind(this)
        this.refactorResponse = this.refactorResponse.bind(this)
        this.findCity = this.findCity.bind(this)
        this.getTimezone = this.getTimezone.bind(this)
    }

    componentDidMount() {
        this.initAwesomplete()
    }

    initAwesomplete() {
        let self = this
        let input1 = document.getElementById("input1")
        let input2 = document.getElementById("input2")
        this.setState({geonames: new Geonames({username: 'temp1fsgafg', lan: 'ru', encoding: 'JSON'})})
        input1.addEventListener('awesomplete-selectcomplete', async function (event) {
            self.setState({result1: await self.generateResult(event)})
        })
        input2.addEventListener('awesomplete-selectcomplete', async function (event) {
            self.setState({result2: await self.generateResult(event)})
        })
    }

    async generateResult(e) {
        return await this.refactorResponse(await this.findCity(e.target.value))
    }

    refactorResponse(str) {
        // 13:18:54
        // 29.10.2018
        // return time + "</br>" + date;
        let d = new Date()
        let date = str.split(" ")[0].split('-').reverse().join('.')
        let time = str.split(" ")[1] + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds()
        return time + "</br>" + date
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
            <h1> {this.state.result1.split("</br>")[0]}</h1>
        )
    }
}

export default Results