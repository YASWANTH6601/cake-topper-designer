import type { DesignShape } from "@/types/design";
import type { BackgroundObject, ElementObject, ImageObject, TextObject } from "@/types/editor";

const DATABASE_NAME = "cake-topper-designer";
const DATABASE_VERSION = 1;
const STORE_NAME = "designs";

export type PersistedSource =
  | { kind: "url"; url: string }
  | { kind: "blob"; blob: Blob };

export type PersistedImageObject = Omit<ImageObject, "src"> & { source: PersistedSource };
export type PersistedElementObject = Omit<ElementObject, "src"> & { source: PersistedSource };
export type PersistedBackground = Omit<BackgroundObject, "src"> & { source: PersistedSource };

export type SavedDesign = {
  id: string;
  version: 1;
  name: string;
  createdAt: string;
  updatedAt: string;
  shape: DesignShape;
  width: number;
  height: number;
  background: PersistedBackground | null;
  textObjects: TextObject[];
  imageObjects: PersistedImageObject[];
  elementObjects: PersistedElementObject[];
  thumbnail: Blob | null;
};

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction was aborted."));
  });
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open IndexedDB."));
  });
}

export async function saveDesign(design: SavedDesign) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(design);
    await transactionDone(transaction);
  } finally {
    database.close();
  }
}

export async function getDesign(id: string) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    return await requestResult(transaction.objectStore(STORE_NAME).get(id) as IDBRequest<SavedDesign | undefined>);
  } finally {
    database.close();
  }
}

export async function listDesigns() {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const designs = await requestResult(transaction.objectStore(STORE_NAME).getAll() as IDBRequest<SavedDesign[]>);
    return designs.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  } finally {
    database.close();
  }
}

export async function deleteDesign(id: string) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    await transactionDone(transaction);
  } finally {
    database.close();
  }
}

export async function duplicateDesign(source: SavedDesign) {
  const now = new Date().toISOString();
  const duplicate: SavedDesign = structuredClone(source);
  duplicate.id = crypto.randomUUID();
  duplicate.name = `Copy of ${source.name}`;
  duplicate.createdAt = now;
  duplicate.updatedAt = now;
  await saveDesign(duplicate);
  return duplicate;
}

export function isStableProjectSource(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

export async function persistSource(src: string, blobCache: Map<string, Blob>): Promise<PersistedSource> {
  if (isStableProjectSource(src)) return { kind: "url", url: src };
  const cached = blobCache.get(src);
  if (cached) return { kind: "blob", blob: cached };
  const response = await fetch(src);
  if (!response.ok) throw new Error("Unable to prepare image data for saving.");
  const blob = await response.blob();
  blobCache.set(src, blob);
  return { kind: "blob", blob };
}

export function restoreSource(source: PersistedSource, objectUrls: Set<string>, blobCache: Map<string, Blob>) {
  if (source.kind === "url") return source.url;
  const url = URL.createObjectURL(source.blob);
  objectUrls.add(url);
  blobCache.set(url, source.blob);
  return url;
}
