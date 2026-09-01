import { motion } from 'framer-motion';

export default function PumpSwitch({ isOn = false }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`relative w-32 h-16 rounded-full transition-all duration-300 shadow-lg ${
          isOn ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
        }`}
      >
        <motion.div
          className="absolute top-2 left-2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center"
          animate={{ x: isOn ? 64 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className={`w-3 h-3 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-400'}`} />
        </motion.div>
      </div>

      <div className="text-center">
        <div className={`text-2xl font-bold ${isOn ? 'text-green-600' : 'text-gray-600'}`}>
          {isOn ? 'HIDUP' : 'MATI'}
        </div>
      </div>
    </div>
  );
}