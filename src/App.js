import './App.css';

function App() {
  return (
    <div className="App">
      <div className="home-container">
        <h1 className="app-title">Youtube Channel Filterer</h1>
        <div className="search-container">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Choose a channel"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
