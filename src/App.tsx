import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChallengeProvider } from './context/ChallengeContext';
import { PaymentProvider } from './context/PaymentContext';
import { AppRouter } from './router/AppRouter';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChallengeProvider>
          <PaymentProvider>
            <div className="App">
              <AppRouter />
            </div>
          </PaymentProvider>
        </ChallengeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
