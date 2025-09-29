// src/components/sections/SuccessStories.js
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessStories = () => {
  const stories = [
    {
      initials: 'AS',
      gradient: 'from-primary-500 to-secondary-500',
      name: 'Ahmad Surya',
      position: 'UI Designer di TechInklusif',
      quote: '"Sebagai tuna netra, saya pikir akan sulit mencari kerja di bidang desain. Ternyata dengan tools yang tepat dan perusahaan yang memahami kebutuhan saya, saya bisa berkarya maksimal!"',
      tags: ['Tuna Netra', 'Remote Work']
    },
    {
      initials: 'DW',
      gradient: 'from-secondary-500 to-accent-500',
      name: 'Dewi Wulandari',
      position: 'Content Writer di MediaInklusif',
      quote: '"Platform ini sangat membantu saya sebagai tuna rungu. Proses interview dengan interpreter bahasa isyarat membuat saya merasa benar-benar dihargai dan dipahami."',
      tags: ['Tuna Rungu', 'Flexible Hours']
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-700">
          Kisah Sukses
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Lihat bagaimana InklusiKerja membantu penyandang disabilitas menemukan karir impian mereka
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {stories.map((story, index) => (
            <div key={index} className="bg-light p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${story.gradient} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
                  {story.initials}
                </div>
                <div>
                  <h4 className="font-bold">{story.name}</h4>
                  <p className="text-gray-600 text-sm">{story.position}</p>
                </div>
              </div>
              <p className="text-gray-700">{story.quote}</p>
              <div className="flex gap-2 mt-4">
                {story.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className={`px-2 py-1 rounded text-xs ${
                      tagIndex === 0 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/testimoni" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            <span>Lihat lebih banyak kisah sukses</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;