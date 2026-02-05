import { Link } from 'react-router-dom'

export default function Home() {

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#4D007B] rounded-xl text-white text-center py-10 sm:py-16 px-4 sm:px-6 mb-8">
        <h1 className="text-2xl sm:text-5xl font-bold mb-3">Jones County Greyhounds</h1>
        <p className="text-base sm:text-xl text-gray-200">Building champions on and off the track</p>
      </div>

      <img
        src="/2025_header.jpg"
        alt="Jones County Greyhounds cross country team"
        className="w-full h-64 sm:h-80 object-cover object-[center_56%] rounded-xl shadow-lg mb-8"
      />

      {/* Achievement banner */}
      <div className="bg-[#FFD700] rounded-xl text-center py-4 sm:py-5 px-3 sm:px-6 mb-8">
        <h2 className="text-[#4D007B] font-bold text-2xl">🏆 REGION CHAMPIONS 🏆</h2>
        <p className="text-[#4D007B] italic text-sm mt-1">A Legacy of Excellence</p>
        <div className="w-16 h-1 bg-[#4D007B] mx-auto mt-3 mb-5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {[
            { title: 'BOYS CROSS COUNTRY', history: ['2009', '1996', '1995', '1993'] },
            { title: 'GIRLS CROSS COUNTRY', history: ['2017', '2015', '1997', '1996'] },
          ].map(({ title, history }) => (
            <div key={title} className="bg-white rounded-lg shadow-lg overflow-hidden text-left">
              <div className="bg-[#4D007B] text-white text-center py-3">
                <h3 className="text-lg font-bold">🏆 {title} 🏆</h3>
                <p className="text-sm opacity-90">8 Regional Championships</p>
              </div>
              <div className="p-4">
                <div className="text-center mb-3">
                  <p className="text-sm font-semibold text-[#4D007B] uppercase tracking-wide">🔥 FOUR-PEAT CHAMPIONS</p>
                  <div className="flex justify-center gap-2 mt-2">
                    {['2025', '2024', '2023', '2022'].map(year => (
                      <span key={year} className="px-3 py-1 bg-[#FFD700] text-[#4D007B] font-bold rounded text-sm">{year}</span>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#4D007B] uppercase tracking-wide font-semibold">CHAMPIONSHIP HISTORY</p>
                  <div className="flex justify-center gap-2 mt-2 flex-wrap">
                    {history.map(year => (
                      <span key={year} className="px-3 py-1 bg-[#4D007B] text-white rounded text-sm">{year}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#4D007B] rounded-lg text-center py-4 px-4 mt-5">
          <h2 className="text-white font-bold text-lg sm:text-xl">🏆 DOMINATING REGION 4 AAAAA 🏆</h2>
          <p className="text-white/90 text-sm sm:text-base mt-1">
            <span className="text-[#FFD700] font-semibold">16 Total Championships</span>
            {" • "}Both Teams FOUR-PEAT Champions (2022–2025){" • "}
            <span className="text-[#FFD700] font-semibold">Go Hounds!</span>
          </p>
        </div>
      </div>

      {/* CTA cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/athletes"
          className="bg-white rounded-xl shadow p-4 sm:p-6 hover:shadow-md transition border-t-4 border-[#4D007B]"
        >
          <h2 className="text-xl font-bold text-[#4D007B] mb-1">Meet Our Athletes</h2>
          <p className="text-gray-500 text-sm">Browse the full roster of Jones County runners.</p>
        </Link>
        <Link
          to="/meets"
          className="bg-white rounded-xl shadow p-4 sm:p-6 hover:shadow-md transition border-t-4 border-[#FFD700]"
        >
          <h2 className="text-xl font-bold text-[#4D007B] mb-1">Meet Schedule & Results</h2>
          <p className="text-gray-500 text-sm">View upcoming and past meets with full results.</p>
        </Link>
      </div>
    </div>
  )
}
