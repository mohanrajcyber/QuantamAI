import { Sprout, Cloud, TrendingUp, Camera, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface CropRecommendation {
  name: string;
  season: string;
  yield: string;
  price: string;
  tips: string[];
}

export function AgricultureAssistant() {
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('');
  const [location, setLocation] = useState('');
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [diseaseImage, setDiseaseImage] = useState<File | null>(null);
  const [diseaseResult, setDiseaseResult] = useState('');

  const SOIL_TYPES = ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Clay Soil', 'Sandy Soil'];
  const SEASONS = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];

  const getCropRecommendations = () => {
    // Mock recommendations based on soil and season
    const crops: Record<string, CropRecommendation[]> = {
      'Black Soil': [
        {
          name: 'Cotton (பருத்தி / कपास)',
          season: 'Kharif',
          yield: '15-20 quintals/acre',
          price: '₹5,500-6,500/quintal',
          tips: [
            'Sow in June-July',
            'Requires 50-75cm rainfall',
            'Harvest in 150-180 days'
          ]
        },
        {
          name: 'Wheat (கோதுமை / गेहूं)',
          season: 'Rabi',
          yield: '25-30 quintals/acre',
          price: '₹2,000-2,500/quintal',
          tips: [
            'Sow in November',
            'Needs irrigation',
            'Harvest in March-April'
          ]
        }
      ],
      'Red Soil': [
        {
          name: 'Groundnut (நிலக்கடலை / मूंगफली)',
          season: 'Kharif',
          yield: '12-15 quintals/acre',
          price: '₹5,000-6,000/quintal',
          tips: [
            'Sow in June',
            'Drought resistant',
            'Harvest in 120-140 days'
          ]
        }
      ],
      'Alluvial Soil': [
        {
          name: 'Rice (நெல் / चावल)',
          season: 'Kharif',
          yield: '30-35 quintals/acre',
          price: '₹1,800-2,200/quintal',
          tips: [
            'Transplant in June-July',
            'Needs standing water',
            'Harvest in 120-150 days'
          ]
        }
      ]
    };

    setRecommendations(crops[soilType] || []);
  };

  const analyzeDiseaseImage = () => {
    // Mock disease detection
    const diseases = [
      'Leaf Blight - Apply fungicide immediately',
      'Nitrogen Deficiency - Add urea fertilizer',
      'Pest Attack - Use neem oil spray',
      'Healthy Plant - No action needed'
    ];
    setDiseaseResult(diseases[Math.floor(Math.random() * diseases.length)]);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
          <Sprout className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Agriculture AI</h2>
          <p className="text-sm text-gray-400">किसान मित्र / விவசாயி நண்பன்</p>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span>Current Location</span>
            </div>
            <div className="text-2xl font-bold text-white">28°C</div>
            <div className="text-sm text-gray-300">Partly Cloudy</div>
          </div>
          <Cloud className="w-16 h-16 text-blue-400" />
        </div>
        <div className="mt-3 pt-3 border-t border-blue-500/30 flex items-center gap-4 text-sm">
          <div>
            <div className="text-gray-400">Rainfall</div>
            <div className="text-white font-medium">45mm expected</div>
          </div>
          <div>
            <div className="text-gray-400">Humidity</div>
            <div className="text-white font-medium">65%</div>
          </div>
        </div>
      </div>

      {/* Crop Recommendation */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Crop Recommendations
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Soil Type (मिट्टी का प्रकार / மண் வகை)</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            >
              <option value="">Select soil type</option>
              {SOIL_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Season (मौसम / பருவம்)</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            >
              <option value="">Select season</option>
              {SEASONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={getCropRecommendations}
            disabled={!soilType || !season}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Recommendations
          </button>
        </div>

        {/* Recommendations Results */}
        {recommendations.length > 0 && (
          <div className="mt-4 space-y-3">
            {recommendations.map((crop, idx) => (
              <div key={idx} className="bg-[#0f1c2e] rounded-lg p-4 border border-green-500/30">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-green-400">{crop.name}</h4>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{crop.season}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-gray-400">Expected Yield</div>
                    <div className="text-white font-medium">{crop.yield}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Market Price</div>
                    <div className="text-white font-medium">{crop.price}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {crop.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disease Detection */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-orange-400" />
          Disease Detection (रोग पहचान / நோய் கண்டறிதல்)
        </h3>

        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            <Camera className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-sm text-gray-400 mb-3">Upload a photo of affected plant</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDiseaseImage(e.target.files?.[0] || null)}
              className="hidden"
              id="disease-upload"
            />
            <label
              htmlFor="disease-upload"
              className="inline-block bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Choose Image
            </label>
            {diseaseImage && (
              <p className="text-sm text-green-400 mt-2">✓ {diseaseImage.name}</p>
            )}
          </div>

          <button
            onClick={analyzeDiseaseImage}
            disabled={!diseaseImage}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze Disease
          </button>

          {diseaseResult && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-400 mb-1">Diagnosis:</div>
                  <div className="text-sm text-gray-300">{diseaseResult}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Market Prices */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Today's Market Prices</h3>
        <div className="space-y-2">
          {[
            { crop: 'Rice (चावल / அரிசி)', price: '₹2,100/quintal', change: '+5%' },
            { crop: 'Wheat (गेहूं / கோதுமை)', price: '₹2,350/quintal', change: '+2%' },
            { crop: 'Cotton (कपास / பருத்தி)', price: '₹6,200/quintal', change: '-3%' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#0f1c2e] rounded-lg">
              <span className="text-gray-300">{item.crop}</span>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{item.price}</span>
                <span className={`text-sm ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
