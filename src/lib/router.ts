import type { RouterProviderProps } from 'react-router-dom';

export const routerConfig: RouterProviderProps['future'] = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
  v7_normalizeFormMethod: true
};