// src/features/resources/pages/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MobileHeader from '../../dashboard/MobileHeader'; // Assuming you have this
import ResourceSidebar from '../components/ResourceSidebar'; // Adjusted path
import ArticleCard from '../components/ArticleCard'; // Adjusted path
import InputField from '../../../components/forms/InputField'; // Reusing your InputField
import SelectField from '../../../components/forms/SelectField'; // Reusing your SelectField
import { MagnifyingGlassIcon, EnvelopeIcon } from '@heroicons/react/24/outline'; // Search and Envelope icon
import Button from '../../../components/ui/Button'; // Reusing your Button component
import useIsMobile from '../../../hooks/useIsMobile'; // Import the hook
import { ARTICLE_CATEGORIES, SORT_OPTIONS } from '../../../utils/constants'; // Import from constants
import { fetchArticles, setResourceFilters } from '../resourcesSlice';


const ResourcesPage = () => {
  const dispatch = useDispatch();
  const { articles, status, error, filters } = useSelector((state) => state.resources);
  const isMobile = useIsMobile();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { searchTerm, selectedCategory, sortBy } = filters;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Dispatch fetchArticles with current filters
    dispatch(fetchArticles(filters));
  }, [dispatch, filters]);

  const handleSearchChange = (e) => {
    dispatch(setResourceFilters({ searchTerm: e.target.value }));
  };

  const handleCategorySelect = (category) => {
    dispatch(setResourceFilters({ selectedCategory: category }));
  };

  const handleSortChange = (e) => {
    dispatch(setResourceFilters({ sortBy: e.target.value }));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-1">
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
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8 md:pl-0 lg:pl-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-8 h-full">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Articles List (2/3 width on desktop) */}
            <div className="md:col-span-2 flex flex-col space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <div className="mb-4 hidden md:block">
                  <h1 className="text-3xl font-heading text-vuka-strong dark:text-white mb-2">Resources & Blog</h1>
                  <p className="text-gray-900 text-lg">Insights, guides & tips for your career journey</p>
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
                      onChange={handleSearchChange}
                      className="pl-10" // Add padding for icon
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-vuka-medium-gray" />
                  </div>
                  <div className="w-full sm:w-auto">
                    <SelectField
                      id="sort-by"
                      name="sort-by"
                      value={sortBy}
                      onChange={handleSortChange}
                      options={SORT_OPTIONS}
                      className="w-full sm:min-w-[150px]"
                    />
                  </div>
                </div>

                {/* Article Grid */}
                {status === 'loading' && <div className="col-span-full text-center py-10 text-gray-500">Loading articles...</div>}
                {status === 'failed' && <div className="col-span-full text-center py-10 text-red-500">Error: {error}</div>}

                {status === 'succeeded' && articles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  status === 'succeeded' && articles.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500 text-lg">
                      No articles found matching your criteria.
                    </div>
                  )
                )}

                {/* Pagination (assuming backend supports it) */}
                <div className="flex justify-center mt-8">
                  {/* You'll need to implement actual pagination logic based on API response */}
                  <button className="px-4 py-2 mx-1 border rounded-md text-vuka-text hover:bg-blue-400  border-gray-300 dark:border-gray-700">1</button>
                  <button className="px-4 py-2 mx-1 border rounded-md text-vuka-text hover:bg-blue-400  border-gray-300 dark:border-gray-700">2</button>
                  <button className="px-4 py-2 mx-1 border rounded-md text-vuka-text hover:bg-blue-400  border-gray-300 dark:border-gray-700">3</button>
                </div>
              </div>
            </div>

            {/* Right Sidebar (1/3 width on desktop) */}
            <div className="md:col-span-1 z-10 flex flex-col space-y-6">
              {/* Popular Articles */}
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="font-heading text-lg font-bold mb-4 dark:text-white">Popular Articles</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-orange-600">🔥</span>
                    <Link to="/resources/2" className="hover:underline">Ace Your Internship Interview</Link>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-orange-600">🚀</span>
                    <Link to="/resources/4" className="hover:underline">First Steps to Career Success</Link>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-700">✅</span>
                    <Link to="/resources/1" className="hover:underline">Crafting a CV that Gets Noticed</Link>
                  </li>
                </ul>
              </div>

              {/* Stay Updated! Newsletter */}
              <div className="bg-gradient-to-br from-blue-900 to-orange-500 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md -z-10 p-6 text-white text-center sticky top-[calc(20rem+10px)] md:top-[calc(20rem+10px)]"> {/* Adjusted sticky top */}
                <EnvelopeIcon className="h-10 w-10 mx-auto mb-4 text-white" />
                <p className="text-3xl font-bold mb-2">Stay Updated!</p>
                <p className="text-sm mb-4 text-white/80">Get the latest resources and guides delivered to your inbox. Join our newsletter!</p>
                <InputField
                  id="newsletter-email"
                  name="newsletter-email"
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent text-gray-700 border-1 rounded-lg h-10 mb-3 p-5 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent w-full"
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