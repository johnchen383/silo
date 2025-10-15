// src/queryClient.ts
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// 1️⃣ Create your QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,                 // always refetch
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: Infinity,              // queue mutations until success
    },
  },
})

// 2️⃣ Set up persistence using IndexedDB or localStorage
const persister = createSyncStoragePersister({
  storage: window.localStorage,    // or use IndexedDB with a custom persister
})

persistQueryClient({
  queryClient,
  persister,
  maxAge: 0,                        // discard old queries on reload
  dehydrateOptions: {
    shouldDehydrateMutation: () => true, // queue mutations indefinitely
  },
})
