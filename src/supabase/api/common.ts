export const REFETCH_ON_SETTLED = false;

export function IS_OFFLINE_ERROR(err: any) {
  return (
    err.message.includes('Failed to fetch')
  )
}