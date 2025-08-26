import { useState, useEffect, useCallback, useRef } from "react";
import {
  eventService,
  Event,
  PaginatedEventResponse,
  EventQueryParams,
} from "@/services/end-user/eventService";

interface PaginationState {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UseEventsOptions {
  initialLimit?: number;
  autoFetch?: boolean;
  upcoming?: boolean; // Filter for upcoming events only
  countdownEnabled?: boolean; // Filter for countdown events only
}

export function useEvents(options: UseEventsOptions = {}) {
  const {
    initialLimit = 10,
    autoFetch = true,
    upcoming = false,
    countdownEnabled,
  } = options;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: initialLimit,
  });

  const hasInitialized = useRef(false);

  const fetchEvents = useCallback(
    async (page = 1, limit = initialLimit, params: EventQueryParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching events with:", { page, limit, ...params });

        let response: PaginatedEventResponse<Event>;

        if (upcoming) {
          response = await eventService.getUpcomingEvents(page, limit);
        } else if (countdownEnabled) {
          response = await eventService.getCountdownEvents(page, limit);
        } else {
          response = await eventService.getPublishedEvents(page, limit);
        }

        console.log("Event service response:", response);
        console.log("Response success:", response.success);
        console.log("Response data:", response.data);
        console.log("Response data items:", response.data?.items);
        console.log("Items is array:", Array.isArray(response.data?.items));

        if (response.success && response.data) {
          if (Array.isArray(response.data.items)) {
            // Paginated response
            console.log("Setting events:", response.data.items);
            console.log("Number of events:", response.data.items.length);
            setEvents(response.data.items);
            const paginationData = {
              total: response.data.total || 0,
              totalPages: response.data.totalPages || 0,
              currentPage: response.data.page || page,
              limit: response.data.limit || limit,
            };
            setPagination(paginationData);
          } else if (Array.isArray(response.data)) {
            // Direct array of events
            setEvents(response.data);
            setPagination({
              total: response.data.length,
              totalPages: 1,
              currentPage: 1,
              limit: response.data.length,
            });
          } else {
            setEvents([]);
            setPagination({
              total: 0,
              totalPages: 0,
              currentPage: 1,
              limit: initialLimit,
            });
          }
        } else {
          console.warn("Events fetch failed:", response.message);
          // Don't set error if there are just no events, only if success is false
          if (response.success === false) {
            setError(response.message || "Failed to fetch events");
          }
          setEvents([]);
          setPagination({
            total: 0,
            totalPages: 0,
            currentPage: 1,
            limit: initialLimit,
          });
        }
      } catch (err) {
        console.error("Events fetch error:", err);
        console.error("Error details:", {
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
          raw: err,
        });
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setEvents([]);
        setPagination({
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: initialLimit,
        });
      } finally {
        setLoading(false);
      }
    },
    [initialLimit, upcoming, countdownEnabled]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      fetchEvents(page, pagination.limit);
    },
    [fetchEvents, pagination.limit]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    fetchEvents,
    setCurrentPage,
    refetch: fetchEvents,
  };
}

// Hook for single event by slug
export function useEvent(slug: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async (eventSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventService.getBySlug(eventSlug);
      setEvent(eventData);
    } catch (err) {
      console.error("Event fetch error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Event not found";
      setError(errorMessage);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      fetchEvent(slug);
    }
  }, [slug, fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch: () => fetchEvent(slug),
  };
}

// Hook for single event by id
export function useEventById(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventService.getById(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error("Event fetch by id error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Event not found";
      setError(errorMessage);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id, fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch: () => fetchEvent(id),
  };
}
