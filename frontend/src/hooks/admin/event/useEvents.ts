import { useState, useCallback, useMemo, useEffect } from "react";
import listEvents, { EventQuery, EventListItem, ListEventsResponse } from "@/services/admin/events/listEvents";
import createEvent, { CreateEventPayload } from "@/services/admin/events/createEvent";
import updateEvent, { UpdateEventPayload } from "@/services/admin/events/updateEvent";
import deleteEvent from "@/services/admin/events/deleteEvent";
import getEventById from "@/services/admin/events/getEventById";

export type UseEventsOptions = {
  initialQuery?: EventQuery;
  autoFetch?: boolean;
};

export function useEvents(options: UseEventsOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<EventQuery>(initialQuery);
  const [data, setData] = useState<ListEventsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (override?: EventQuery) => {
    setLoading(true);
    setError(null);
    try {
      const effectiveQuery = { ...query, ...override };
      const res = await listEvents(effectiveQuery);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [query]);

  // CRUD operations
  const create = useCallback(async (payload: CreateEventPayload) => {
    const res = await createEvent(payload);
    await fetchEvents();
    return res;
  }, [fetchEvents]);

  const update = useCallback(async (id: string | number, payload: UpdateEventPayload) => {
    const res = await updateEvent(id, payload);
    await fetchEvents();
    return res;
  }, [fetchEvents]);

  const remove = useCallback(async (id: string | number) => {
    const res = await deleteEvent(id);
    await fetchEvents();
    return res;
  }, [fetchEvents]);

  const getById = useCallback(async (id: string | number) => getEventById(id), []);

  const items: EventListItem[] = useMemo(() => data?.items ?? [], [data]);

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, []); // Empty dependency array to run only once on mount

  return {
    query,
    setQuery,
    data,
    items,
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? query.limit ?? 10,
    loading,
    error,
    fetchEvents,
    create,
    update,
    remove,
    getById,
  };
}

export default useEvents;
