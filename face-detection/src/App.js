import React ,{ Component } from 'react';
import Clarifai  from 'clarifai';
import Particles from "react-tsparticles";
import Signin from './component/Signin/Signin';
import Register from './component/Register/Register';
import Navigation from './component/Navigation/Navigation';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import Logo from './component/Logo/Logo';
import Imagelinkform from './component/ImageLinkform/ImageLinkform';
import Rank from './component/Rank/Rank';
import './App.css';


const app = new Clarifai.App({
  apiKey: 'ef29a854960e4c3a91dc78e80e08b905'
 });


class App extends Component {
  constructor(){
    super();
    this.state = {
        input: '',
        imageUrl:'',
        box: {},
        route:'signin',
        isSignedIn: false,

        user:{
          id:'',
          name:'',
          email:'',
          entries:0,
          joined:'' 
        }
    }
  }
  
  loadUser = (data) => {
    this.setState({user: {
      id:data.id,
      name:data.name,
      email: data.email,
      entries:data.entries,
      joined:data.joined,
    }})
  }


  calculateFacelocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftcol:clarifaiFace.left_col * width,
      toprow: clarifaiFace.top_row * height,
      rightcol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }

  displayFacebox = (box)=> {
    this.setState({box: box});
  }

  onInputChange = (event) => {this.setState({input: event.target.value});}

  onButtonSubmit = () => {this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => {

      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put' ,
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id:this.state.user.id
          })
        })

        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries: count}))
          })
      }
      this.displayFacebox(this.calculateFacelocation(response))})
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState({isSignedIn: false})
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
   this.setState({route:route});
  }
 
  render() {  
  const {isSignedIn,imageUrl,route,box} = this.state;
    return (
    <div className="App">
      <Particles className='particles'  options={{
    fpsLimit: 25,
    interactivity: {
      detectsOn: "canvas",
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40,
        },
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: false,
      },
      move: {
        direction: "none",
        enable: true,
        outMode: "bounce",
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          value_area: 800,
        },
        value: 100,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        random: true,
        value: 5,
      },
    },
    detectRetina: true,
  }} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      <Logo/>
      { route === 'home' 
      ?<div>
      <Rank name={this.state.user.name}
      entries={this.state.user.entries}/>
      <Imagelinkform 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box={box} imageUrl={imageUrl}/>
       </div>

      :(
        route === 'signin' 
       ? <Signin  loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
       : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
       )
      }
    </div>
    );
  }
}
export default App;