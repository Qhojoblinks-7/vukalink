// src/components/home/HeroSection.jsx
import { Link } from 'react-router-dom';
import Button from '../ui/Button'; // Assuming your Button component
// Placeholder for the illustration on the right
import heroIllustration from '../../assets/logo.svg'; // Create or find an image for this

const HeroSection = () => {
  return (
    <section className="bg-blue-50 py-20 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between min-h-[500px]">
      <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
        <h1 className="text-5xl font-heading font-bold text-bold leading-tight mb-6">
          Tired of endless internship hunts? <span className="text-blue">LinkUp is your solution!</span>
        </h1>
        <p className="ttext-grey-600 -900 text-lg mb-8 max-w-xl mx-auto md:mx-0">
          LinkUp bridges the gap between students and companies, making it effortless to find, apply to, and manage meaningful internships or attachments. Start your confident career journey here.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
          <Link to="/register-student">
            <Button className="w-full sm:w-auto">Sign Up as Student</Button>
          </Link>
          <Link to="/register-company">
            <Button variant="outline" className="w-full sm:w-auto">Sign Up as Company</Button>
          </Link>
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <img src={heroIllustration} alt="LinkUp Solution" className="max-w-full h-auto md:max-h-[400px]" />
      </div>
    </section>
  );
};

export default HeroSection;