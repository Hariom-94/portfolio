// import { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { edited_videos } from '../data.js';

// const API_KEY = import.meta.env.VITE_YT_API_KEY;
// const CACHE_KEY = 'edited_videos_views_v1';

// const chunk = (arr, size = 50) =>
//   Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
//     arr.slice(i * size, i * size + size),
//   );

// const readCache = (ttl, idsKey) => {
//   try {
//     const c = JSON.parse(localStorage.getItem(CACHE_KEY));
//     if (c && c.idsKey === idsKey && Date.now() - c.at < ttl) return c;
//   } catch {}
//   return null;
// };

// /**
//  * @param videos    array of { yt_id }, defaults to edited_videos
//  * @param cacheMs   how long a result is reused before refetching (default 5 min)
//  * @param pollMs    optional auto-refresh while the tab is visible (0 = off)
//  */
// export function useEditedVideoViews({
//   videos = edited_videos,
//   cacheMs = 5 * 60_000,
//   pollMs = 0,
// } = {}) {
//   const ids = useMemo(
//     () => [...new Set(videos.map((v) => v.yt_id))], // de-dupe so no ID is counted twice
//     [videos],
//   );
//   const idsKey = ids.join(',');

//   const initial = readCache(cacheMs, idsKey);
//   const [viewsById, setViewsById] = useState(initial?.viewsById ?? {});
//   const [loading, setLoading] = useState(!initial);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let timer = null;
//     const controller = new AbortController();

//     const fetchViews = async (force = false) => {
//       if (!force && readCache(cacheMs, idsKey)) return; // still fresh, spend 0 units

//       try {
//         const responses = await Promise.all(
//           chunk(ids).map((batch) =>
//             axios.get('https://www.googleapis.com/youtube/v3/videos', {
//               params: {
//                 part: 'statistics',
//                 id: batch.join(','),
//                 key: API_KEY,
//                 fields: 'items(id,statistics/viewCount)',
//               },
//               signal: controller.signal,
//             }),
//           ),
//         );

//         const map = {};
//         for (const { data } of responses)
//           for (const it of data.items ?? []) {
//             map[it.id] = Number(it.statistics?.viewCount ?? 0);
//           }

//         setViewsById(map);
//         setError(null);
//         try {
//           localStorage.setItem(
//             CACHE_KEY,
//             JSON.stringify({ at: Date.now(), idsKey, viewsById: map }),
//           );
//         } catch {}
//       } catch (err) {
//         if (axios.isCancel(err)) return; // keep last good numbers on any failure
//         setError(err.response?.data?.error?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const start = () => {
//       fetchViews();
//       if (pollMs > 0) timer = setInterval(() => fetchViews(true), pollMs);
//     };
//     const stop = () => {
//       clearInterval(timer);
//       timer = null;
//     };
//     const onVisibility = () => (document.hidden ? stop() : !timer && start());

//     start();
//     document.addEventListener('visibilitychange', onVisibility);
//     return () => {
//       document.removeEventListener('visibilitychange', onVisibility);
//       stop();
//       controller.abort();
//     };
//   }, [idsKey, cacheMs, pollMs]);

//   const totalViews = useMemo(
//     () => Object.values(viewsById).reduce((sum, n) => sum + n, 0),
//     [viewsById],
//   );

//   return {
//     totalViews,
//     viewsById, // { [yt_id]: views }, handy for per-video cards
//     foundCount: Object.keys(viewsById).length,
//     loading,
//     error,
//   };
// }

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { edited_videos } from '../data';

const API_KEY = import.meta.env.VITE_YT_API_KEY;
// Bumped to v2: the cached shape now includes likes and durations
const CACHE_KEY = 'edited_videos_stats_v2';

const chunk = (arr, size = 50) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

// ISO 8601 duration ("PT1H2M3S", "P1DT2H") -> seconds
const toSeconds = (iso = '') => {
  const m =
    iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/) || [];
  return (
    (+m[1] || 0) * 86400 +
    (+m[2] || 0) * 3600 +
    (+m[3] || 0) * 60 +
    (+m[4] || 0)
  );
};

const readCache = (ttl, idsKey) => {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (c && c.idsKey === idsKey && Date.now() - c.at < ttl) return c;
  } catch {}
  return null;
};

/**
 * One API call (1 quota unit per 50 videos) returns views, likes and duration.
 *
 * @param videos   array of { yt_id }, defaults to edited_videos
 * @param cacheMs  how long a result is reused before refetching (default 5 min)
 * @param pollMs   optional auto-refresh while the tab is visible (0 = off)
 */
export function useEditedVideoViews({
  videos = edited_videos,
  cacheMs = 5 * 60_000,
  pollMs = 0,
} = {}) {
  const ids = useMemo(
    () => [...new Set(videos.map((v) => v.yt_id))], // de-dupe: no ID counted twice
    [videos],
  );
  const idsKey = ids.join(',');

  const initial = readCache(cacheMs, idsKey);
  const [viewsById, setViewsById] = useState(initial?.viewsById ?? {});
  const [detailsById, setDetailsById] = useState(initial?.detailsById ?? {});
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timer = null;
    const controller = new AbortController();

    const fetchStats = async (force = false) => {
      if (!force && readCache(cacheMs, idsKey)) return; // still fresh: 0 units

      try {
        const responses = await Promise.all(
          chunk(ids).map((batch) =>
            axios.get('https://www.googleapis.com/youtube/v3/videos', {
              params: {
                part: 'statistics,contentDetails',
                id: batch.join(','),
                key: API_KEY,
                fields:
                  'items(id,statistics(viewCount,likeCount),contentDetails/duration)',
              },
              signal: controller.signal,
            }),
          ),
        );

        const views = {};
        const details = {};
        for (const { data } of responses) {
          for (const it of data.items ?? []) {
            views[it.id] = Number(it.statistics?.viewCount ?? 0);
            details[it.id] = {
              // likeCount is missing when a channel hides likes
              likes: Number(it.statistics?.likeCount ?? 0),
              seconds: toSeconds(it.contentDetails?.duration),
            };
          }
        }

        setViewsById(views);
        setDetailsById(details);
        setError(null);
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              at: Date.now(),
              idsKey,
              viewsById: views,
              detailsById: details,
            }),
          );
        } catch {}
      } catch (err) {
        if (axios.isCancel(err)) return; // keep last good numbers on any failure
        setError(err.response?.data?.error?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    const start = () => {
      fetchStats();
      if (pollMs > 0) timer = setInterval(() => fetchStats(true), pollMs);
    };
    const stop = () => {
      clearInterval(timer);
      timer = null;
    };
    // Pause polling while the tab is hidden, resume when visible
    const onVisibility = () => (document.hidden ? stop() : !timer && start());

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
      controller.abort();
    };
  }, [idsKey, cacheMs, pollMs]);

  const totals = useMemo(() => {
    const totalViews = Object.values(viewsById).reduce((s, n) => s + n, 0);
    const list = Object.values(detailsById);
    return {
      totalViews,
      totalLikes: list.reduce((s, d) => s + d.likes, 0),
      totalSeconds: list.reduce((s, d) => s + d.seconds, 0),
    };
  }, [viewsById, detailsById]);

  return {
    ...totals, // totalViews, totalLikes, totalSeconds
    viewsById, // { [yt_id]: views }
    detailsById, // { [yt_id]: { likes, seconds } }
    foundCount: Object.keys(viewsById).length, // should equal edited_videos.length
    loading,
    error,
  };
}
