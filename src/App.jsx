import { Routes, Route } from 'react-router-dom';
import Trip from './pages/Trip';
import ParticipantsPage from './pages/ParticipantsPage';
import { Toaster } from 'react-hot-toast';


export default function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 shadow">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
            <img src="/Capture.png" alt="App Logo" className="h-20 w-30" />
            <h1 className="text-4xl font-bold text-white">
              Trip Expense Splitter
            </h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-6">
          <Routes>
            <Route path="/" element={<Trip />} />
            <Route path="/trip/:tripId" element={<Trip />} />
            <Route path="/trip/:tripId/participants" element={<ParticipantsPage />} />
          </Routes>
        </main>
      </div>

      <Toaster position="top-right" />
    </>
  );
}
