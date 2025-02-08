import React,{useState} from 'react'

function Review() {
    const [analysisResults, setAnalysisResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function scrapeReviews() {
        const productUrl = document.getElementById('productUrl').value;
        setLoading(true);
        setError(null);
        setAnalysisResults(null);

        if (!productUrl) {
            setError("Please enter a valid product URL.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/run-pipeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productUrl }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            // Set the analysis results
            setAnalysisResults(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div className='flex flex-col justify-center items-center relative z-10 text-white px-4'>
  {/* URL Input and Search Button */}
  <section className='text-center mt-8 w-full'>
    <div className="relative z-10">
      <h1 className="text-2xl sm:text-4xl font-bold text-white">
        Verify Review
      </h1>
    </div>
    <div className='flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-md sm:max-w-lg'>
      <input
        type="text"
        id="productUrl"
        placeholder="Enter product URL"
        className='p-2 rounded-lg text-white w-full border-white border-2 bg-transparent'
      />
      <button
        onClick={scrapeReviews}
        className='bg-transparent transition-colors border-2 border-white text-white flex justify-center items-center h-10 w-full sm:w-40'
      >
        Scrape Reviews
      </button>
    </div>
  </section>

  {/* Display Analysis Results */}
  {analysisResults && (
    <section className='mt-8 w-full max-w-6xl px-4'>
      {/* Product Legitimacy */}
      <div className='text-center mb-8'>
        <h2 className='text-xl sm:text-3xl font-semibold'>Product Legitimacy</h2>
        <p className='text-lg sm:text-xl mt-2'>{analysisResults.productLegitimacy}</p>
        <p className='text-base sm:text-lg mt-2'>
          Original Reviews: {analysisResults.originalPercentage}%
        </p>
      </div>
      <div className='flex flex-col sm:flex-row w-full gap-4 sm:gap-8'>
        {/* Top Original Reviews */}
        <div className='bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg w-full sm:w-1/3'>
          <h2 className='text-xl sm:text-3xl font-semibold mb-4'>Top Original Reviews</h2>
          <div className='max-h-64 sm:max-h-96 overflow-y-auto'>
            {analysisResults.topOriginalReviews.map((review, index) => (
              <div key={index} className='p-2 bg-gray-800 rounded-lg mb-4'>
                <p className='text-sm sm:text-base'>{review.Review}</p>
                <p className='text-xs sm:text-sm text-gray-400'>
                  Confidence: {(review.PredictionProba * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fake Reviews */}
        <div className='bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg w-full sm:w-1/3'>
          <h2 className='text-xl sm:text-3xl font-semibold mb-4'>Top Fake Reviews</h2>
          <div className='max-h-64 sm:max-h-96 overflow-y-auto'>
            {analysisResults.topFakeReviews.map((review, index) => (
              <div key={index} className='p-2 bg-gray-800 rounded-lg mb-4'>
                <p className='text-sm sm:text-base'>{review.Review}</p>
                <p className='text-xs sm:text-sm text-gray-400'>
                  Confidence: {(review.PredictionProba * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )}

  {/* Error Handling */}
  {error && (
    <section className='mt-8 text-center'>
      <p className='text-red-500 text-sm sm:text-base'>{error}</p>
    </section>
  )}

  {/* Loading State */}
  {loading && (
    <section className='mt-8 text-center'>
      <p className='text-blue-500 text-sm sm:text-base'>Loading...</p>
    </section>
  )}
</div>
  )
}

export default Review