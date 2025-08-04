import { Link, Paginated } from '@/types';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';

interface Props<T extends object> {
    data: Paginated<T>;
}

const renderLink = (link: Link, index: string) => {
    if (link.label === '&laquo; Previous') {
        return (
            <PaginationItem key={index}>
                <PaginationPrevious href={link.url || '#'} />
            </PaginationItem>
        );
    } else if (link.label === 'Next &raquo;') {
        return (
            <PaginationItem key={index}>
                <PaginationNext href={link.url || '#'} />
            </PaginationItem>
        );
    } else if (link.label === '...') {
        return (
            <PaginationItem key={index}>
                <PaginationEllipsis />
            </PaginationItem>
        );
    } else {
        return (
            <PaginationItem key={index}>
                <PaginationLink href={link.url || '#'} isActive={link.active}>
                    {link.label}
                </PaginationLink>
            </PaginationItem>
        );
    }
};

export default function PaginationButton<T extends object>({ data }: Props<T>) {
    return (
        <Pagination className="mt-4 items-center justify-between px-3">
            <span className="text-sm text-gray-700">
                Showing {data.from} - {data.to} of {data.total} items
            </span>
            <PaginationContent>{data.links.map((link, i) => renderLink(link, i.toString()))}</PaginationContent>
        </Pagination>
    );
}
