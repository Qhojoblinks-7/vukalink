// src/components/resources/ArticleCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  return (
    <Link to={`/resources/${article.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-40 object-cover"
          />
        )}
        <div className="p-4 flex-grow flex flex-col">
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2
            ${article.category === 'Resume Tips' ? 'bg-vuka-orange-light text-vuka-orange' :
              article.category === 'Interview Prep' ? 'bg-vuka-blue-light text-vuka-blue' :
              article.category === 'Networking' ? 'bg-vuka-green-light text-vuka-green' :
              article.category === 'Career Growth' ? 'bg-vuka-blue-dark text-vuka-white' : // A slightly darker tag for contrast
              'bg-vuka-grey-light text-vuka-text' // Default
            }`}
          >
            {article.category}
          </span>
          <h3 className="text-lg font-semibold text-vuka-strong mb-2 font-heading">
            {article.title}
          </h3>
          <p className="text-sm text-vuka-text mb-4 flex-grow">
            {article.description}
          </p>
          <div className="flex items-center text-vuka-medium-grey text-xs mt-auto">
            {/* Optional: Author Avatar */}
            {/* <img src="/images/default-avatar.png" alt={article.author} className="h-6 w-6 rounded-full mr-2" /> */}
            <span>{article.author}</span>
            <span className="mx-1">•</span>
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;