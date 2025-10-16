// src/queryClient.ts
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { get, set, del } from 'idb-keyval'
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      retry: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false,
      networkMode: 'offlineFirst',
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key: string): Promise<string | null> => {
      const value = await get(key);
      return value ?? null;
    },
    setItem: (key: string, value: string): Promise<void> => set(key, value),
    removeItem: (key: string): Promise<void> => del(key),
  },
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: Infinity,
  dehydrateOptions: {
    shouldDehydrateMutation: () => true,
  },
})