'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { popularBuildUps } from '@/config/popularBuildUps';

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('probabilities');
  const router = useRouter();
  const t = useTranslations('BuildUp');

  const handleCardClick = (cardName: string) => {
    router.push(`/cards/${cardName}`);
  };

  const renderBuildUps = () => {
    return (
      <div className="space-y-8">
        {popularBuildUps.map((buildUp, index) => (
          <div key={index} className="border p-4">
            <h3 className="mb-4 text-center text-lg font-semibold">
              {buildUp.name}
            </h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-10">
              {buildUp.cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="relative cursor-pointer border p-2 text-center"
                  onClick={() => handleCardClick(card)}
                >
                  <div className="font-semibold">{card}</div>
                  <div className="absolute inset-0 hidden hover:flex hover:items-center hover:justify-center hover:bg-black hover:bg-opacity-50 hover:text-white">
                    <span>{t('Click for details')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="mx-auto max-w-full px-6 py-6 md:px-32">
      <h2 className="mb-6 text-center text-2xl font-semibold">{t('title')}</h2>
      <div className="mb-6 flex space-x-4">
        <button
          className={`${
            selectedTab === 'probabilities' ? 'font-bold' : ''
          } p-2`}
          onClick={() => setSelectedTab('probabilities')}
        >
          {t('Probabilities')}
        </button>
        <button
          className={`${selectedTab === 'buildUps' ? 'font-bold' : ''} p-2`}
          onClick={() => setSelectedTab('buildUps')}
        >
          {t('Popular Build-ups')}
        </button>
      </div>
      {renderBuildUps()}
    </div>
  );
};

export default Home;
