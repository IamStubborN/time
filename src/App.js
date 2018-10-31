import React from 'react'
import './awesomplete.css'
import './App.css'
import Results from "./comps/Results"
import Awesomplete from "awesomplete"

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            display: 'none',
            paths: [
                './data/city.json',
                './data/region.json',
                './data/country.json'
            ],
        }
        this.createDataArray = this.createDataArray.bind(this)
        App.initAwesomplete = App.initAwesomplete.bind(this)
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
                App.initAwesomplete(temp)
                this.setState({isLoading: false, display: 'block'})
            })
    }

    static initAwesomplete(array) {
        let input1 = document.getElementById("input1")
        let input2 = document.getElementById("input2")
        new Awesomplete(input1, {
            list: array
        })
        new Awesomplete(input2, {
            list: array
        })
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
                            <input id="input1" defaultValue="Москва" placeholder={'Введите положение'}/>
                            <Results id={'input1'}/>
                        </div>
                        <div className="group">
                            <label htmlFor="input2">Другое положение</label>
                            <input id="input2" placeholder={'Введите положение'}/>
                            <Results id={'input2'}/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default App
