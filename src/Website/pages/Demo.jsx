import Header from '../components/Header';
import Footer from '../components/Footer';
import { Play, Monitor, Smartphone, Cloud } from 'lucide-react';

function Demo() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            See It In Action
          </h1>
          <p className="text-xl text-gray-600">
            Experience our platform with a live demo
          </p>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play className="w-20 h-20 text-white mx-auto mb-4 opacity-80" />
              <p className="text-white text-lg">Demo Video Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Demo */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Available Platforms
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Access from any browser with full features
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile App</h3>
              <p className="text-gray-600 text-sm">
                iOS and Android apps for on-the-go access
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <Cloud className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud Sync</h3>
              <p className="text-gray-600 text-sm">
                Real-time synchronization across all devices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Gallery */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Dashboard Screenshots
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center border border-gray-200">
                <p className="text-gray-400">Screenshot {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Demo;
