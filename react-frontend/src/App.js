import React, { Component } from 'react';
import './App.css';
import Routes from './routes';
import '../node_modules/reactjs-toastr/lib/toast.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGhost } from '@fortawesome/free-solid-svg-icons'

library.add(faGhost)
class App extends Component {

    constructor(props){
        super(props);

    }





  render() {


    return (
        <div>
            <Routes name="React-App"/>
        </div>




    );
  }
}

export default App;
