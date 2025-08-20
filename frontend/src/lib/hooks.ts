import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for specific slices
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUI = () => useAppSelector((state) => state.ui);

// Selector hooks
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () =>
  useAppSelector((state) => state.auth.isAuthenticated);
export const useAuthLoading = () =>
  useAppSelector((state) => state.auth.isLoading);
export const useAuthError = () => useAppSelector((state) => state.auth.error);

export const useSidebarOpen = () =>
  useAppSelector((state) => state.ui.sidebarOpen);
export const useTheme = () => useAppSelector((state) => state.ui.theme);
export const useNotifications = () =>
  useAppSelector((state) => state.ui.notifications);
export const useGlobalLoading = () =>
  useAppSelector((state) => state.ui.isLoading);
