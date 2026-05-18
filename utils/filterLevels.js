// helper function for filtering levels
function filterLevels(levels, levelFilter) {
  if (!levelFilter || !levels) return levels;

  const requestedLevels = levelFilter
    .split(',')
    .map((level) => level.trim().toUpperCase());

  const filteredLevels = {};

  // Keep only the requested log levels in the response
  Object.entries(levels).forEach(([level, count]) => {
    if (requestedLevels.includes(level)) {
      filteredLevels[level] = count;
    }
  });

  return filteredLevels;
}

module.exports = filterLevels;
