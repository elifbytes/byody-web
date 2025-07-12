import { Collection } from '@/types/collection';

export const flattenCollections = (collections: Collection[]): Collection[] => {
    const flatCollections: Collection[] = [];

    const flatten = (collection: Collection) => {
        if (collection.children && collection.children.length > 0) {
            collection.children.forEach(flatten);
        } else {
            flatCollections.push(collection);
        }
    };

    collections.forEach(flatten);

    return flatCollections;
};
