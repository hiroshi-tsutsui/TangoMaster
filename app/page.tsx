import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vocab Drill</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">N3 Core</span>
        </div>

        <div className="relative w-full h-96 perspective-1000 group cursor-pointer">
          <div className="relative w-full h-full text-center transition-transform duration-500 transform-style-3d group-hover:rotate-y-180 shadow-xl rounded-2xl">
            
            {/* Front */}
            <div className="absolute w-full h-full bg-white rounded-2xl backface-hidden flex flex-col items-center justify-center border border-gray-200">
               <span className="text-gray-400 text-sm mb-4">Word</span>
               <h2 className="text-6xl font-bold">開発</h2>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full bg-blue-600 text-white rounded-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center">
               <h2 className="text-4xl font-bold mb-2">Kaihatsu</h2>
               <p className="text-xl opacity-90">Development</p>
               <p className="mt-6 text-sm opacity-75 max-w-[80%]">Software development is fun.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 gap-4">
          <button className="flex-1 py-4 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition">Hard</button>
          <button className="flex-1 py-4 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200 transition">Easy</button>
        </div>
      </div>
    </main>
  );
}
