import * as React from 'react';
import './App.css';
import Household from './Household/Household'

// const URL =`localhost:8080/bills`

class App extends React.Component{
render () {
return (
  <div>
    <Household/>
  </div>
)
};
}
//   state ={
//     person: [
//       {title: 'title', body: 'Before the call is made'},
//       {title: 'title', body: 'Before the call is made'},
//       {title: 'title', body: 'Before the call is made'},
//     ]
//   }

// nameChangedHandler = (event) => {
//   this.setState({
//     person: [
//       {title: 'title0', body: "body of the state"},
//       {title: 'title1', body: "body of the state"},
//       {title: 'title2', body: "body of the state"},
//     ]

//   }
//   )
// }

// handleSubmit = (event)=>{
//   fetch('https:jsonplaceholder.typicode.com/posts/1')
//       .then((response) => response.json())
//       .then((json) => console.log(json))
//       .catch(err => console.log(err))
// }
// switchNameHandler = () => {
//   console.log('was clicked!');
// }

//   render () {
//     return (
//       <div className="App">
//         <h1>Hi I am a react app</h1>
//         <button onClick={this.handleSubmit}>Call API</button>
//         <Household/>
//       </div>
//     )
//   };


export default App;
