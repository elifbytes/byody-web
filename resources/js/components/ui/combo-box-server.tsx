import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./command";
import { PopoverClose } from "@radix-ui/react-popover";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface Props<T extends object> {
    title?: string;
    value?: T;
    valueKey: keyof T;
    disabled?: boolean;
    size?: number;
    renderText: (value: T) => string;
    onChange?: (value: T) => void;
    searchFn: (search: string, offset: number, size: number) => Promise<T[]>;
}
const ComboBoxServer = <T extends object>({
    title,
    value,
    valueKey,
    disabled = false,
    size = 25,
    renderText,
    onChange,
    searchFn,
}: Props<T>) => {
    const [search, setSearch] = useState<string>("");
    const [options, setOptions] = useState<T[]>([]);
    const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
    const debouncedsearch = useDebounce<string>(search, 500);

    const getOptions = useCallback(async () => {
        const searchResult = await searchFn(debouncedsearch || "", 0, size);
        if (searchResult.length === 0 || searchResult.length < size) {
            setCanLoadMore(false);
        }
        setOptions(searchResult);
    }, [debouncedsearch, searchFn, size]);

    const getMoreOptions = useCallback(async () => {
        const searchResult = await searchFn(
            debouncedsearch || "",
            options.length,
            size,
        );
        if (searchResult.length === 0 || searchResult.length < size) {
            setCanLoadMore(false);
        }
        if (
            searchResult[searchResult.length - 1][valueKey] ===
            options[options.length - 1][valueKey]
        ) {
            setCanLoadMore(false);
            return;
        }
        setOptions([...options, ...searchResult]);
    }, [debouncedsearch, searchFn, options, valueKey, size]);

    useEffect(() => {
        getOptions();
    }, [getOptions]);

    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "min-w-full max-w-96 justify-between",
                        !value && "text-muted-foreground",
                    )}
                    disabled={disabled}
                >
                    <div className="truncate">
                        {value ? renderText(value) : `Pilih ${title}`}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="PopoverContent p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        className="active:border-primary"
                        placeholder={`Cari ${title}...`}
                        value={typeof search === "string" ? search : ""}
                        onValueChange={(value) => setSearch(value)}
                    />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                            <PopoverClose asChild>
                                <div>
                                    {options.map((option) => (
                                        <CommandItem
                                            value={option[valueKey] as string}
                                            key={option[valueKey] as string}
                                            onSelect={() => onChange?.(option)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    option[valueKey] ===
                                                        value?.[valueKey]
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                            {renderText(option)}
                                        </CommandItem>
                                    ))}
                                </div>
                            </PopoverClose>
                            <CommandItem asChild>
                                {canLoadMore && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-7"
                                        onClick={getMoreOptions}
                                    >
                                        Muat Lebih Banyak ↓
                                    </Button>
                                )}
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ComboBoxServer;
