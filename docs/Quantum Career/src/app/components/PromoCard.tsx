import { Button } from "./ui/button";

export function PromoCard() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
        }}></div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-white text-xl mb-2">
          Get Your best<br />
          profession<br />
          with Quantum Career
        </h3>
        <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
          Learn more
        </Button>
      </div>
    </div>
  );
}
