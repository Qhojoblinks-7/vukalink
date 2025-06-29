// src/pages/OpportunityDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DesktopOpportunityDetailsLayout from '../components/opportunities/details/DesktopOpportunityDetailsLayout';
import MobileOpportunityDetailsLayout from '../components/opportunities/details/MobileOpportunityDetailsLayout';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth is here

const OpportunityDetailsPage = () => {
  const { id } = useParams(); // Get the opportunity ID from the URL
  const { user, loading: authLoading } = useAuth(); // Access auth context
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- Dummy Data Fetching ---
        // In a real application, you would fetch this from your backend API or Supabase
        const allOpportunities = [
          {
            id: 'marketing_intern',
            title: 'Marketing Intern',
            company: 'BrightFutures Inc.',
            location: 'Nairobi, Kenya',
            salary: 'KES 20,000/month',
            duration: '3 Months',
            aboutOpportunity: "As a Marketing Intern at BrightFutures Inc., you'll collaborate with our cross-functional marketing team to help execute exciting campaigns that drive real impact. This role is perfect for students eager to gain hands-on experience in digital marketing, content creation, and brand management within a supportive, fast-paced environment. You'll have the chance to work on real projects, learn from marketing pros, and build a portfolio that will kickstart your career. We value creativity, initiative, and a willingness to learn!",
            keyResponsibilities: [
              "Support the execution of digital marketing campaigns across multiple platforms.",
              "Assist with content creation for social media, blogs, and newsletters.",
              "Help analyze campaign performance and prepare reports.",
              "Collaborate in brainstorming sessions for brand initiatives.",
              "Participate in team meetings and marketing workshops."
            ],
            requirements: [
              "Currently enrolled in or recent graduate from a tertiary institution.",
              "Strong written and verbal communication skills.",
              "Passion for digital marketing and social media trends.",
              "Proactive, creative, and eager to learn.",
              "Basic understanding of Microsoft Office and/or Google Workspace."
            ],
            applicationProcess: "Apply directly through LinkUp by clicking the \"Apply Now\" button below. Ensure your profile is complete for the best chance of success.",
            deadline: '2025-06-30T23:59:59', // ISO format for easy date manipulation
            views: 276,
            appliedCount: 48,
            companyLogo: '/images/brightfutures_logo.png', // Dummy path
            companyWebsite: 'https://www.brightfutures.com',
            companyProfileLink: '/company/brightfutures',
            aboutCompany: "BrightFutures Inc. is a leading youth-focused marketing agency dedicated to empowering young professionals to launch their careers. Our vibrant team works with top brands to deliver creative campaigns and positive social impact."
          },
          {
            id: 'software_engineering_intern',
            title: 'Software Engineering Intern',
            company: 'DevSpark Africa',
            location: 'Accra',
            salary: 'GHC 500/month',
            duration: '3 months',
            aboutOpportunity: "Join our team to work on real-world projects, learn from experienced engineers, and accelerate your tech career. You'll contribute to developing scalable web solutions and receive mentorship throughout your internship.",
            keyResponsibilities: [
              "Collaborate with team members on web application features.",
              "Participate in agile sprints and standups.",
              "Test, debug, and optimize code.",
              "Assist in documentation and code reviews."
            ],
            requirements: [
              "Currently enrolled or recently graduated in Computer Science or related field.",
              "Basic knowledge of HTML, CSS, JavaScript.",
              "Good communication skills.",
              "Enthusiasm for learning and teamwork."
            ],
            applicationProcess: "Apply directly through LinkUp by clicking the \"Apply Now\" button below. Ensure your profile is complete for the best chance of success.",
            deadline: '2024-06-30T23:59:59', // Example past deadline
            views: 450,
            appliedCount: 120,
            companyLogo: '/images/devspark_logo.png', // Dummy path
            companyWebsite: 'https://www.devsparkafrica.com',
            companyProfileLink: '/company/devsparkafrica',
            aboutCompany: "DevSpark Africa: Empowering African youth through technology, innovation, and impactful mentorship."
          }
          // Add more dummy opportunity data as needed for testing
        ];

        const foundOpportunity = allOpportunities.find(opp => opp.id === id);
        if (foundOpportunity) {
          setOpportunity(foundOpportunity);
        } else {
          setError(new Error('Opportunity not found.'));
        }
        // --- End Dummy Data Fetching ---

        // --- Supabase Example (uncomment and adapt if you use Supabase) ---
        /*
        const { data, error } = await supabase
          .from('opportunities') // Replace 'opportunities' with your table name
          .select('*')
          .eq('id', id)
          .single(); // Use single() if you expect one result

        if (error) {
          console.error("Error fetching opportunity:", error);
          setError(error);
        } else if (data) {
          setOpportunity(data);
        } else {
          setError(new Error('Opportunity not found.'));
        }
        */
      } catch (err) {
        console.error("Failed to fetch opportunity:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOpportunityDetails();
    } else {
      setLoading(false);
      setError(new Error('No opportunity ID provided.'));
    }
  }, [id]);

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">Loading Opportunity Details...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-vuka-background text-vuka-danger text-xl font-body p-4">
        Error loading opportunity: {error.message || 'An unknown error occurred.'}
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-vuka-background text-vuka-text text-xl font-body p-4">
        Opportunity not found.
      </div>
    );
  }

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow">
        <DesktopOpportunityDetailsLayout opportunity={opportunity} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-grow flex flex-col">
        <MobileOpportunityDetailsLayout opportunity={opportunity} />
      </div>
    </div>
  );
};

export default OpportunityDetailsPage;