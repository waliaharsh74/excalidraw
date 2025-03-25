
import Link from 'next/link';
import { Button } from "../components/ui/button";
import { Users, Calendar } from 'lucide-react';

interface RoomCardProps {
  id: string;
  name: string;
  participants: number;
  createdAt: string;
  thumbnailColor?: string;
}

const RoomCard = ({ id, name, participants, createdAt, thumbnailColor = 'bg-blue-100' }: RoomCardProps) => {
  const getRoomUrl = () => `/room/${id}`;
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className={`${thumbnailColor} h-32 relative`}>
        {/* Random shapes as thumbnail preview */}
        <div className="absolute w-16 h-16 rounded-lg bg-blue-500/60 left-[20%] top-[30%] transform -rotate-6"></div>
        <div className="absolute w-12 h-12 rounded-full bg-purple-500/60 left-[60%] top-[40%]"></div>
        <div className="absolute w-10 h-10 bg-green-500/60 left-[40%] top-[60%] transform rotate-45"></div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
          <Link href="/signin">
            <Button className="transition-transform transform group-hover:scale-105">
              Join Room
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2 truncate">{name}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span>{participants} participants</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
