/**
 * Location Context Provider
 * Manages multi-tenant restaurant location switching
 */

'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useAuthStore } from '@/store/auth-store';
import { locationApi } from '@/services/api';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: string;
  address?: string;
  status: 'active' | 'paused' | 'closed';
  logo?: string;
}

interface LocationContextType {
  locations: Location[];
  currentLocation: Location | null;
  isLoading: boolean;
  switchLocation: (locationId: string) => Promise<void>;
  refreshLocations: () => Promise<void>;
  hasLocationAccess: (locationId: string) => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Mock locations for development
const MOCK_LOCATIONS: Location[] = [
  {
    id: 'rst_001',
    name: 'Bella Vista - Downtown',
    address: '123 Main St, Downtown',
    status: 'active',
  },
  {
    id: 'rst_002',
    name: 'Bella Vista - Uptown',
    address: '456 Oak Ave, Uptown',
    status: 'active',
  },
  {
    id: 'rst_003',
    name: 'Bella Vista - Mall Branch',
    address: '789 Mall Drive, Shopping Center',
    status: 'paused',
  },
];

export function LocationProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuthStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load locations when user changes
  useEffect(() => {
    if (user?.restaurantIds?.length) {
      // Filter mock locations based on user's allowed locations
      const userLocations = MOCK_LOCATIONS.filter((loc) =>
        user.restaurantIds?.includes(loc.id)
      );
      setLocations(userLocations);

      // Set current location
      const currentLoc = userLocations.find(
        (loc) => loc.id === user.currentLocationId
      );
      setCurrentLocation(currentLoc || userLocations[0] || null);
    } else {
      setLocations([]);
      setCurrentLocation(null);
    }
  }, [user]);

  const switchLocation = useCallback(
    async (locationId: string) => {
      if (!user) return;

      // Check if user has access to this location
      if (!user.restaurantIds?.includes(locationId)) {
        toast.error('You do not have access to this location');
        return;
      }

      setIsLoading(true);

      try {
        // Call API to switch location
        await locationApi.switchLocation(locationId);

        // Update local state
        const newLocation = locations.find((loc) => loc.id === locationId);
        if (newLocation) {
          setCurrentLocation(newLocation);
          setUser({
            ...user,
            currentLocationId: locationId,
          });
          toast.success(`Switched to ${newLocation.name}`);
        }
      } catch (error) {
        toast.error('Failed to switch location');
      } finally {
        setIsLoading(false);
      }
    },
    [user, locations, setUser]
  );

  const refreshLocations = useCallback(async () => {
    if (!user) return;

    try {
      const response = await locationApi.getLocations();
      // Update locations from API response
    } catch (error) {
      console.error('Failed to refresh locations:', error);
    }
  }, [user]);

  const hasLocationAccess = useCallback(
    (locationId: string) => {
      return user?.restaurantIds?.includes(locationId) ?? false;
    },
    [user]
  );

  return (
    <LocationContext.Provider
      value={{
        locations,
        currentLocation,
        isLoading,
        switchLocation,
        refreshLocations,
        hasLocationAccess,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

// Hook for location-scoped permissions
export function useLocationPermission(permission: string) {
  const { user } = useAuthStore();
  const { currentLocation } = useLocation();

  const hasPermission = (): boolean => {
    if (!user) return false;

    // Check global permissions
    if (user.permissions?.includes(permission) || user.permissions?.includes('*')) {
      return true;
    }

    // Check location-specific permissions
    if (currentLocation?.id) {
      const locationPerms = user.locationPermissions?.[currentLocation.id];
      if (locationPerms?.includes(permission) || locationPerms?.includes('all')) {
        return true;
      }
    }

    return false;
  };

  return { hasPermission: hasPermission() };
}
