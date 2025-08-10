import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    PopoverDialog,
    PopoverDialogContent,
    PopoverDialogTrigger,
} from "@/components/ui/popover-dialog";

interface Props {
    items: { value: string; label: string }[];
    placeholder?: string;
    value: string | null;
    onChange: (value: string | null) => void;
}

export function Combobox({
    items,
    value,
    placeholder = "item",
    onChange,
}: Props) {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <PopoverDialog open={open} onOpenChange={setOpen} modal={true}>
            <PopoverDialogTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? (
                        items.find((item) => item.value.trim() === value.trim())
                            ?.label
                    ) : (
                        <div className="text-muted-foreground">
                            Select {placeholder}...
                        </div>
                    )}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverDialogTrigger>
            <PopoverDialogContent className="w-[--radix-popover-trigger-width] p-0 bg-transparent PopoverContent">
                <Command
                    filter={(value, search, keywords) => {
                        const extendedValue = `${value} ${keywords?.join(" ")}`;
                        if (
                            extendedValue
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                            return 1;
                        return 0;
                    }}
                >
                    <CommandInput
                        placeholder={`Search ${placeholder}...`}
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    keywords={[item.label]}
                                    onSelect={(currentValue) => {
                                        onChange(
                                            currentValue === value
                                                ? null
                                                : currentValue,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === item.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverDialogContent>
        </PopoverDialog>
    );
}
