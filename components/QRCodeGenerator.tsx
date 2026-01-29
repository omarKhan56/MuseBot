'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

export default function QRCodeGenerator({ value, size = 200 }: QRCodeGeneratorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse bg-gray-200" style={{ width: size, height: size }} />;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md inline-block">
      <QRCode value={value} size={size} />
    </div>
  );
}