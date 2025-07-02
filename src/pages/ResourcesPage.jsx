// src/pages/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileHeader from '../features/dashboard/MobileHeader'; // Assuming you have this
import ResourceSidebar from '../components/resources/ResourceSidebar'; // New sidebar component
import ArticleCard from '../features/resources/components/ArticleCard'; // New article card component
import InputField from '../components/forms/InputField'; // Reusing your InputField
import SelectField from '../components/forms/SelectField'; // Reusing your SelectField
import { MagnifyingGlassIcon, EnvelopeIcon } from '@heroicons/react/24/outline'; // Search and Envelope icon
import Button from '../components/ui/Button'; // Reusing your Button component
import useIsMobile from '../hooks/useIsMobile'; // Import the hook

const DUMMY_ARTICLES = [
  {
    id: '1',
    category: 'Resume Tips',
    title: 'Crafting a CV that Gets Noticed',
    description: 'Your resume is your first impression. Learn how to tailor it for maximum impact and stand out to recruiters.',
    author: 'James Owusu',
    date: 'May 19, 2024',
    image: '/images/article_resume_tips.jpg', // Placeholder image
    fullContent: `
      <h2>The Art of Crafting a Standout CV</h2>
      <p>Your Curriculum Vitae (CV) is often the first impression you make on a potential employer. In a competitive job market, a generic CV simply won't cut it. To truly get noticed, your CV needs to be a compelling, tailored document that highlights your most relevant skills and experiences.</p>

      <h3>1. Tailor Your CV for Each Application</h3>
      <p>This is perhaps the most crucial tip. Generic CVs rarely succeed. For every job you apply to, carefully read the job description and identify the key skills, qualifications, and keywords they are looking for. Then, customize your CV to reflect these. Use similar terminology where appropriate, and ensure your experience directly addresses their needs.</p>

      <h3>2. Focus on Achievements, Not Just Duties</h3>
      <p>Instead of merely listing your job duties, quantify your achievements whenever possible. For example, instead of "Managed social media accounts," write "Grew social media engagement by 30% over 6 months, resulting in a 15% increase in website traffic." Numbers make your impact tangible and memorable.</p>

      <h3>3. Keep it Concise and Relevant</h3>
      <p>For most early-career professionals, a two-page CV is ideal. Avoid jargon where simpler language suffices. Only include information that is relevant to the job you're applying for. If an experience doesn't add value, consider removing it.</p>

      <h3>4. Use Clear and Consistent Formatting</h3>
      <p>A well-formatted CV is easy to read and professional. Use a clean, legible font (e.g., Arial, Calibri, Lato). Maintain consistent headings, bullet points, and spacing. Use bolding and italics sparingly to highlight key information. Proofread meticulously for any typos or grammatical errors.</p>

      <h3>5. Highlight Key Skills</h3>
      <p>Create a dedicated "Skills" section, breaking down your abilities into categories like "Technical Skills," "Soft Skills," and "Languages." This allows recruiters to quickly scan for competencies relevant to the role.</p>

      <h3>6. Strong Action Verbs</h3>
      <p>Start your bullet points with strong action verbs (e.g., "Developed," "Implemented," "Analyzed," "Led," "Optimized") to convey a sense of accomplishment and dynamism.</p>

      <h3>7. Get Feedback</h3>
      <p>Before sending out your CV, ask a trusted friend, mentor, or career advisor to review it. A fresh pair of eyes can catch errors or suggest improvements you might have missed.</p>
    `
  },
  {
    id: '2',
    category: 'Interview Prep',
    title: 'Ace Your Internship Interview',
    description: 'Get ready for the big day! Our interview tips help you prepare, perform, and leave a lasting impression.',
    author: 'Akosua Mensah',
    date: 'May 14, 2024',
    image: '/images/article_interview_prep.jpg', // Placeholder image
    fullContent: `
      <h2>Mastering the Internship Interview</h2>
      <p>An internship interview is your chance to shine and demonstrate why you're the best candidate for the role. Proper preparation is key to calming your nerves and performing your best.</p>

      <h3>1. Research the Company and Role Thoroughly</h3>
      <p>Before anything else, dive deep into the company's website, social media, and recent news. Understand their mission, values, products/services, and culture. For the role itself, analyze the job description to identify key responsibilities and required skills. This research will help you tailor your answers and ask informed questions.</p>

      <h3>2. Understand Common Interview Questions</h3>
      <p>Prepare for behavioral questions (e.g., "Tell me about a time you faced a challenge...") using the STAR method (Situation, Task, Action, Result). Also, anticipate questions about your strengths, weaknesses, career goals, and why you're interested in *this specific* internship and company.</p>

      <h3>3. Prepare Thoughtful Questions for the Interviewer</h3>
      <p>Having questions ready shows your engagement and interest. Prepare 3-5 questions about the team, daily tasks, company culture, learning opportunities, or how success is measured in the role. Avoid questions that can be easily answered by a quick search online.</p>

      <h3>4. Practice Your Answers Aloud</h3>
      <p>Don't just think about your answers; say them out loud. Practice with a friend, mentor, or in front of a mirror. This helps refine your phrasing, identify awkward sentences, and ensures you can articulate your thoughts clearly under pressure.</p>

      <h3>5. Dress Appropriately and Professional</h3>
      <p>Your appearance matters. Even for virtual interviews, dress as you would for an in-person meeting. This generally means business casual or business professional attire, ensuring you look neat and presentable.</p>

      <h3>6. Punctuality is Key</h3>
      <p>For in-person interviews, aim to arrive 10-15 minutes early. For virtual interviews, log in 5-10 minutes early to check your tech (internet, camera, microphone) and ensure everything is working smoothly.</p>

      <h3>7. Send a Thank-You Note</h3>
      <p>Always send a thank-you email within 24 hours of your interview. Reiterate your interest in the role, thank them for their time, and briefly mention something specific you discussed to remind them of your conversation.</p>
    `
  },
  {
    id: '3',
    category: 'Networking',
    title: 'Networking: Your Secret Career Weapon',
    description: 'Unlock the power of connections. Discover actionable strategies to build your professional network.',
    author: 'Kwame Agyemang',
    date: 'May 10, 2024',
    image: '/images/article_networking.jpg', // Placeholder image
    fullContent: `
      <h2>Networking: Your Secret Weapon for Career Growth</h2>
      <p>In today's interconnected world, networking is more than just collecting business cards; it's about building genuine relationships that can open doors to new opportunities and insights.</p>

      <h3>1. Start with Your Existing Network</h3>
      <p>You probably have a stronger network than you think. Start with friends, family, former teachers, university alumni, and previous colleagues. Let them know what you're looking for and ask if they know anyone who might be helpful to connect with.</p>

      <h3>2. Attend Industry Events and Webinars</h3>
      <p>Industry conferences, workshops, and online webinars are excellent places to meet professionals in your field. Actively participate, ask questions, and introduce yourself. Don't just collect contacts; aim for meaningful conversations.</p>

      <h3>3. Leverage Online Platforms (LinkedIn, etc.)</h3>
      <p>LinkedIn is indispensable for professional networking. Optimize your profile, join relevant groups, and engage with content. When connecting with new people, always send a personalized message explaining why you'd like to connect.</p>

      <h3>4. Focus on Giving, Not Just Taking</h3>
      <p>Networking is a two-way street. Think about how you can offer value to others. Share relevant articles, offer to make introductions, or provide support. When you give, people are more likely to reciprocate.</p>

      <h3>5. Follow Up Thoughtfully</h3>
      <p>After meeting someone, send a personalized follow-up message within 24-48 hours. Reference something specific you discussed and suggest a next step, whether it's another conversation, sharing resources, or meeting for coffee.</p>

      <h3>6. Be Authentic and Curious</h3>
      <p>People connect with genuine individuals. Be yourself, show genuine curiosity about others' work and experiences, and listen more than you talk. Ask open-ended questions that encourage conversation.</p>

      <h3>7. Maintain Relationships Over Time</h3>
      <p>Networking isn't a one-off event. Nurture your connections by periodically checking in, sharing relevant updates, or congratulating them on achievements. A strong network is built on consistent effort.</p>
    `
  },
  {
    id: '4',
    category: 'Career Growth',
    title: 'First Steps to Career Success',
    description: 'It\'s more than grades. Learn the practical skills and mindset shifts that set successful professionals apart.',
    author: 'Samuel Boateng',
    date: 'May 8, 2024',
    image: '/images/article_career_growth_1.jpg', // Placeholder image
    fullContent: `
      <h2>Your First Steps to Long-Term Career Success</h2>
      <p>Embarking on your career journey requires more than just good grades. It demands a proactive mindset, continuous learning, and the development of crucial soft skills. Here’s how to lay a strong foundation for a successful career.</p>

      <h3>1. Embrace Continuous Learning</h3>
      <p>The professional landscape is constantly evolving. Commit to lifelong learning, whether through online courses, certifications, workshops, or simply staying updated with industry trends. Never stop acquiring new skills.</p>

      <h3>2. Develop Strong Soft Skills</h3>
      <p>Technical skills get you hired, but soft skills help you thrive. Focus on improving communication, teamwork, problem-solving, adaptability, and emotional intelligence. These are invaluable in any role and industry.</p>

      <h3>3. Seek Mentorship</h3>
      <p>Find experienced professionals who can guide you. Mentors offer invaluable advice, share insights, and can help you navigate challenges. Be open to feedback and proactive in seeking their wisdom.</p>

      <h3>4. Build a Professional Brand</h3>
      <p>Your professional brand is how you are perceived. This includes your online presence (LinkedIn, portfolio), your reputation for reliability, and your unique strengths. Cultivate a positive and consistent brand that reflects your aspirations.</p>

      <h3>5. Take Initiative and Be Proactive</h3>
      <p>Don't just wait for tasks to be assigned. Look for opportunities to take on new responsibilities, solve problems, and contribute beyond your immediate duties. Proactivity demonstrates leadership potential and commitment.</p>

      <h3>6. Learn to Handle Feedback (and Rejection) Constructively</h3>
      <p>Feedback is a gift for growth. Listen actively, ask clarifying questions, and implement changes. Similarly, rejection is a part of any career journey. Learn from it, don't let it define you, and move forward with resilience.</p>

      <h3>7. Network Strategically</h3>
      <p>Build relationships with peers, seniors, and industry leaders. Attend events, engage on professional platforms, and seek informational interviews. A strong network provides support, insights, and opens doors to future opportunities.</p>
    `
  },
  {
    id: '5',
    category: 'Resume Tips',
    title: 'Digital Portfolios That Shine',
    description: 'Showcase your skills with an impressive online portfolio. Step-by-step guidance for students and grads.',
    author: 'Esi Tawiah',
    date: 'May 2, 2024',
    image: '/images/article_digital_portfolio.jpg', // Placeholder image
    fullContent: `
      <h2>Building a Digital Portfolio That Shines</h2>
      <p>In today's digital age, a strong online portfolio is essential for students and graduates, especially in creative and tech fields. It’s a dynamic showcase of your skills and projects that goes beyond a traditional resume.</p>

      <h3>1. Choose the Right Platform</h3>
      <p>Select a platform that suits your needs. Options include Behance, Dribbble (for design), GitHub (for coding), WordPress, Squarespace, or even a custom-built website. Consider ease of use, cost, and customization options.</p>

      <h3>2. Curate Your Best Work</h3>
      <p>Don't include every project you've ever done. Instead, curate a selection of your strongest, most relevant work that aligns with the types of jobs you want. Quality over quantity is key.</p>

      <h3>3. Tell the Story Behind Each Project</h3>
      <p>For each project, go beyond just showing the final product. Explain your role, the problem you were trying to solve, your thought process, the tools you used, and the impact of your work. Use the STAR method (Situation, Task, Action, Result).</p>

      <h3>4. Include a Professional Headshot and Bio</h3>
      <p>Personalize your portfolio with a professional headshot and a concise bio that highlights your skills, passions, and career aspirations. Make it easy for visitors to understand who you are and what you do.</p>

      <h3>5. Optimize for User Experience</h3>
      <p>Ensure your portfolio is easy to navigate, mobile-responsive, and loads quickly. A seamless user experience reflects positively on your attention to detail.</p>

      <h3>6. Get Feedback and Iterate</h3>
      <p>Share your portfolio with mentors, peers, and career advisors for feedback. Use their insights to refine and improve your showcase. A portfolio is a living document that should evolve with your skills.</p>

      <h3>7. Promote Your Portfolio</h3>
      <p>Link your portfolio from your resume, LinkedIn profile, email signature, and other professional communications. Make it easy for recruiters and hiring managers to find your work.</p>
    `
  },
  {
    id: '6',
    category: 'Career Growth',
    title: 'Celebrating Small Wins',
    description: 'Building confidence with every step. Recognize your progress and keep the momentum going.',
    author: 'Ama Ofori',
    date: 'Apr 28, 2024',
    image: '/images/article_celebrating_wins.jpg', // Placeholder image
    fullContent: `
      <h2>The Power of Celebrating Small Wins in Your Career</h2>
      <p>In the grand journey of career growth, it's easy to get caught up in the pursuit of major milestones. However, overlooking the smaller achievements along the way can deplete your motivation and hinder your progress. Celebrating small wins is a powerful strategy for maintaining momentum, building confidence, and fostering a positive mindset.</p>

      <h3>1. Boosts Motivation and Morale</h3>
      <p>Each small win acts as a mini-celebration, releasing dopamine and giving you a sense of accomplishment. This positive reinforcement motivates you to continue working towards your larger goals.</p>

      <h3>2. Builds Confidence and Self-Efficacy</h3>
      <p>Successfully completing smaller tasks reinforces your belief in your abilities. As you accumulate small wins, your confidence grows, making you more willing to tackle bigger challenges.</p>

      <h3>3. Provides Clearer Progress Tracking</h3>
      <p>Breaking down large goals into smaller, manageable steps allows for clearer tracking of progress. Celebrating each step gives you tangible proof of movement, even when the ultimate goal seems distant.</p>

      <h3>4. Encourages Resilience</h3>
      <p>Career paths are rarely linear. When faced with setbacks, a history of celebrating small wins reminds you of your capability to overcome obstacles, fostering resilience.</p>

      <h3>5. Prevents Burnout</h3>
      <p>Constantly striving without acknowledging progress can lead to burnout. Small celebrations provide much-needed breaks and moments of appreciation, preventing exhaustion.</p>

      <h3>How to Celebrate Small Wins:</h3>
      <ul>
        <li><strong>Acknowledge It:</strong> Take a moment to consciously recognize your achievement.</li>
        <li><strong>Share It:</strong> Tell a colleague, friend, or mentor. Sharing amplifies the positive feeling.</li>
        <li><strong>Reward Yourself:</strong> This doesn't have to be big. It could be a nice coffee, a short break, or listening to your favorite song.</li>
        <li><strong>Document It:</strong> Keep a "win journal" to track your progress and reflect on your accomplishments.</li>
      </ul>
      <p>Remember, every big success is built on a foundation of many small victories. Start celebrating them today!</p>
    `
  },
];

const ARTICLE_CATEGORIES = [
  { value: 'All Articles', label: 'All Articles' },
  { value: 'Resume Tips', label: 'Resume Tips' },
  { value: 'Interview Prep', label: 'Interview Prep' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Career Growth', label: 'Career Growth' },
];

const SORT_OPTIONS = [
  { value: 'Newest', label: 'Newest' },
  { value: 'Oldest', label: 'Oldest' },
  { value: 'Alphabetical', label: 'Alphabetical (A-Z)' },
];

const ResourcesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [sortBy, setSortBy] = useState('Newest');
  const [displayedArticles, setDisplayedArticles] = useState(DUMMY_ARTICLES);
  const isMobile = useIsMobile(); // Use the useIsMobile hook

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter and sort articles based on state
  useEffect(() => {
    let filtered = DUMMY_ARTICLES.filter(article =>
      (selectedCategory === 'All Articles' || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'Oldest') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'Alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setDisplayedArticles(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="bg-grey-100   min-h-screen flex flex-1">
      {/* Mobile Header (conditionally rendered) */}
      {isMobile && (
        <MobileHeader
          title="Resources"
          showBack={false} // No back button on main resources page
          showBell={true}
          showProfile={true}
          onMenuClick={toggleSidebar}
        />
      )}

      {/* Resource Sidebar (desktop and mobile overlay) */}
      <ResourceSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        categories={ARTICLE_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8 md:pl-0 lg:pl-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-8 h-full"> {/* Container for main content + right sidebar */}
          
          

          {/* Main Articles and Right Sidebar */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6"> {/* This is the main grid container */}

            {/* Articles List (2/3 width on desktop) */}
            <div className="md:col-span-2 flex flex-col space-y-6">
              {/* Desktop Heading and Search/Filter section */}
              <div className="bg-white   rounded-lg shadow-lg p-4 md:p-6">
                <div className="mb-4 hidden md:block"> {/* Show title only on desktop here */}
                  <h1 className="text-3xl font-heading text-vuka-strong dark:text-white mb-2">Resources & Blog</h1>
                  <p className="text-grey-900  text-lg">Insights, guides & tips for your career journey</p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-grow relative">
                    <InputField
                      id="search-articles"
                      name="search-articles"
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10" // Add padding for icon
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-vuka-medium-grey  " />
                  </div>
                  <div className="w-full sm:w-auto">
                    <SelectField
                      id="sort-by"
                      name="sort-by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      options={SORT_OPTIONS}
                      className="w-full sm:min-w-[150px]"
                    />
                  </div>
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Nested grid for articles */}
                  {displayedArticles.length > 0 ? (
                    displayedArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-vuka-medium-grey   text-lg">
                      No articles found matching your criteria.
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <button className="px-4 py-2 mx-1 border rounded-md text-vuka-text   hover:bg-vuka-blue-light   border-gray-300 dark:border-gray-700">1</button>
                  <button className="px-4 py-2 mx-1 border rounded-md text-vuka-text   hover:bg-vuka-blue-light   border-gray-300 dark:border-gray-700">2</button>
                  <button className="px-4 py-2 mx-1 border rounded-md text-vuka-text   hover:bg-vuka-blue-light   border-gray-300 dark:border-gray-700">3</button>
                </div>
              </div>
            </div>

            {/* Right Sidebar (1/3 width on desktop) */}
            <div className="md:col-span-1 z-10 flex flex-col space-y-6">
              {/* Popular Articles */}
              <div className="bg-white   rounded-lg shadow-lg p-6 sticky top-8"> {/* Added sticky */}
                <h3 className="font-heading text-lg text-bold mb-4 dark:text-white">Popular Articles</h3>
                <ul className="space-y-2">
                  {/* You can map actual popular articles here */}
                  <li className="flex items-center text-grey-700  ">
                    <span className="mr-2 text-orange-600">🔥</span>
                    <Link to="/resources/2" className="hover:underline">Ace Your Internship Interview</Link>
                  </li>
                  <li className="flex items-center text-grey-700  ">
                    <span className="mr-2 text-orange-600">🚀</span>
                    <Link to="/resources/4" className="hover:underline">First Steps to Career Success</Link>
                  </li>
                  <li className="flex items-center text-grey-700  ">
                    <span className="mr-2 text-green-700">✅</span>
                    <Link to="/resources/1" className="hover:underline">Crafting a CV that Gets Noticed</Link>
                  </li>
                </ul>
              </div>

              {/* Stay Updated! Newsletter */}
              <div className="bg-gradient-to-br from-blue-900 to-orange-500 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md -z-10 p-6  text-white text-center fixed top-[calc(20rem+10px)]"> {/* Adjusted sticky top */}
                <EnvelopeIcon className="h-10 w-10 mx-auto mb-4 text-white" />
                <p className="text-3xl font-bold mb-2">Stay Updated!</p>
                <p className="text-sm mb-4 text-white/80">Get the latest resources and guides delivered to your inbox. Join our newsletter!</p>
                <InputField
                  id="newsletter-email"
                  name="newsletter-email"
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent text-grey-700   border-1 rounded-lg h-10 mb-3 p-5 placeholder:text-grey-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent w-full"
                />
                <Button className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2.5 rounded-md hover:bg-blue-700 dark:hover:bg-blue-900">
                  Subscribe
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;