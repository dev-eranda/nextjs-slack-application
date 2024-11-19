import { format } from "date-fns";

interface ChannleHeroProps {
   name: string;
   createdTime: number;
}

export const ChannelHero = ({ name, createdTime }: ChannleHeroProps) => {
   return (
      <div className="mt-[88px] mx-5 mb-4">
         <p className="text-2xl font-bold flex items-center mb-2"># {name}</p>
         <p className="font-normal text-slate-800 mb-4">
            This channel was created on {format(createdTime, "MMMM do, yyyy")}, This is the very begining of the{" "}
            <strong>{name}</strong> channel.
         </p>
      </div>
   );
};
