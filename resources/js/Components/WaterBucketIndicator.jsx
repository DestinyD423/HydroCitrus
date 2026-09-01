import { motion } from 'framer-motion';

export default function WaterBucketIndicator({ isFull = false }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-40">
        <svg viewBox="0 0 200 240" className="w-full h-full">
          <path d="M 60 40 L 50 220 L 150 220 L 140 40 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
          
          <motion.path
            d="M 62 210 L 138 210 L 135 180 L 65 180 Z"
            fill="#3b82f6"
            animate={{ opacity: isFull ? 1 : 0, y: isFull ? 0 : 40 }}
            transition={{ duration: 0.8 }}
          />
        </svg>
      </div>
      <div className={`mt-3 text-2xl font-bold ${isFull ? 'text-blue-600' : 'text-orange-600'}`}>
        {isFull ? 'PENUH' : 'KOSONG'}
      </div>
    </div>
  );
}