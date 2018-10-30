import React from 'react'
import './App.css'
import Geonames from "geonames.js"
import Awesomplete from "awesomplete"
import Moment from "moment"

class App extends React.Component {
    state = {
        isLoading: false,
        paths: [
            './data/city.json',
            './data/region.json',
            './data/country.json'
        ],
    }

    componentDidMount() {
        this.setState({ isLoading: true })
            let set = new Set();
            let fetches = [];
            this.state.paths.forEach(function (item) {
                fetches.push(fetch(item)
                    .then(response => response.json())
                    .then(data => data.forEach(function (item) {
                        set.add(item.name)
                    })))
            });
            Promise.all(fetches)
                .then(data => {
                    console.log(Array.from(set))
                    this.setState({ isLoading: false })
                })

    }

    render() {
        return (
            <div>{this.state.isLoading && <img src="http://localhost:3000/data/1.svg"/>}</div>
        )
    }
}

export default App
