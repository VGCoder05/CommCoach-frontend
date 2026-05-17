import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrends, getStats, getCalendar } from '../../store/slices/progressSlice';

const HEATMAP_COLORS = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

// Group flat calendar array into weeks for the heatmap
const buildWeeks = (calendar) => {
  if (!calendar?.length) return [];
  const weeks = [];
  let week = [];
  calendar.forEach((day, i) => {
    week.push(day);
    if (week.length === 7 || i === calendar.length - 1) {
      weeks.push(week);
      week = [];
    }
  });
  return weeks;
};

export const useProgressPageLogic = () => {
  const dispatch = useDispatch();
  const [selectedDays, setSelectedDays] = useState(30);

  const { trends, stats, calendar, isLoading } = useSelector((s) => s.progress);

  useEffect(() => {
    dispatch(getTrends(selectedDays));
    dispatch(getStats());
    dispatch(getCalendar(new Date().getFullYear()));
  }, [dispatch, selectedDays]);

  const weeks = buildWeeks(calendar);

  const heatmapColor = (level) => HEATMAP_COLORS[level] || HEATMAP_COLORS[0];

  return {
    trends,
    stats,
    calendar,
    weeks,
    isLoading,
    selectedDays,
    setSelectedDays,
    heatmapColor,
  };
};