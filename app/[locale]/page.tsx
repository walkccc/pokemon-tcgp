'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'; // Shadcn Select
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Shadcn Table
import { packets } from '@/config/cards';
import { Order, Packet, PacketName } from '@/types';

const Home = () => {
  const [showAccumulated, setShowAccumulated] = useState(false);
  const [selectedPacketName, setSelectedPacketName] = useState(PacketName.MEW);
  const [filterText, setFilterText] = useState('');

  const t = useTranslations('Home');
  const router = useRouter();
  const locale = useLocale();

  const getProbabilities = (packet: Packet, accumulatingRarities: boolean) => {
    const result: {
      // cardKey := card name | card name + rarity
      [cardKey: string]: {
        index: number;
        [order: number]: {
          probability: number;
        };
      };
    } = {};

    let index = 0;

    for (const subPacket of packet.subPackets) {
      for (const bundle of subPacket.bundles) {
        const individualProbability = bundle.probability / bundle.cards.length;
        for (const card of bundle.cards) {
          const cardKey = accumulatingRarities
            ? card
            : `${card} (${bundle.rarity})`;
          if (result[cardKey] === undefined) {
            result[cardKey] = { index: index++ };
            result[cardKey][Order.FIRST_TO_THIRD] = { probability: 0 };
            result[cardKey][Order.FOURTH] = { probability: 0 };
            result[cardKey][Order.FIFTH] = { probability: 0 };
          }
          result[cardKey][subPacket.order] = {
            probability:
              result[cardKey][subPacket.order].probability +
              individualProbability,
          };
        }
      }
    }

    return Object.keys(result)
      .map((cardKey) => ({
        cardKey,
        index: result[cardKey].index,
        [Order.FIRST_TO_THIRD]: result[cardKey][Order.FIRST_TO_THIRD],
        [Order.FOURTH]: result[cardKey][Order.FOURTH],
        [Order.FIFTH]: result[cardKey][Order.FIFTH],
      }))
      .sort((a, b) => a.index - b.index);
  };

  const getRarityIcon = (rarity: string) => {
    if (rarity === 'CROWN') return '👑';
    if (rarity === 'STAR1') return '⭐️';
    if (rarity === 'STAR2') return '⭐️⭐️';
    if (rarity === 'STAR3') return '⭐️⭐️⭐️';
    if (rarity === 'DIAMOND1') return '♢';
    if (rarity === 'DIAMOND2') return '♢♢';
    if (rarity === 'DIAMOND3') return '♢♢♢';
    if (rarity === 'DIAMOND4') return '♢♢♢♢';
    return '';
  };

  const packet = packets.find((packet) => packet.name === selectedPacketName);
  if (packet === undefined) return <div>No packet found</div>;

  const individualProbabilities = getProbabilities(packet, false);
  const accumulatedProbabilities = getProbabilities(packet, true);

  const filteredIndividualProbabilities = individualProbabilities.filter(
    ({ cardKey }) => {
      const cardName = cardKey.substring(0, cardKey.indexOf(' ('));
      return t(cardName).toLowerCase().includes(filterText.toLowerCase());
    },
  );

  const filteredAccumulatedProbabilities = accumulatedProbabilities.filter(
    ({ cardKey }) => {
      return t(cardKey).toLowerCase().includes(filterText.toLowerCase());
    },
  );

  const handleLanguageChange = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <div className="mx-auto max-w-full px-6 py-6 md:px-32">
      <h2 className="mb-6 text-center text-2xl font-semibold">{t('title')}</h2>

      <div className="mb-2 flex items-center space-x-2">
        <Select
          value={locale}
          onValueChange={(newLocale) => handleLanguageChange(newLocale)}
        >
          <SelectTrigger className="rounded-md bg-white p-2 text-black">
            <span>
              {locale === 'en'
                ? '🇺🇸 English'
                : locale === 'ja'
                  ? '🇯🇵 日本語'
                  : '🇹🇼 繁體中文'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">🇹🇼 繁體中文</SelectItem>
            <SelectItem value="en">🇺🇸 English</SelectItem>
            <SelectItem value="ja">🇯🇵 日本語</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedPacketName}
          onValueChange={(packetName: string) =>
            setSelectedPacketName(packetName as PacketName)
          }
        >
          <SelectTrigger className="rounded-md bg-white p-2 text-black">
            <span>{t(selectedPacketName)}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PacketName.MEW}>{t(PacketName.MEW)}</SelectItem>
            <SelectItem value={PacketName.PIKACHU}>
              {t(PacketName.PIKACHU)}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={showAccumulated ? 'accumulated' : 'individual'}
          onValueChange={(e) => setShowAccumulated(e === 'accumulated')}
        >
          <SelectTrigger className="rounded-md bg-white p-2 text-black">
            <span>
              {showAccumulated
                ? t('Accumulated Probabilities')
                : t('Individual Probabilities')}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">
              {t('Individual Probabilities')}
            </SelectItem>
            <SelectItem value="accumulated">
              {t('Accumulated Probabilities')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder={t('Filter by card name')}
          className="w-full rounded-md border p-2"
        />
      </div>

      <Table className="min-w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">{t('Card Name')}</TableHead>
            <TableHead className="w-1/4">
              {t('1st to 3rd Probability')}
            </TableHead>
            <TableHead className="w-1/4">{t('4th Probability')}</TableHead>
            <TableHead className="w-1/4">{t('5th Probability')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!showAccumulated &&
            filteredIndividualProbabilities.map((item) => {
              const { cardKey } = item;
              const cardName = cardKey.substring(0, cardKey.indexOf(' ('));
              const rarity = cardKey.substring(
                cardKey.indexOf('(') + 1,
                cardKey.indexOf(')'),
              );
              const rarityIcon = getRarityIcon(rarity);
              return (
                <TableRow key={cardKey}>
                  <TableCell>
                    {t(cardName)} {rarityIcon}
                  </TableCell>
                  <TableCell>{item['1'].probability.toFixed(3)}%</TableCell>
                  <TableCell>{item['4'].probability.toFixed(3)}%</TableCell>
                  <TableCell>{item['5'].probability.toFixed(3)}%</TableCell>
                </TableRow>
              );
            })}
          {showAccumulated &&
            filteredAccumulatedProbabilities.map((item) => (
              <TableRow key={item.cardKey}>
                <TableCell>{t(item.cardKey)}</TableCell>
                <TableCell>{item['1'].probability.toFixed(3)}%</TableCell>
                <TableCell>{item['4'].probability.toFixed(3)}%</TableCell>
                <TableCell>{item['5'].probability.toFixed(3)}%</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Home;
