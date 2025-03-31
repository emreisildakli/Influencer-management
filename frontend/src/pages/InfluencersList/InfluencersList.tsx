import Influencer from "@/components/Influencer";
import { Person } from "@/components/Influencer/Influencer";
import { useEffect, useState } from "react";
import InfluencerSkeleton from "@/components/InfluencerSkeleton";
import InfluencerCreate from "../../components/InfluencerCreate";
import { deleteInfluencer, getInfluencerList } from "@/request";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { InstagramLogo, TiktokLogo } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

const getAvatarUrl = (idx: number) => {
  return `https://shadcnblocks.com/images/block/avatar-${(idx % 7) + 1}.webp`;
};

function InfluencersList() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Person | null>(null);

  const fetchInfluencers = (query: string = "") => {
    getInfluencerList(query)
      .then(({ data }) => setInfluencers(data.data.map((item: Person, idx: number) => ({ ...item, avatarUrl: getAvatarUrl(idx) }))))
      .catch((err) => {
        toast.error(err.response.data.message);
        setInfluencers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchInfluencers();
  }, []);

  const handleDelete = (id: string) => {
    setLoading(true);
    deleteInfluencer(id)
      .then(() => {
        toast.success("Influencer has been deleted.");
        return fetchInfluencers();
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  const handleShowDetails = (inf: Person) => {
    if (selectedInfluencer?._id === inf._id) {
      setSelectedInfluencer(null);
    } else {
      setSelectedInfluencer(inf);
    }
  };

  return (
    <div className="container mx-auto mt-10 h-full grow">
      {/* modal and search bar*/}
      <div className="flex gap-2">
        <InfluencerCreate fetchInfluencers={fetchInfluencers} />
        <Input
          placeholder="Search for users..."
          type="text"
          onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            fetchInfluencers(e.target.value);
          }, 500)}
          className="h-[42px]"
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,_minmax(630px,_1fr))] gap-5">
        {influencers &&
          influencers.map((inf: Person) => (
            <Influencer key={inf._id} person={inf} onDelete={() => handleDelete(inf._id)} onShowDetails={() => handleShowDetails(inf)} />
          ))}

        {/* skeleton loading */}
        {loading && influencers.length === 0 && Array.from({ length: 10 }).map((a, idx) => <InfluencerSkeleton key={idx} />)}

        {/* Drawer */}
        <Sheet open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {selectedInfluencer?.name} {selectedInfluencer?.lastName}
              </SheetTitle>
            </SheetHeader>

            <div className="grid gap-4 py-4 px-2 grid-cols-2">
              <div className="px-1">
                <div className="flex justify-center items-center gap-2 pb-2">
                  <TiktokLogo size={22} className="text-neutral-900" />
                  <SheetDescription className="text-neutral-900 font-medium">Tiktok accounts</SheetDescription>
                </div>

                <Separator />

                <ul className="grid grid-cols-1 gap-2 pt-1">
                  {selectedInfluencer?.accounts.tiktok.map((acc) => (
                    <li key={acc} className="px-2 text-muted-foreground text-sm break-words">
                      @{acc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-1">
                <div className="flex items-center gap-2 pb-2">
                  <InstagramLogo size={22} className="text-neutral-900" />
                  <SheetDescription className="text-neutral-900 font-medium">Instagram accounts</SheetDescription>
                </div>

                <Separator />

                <ul className="grid list-disc grid-cols-1 gap-2 t-1 mt-2">
                  {selectedInfluencer?.accounts.instagram.map((acc) => (
                    <li key={acc} className="px-0 text-muted-foreground text-sm break-words">
                      @{acc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default InfluencersList;
