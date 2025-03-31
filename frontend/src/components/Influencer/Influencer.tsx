import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { TiktokLogo, InstagramLogo, TrashSimple } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { useElementSize } from "@custom-react-hooks/use-element-size";

export type Person = {
  _id: string;
  name: string;
  lastName: string;
  accounts: {
    tiktok: Array<string>;
    instagram: Array<string>;
  };
  avatarUrl: string;
};

interface Props {
  person: Person;
  onDelete: () => void;
  onShowDetails: () => void;
}

function Platform({ accounts, onShowDetails, logo }: { accounts: Array<string>; onShowDetails: () => void; logo: React.ReactNode }) {
  const [containerRef, size] = useElementSize();

  const accountsOverflow = useMemo(() => size.width > 400, [size]);

  return (
    <div className="mt-2 w-[500px] flex items-center gap-3 relative">
      {logo}

      <div ref={containerRef} className="flex gap-3">
        {accounts.map((userName: string) => (
          <div className="flex items-center gap-3" key={userName}>
            <Separator className="my-2" orientation="vertical" />

            <p key={userName} className="text-muted-foreground border-right">
              @{userName}
            </p>
          </div>
        ))}
      </div>

      {accountsOverflow && (
        <>
          <div className="w-35 h-30 backdrop-blur-[1.5px] z-1 absolute right-0"></div>

          <Button variant={"ghost"} className="w-25  cursor-pointer bg-accent z-2 absolute right-5" onClick={onShowDetails}>
            Show more
          </Button>
        </>
      )}
    </div>
  );
}

function Influencer({ person, onDelete, onShowDetails }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="flex-col items-center gap-8 bg-card text-card-foreground rounded-xl border p-3 pb-4 shadow-sm overflow-hidden"
        layoutId={person._id}
        transition={{ ease: [0.6, 0.01, -0.05, 0.9], duration: 0.8 }}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-3 items-center">
            <Avatar className="size-18 lg:size-15">
              <AvatarImage src={person.avatarUrl} />
              <AvatarFallback>{person.name}</AvatarFallback>
            </Avatar>

            <p className="text-xl max-w-4/5 break-all ">
              {person.name} {person.lastName}
            </p>
          </div>

          <TrashSimple size={26} className="cursor-pointer min-w-10" onClick={onDelete} />
        </div>

        <div className="flex items-center gap-x-5">
          <div className="flex flex-col justify-start gap-1 w-max max-w-4/5 flex-1 overflow-hidden">
            <div className="mt-2 w-[500px] flex items-center gap-3 relative">
              {
                <Platform
                  accounts={person.accounts.tiktok}
                  onShowDetails={onShowDetails}
                  logo={<TiktokLogo size={24} className="text-muted-foreground min-w-8" />}
                />
              }
            </div>

            {
              <Platform
                accounts={person.accounts.instagram}
                onShowDetails={onShowDetails}
                logo={<InstagramLogo size={24} className="text-muted-foreground min-w-8" />}
              />
            }
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Influencer;
