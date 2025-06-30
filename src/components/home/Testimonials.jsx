// src/components/home/Testimonials.jsx
import React from 'react';
// You might have actual avatar images, or use a placeholder/Gravatar logic
import userAvatar1 from '../../assets/logo.svg'; // Placeholder image
import userAvatar2 from '../../assets/logo.svg'; // Placeholder image

const TestimonialCard = ({ quote, name, title, avatar }) => (
  <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center flex flex-col items-center max-w-md mx-auto">
    <img src={avatar} alt={name} className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-900 -light" />
    <p className="ttext-grey-600 -900 text-lg italic mb-4">"{quote}"</p>
    <p className="text-bold font-semibold">{name}</p>
    <p className="text-grey-600 text-sm">{title}</p>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-20 px-6 md:px-10 text-grey-100">
      <h2 className="text-4xl font-heading font-bold text-bold text-center mb-12">Hear From Our Users</h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 max-w-5xl mx-auto">
        <TestimonialCard
          quote="LinkUp helped me land a great internship in my field, making the process easy and stress-free!"
          name="Ama Korpono"
          title="Student, UG"
          avatar={userAvatar1}
        />
        <TestimonialCard
          quote="We found exceptional talent for our summer program with ease. LinkUp truly made recruitment a breeze!"
          name="Kwesi Mensah"
          title="HR, BrightEdge Labs"
          avatar={userAvatar2}
        />
      </div>
    </section>
  );
};

export default Testimonials;