//need to populate these with the actual data
import { Battery, Sun, Wind } from 'lucide-react'

import { Battery, Sun, Wind } from 'lucide-react'

export interface BatteryProduct {
  id: number;
  name: string;
  capacity: string;
  price: number;
  icon: any; // You might want to define a more specific type for icons
  type: 'ebike' | 'surfboard';
  imageName: string; // New field for the image filename
}

export const ebikeBatteries: BatteryProduct[] = [
  {
    id: 1,
    name: "Eco Rider",
    capacity: "500Wh",
    price: 299.99,
    icon: Battery,
    type: 'ebike',
    imageName: 'eco-rider.jpg'
  },
  {
    id: 2,
    name: "Urban Commuter",
    capacity: "750Wh",
    price: 399.99,
    icon: Sun,
    type: 'ebike',
    imageName: 'urban-commuter.jpg'
  },
  {
    id: 3,
    name: "Mountain Explorer",
    capacity: "1000Wh",
    price: 499.99,
    icon: Wind,
    type: 'ebike',
    imageName: 'mountain-explorer.jpg'
  },
  {
    id: 4,
    name: "Long Range Cruiser",
    capacity: "1200Wh",
    price: 599.99,
    icon: Battery,
    type: 'ebike',
    imageName: 'long-range-cruiser.jpg'
  }
];

export const surfboardBatteries: BatteryProduct[] = [
  {
    id: 101,
    name: "Wave Rider",
    capacity: "200Wh",
    price: 199.99,
    icon: Wind,
    type: 'surfboard',
    imageName: 'wave-rider.jpg'
  },
  {
    id: 102,
    name: "Ocean Explorer",
    capacity: "300Wh",
    price: 249.99,
    icon: Sun,
    type: 'surfboard',
    imageName: 'ocean-explorer.jpg'
  },
  {
    id: 103,
    name: "Surf Pro",
    capacity: "400Wh",
    price: 299.99,
    icon: Battery,
    type: 'surfboard',
    imageName: 'surf-pro.jpg'
  }
];