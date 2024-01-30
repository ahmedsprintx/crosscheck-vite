// NOTE: export default Component;
import React, { useState } from 'react';

const BuggyCounter = () => {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter(counter + 1);
  };

  if (counter === 5) {
    // NOTE: Simulate a JS error
    throw new Error('I crashed!');
  }
  return <h1 onClick={handleClick}>{counter}</h1>;
};

export default BuggyCounter;
