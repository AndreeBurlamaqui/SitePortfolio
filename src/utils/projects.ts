import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Fetches a collection and automatically sorts it by 'sortDate' (Newest first).
 * @param collectionName - The string ID of the collection (e.g., 'released-games')
 */
export async function getSortedProjects(collectionName: CollectionKey) {
  // 1. Fetch the data
  const items = await getCollection(collectionName);

  // 2. Sort it (Newest First)
  const sortedItems = items.sort((a, b) => {
    // We assume your schema has 'sortDate'. If not, we fallback to 0 to prevent crashes.
    const dateA = a.data.sortDate?.valueOf() || 0;
    const dateB = b.data.sortDate?.valueOf() || 0;
    return dateB - dateA;
  });

  return sortedItems;
}