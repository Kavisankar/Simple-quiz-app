import React from 'react';
import HomeScreen from './screens/HomeScreen';
import './App.sass';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <div className="app d-flex flex-column">
            <ErrorBoundary>
                <HomeScreen />
            </ErrorBoundary>
        </div>
    );
}

export default App;
