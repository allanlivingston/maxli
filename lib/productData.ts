import { Battery, Sun, Wind, LucideIcon } from 'lucide-react'

export interface BatteryProduct {
  id: number;
  name: string;
  capacity: string;
  price: number;
  icon: LucideIcon; // Changed from 'any' to 'LucideIcon'
  type: 'ebike' | 'surfboard';
  imageName: string; // New field for the image filename
}

export const ebikeBatteries: BatteryProduct[] = [
  {
    id: 1,
    name: "Redwood Rideout",
    capacity: "500Wh",
    price: 299.99,
    icon: Battery,
    type: 'ebike',
    imageName: 'redwood-rideout.jpg'
  },
  {
    id: 2,
    name: "Sequoia Scrambler",
    capacity: "750Wh",
    price: 399.99,
    icon: Sun,
    type: 'ebike',
    imageName: 'sequoia-scrambler.jpg'
  },
  {
    id: 3,
    name: "Coastal Cruiser",
    capacity: "1000Wh",
    price: 499.99,
    icon: Wind,
    type: 'ebike',
    imageName: 'coastal-cruiser.jpg'
  },
  {
    id: 4,
    name: "Sierra OP",
    capacity: "1200Wh",
    price: 599.99,
    icon: Battery,
    type: 'ebike',
    imageName: 'sierra-op.jpg'
  }
];

export const surfboardBatteries: BatteryProduct[] = [
  {
    id: 101,
    name: "Mavericks Pro",
    capacity: "200Wh",
    price: 199.99,
    icon: Wind,
    type: 'surfboard',
    imageName: 'mavericks-pro.jpg'
  },
  {
    id: 102,
    name: "Santa Cruz Glider",
    capacity: "300Wh",
    price: 249.99,
    icon: Sun,
    type: 'surfboard',
    imageName: 'santa-cruz-glider.jpg'
  },
  {
    id: 103,
    name: "Big Sur Endurance",
    capacity: "400Wh",
    price: 299.99,
    icon: Battery,
    type: 'surfboard',
    imageName: 'big-sur-endurance.jpg'
  }
];