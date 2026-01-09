import Trip from './pages/Trip';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 shadow">
    
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
        <img src="images/Capture.png" alt="App Logo" className="h-20 w-30" />
          <h1 className="text-4xl font-bold text-white ">
           
            Trip Expense Splitter
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">


        <Trip />
      </main>
    </div>
  );
}
