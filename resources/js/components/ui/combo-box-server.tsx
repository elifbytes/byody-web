import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./command";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { PopoverDialog, PopoverDialogContent, PopoverDialogTrigger } from '@/components/ui/popover-dialog';
import { PopoverClose } from '@radix-ui/react-popover';

interface Props<T extends object> {
    title?: string;
    value?: T;
    valueKey: keyof T;
    disabled?: boolean;
    size?: number;
    renderText: (value: T) => string;
    onChange?: (value: T) => void;
    minInputLength?: number;
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
    minInputLength = 0,
    searchFn,
}: Props<T>) => {
    const [search, setSearch] = useState<string>("");
    const [options, setOptions] = useState<T[]>([]);
    const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
    const debouncedsearch = useDebounce<string>(search, 500);

    const getOptions = useCallback(async () => {
        if (debouncedsearch.length < minInputLength) {
            setOptions([]);
            setCanLoadMore(false);
            return;
        }
        const searchResult = await searchFn(debouncedsearch || "", 0, size);
        if (searchResult.length === 0 || searchResult.length < size) {
            setCanLoadMore(false);
        }
        setOptions(searchResult);
    }, [debouncedsearch, minInputLength, searchFn, size]);

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
        <PopoverDialog modal={true}>
            <PopoverDialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "min-w-full max-w-96 justify-between",
                        !value && "text-muted-foreground",
                    )}
                    disabled={disabled}
                >
                    <div className="truncate">
                        {value ? renderText(value) : `Select ${title}`}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverDialogTrigger>
            <PopoverDialogContent className="PopoverContent p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        className="active:border-primary"
                        placeholder={`Search ${title}... (please type at least ${minInputLength} characters)`}
                        value={search}
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
                                        Load More ↓
                                    </Button>
                                )}
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverDialogContent>
        </PopoverDialog>
    );
};

export default ComboBoxServer;
