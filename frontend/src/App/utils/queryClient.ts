
import { QueryClient, defaultScheduler, notifyManager } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Runs `write` with React Query's cache notifications delivered synchronously.
 *
 * Required for cache writes that feed a controlled input's `value`: the default
 * scheduler defers notifications to a `setTimeout(0)`, which lands after React's
 * post-event `restoreControlledState` has already reverted the DOM node to its
 * pre-keystroke value, so anything typed inside that window is composed onto the
 * stale value and lost. Notifying synchronously puts the re-render inside the event,
 * ahead of the check that compares node and prop values.
 *
 * Scoped per write so other queries keep React Query's default batching.
 *
 * Call it straight from the event handler that owns the edit. Inside an open
 * `notifyManager.batch()` — which query and mutation callbacks run in — notifications
 * queue until that outer batch ends, by which point the `finally` below has restored the
 * deferring scheduler, and the reverting comes back with no failure signal.
 */
export function writeWithSyncNotify<T>(write: () => T): T {
  notifyManager.setScheduler((callback) => callback());
  try {
    return write();
  } finally {
    notifyManager.setScheduler(defaultScheduler);
  }
}

export default queryClient;
