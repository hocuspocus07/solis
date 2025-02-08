import React,{useState} from 'react'
import NavComp from '../components/NavComp.jsx'

function Home() {
    const [metrics, setMetrics] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function scrapeReviews() {
        const productUrl = document.getElementById('productUrl').value;
        setLoading(true);
        setError(null);
        setMetrics(null);
        setPredictions(null);

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
            setPredictions(data.predictions_data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='custom-bg h-screen w-screen'>
            <NavComp/>
            <div className='flex flex-col justify-center items-center text-white'>
                {/* URL Input and Search Button */}
                <section className='text-center mt-8'>
                    <h1 className='text-6xl mb-6 font-bold'>Myntra Fake Review Detector</h1>
                    <div className='flex gap-4'>
                        <input
                            type="text"
                            id="productUrl"
                            placeholder="Enter product URL"
                            className='p-2 rounded-lg text-black w-96'
                        />
                        <button
                            onClick={scrapeReviews}
                            className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg'
                        >
                            Scrape Reviews
                        </button>
                    </div>
                </section>

                {/* Prediction Summary with Semi-Circular Graph */}
                {predictions && (
                    <section className='mt-8 text-center'>
                        <h2 className='text-3xl font-semibold mb-4'>Prediction Summary</h2>
                        <div className='relative w-64 h-32'>
                            <div className='absolute w-full h-full border-4 border-gray-700 rounded-t-full overflow-hidden'>
                                <div
                                    className='absolute bottom-0 left-0 w-full bg-blue-500'
                                    style={{ height: `${(predictions.prediction_counts['Original'] / predictions.total_reviews) * 100}%` }}
                                ></div>
                                <div
                                    className='absolute bottom-0 left-0 w-full bg-red-500'
                                    style={{ height: `${(predictions.prediction_counts['Computer-Generated'] / predictions.total_reviews) * 100}%` }}
                                ></div>
                            </div>
                            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
                                <p className='text-lg'>{predictions.total_reviews} Reviews</p>
                            </div>
                        </div>
                        <div className='flex justify-center gap-8 mt-4'>
                            <div className='flex items-center gap-2'>
                                <div className='w-4 h-4 bg-blue-500'></div>
                                <p>Original: {predictions.prediction_counts['Original']}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='w-4 h-4 bg-red-500'></div>
                                <p>Computer-Generated: {predictions.prediction_counts['Computer-Generated']}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Original and Computer-Generated Reviews */}
                {predictions && (
                    <section className='mt-8 w-full max-w-6xl'>
                        <div className='grid grid-cols-2 gap-8'>
                            {/* Computer-Generated Reviews */}
                            <div className='bg-gray-900 p-6 rounded-lg shadow-lg'>
                                <h2 className='text-3xl font-semibold mb-4'>Computer-Generated Reviews</h2>
                                {predictions.examples
                                    .filter((review) => review.Prediction_Label === 'Computer-Generated')
                                    .slice(0, 5)
                                    .map((review, index) => (
                                        <div key={index} className='p-4 bg-gray-800 rounded-lg mb-4'>
                                            <p>{review.Review}</p>
                                        </div>
                                    ))}
                            </div>

                            {/* Original Reviews */}
                            <div className='bg-gray-900 p-6 rounded-lg shadow-lg'>
                                <h2 className='text-3xl font-semibold mb-4'>Original Reviews</h2>
                                {predictions.examples
                                    .filter((review) => review.Prediction_Label === 'Original')
                                    .slice(0, 5)
                                    .map((review, index) => (
                                        <div key={index} className='p-4 bg-gray-800 rounded-lg mb-4'>
                                            <p>{review.Review}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Error Handling */}
                {error && (
                    <section className='mt-8 text-center'>
                        <p className='text-red-500'>{error}</p>
                    </section>
                )}
            </div>
        </div>
    )
}

export default Home