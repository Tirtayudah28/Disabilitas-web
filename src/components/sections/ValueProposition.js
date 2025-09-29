// src/components/sections/ValueProposition.js
import React from 'react';

const ValueProposition = () => {
  const features = [
    {
      icon: 'fa-universal-access',
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      title: 'Aksesibilitas Penuh',
      description: 'Setiap elemen platform dirancang dengan standar aksesibilitas tertinggi untuk semua jenis disabilitas.'
    },
    {
      icon: 'fa-robot',
      bgColor: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      title: 'Pencocokan Cerdas',
      description: 'AI kami mempertimbangkan skill, preferensi kerja, dan kebutuhan aksesibilitas Anda.'
    },
    {
      icon: 'fa-handshake',
      bgColor: 'bg-accent-100',
      iconColor: 'text-accent-600',
      title: 'Perusahaan Ramah',
      description: 'Hanya perusahaan yang benar-benar berkomitmen pada inklusivitas yang bergabung dengan platform kami.'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50/50 to-accent-50/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-700">
          Mengapa Memilih InklusiKerja?
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Platform kami dirancang khusus untuk memenuhi kebutuhan unik penyandang disabilitas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover-lift text-center">
              <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`fas ${feature.icon} ${feature.iconColor} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;