import { cache } from 'react'
import { getContent } from './content'

// Dedupe content reads within a single request (layout + page).
export const getCachedContent = cache(getContent)
