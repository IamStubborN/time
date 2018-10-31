import React from 'react'
import Awesomplete from "awesomplete"
import Results from "./comps/Results"

import './awesomplete.css'
import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            display: 'none',
            paths: [
                './data/city.json',
                './data/region.json',
                './data/country.json',
                './data/countriesNEW.json',
                './data/regionsNEW.json'
            ],
        }
        this.createDataArray = this.createDataArray.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
        this.initAwesomplete = this.initAwesomplete.bind(this)
    }

    createDataArray() {
        this.setState({isLoading: true})
        let set = new Set()
        let fetches = []
        this.state.paths.forEach(function (item) {
            fetches.push(fetch(item)
                .then(response => response.json())
                .then(data => data.forEach(function (item) {
                    set.add(item.name)
                })))
        })
        Promise.all(fetches)
            .then(data => {
                let temp = Array.from(set)
                this.initAwesomplete(temp)
                this.setState({isLoading: false, display: 'block'})
            })
    }

    initAwesomplete(array) {
        let input1 = document.getElementById("input1")
        let input2 = document.getElementById("input2")
        let aw1 = new Awesomplete(input1, {
            list: array
        })
        let aw2 = new Awesomplete(input2, {
            list: array
        })
        this.setState({aw1: aw1, aw2: aw2})
    }

    handleEnter(e) {
        if (e.which === 13) {
            if (e.currentTarget.id === 'input1') {
                document.getElementById(e.currentTarget.id).dispatchEvent(new Event('awesomplete-selectcomplete'))
                this.state.aw1.close();
            } if (e.currentTarget.id === 'input2') {
                document.getElementById(e.currentTarget.id).dispatchEvent(new Event('awesomplete-selectcomplete'))
                this.state.aw2.close();
            }
        }
    }

    componentDidMount() {
        this.createDataArray()
    }

    render() {
        const {isLoading} = this.state
        return (
            <React.Fragment>
                {isLoading && <div className='parent'>
                    <div className="cssload-main">
                        <div className="cssload-heart">
                            <span className="cssload-heartL"/>
                            <span className="cssload-heartR"/>
                            <span className="cssload-square"/>
                        </div>
                        <div className="cssload-shadow"/>
                    </div>
                </div>}
                <div style={{display: this.state.display}} className="container">
                    <div className="cards">
                        <div className="group">
                            <label htmlFor="input1">Ваше положение</label>
                            <input id="input1" onKeyPress={this.handleEnter} defaultValue="Москва" placeholder={'Введите положение'}/>
                            <Results id={'input1'} defaultValue={"Москва"}/>
                        </div>
                        <div className="group">
                            <label htmlFor="input2">Другое положение</label>
                            <input id="input2" onKeyPress={this.handleEnter} placeholder={'Введите положение'}/>
                            <Results id={'input2'}/>
                        </div>
                    </div>
                    <div id={'results'}>

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default App
