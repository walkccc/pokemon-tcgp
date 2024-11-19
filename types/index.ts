export enum Order {
  FIRST_TO_THIRD = 1,
  FOURTH = 4,
  FIFTH = 5,
}

export enum Rarity {
  DIAMOND1 = 'DIAMOND1',
  DIAMOND2 = 'DIAMOND2',
  DIAMOND3 = 'DIAMOND3',
  DIAMOND4 = 'DIAMOND4',
  STAR1 = 'STAR1',
  STAR2 = 'STAR2',
  STAR3 = 'STAR3',
  CROWN = 'CROWN',
}

type Bundle = {
  rarity: Rarity;
  probability: number;
  cards: string[];
};

type SubPacket = {
  order: Order;
  bundles: Bundle[];
};

export enum PacketName {
  MEW = 'Mew Packet',
  PIKACHU = 'Pikachu Packet',
}

export type Packet = {
  name: PacketName;
  subPackets: SubPacket[];
};
