// src/pages/ResumePage.js
import React, { useState } from 'react';

const ResumePage = () => {
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [contentSections, setContentSections] = useState({
    contact: true,
    about: true,
    experience: true,
    education: true,
    skills: true,
    portfolio: false,
    disability: true
  });

  // Template options
  const templates = [
    { id: 'modern', name: 'Modern', color: 'from-primary-500 to-secondary-500' },
    { id: 'professional', name: 'Professional', color: 'from-gray-700 to-gray-900' },
    { id: 'creative', name: 'Creative', color: 'from-accent-500 to-success-500' },
    { id: 'minimal', name: 'Minimal', color: 'from-gray-100 to-gray-300' }
  ];

  // Sample resume data - nanti bisa diambil dari context atau API
  const resumeData = {
    personalInfo: {
      name: 'Ahmad Surya',
      title: 'UI/UX Designer',
      email: 'ahmad.surya@email.com',
      phone: '0812-3456-789',
      location: 'Jakarta, Indonesia'
    },
    about: 'UI/UX Designer dengan pengalaman 3 tahun dalam menciptakan desain yang inklusif dan accessible. Sebagai penyandang disabilitas tuna netra, saya memiliki pemahaman mendalam tentang pentingnya aksesibilitas dalam setiap produk digital. Berkomitmen untuk menciptakan pengalaman pengguna yang optimal untuk semua kalangan.',
    experiences: [
      {
        id: 1,
        position: 'UI/UX Designer',
        company: 'PT Tech Inklusif',
        location: 'Jakarta',
        period: 'Jan 2022 - Sekarang',
        description: [
          'Mendesain interface yang accessible untuk aplikasi mobile dan web',
          'Kolaborasi dengan developer untuk implementasi desain yang optimal',
          'Melakukan user research dengan peserta dari berbagai latar belakang disabilitas',
          'Meningkatkan skor aksesibilitas produk dari 60% menjadi 95%'
        ]
      },
      {
        id: 2,
        position: 'Junior UI Designer',
        company: 'Creative Studio',
        location: 'Bandung',
        period: 'Mar 2020 - Des 2021',
        description: [
          'Membuat wireframe dan prototype untuk berbagai client',
          'Belajar dan menerapkan prinsip desain inklusif',
          'Berkolaborasi dengan tim dalam proses design thinking'
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Sarjana Desain Komunikasi Visual',
        institution: 'Universitas Indonesia',
        location: 'Jakarta',
        period: '2016 - 2020',
        details: 'IPK: 3.75/4.00 - Graduated Cum Laude'
      }
    ],
    skills: {
      technical: [
        { name: 'Figma', level: 95 },
        { name: 'Adobe XD', level: 90 },
        { name: 'User Research', level: 85 }
      ],
      soft: [
        { name: 'Komunikasi', level: 90 },
        { name: 'Teamwork', level: 88 },
        { name: 'Problem Solving', level: 92 }
      ]
    },
    disabilityInfo: {
      type: 'Tuna Netra',
      accommodations: 'Screen reader support, dokumen accessible format, software kompatibel dengan teknologi assistive',
      description: 'Memiliki pengalaman menggunakan berbagai tools aksesibilitas dan dapat berkontribusi dalam menciptakan produk yang inklusif.'
    }
  };

  // Content section toggles
  const toggleSection = (section) => {
    setContentSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // PDF download functionality
  const handleDownloadPDF = () => {
    // Implementasi PDF download
    console.log('Download PDF');
    showNotification('Membuat PDF...', 'info');
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Refresh from profile functionality
  const handleRefreshFromProfile = () => {
    console.log('Refresh dari profil');
    showNotification('Resume diperbarui dari data profil', 'success');
  };

  // Share link functionality
  const handleShareLink = () => {
    console.log('Bagikan link');
    showNotification('Link resume disalin ke clipboard', 'success');
  };

  // Notification function (sama seperti di ProfilePage)
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-primary-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Main Content - SAMA SEPERTI DI ProfilePage.js */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">Resume Saya</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Buat resume profesional yang menarik dan aksesibel. Pilih template, sesuaikan konten, dan download dalam format PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar Controls */}
          <div className="xl:col-span-1 space-y-6 no-print">
            <TemplateSelection
              templates={templates}
              activeTemplate={activeTemplate}
              onTemplateChange={setActiveTemplate}
            />

            <ContentCustomization
              sections={contentSections}
              onSectionToggle={toggleSection}
            />

            {/* Action Buttons - DIUBAH SESUAI DENGAN KODE ANDA */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Unduh & Bagikan</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  <span>Download PDF</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="w-full border border-primary-500 text-primary-500 py-3 rounded-lg hover:bg-primary-50 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-print"></i>
                  <span>Print Resume</span>
                </button>
                <button 
                  onClick={handleShareLink}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-share-alt"></i>
                  <span>Bagikan Link</span>
                </button>
                <button 
                  onClick={handleRefreshFromProfile}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>Refresh dari Profil</span>
                </button>
              </div>
            </div>

            {/* Accessibility Options - DITAMBAHKAN */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Opsi Aksesibilitas</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span>Font Size</span>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>Normal</option>
                    <option>Besar</option>
                    <option>Extra Besar</option>
                  </select>
                </label>
                <label className="flex items-center justify-between">
                  <span>Spacing</span>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>Normal</option>
                    <option>Lebih Luas</option>
                  </select>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3 h-5 w-5 text-primary-500" defaultChecked />
                  <span>Tagging untuk Screen Reader</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3 h-5 w-5 text-primary-500" />
                  <span>High Contrast Mode</span>
                </label>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="xl:col-span-3">
            <ResumePreviewHeader />
            
            <ResumeTemplate
              data={resumeData}
              template={activeTemplate}
              visibleSections={contentSections}
            />

            <ResumeQualityCheck />
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components (tetap sama seperti sebelumnya)
const TemplateSelection = ({ templates, activeTemplate, onTemplateChange }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="font-bold text-lg mb-4">Pilih Template</h3>
    <div className="grid grid-cols-2 gap-3">
      {templates.map(template => (
        <div
          key={template.id}
          className={`template-option cursor-pointer ${activeTemplate === template.id ? 'selected' : ''}`}
          onClick={() => onTemplateChange(template.id)}
        >
          <div className={`bg-gradient-to-br ${template.color} h-16 rounded-lg mb-2`}></div>
          <p className="text-sm text-center">{template.name}</p>
        </div>
      ))}
    </div>
  </div>
);

const ContentCustomization = ({ sections, onSectionToggle }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="font-bold text-lg mb-4">Sesuaikan Konten</h3>
    <div className="space-y-3">
      {Object.entries(sections).map(([key, value]) => (
        <label key={key} className="flex items-center">
          <input
            type="checkbox"
            checked={value}
            onChange={() => onSectionToggle(key)}
            className="mr-3 h-5 w-5 text-primary-500"
          />
          <span>{getSectionLabel(key)}</span>
        </label>
      ))}
    </div>
  </div>
);

const ResumePreviewHeader = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 no-print">
    <div className="flex flex-wrap gap-4 justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">Pratinjau Resume</h3>
        <p className="text-gray-600">Resume akan terisi otomatis dari data profil Anda</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <i className="fas fa-edit mr-2"></i>Edit Manual
        </button>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition">
          <i className="fas fa-save mr-2"></i>Simpan Perubahan
        </button>
      </div>
    </div>
  </div>
);

const ResumeTemplate = ({ data, template, visibleSections }) => (
  <div className="resume-template rounded-lg">
    <div className="resume-template-modern">
      {/* Header */}
      {visibleSections.contact && (
        <div className="resume-header p-8 rounded-t-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{data.personalInfo.name}</h1>
            <p className="text-xl opacity-90">{data.personalInfo.title}</p>
            <div className="flex justify-center gap-6 mt-4 text-sm opacity-90">
              <span><i className="fas fa-envelope mr-2"></i>{data.personalInfo.email}</span>
              <span><i className="fas fa-phone mr-2"></i>{data.personalInfo.phone}</span>
              <span><i className="fas fa-map-marker-alt mr-2"></i>{data.personalInfo.location}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        {/* About Section */}
        {visibleSections.about && (
          <div className="resume-section">
            <h2 className="resume-section-title">Tentang Saya</h2>
            <p className="text-gray-700 leading-relaxed">{data.about}</p>
          </div>
        )}

        {/* Experience Section */}
        {visibleSections.experience && data.experiences.map(exp => (
          <div key={exp.id} className="resume-section">
            <h2 className="resume-section-title">Pengalaman Kerja</h2>
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{exp.position}</h3>
                <span className="text-primary-600 font-medium">{exp.period}</span>
              </div>
              <p className="text-gray-600 mb-2">{exp.company} • {exp.location}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {exp.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Education Section */}
        {visibleSections.education && data.education.map(edu => (
          <div key={edu.id} className="resume-section">
            <h2 className="resume-section-title">Pendidikan</h2>
            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold">{edu.degree}</h3>
                <span className="text-primary-600 font-medium">{edu.period}</span>
              </div>
              <p className="text-gray-600">{edu.institution} • {edu.location}</p>
              <p className="text-gray-700">{edu.details}</p>
            </div>
          </div>
        ))}

        {/* Skills Section */}
        {visibleSections.skills && (
          <div className="resume-section">
            <h2 className="resume-section-title">Keahlian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Technical Skills</h4>
                <div className="space-y-3">
                  {data.skills.technical.map((skill, index) => (
                    <SkillBar key={index} skill={skill} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Soft Skills</h4>
                <div className="space-y-3">
                  {data.skills.soft.map((skill, index) => (
                    <SkillBar key={index} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disability Information */}
        {visibleSections.disability && (
          <div className="resume-section">
            <h2 className="resume-section-title">Informasi Disabilitas & Aksesibilitas</h2>
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Jenis Disabilitas:</strong> {data.disabilityInfo.type}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Akomodasi yang Diperlukan:</strong> {data.disabilityInfo.accommodations}
              </p>
              <p className="text-gray-700">
                <strong>Keterangan:</strong> {data.disabilityInfo.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SkillBar = ({ skill }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span>{skill.name}</span>
      <span className="text-gray-600">{skill.level}%</span>
    </div>
    <div className="skill-level">
      <div className="skill-level-fill" style={{ width: `${skill.level}%` }}></div>
    </div>
  </div>
);

const ResumeQualityCheck = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 no-print">
    <h3 className="font-bold text-lg mb-4">Pemeriksaan Kualitas Resume</h3>
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <i className="fas fa-check-circle text-green-500 mr-3"></i>
          <span>Informasi kontak lengkap</span>
        </div>
        <span className="text-green-600 font-medium">✓</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <i className="fas fa-check-circle text-green-500 mr-3"></i>
          <span>Pengalaman kerja detail</span>
        </div>
        <span className="text-green-600 font-medium">✓</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-center">
          <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
          <span>Portofolio belum ditambahkan</span>
        </div>
        <button className="text-primary-500 hover:text-primary-700 text-sm">Tambahkan</button>
      </div>
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <i className="fas fa-check-circle text-green-500 mr-3"></i>
          <span>Informasi disabilitas jelas</span>
        </div>
        <span className="text-green-600 font-medium">✓</span>
      </div>
    </div>
  </div>
);

// Helper function
const getSectionLabel = (key) => {
  const labels = {
    contact: 'Informasi Kontak',
    about: 'Tentang Saya',
    experience: 'Pengalaman Kerja',
    education: 'Pendidikan',
    skills: 'Keahlian',
    portfolio: 'Portofolio',
    disability: 'Informasi Disabilitas'
  };
  return labels[key] || key;
};

export default ResumePage;