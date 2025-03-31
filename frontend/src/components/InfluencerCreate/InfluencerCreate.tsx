import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { TrashSimple } from "@phosphor-icons/react";
import { v4 as uuid } from "uuid";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createInfluencer } from "@/request";

const platforms = [
  {
    value: "instagram",
    label: "Instagram"
  },
  {
    value: "tiktok",
    label: "Tiktok"
  }
];

enum PlatformEnum {
  tiktok = "tiktok",
  instagram = "instagram"
}

interface IFormInput {
  name: string;
  lastName: string;
}

interface Props {
  fetchInfluencers: () => void;
}

const getDefaultAccount = () => ({ platform: "tiktok", userName: "", id: uuid() });

// yup schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required("First name is a required field")
    .test("len", "First name cannot be longer than 50 characters.", (val) => val.length <= 50),
  lastName: yup
    .string()
    .required("Last name is a required field")
    .test("len", "Last name cannot be longer than 50 characters.", (val) => val.length <= 50)
});

const errorClasses = "text-xs text-red-600";

const checkDuplicate = (array: Array<string>) => array.some((item, index) => array.indexOf(item) !== index);

function InfluencerCreate({ fetchInfluencers }: Props) {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accounts, setAccounts] = useState([getDefaultAccount()]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField
  } = useForm<IFormInput>({
    defaultValues: { name: "", lastName: "" },
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (accounts.some((acc) => !acc.userName.trim())) {
      toast.warning("Username input cannot be empty.");
      return;
    }

    const tiktokAccounts = accounts.filter((a) => a.platform === PlatformEnum.tiktok).map((a) => a.userName);
    const instagramAccounts = accounts.filter((a) => a.platform === PlatformEnum.instagram).map((a) => a.userName);

    if (checkDuplicate(tiktokAccounts)) {
      toast.warning("A tiktok account with same username already exists.");
      return;
    }

    if (checkDuplicate(instagramAccounts)) {
      toast.warning("An instagram account with same username already exists.");
      return;
    }

    const request = {
      ...data,
      accounts: {
        tiktok: tiktokAccounts,
        instagram: instagramAccounts
      }
    };

    createInfluencer(request)
      .then(() => {
        toast.success("Influencer has been created.");
        resetField("name");
        resetField("lastName");
        setAccounts([getDefaultAccount()]);

        return fetchInfluencers();
      })
      .catch((err) => err.response.data.errors.map((message: string) => toast.error(message)))
      .finally(() => setIsModalOpen(false));
  };

  const selectPlatform = (id: string, platform: string) => {
    setAccounts(accounts.map((acc) => (acc.id === id ? { ...acc, platform } : acc)));
  };

  const changeUserName = (id: string, userName: string) => {
    setAccounts(accounts.map((acc) => (acc.id === id ? { ...acc, userName } : acc)));
  };

  const addNewAccount = () => {
    const newAccount = getDefaultAccount();
    setAccounts([...accounts, newAccount]);
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const togglePlatformDropdown = (id: string) => {
    if (openDropdown === id) {
      setOpenDropdown("");
    } else {
      setOpenDropdown(id);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild className="mb-5 p-5 px-8">
        <Button variant="outline">Create </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an influencer</DialogTitle>
          <DialogDescription>Enter the details. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">First Name</Label>
            <Input {...register("name", { required: true, maxLength: 50 })} placeholder="Emre" className="col-span-3" />
          </div>
          {errors.name && <p className={errorClasses}>{errors.name.message}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Last Name</Label>
            <Input {...register("lastName", { required: true, maxLength: 50 })} placeholder="Işıldaklı" className="col-span-3" />
          </div>
          {errors.lastName && <p className={errorClasses}>{errors.lastName.message}</p>}

          <Label className="mt-2">Social Media Accounts</Label>

          <div className="grid cols-1 gap-4 overflow-y-scroll max-h-30">
            {accounts.map((account) => (
              <div className="flex items-center gap-2" key={account.id}>
                <Popover open={openDropdown === account.id} onOpenChange={() => togglePlatformDropdown(account.id)}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDropdown === account.id}
                      className="w-[150px] justify-between"
                    >
                      {account.platform ? platforms.find((platform) => platform.value === account.platform)?.label : "Select platform..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[150px] p-0">
                    <Command>
                      <CommandInput placeholder="Search platform..." className="h-9" />
                      <CommandList>
                        <CommandGroup>
                          {platforms.map((platform) => (
                            <CommandItem
                              key={platform.value}
                              value={platform.value}
                              onSelect={(currentValue) => {
                                selectPlatform(account.id, currentValue);
                                setOpenDropdown("");
                              }}
                            >
                              {platform.label}
                              <Check className={cn("ml-auto", account.platform === platform.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Input
                  maxLength={30}
                  value={account.userName}
                  onChange={(e) => changeUserName(account.id, e.target.value)}
                  placeholder="emreisildakli"
                  id={account.id}
                />

                <TrashSimple className="cursor-pointer size-8 mr-6" onClick={() => deleteAccount(account.id)} />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 cursor-pointer w-max" onClick={addNewAccount}>
            <CirclePlus className="size-5 cursor-pointer" />
            <Label className="cursor-pointer">Add another account</Label>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InfluencerCreate;
