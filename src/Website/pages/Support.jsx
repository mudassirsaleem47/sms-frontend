import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MessageCircle, HelpCircle, Book, Video } from 'lucide-react';
import { useState } from 'react';

function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const supportOptions = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@schoolms.com",
      action: "Send Email"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Support",
      description: "Call us directly",
      contact: "+92 300 1234567",
      action: "Call Now"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 9 AM - 6 PM",
      action: "Start Chat"
    }
  ];

  const resources = [
    { icon: <Book className="w-6 h-6" />, title: "Documentation", desc: "Comprehensive guides and tutorials" },
    { icon: <Video className="w-6 h-6" />, title: "Video Tutorials", desc: "Step-by-step video guides" },
    { icon: <HelpCircle className="w-6 h-6" />, title: "FAQ", desc: "Frequently asked questions" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-600">
            We're here to support you every step of the way
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Get In Touch
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <p className="text-blue-600 font-medium mb-4">{option.contact}</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  {option.action}
                </button>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Self-Service Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {resource.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-sm text-gray-600">{resource.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Support;
