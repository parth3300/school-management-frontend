// src/components/Loader.js
import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import bookAnimation from '../assets/bookLoader.json';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <Player
        autoplay
        loop
        src={bookAnimation}
        style={{ height: '300px', width: '300px' }}
      />
    </div>
  );
};

export default Loader;
