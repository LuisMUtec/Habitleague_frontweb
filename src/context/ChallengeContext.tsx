import React, { createContext, useContext, useState } from 'react';

const ChallengeContext = createContext({});

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState([]);

  return (
    <ChallengeContext.Provider value={{ challenges, setChallenges }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallengeContext = () => useContext(ChallengeContext); 