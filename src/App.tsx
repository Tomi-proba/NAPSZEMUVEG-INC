import Scene from './components/Scene'
import Panel from './components/Panel/Panel'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="viewport">
        <Scene />
      </div>
      <Panel />
    </div>
  )
}

export default App
