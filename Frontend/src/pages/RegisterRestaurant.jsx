import { useNavigate } from 'react-router-dom';

export default function RegisterRestaurantPlaceholder() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10">
      <h1 className="text-4xl font-black mb-6">Register Your Restaurant</h1>
      <p className="mb-10 text-lg">Follow the steps to get your restaurant listed.</p>
      <button 
        onClick={() => navigate('/owner')} 
        className="px-8 py-4 bg-[#F5B301] font-bold rounded-full"
      >
        Complete Registration & Go to Dashboard
      </button>
    </div>
  );
}
