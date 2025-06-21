import { useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function Home() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleEmergencyClick = () => {
    setShowEmergencyModal(true);
  };

  const emergencyContacts = [
    { name: 'Emergency Services', number: '112', description: 'General emergency number' },
    { name: 'Domestic Violence Helpline', number: '1091', description: 'Women helpline' },
    { name: 'Child Helpline', number: '1098', description: 'Child protection services' },
    { name: 'Mental Health Crisis', number: '988', description: 'Suicide prevention lifeline' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Emergency Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleEmergencyClick}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-lg"
        >
          🆘 EMERGENCY
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">HealNet</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A safe, anonymous platform designed to support abuse survivors on their healing journey. 
            You're not alone, and help is always available.
          </p>
        </div>

        {/* Welcome Message */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome, Anonymous User
            </h2>
            <p className="text-gray-600">
              Your session is secure and anonymous. Your UID: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{user.uid}</code>
            </p>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Counselor Chat</h3>
            <p className="text-gray-600 mb-4">
              Connect with trained professionals and volunteers for real-time support and guidance.
            </p>
            <a 
              href="/chat" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Chat
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resource Hub</h3>
            <p className="text-gray-600 mb-4">
              Access curated resources for safety planning, trauma healing, legal support, and rebuilding your life.
            </p>
            <a 
              href="/resources" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Resources
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Stories</h3>
            <p className="text-gray-600 mb-4">
              Read and share healing stories from others who have walked similar paths.
            </p>
            <a 
              href="/stories" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Stories
            </a>
          </div>
        </div>

        {/* Safety Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Safety First</h3>
          <p className="text-yellow-700 mb-4">
            If you're in immediate danger, please call emergency services immediately. 
            This platform is designed for support and guidance, not emergency response.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
              Emergency: 112
            </span>
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
              Women Helpline: 1091
            </span>
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
              Child Helpline: 1098
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-red-600 mb-4">Emergency Help</h3>
              <p className="text-gray-700 mb-6">
                If you're in immediate danger, please call emergency services right away.
              </p>
              
              <div className="space-y-3 mb-6">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-semibold text-gray-900">{contact.name}</div>
                    <div className="text-lg font-bold text-red-600">{contact.number}</div>
                    <div className="text-sm text-gray-600">{contact.description}</div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 