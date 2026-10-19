import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_YT_API_KEY;

export function useYouTubeChannels(channelIds, pollMs = 120_000) {
  const [totalSubs, setTotalSubs] = useState(0);
  const [subsById, setSubsById] = useState({});
  const [error, setError] = useState(null);

  const idsKey = channelIds.join(',');

  useEffect(() => {
    let timer = null;
    const controller = new AbortController();

    const fetchChannels = async () => {
      try {
        const { data } = await axios.get(
          'https://www.googleapis.com/youtube/v3/channels',
          {
            params: {
              part: 'statistics',
              id: idsKey,
              key: API_KEY,
              fields:
                'items(id,statistics(subscriberCount,hiddenSubscriberCount))',
            },
            signal: controller.signal,
          },
        );

        const map = {};
        let total = 0;
        for (const item of data.items ?? []) {
          if (item.statistics.hiddenSubscriberCount) continue;
          const subs = Number(item.statistics.subscriberCount);
          map[item.id] = subs;
          total += subs;
        }

        setSubsById(map);
        setTotalSubs(total);
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.response?.data?.error?.message || err.message);
      }
    };

    const start = () => {
      fetchChannels();
      timer = setInterval(fetchChannels, pollMs);
    };
    const stop = () => {
      clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : !timer && start());

    start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
      controller.abort();
    };
  }, [idsKey, pollMs]);

  return { totalSubs, subsById, error };
}
