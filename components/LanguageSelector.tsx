//components/LanguageSelector.tsx
'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

export default function LanguageSelector() {
  const [selected, setSelected] = useState('en');

  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
      <Globe className="w-5 h-5 text-gray-600" />
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border-none bg-transparent focus:outline-none cursor-pointer font-medium"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}