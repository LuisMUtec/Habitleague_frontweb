import { useState } from 'react';

export const useApi = () => {
  const [loading] = useState(false);
  const [error] = useState(null);

  return {
    loading,
    error,
    get: () => {},
    post: () => {},
    put: () => {},
    delete: () => {}
  };
}; 