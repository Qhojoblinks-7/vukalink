// HomePage.jsx

import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HomePage = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to VukaLink!</h1>
    </main>
    <Footer />
  </div>
);

export default HomePage;
