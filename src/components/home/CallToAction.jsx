// src/components/home/CallToAction.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CallToAction = () => {
  return (
    <section className="bg-white  py-20 px-6 md:px-10 text-center">
      <h2 className="text-4xl font-heading font-bold text-bold mb-6">Ready to LinkUp?</h2>
      <p className="text-vuka-text text-lg mb-8 max-w-xl mx-auto">
        Don't miss your next opportunity. Join LinkUp and unlock your pathway to a thriving career or find your next great hire with ease.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
        <Link to="/register-student">
          <Button className="w-full sm:w-auto">Sign Up as Student</Button>
        </Link>
        <Link to="/register-company">
          <Button variant="outline" className="w-full sm:w-auto">Sign Up as Company</Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;