import { Heart, Pill, Calendar, AlertTriangle, Activity, Phone } from 'lucide-react';
import { useState } from 'react';

interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface Medicine {
  name: string;
  time: string;
  taken: boolean;
}

export function HealthcareAssistant() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: 'Paracetamol 500mg', time: '08:00 AM', taken: false },
    { name: 'Vitamin D', time: '12:00 PM', taken: false },
    { name: 'Calcium', time: '08:00 PM', taken: false }
  ]);

  const COMMON_SYMPTOMS = [
    'Fever (बुखार / காய்ச்சல்)',
    'Headache (सिरदर्द / தலைவலி)',
    'Cough (खांसी / இருமல்)',
    'Cold (सर्दी / சளி)',
    'Body Pain (शरीर दर्द / உடல் வலி)',
    'Stomach Ache (पेट दर्द / வயிற்று வலி)'
  ];

  const addSymptom = (symptom: string) => {
    setSymptoms([...symptoms, { name: symptom, severity: 'moderate' }]);
    setSymptomInput('');
  };

  const checkSymptoms = () => {
    if (symptoms.length === 0) {
      setDiagnosis('Please add symptoms first.');
      return;
    }

    // Mock diagnosis based on symptoms
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    
    if (symptomNames.some(s => s.includes('fever') || s.includes('बुखार') || s.includes('காய்ச்சல்'))) {
      setDiagnosis(`
**Possible Condition:** Common Fever / सामान्य बुखार / சாதாரண காய்ச்சல்

**Recommendations:**
1. Take Paracetamol 500mg every 6 hours
2. Drink plenty of fluids (8-10 glasses of water)
3. Rest for 2-3 days
4. Monitor temperature regularly

**When to see a doctor:**
- Fever above 103°F (39.4°C)
- Fever lasting more than 3 days
- Severe headache or body pain
- Difficulty breathing

**Home Remedies:**
- Tulsi (तुलसी / துளசி) tea
- Ginger (अदरक / இஞ்சி) with honey
- Warm water gargle
      `);
    } else if (symptomNames.some(s => s.includes('cough') || s.includes('खांसी') || s.includes('இருமல்'))) {
      setDiagnosis(`
**Possible Condition:** Common Cough / खांसी / இருமல்

**Recommendations:**
1. Drink warm water with honey
2. Avoid cold drinks
3. Steam inhalation 2-3 times daily
4. Cough syrup if needed

**Ayurvedic Remedies:**
- Honey with turmeric (हल्दी / மஞ்சள்)
- Ginger tea
- Tulsi leaves
      `);
    } else {
      setDiagnosis('Please consult a doctor for proper diagnosis.');
    }
  };

  const toggleMedicine = (index: number) => {
    const newMedicines = [...medicines];
    newMedicines[index].taken = !newMedicines[index].taken;
    setMedicines(newMedicines);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Healthcare Assistant</h2>
          <p className="text-sm text-gray-400">स्वास्थ्य सहायक / சுகாதார உதவியாளர்</p>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Emergency Helpline</div>
            <div className="text-2xl font-bold text-white">108</div>
            <div className="text-sm text-gray-300">24/7 Ambulance Service</div>
          </div>
          <Phone className="w-12 h-12 text-red-400" />
        </div>
      </div>

      {/* Symptom Checker */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Symptom Checker (लक्षण जांच / அறிகுறி சோதனை)
        </h3>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder="Enter symptom..."
              className="flex-1 bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && symptomInput.trim()) {
                  addSymptom(symptomInput);
                }
              }}
            />
            <button
              onClick={() => symptomInput.trim() && addSymptom(symptomInput)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>

          {/* Common Symptoms */}
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((symptom, idx) => (
              <button
                key={idx}
                onClick={() => addSymptom(symptom)}
                className="px-3 py-1.5 bg-[#0f1c2e] hover:bg-gray-700/50 text-sm text-gray-300 rounded-lg transition-colors"
              >
                {symptom}
              </button>
            ))}
          </div>

          {/* Added Symptoms */}
          {symptoms.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-400 mb-2">Your Symptoms:</div>
              {symptoms.map((symptom, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#0f1c2e] rounded-lg p-3">
                  <span className="text-gray-300">{symptom.name}</span>
                  <button
                    onClick={() => setSymptoms(symptoms.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={checkSymptoms}
            disabled={symptoms.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Symptoms
          </button>

          {/* Diagnosis */}
          {diagnosis && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-blue-400 mb-2">AI Diagnosis:</div>
                  <div className="text-sm text-gray-300 whitespace-pre-line">{diagnosis}</div>
                  <div className="mt-3 text-xs text-yellow-400">
                    ⚠️ This is not a substitute for professional medical advice. Please consult a doctor.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medicine Reminders */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-green-400" />
          Medicine Reminders (दवा अनुस्मारक / மருந்து நினைவூட்டல்)
        </h3>

        <div className="space-y-2">
          {medicines.map((medicine, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                medicine.taken
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-[#0f1c2e] border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleMedicine(idx)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    medicine.taken
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-600 hover:border-green-500'
                  }`}
                >
                  {medicine.taken && <span className="text-white text-sm">✓</span>}
                </button>
                <div>
                  <div className={`font-medium ${medicine.taken ? 'text-green-400 line-through' : 'text-white'}`}>
                    {medicine.name}
                  </div>
                  <div className="text-sm text-gray-400">{medicine.time}</div>
                </div>
              </div>
              <Pill className={`w-5 h-5 ${medicine.taken ? 'text-green-400' : 'text-gray-500'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Health Tips</h3>
        <div className="space-y-3">
          {[
            {
              title: 'Drink Water (पानी पिएं / தண்ணீர் குடியுங்கள்)',
              tip: 'Drink 8-10 glasses of water daily for better health'
            },
            {
              title: 'Exercise (व्यायाम / உடற்பயிற்சி)',
              tip: '30 minutes of walking or yoga daily keeps you fit'
            },
            {
              title: 'Sleep (नींद / தூக்கம்)',
              tip: 'Get 7-8 hours of quality sleep every night'
            },
            {
              title: 'Balanced Diet (संतुलित आहार / சமச்சீர் உணவு)',
              tip: 'Include fruits, vegetables, and proteins in your diet'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0f1c2e] rounded-lg p-4">
              <div className="font-medium text-green-400 mb-1">{item.title}</div>
              <div className="text-sm text-gray-300">{item.tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ayurveda Section */}
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-5 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-white mb-3">Ayurvedic Remedies</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div>🌿 <strong>Tulsi (तुलसी / துளசி):</strong> Boosts immunity, good for cough and cold</div>
          <div>🌿 <strong>Turmeric (हल्दी / மஞ்சள்):</strong> Anti-inflammatory, heals wounds</div>
          <div>🌿 <strong>Ginger (अदरक / இஞ்சி):</strong> Aids digestion, reduces nausea</div>
          <div>🌿 <strong>Neem (नीम / வேப்பம்):</strong> Purifies blood, good for skin</div>
        </div>
      </div>
    </div>
  );
}
