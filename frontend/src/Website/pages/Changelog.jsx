import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, CheckCircle2, Sparkles, Zap } from 'lucide-react';

function Changelog() {
  const releases = [
    {
      version: "v2.1.0",
      date: "December 2025",
      type: "Latest",
      changes: [
        { type: "new", text: "Added monthly recurring fee system" },
        { type: "new", text: "Improved exam result analytics" },
        { type: "improvement", text: "Enhanced mobile responsiveness" },
        { type: "fix", text: "Fixed data isolation issues between schools" }
      ]
    },
    {
      version: "v2.0.0",
      date: "November 2025",
      type: "Major",
      changes: [
        { type: "new", text: "Complete UI redesign" },
        { type: "new", text: "Added expense management module" },
        { type: "new", text: "Introduced role-based access control" },
        { type: "improvement", text: "Performance optimizations" }
      ]
    },
    {
      version: "v1.5.0",
      date: "October 2025",
      type: "Update",
      changes: [
        { type: "new", text: "Fee collection reports" },
        { type: "new", text: "Student admission workflow" },
        { type: "improvement", text: "Improved search functionality" },
        { type: "fix", text: "Various bug fixes and improvements" }
      ]
    },
    {
      version: "v1.0.0",
      date: "September 2025",
      type: "Initial",
      changes: [
        { type: "new", text: "Student management system" },
        { type: "new", text: "Basic fee collection" },
        { type: "new", text: "Exam management" },
        { type: "new", text: "Class organization" }
      ]
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "new": return "bg-blue-100 text-blue-700";
      case "improvement": return "bg-green-100 text-green-700";
      case "fix": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "new": return <Sparkles className="w-4 h-4" />;
      case "improvement": return <Zap className="w-4 h-4" />;
      case "fix": return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const getVersionBadgeColor = (type) => {
    switch (type) {
      case "Latest": return "bg-blue-600 text-white";
      case "Major": return "bg-purple-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Changelog
          </h1>
          <p className="text-xl text-gray-600">
            Track our product updates and improvements
          </p>
        </div>
      </section>

      {/* Changelog Timeline */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {releases.map((release, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{release.version}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getVersionBadgeColor(release.type)}`}>
                        {release.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{release.date}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {release.changes.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getTypeColor(change.type)}`}>
                        {getTypeIcon(change.type)}
                        {change.type}
                      </span>
                      <p className="text-gray-700 flex-1">{change.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Changelog;
