const fs = require("fs");
const path = require("path");

const ROOT = "/home/enrico/last-war-map-planner";
const RAW_PATH = path.join(ROOT, "assets/data/season-5-poi-points.json");
const STRATEGIC_PATH = path.join(ROOT, "assets/data/season-5-strategic-poi.json");
const OUTPUT_PATH = path.join(ROOT, "docs/season5-benchmark-report.md");

const SEASON_CONFIG = {
  limits: {
    maxCities: 8,
    baseStrongholds: 4,
    maxStrongholds: 12,
    strongholdsPerCity: 1
  }
};

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeStrategicPoint(point) {
  return {
    id: point.id,
    sourceId: point.sourceId || point.id,
    name: point.label,
    sourceName: point.label,
    category: point.category || point.type,
    label: point.label,
    shortLabel: point.shortLabel,
    level: point.level || 0,
    x: point.x,
    y: point.y,
    gridX: point.gridX,
    gridY: point.gridY,
    width: point.width || 80,
    height: point.height || 80,
    buff: point.buff || null,
    resources: point.resources || null,
    meta: point.meta || {},
    isCapitol: (point.category || point.type) === "capital"
  };
}

function normalizeRawPoint(point) {
  return {
    id: point.id,
    sourceId: point.sourceId || point.id,
    name: point.label || point.sourceName,
    sourceName: point.sourceName || point.label,
    category: point.category,
    label: point.label || point.sourceName,
    shortLabel: point.shortLabel,
    level: point.level || 0,
    x: point.x,
    y: point.y,
    gridX: point.gridX,
    gridY: point.gridY,
    width: point.width || 50,
    height: point.height || 50,
    buff: point.buff || null,
    resources: point.resources || null,
    meta: point.meta || {},
    isCapitol: point.category === "capital"
  };
}

function territoryKind(point) {
  if (point.category === "regional_zone") return "city";
  if (point.category === "road") return "city";
  if (point.category === "stronghold_territory") return "bank";
  if (point.category === "capital") return "golden_palace";
  if (point.category === "nexus") return "nexus";
  if (point.category === "outpost") return "outpost";
  if (point.category === "trade_post") return "trade_post";
  if (point.category === "crystal_mine") return "crystal_mine";
  return point.category;
}

function buildAllPoints() {
  const rawData = loadJson(RAW_PATH);
  const strategicData = loadJson(STRATEGIC_PATH);
  const rawPoints = (rawData.poi || rawData.points || []).map(normalizeRawPoint);
  const strategicPoints = (strategicData.poi || strategicData.points || []).map(normalizeStrategicPoint);
  const strategicById = new Map(strategicPoints.map((point) => [point.id, point]));

  return rawPoints.map((point) => {
    const strategic = strategicById.get(point.id);
    return Object.assign(
      {},
      point,
      strategic
        ? {
            name: strategic.name || point.name,
            label: strategic.label || point.label,
            shortLabel: strategic.shortLabel || point.shortLabel
          }
        : null,
      {
        territoryKind: territoryKind(point),
        cells: null
      }
    );
  });
}

const allPoints = buildAllPoints();
const pointsById = new Map(allPoints.map((point) => [point.id, point]));

function pointById(id) {
  return pointsById.get(id) || null;
}

function pointName(point) {
  return point.name || point.label || point.sourceName;
}

function isCity(point) {
  return point && point.territoryKind === "city";
}

function isTraversalPoint(point) {
  return point &&
    (point.territoryKind === "golden_palace" ||
      point.territoryKind === "nexus" ||
      point.territoryKind === "city" ||
      point.territoryKind === "bank");
}

function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function pointsAdjacent(a, b) {
  if (!a || !b) return false;
  const aLeft = a.x - (a.width || 50) / 2;
  const aRight = a.x + (a.width || 50) / 2;
  const aTop = a.y - (a.height || 50) / 2;
  const aBottom = a.y + (a.height || 50) / 2;
  const bLeft = b.x - (b.width || 50) / 2;
  const bRight = b.x + (b.width || 50) / 2;
  const bTop = b.y - (b.height || 50) / 2;
  const bBottom = b.y + (b.height || 50) / 2;
  const overlapX = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);
  const overlapY = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);
  const epsilon = 0.001;

  if (overlapX > epsilon && overlapY > epsilon) return true;

  const sharesVerticalEdge =
    (Math.abs(aRight - bLeft) <= epsilon || Math.abs(bRight - aLeft) <= epsilon) &&
    overlapY > epsilon;
  if (sharesVerticalEdge) return true;

  const sharesHorizontalEdge =
    (Math.abs(aBottom - bTop) <= epsilon || Math.abs(bBottom - aTop) <= epsilon) &&
    overlapX > epsilon;
  return sharesHorizontalEdge;
}

function graphNeighbors(point, collection) {
  return collection.filter((candidate) => candidate.id !== point.id && pointsAdjacent(point, candidate));
}

function shortestPath(startId, targetId, collection, neighborFn) {
  const traversable = collection.filter(isTraversalPoint);
  const map = new Map(traversable.map((point) => [point.id, point]));
  if (!map.has(startId) || !map.has(targetId)) return [];

  const queue = [startId];
  const previous = new Map();
  const visited = new Set([startId]);

  while (queue.length) {
    const currentId = queue.shift();
    if (currentId === targetId) break;
    neighborFn(map.get(currentId), traversable).forEach((neighbor) => {
      if (visited.has(neighbor.id)) return;
      visited.add(neighbor.id);
      previous.set(neighbor.id, currentId);
      queue.push(neighbor.id);
    });
  }

  if (!visited.has(targetId)) return [];

  const path = [];
  let cursor = targetId;
  while (cursor) {
    path.unshift(cursor);
    cursor = previous.get(cursor);
    if (cursor === startId) {
      path.unshift(cursor);
      break;
    }
  }
  return path;
}

function strictNeighbors(point, collection) {
  return collection.filter((candidate) => candidate.id !== point.id && pointsAdjacent(point, candidate));
}

function palaceZonePoints() {
  const palace = pointById("poi:I61");
  if (!palace) return [];
  return allPoints.filter((point) => {
    return point.id === palace.id || (point.category === "crystal_mine" && pointsAdjacent(point, palace));
  });
}

function adjacentToPalaceZone(point) {
  return palaceZonePoints().some((zonePoint) => pointsAdjacent(point, zonePoint));
}

function centralBankStrongholds() {
  return allPoints
    .filter((point) => point.territoryKind === "bank" && point.level === 10 && adjacentToPalaceZone(point))
    .sort((a, b) => manhattanDistance(a, pointById("poi:I61")) - manhattanDistance(b, pointById("poi:I61")));
}

function allianceFrontier(alliance) {
  const owned = alliance.areaIds.map(pointById).filter(Boolean);
  if (owned.length) return owned[0];
  return allPoints
    .filter((point) => point.territoryKind === "city" && point.level <= 2)
    .sort((a, b) => manhattanDistance(a, pointById("poi:I61")) - manhattanDistance(b, pointById("poi:I61")))[0] || null;
}

function pointResourceScore(point) {
  if (!point || !point.resources) return point && point.level ? point.level * 100 : 0;
  return (point.resources.influence || 0) + ((point.resources.crystalGold || 0) * 1000) + ((point.level || 0) * 100);
}

function strongholdCapacityForOwnedPoints(ownedPoints) {
  const cityCount = ownedPoints.filter(isCity).length;
  const level6CityCount = ownedPoints.filter((point) => point.territoryKind === "city" && point.level === 6).length;
  return Math.min(
    SEASON_CONFIG.limits.baseStrongholds +
      (cityCount - level6CityCount) * 1 +
      level6CityCount * 2,
    SEASON_CONFIG.limits.maxStrongholds
  );
}

function computeAllianceCounts(alliance) {
  const owned = alliance.areaIds.map(pointById).filter(Boolean);
  const cityCount = owned.filter(isCity).length;
  const strongholdCount = owned.filter((point) => point.territoryKind === "bank").length;
  return {
    cities: { current: cityCount, max: SEASON_CONFIG.limits.maxCities },
    strongholds: { current: strongholdCount, max: strongholdCapacityForOwnedPoints(owned) }
  };
}

function nextDesiredRouteId(desiredRouteIds, ownedIds) {
  const owned = new Set(ownedIds);
  return desiredRouteIds.find((id) => !owned.has(id)) || null;
}

function protectedKeepIds(state, desiredRouteIds, alliance) {
  const protectedIds = {};
  const nextDesired = desiredRouteIds.filter((id) => !state.ownedIds.includes(id)).slice(0, 4);
  nextDesired.forEach((id) => {
    protectedIds[id] = true;
  });
  state.ownedIds.forEach((ownedId) => {
    const ownedPoint = pointById(ownedId);
    if (!ownedPoint) return;
    nextDesired.forEach((targetId) => {
      const targetPoint = pointById(targetId);
      if (targetPoint && pointsAdjacent(ownedPoint, targetPoint)) protectedIds[ownedId] = true;
    });
  });
  const startId = alliance.areaIds[0];
  if (startId) protectedIds[startId] = true;
  return protectedIds;
}

function classifyOwnedTerritories(state, desiredRouteIds, alliance) {
  const keepIds = protectedKeepIds(state, desiredRouteIds, alliance);
  const classes = {};
  state.ownedIds.forEach((ownedId) => {
    const point = pointById(ownedId);
    if (!point) return;
    if (keepIds[ownedId]) classes[ownedId] = "keep";
    else if (pointResourceScore(point) >= 450000) classes[ownedId] = "yield";
    else classes[ownedId] = "release-candidate";
  });
  return classes;
}

function createAllianceDayState(alliance) {
  const ownedIds = alliance.areaIds.slice();
  const captureHistory = {};
  ownedIds.forEach((id) => {
    captureHistory[id] = 1;
  });
  return {
    day: 1,
    alliance,
    ownedIds,
    cityCapturesToday: 0,
    bankCapturesToday: 0,
    actionsToday: 0,
    counts: computeAllianceCounts({ areaIds: ownedIds }),
    desiredRouteIds: [],
    ownedClasses: {},
    capturedNamesToday: {},
    captureHistory,
    releasedHistory: {},
    recentReleasedIds: {},
    slotsUsedToday: {},
    preferredSideByDay: {}
  };
}

function refreshAllianceDayState(state) {
  state.counts = computeAllianceCounts({ areaIds: state.ownedIds });
  state.ownedClasses = classifyOwnedTerritories(
    state,
    state.desiredRouteIds || [],
    state.alliance || { areaIds: state.ownedIds }
  );
  return state;
}

function nextAllianceDay(state) {
  state.day += 1;
  state.cityCapturesToday = 0;
  state.bankCapturesToday = 0;
  state.actionsToday = 0;
  state.slotsUsedToday = {};
  state.capturedNamesToday = {};
  return refreshAllianceDayState(state);
}

function nextBattleSlotIndex(state) {
  const nextIndex = (state.actionsToday || 0) + 1;
  return Math.min(3, nextIndex);
}

function isWarDay(day) {
  const weekday = ((day - 1) % 7) + 1;
  return weekday === 3 || weekday === 6;
}

function frontierCandidateIds(ownedIds) {
  const ownedMap = new Set(ownedIds);
  const results = [];
  ownedIds.map(pointById).filter(Boolean).forEach((ownedPoint) => {
    allPoints.filter(isTraversalPoint).forEach((candidate) => {
      if (!ownedMap.has(candidate.id) && pointsAdjacent(ownedPoint, candidate)) {
        results.push(candidate.id);
      }
    });
  });
  return [...new Set(results)];
}

function cityOpportunityScore(point) {
  if (!point || !isCity(point)) return 0;
  let score = pointResourceScore(point);
  if (pointName(point) === "Lawless Road") score -= 120000;
  if (point.level >= 4) score += 80000;
  if (point.level >= 6) score += 140000;
  return score;
}

function distanceToPalaceZone(point) {
  return palaceZonePoints().reduce((best, zonePoint) => Math.min(best, manhattanDistance(point, zonePoint)), Infinity);
}

function pointSide(point, palace) {
  const dx = point.x - palace.x;
  const dy = point.y - palace.y;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "east" : "west";
  return dy >= 0 ? "south" : "north";
}

function strategicCandidateScore(point, state, desiredRouteIds, style) {
  const desiredSet = {};
  desiredRouteIds.forEach((id, index) => {
    desiredSet[id] = index + 1;
  });
  const nextDesiredId = nextDesiredRouteId(desiredRouteIds, state.ownedIds);
  let score = pointResourceScore(point) / 10000;
  const sameNameToday = state.capturedNamesToday[pointName(point)] || 0;
  const palace = pointById("poi:I61");
  const pointSideName = palace ? pointSide(point, palace) : null;
  const preferredSide = state.preferredSideByDay ? state.preferredSideByDay[state.day] : null;

  if (desiredSet[point.id]) score += Math.max(40, 220 - desiredSet[point.id] * 8);
  if (nextDesiredId === point.id) score += 500;
  if (point.territoryKind === "bank") score += 40 + point.level * 18;
  if (point.territoryKind === "city") score += 60 + cityOpportunityScore(point) / 10000;
  if (point.territoryKind === "golden_palace") score += 900;
  score += Math.max(0, 80 - distanceToPalaceZone(point) / 40);
  if (preferredSide && pointSideName === preferredSide) score += 65;
  if (preferredSide && pointSideName && pointSideName !== preferredSide && !desiredSet[point.id]) score -= 45;

  if (style === "direct") {
    if (point.territoryKind === "bank") score += 90;
    if (point.id === nextDesiredId) score += 220;
    if (point.territoryKind === "city") score -= 25;
  } else if (style === "safe") {
    if (point.territoryKind === "city") score += 80;
    if (point.level >= 4) score += 40;
  } else if (style === "cannon-heavy") {
    if (point.territoryKind === "city") score += 55;
    if (point.level >= 6) score += 70;
  }

  if (pointName(point) === "Lawless Road") score -= 80;
  if (sameNameToday) score -= sameNameToday * 140;
  if (state.captureHistory && state.captureHistory[point.id]) {
    score -= state.captureHistory[point.id] * 220;
    if (nextDesiredId !== point.id) score -= 320;
  }
  if (state.releasedHistory && state.releasedHistory[point.id]) {
    score -= state.releasedHistory[point.id] * 380;
  }
  if (state.recentReleasedIds && state.recentReleasedIds[point.id] === state.day) {
    score -= 1200;
  }
  return score;
}

function releaseCandidate(ownedIds, remainingRouteIds, alliance, kind) {
  const protectedIds = {};
  remainingRouteIds.forEach((id) => {
    protectedIds[id] = true;
  });
  const startId = alliance.areaIds[0];
  if (startId) protectedIds[startId] = true;

  return ownedIds
    .map(pointById)
    .filter(Boolean)
    .filter((point) => point.territoryKind === kind && !protectedIds[point.id])
    .sort((a, b) => pointResourceScore(a) - pointResourceScore(b) || a.level - b.level)[0] || null;
}

function buildStrategicSchedule(desiredRouteIds, alliance, style) {
  const state = createAllianceDayState(alliance);
  state.desiredRouteIds = desiredRouteIds.slice();
  const schedule = [];
  const desiredRouteMap = {};
  desiredRouteIds.forEach((id) => {
    desiredRouteMap[id] = true;
  });
  let stagnationDays = 0;
  const maxDays = 14;

  function stepRoleFor(point, action) {
    if (action === "release") return "release";
    if (!point) return "unknown";
    if (desiredRouteMap[point.id]) return "main-trunk";
    if (point.territoryKind === "city") return "war-day-side";
    return "support-side";
  }

  function preferredRolesForSlot(slotIndex) {
    if (isWarDay(state.day)) {
      if (slotIndex === 3) return ["war-day-side", "main-trunk", "support-side"];
      return ["main-trunk", "war-day-side", "support-side"];
    }
    return ["main-trunk", "support-side", "war-day-side"];
  }

  function chooseCandidateForSlot(candidates) {
    const slotIndex = nextBattleSlotIndex(state);
    const preferredRoles = preferredRolesForSlot(slotIndex);
    const roleBuckets = {};
    preferredRoles.forEach((role) => {
      roleBuckets[role] = [];
    });

    candidates.forEach((candidate) => {
      const role = stepRoleFor(candidate, "capture");
      if (!roleBuckets[role]) roleBuckets[role] = [];
      roleBuckets[role].push(candidate);
    });

    for (let index = 0; index < preferredRoles.length; index += 1) {
      const roleCandidates = roleBuckets[preferredRoles[index]] || [];
      if (roleCandidates.length) return roleCandidates[0];
    }
    return candidates[0] || null;
  }

  function addStep(areaId, action, note) {
    const point = pointById(areaId);
    if (!point) return;
    const role = stepRoleFor(point, action);
    schedule.push({
      day: state.day,
      areaId,
      territoryKind: point.territoryKind,
      routeRole: role,
      action,
      note: note || ""
    });
    if (action !== "release" && role !== "main-trunk") {
      state.preferredSideByDay[state.day] = pointSide(point, pointById("poi:I61"));
    }
  }

  function releaseFor(point) {
    refreshAllianceDayState(state);
    if (point.territoryKind === "bank") {
      while (state.counts.strongholds.current >= state.counts.strongholds.max) {
        const bankToRelease =
          state.ownedIds
            .map(pointById)
            .filter(Boolean)
            .filter((ownedPoint) => ownedPoint.territoryKind === "bank" && state.ownedClasses[ownedPoint.id] === "release-candidate")
            .sort((a, b) => pointResourceScore(a) - pointResourceScore(b) || a.level - b.level)[0] ||
          releaseCandidate(state.ownedIds, desiredRouteIds, alliance, "bank");
        if (!bankToRelease) return false;
        addStep(bankToRelease.id, "release", `Release bank slot before capturing ${pointName(point)}`);
        state.ownedIds = state.ownedIds.filter((id) => id !== bankToRelease.id);
        state.releasedHistory[bankToRelease.id] = (state.releasedHistory[bankToRelease.id] || 0) + 1;
        state.recentReleasedIds[bankToRelease.id] = state.day;
        refreshAllianceDayState(state);
      }
      return true;
    }
    if (point.territoryKind === "city") {
      while (state.counts.cities.current >= state.counts.cities.max) {
        const cityToRelease =
          state.ownedIds
            .map(pointById)
            .filter(Boolean)
            .filter((ownedPoint) => ownedPoint.territoryKind === "city" && state.ownedClasses[ownedPoint.id] === "release-candidate")
            .sort((a, b) => pointResourceScore(a) - pointResourceScore(b) || a.level - b.level)[0] ||
          releaseCandidate(state.ownedIds, desiredRouteIds, alliance, "city");
        if (!cityToRelease) return false;
        addStep(cityToRelease.id, "release", `Release city slot before capturing ${pointName(point)}`);
        state.ownedIds = state.ownedIds.filter((id) => id !== cityToRelease.id);
        state.releasedHistory[cityToRelease.id] = (state.releasedHistory[cityToRelease.id] || 0) + 1;
        state.recentReleasedIds[cityToRelease.id] = state.day;
        refreshAllianceDayState(state);
      }
      while (state.counts.strongholds.current > state.counts.strongholds.max) {
        const forcedBankRelease =
          state.ownedIds
            .map(pointById)
            .filter(Boolean)
            .filter((ownedPoint) => ownedPoint.territoryKind === "bank" && state.ownedClasses[ownedPoint.id] === "release-candidate")
            .sort((a, b) => pointResourceScore(a) - pointResourceScore(b) || a.level - b.level)[0] ||
          releaseCandidate(state.ownedIds, desiredRouteIds, alliance, "bank");
        if (!forcedBankRelease) return false;
        addStep(forcedBankRelease.id, "release", "Release bank after city capture to stay within stronghold capacity");
        state.ownedIds = state.ownedIds.filter((id) => id !== forcedBankRelease.id);
        state.releasedHistory[forcedBankRelease.id] = (state.releasedHistory[forcedBankRelease.id] || 0) + 1;
        state.recentReleasedIds[forcedBankRelease.id] = state.day;
        refreshAllianceDayState(state);
      }
      return true;
    }
    return true;
  }

  while (state.day <= maxDays) {
    let capturedToday = 0;
    const actionBudget = isWarDay(state.day) ? 3 : 2;
    state.capturedNamesToday = {};

    while (capturedToday < actionBudget) {
      const frontierIds = frontierCandidateIds(state.ownedIds);
      const candidates = frontierIds
        .map(pointById)
        .filter(Boolean)
        .filter((point) => {
          if (point.territoryKind === "golden_palace") return isWarDay(state.day);
          if (point.territoryKind === "city") return isWarDay(state.day) && state.cityCapturesToday < 3;
          if (point.territoryKind === "bank") return state.bankCapturesToday < 2;
          return false;
        })
        .sort((a, b) => strategicCandidateScore(b, state, desiredRouteIds, style) - strategicCandidateScore(a, state, desiredRouteIds, style));

      if (!candidates.length) break;
      const candidate = chooseCandidateForSlot(candidates);
      if (!candidate) break;
      if (!releaseFor(candidate)) break;

      addStep(candidate.id, "capture");
      state.ownedIds.push(candidate.id);
      state.captureHistory[candidate.id] = (state.captureHistory[candidate.id] || 0) + 1;
      if (candidate.territoryKind === "bank") state.bankCapturesToday += 1;
      if (candidate.territoryKind === "city") state.cityCapturesToday += 1;
      state.capturedNamesToday[pointName(candidate)] = (state.capturedNamesToday[pointName(candidate)] || 0) + 1;
      refreshAllianceDayState(state);
      capturedToday += 1;
    }

    stagnationDays = capturedToday ? 0 : stagnationDays + 1;
    if (stagnationDays >= 2) break;
    nextAllianceDay(state);
  }

  return schedule;
}

function simulationProfiles(rank) {
  if (rank === "elite") {
    return [
      { key: "cannon-heavy", label: "Cannon Control" },
      { key: "safe", label: "Balanced Push" },
      { key: "direct", label: "Direct Breach" }
    ];
  }
  return [{ key: "direct", label: "Low Risk Push" }];
}

function uniquePathIds(ids) {
  return [...new Set(ids)];
}

function planFromStart(startId) {
  const alliance = { id: "benchmark", name: "Benchmark", areaIds: [startId] };
  const frontier = allianceFrontier(alliance);
  const entries = centralBankStrongholds();
  const entryCandidates = entries
    .map((entry) => ({
      entry,
      path: shortestPath(frontier.id, entry.id, allPoints, graphNeighbors)
    }))
    .filter((candidate) => candidate.path.length)
    .sort((a, b) => a.path.length - b.path.length)
    .slice(0, 5);

  const plans = entryCandidates.flatMap((candidate) => {
    return simulationProfiles("elite").map((profile) => {
      const desiredRouteIds = uniquePathIds(candidate.path.concat(["poi:I61"]));
      const schedule = buildStrategicSchedule(desiredRouteIds, alliance, profile.key);
      const captures = schedule.filter((step) => step.action !== "release").map((step) => step.areaId);
      return {
        profile: profile.label,
        styleKey: profile.key,
        entryId: candidate.entry.id,
        graphPath: candidate.path,
        desiredRouteIds,
        schedule,
        captures
      };
    });
  });

  plans.sort((a, b) => a.schedule.length - b.schedule.length || a.captures.length - b.captures.length);
  return { alliance, frontier, entries, entryCandidates, plans };
}

function invalidHops(ids) {
  const bad = [];
  for (let index = 0; index < ids.length - 1; index += 1) {
    const from = pointById(ids[index]);
    const to = pointById(ids[index + 1]);
    if (!pointsAdjacent(from, to)) {
      bad.push({
        from: formatPoint(from),
        to: formatPoint(to)
      });
    }
  }
  return bad;
}

function formatPoint(point) {
  if (!point) return "missing";
  return `${point.id} ${pointName(point)} Lv.${point.level} [${point.territoryKind}]`;
}

function benchmarkStrictRoute(startId) {
  const entries = centralBankStrongholds();
  const strict = entries
    .map((entry) => ({
      entry,
      path: shortestPath(startId, entry.id, allPoints, strictNeighbors)
    }))
    .filter((candidate) => candidate.path.length)
    .sort((a, b) => a.path.length - b.path.length);
  return strict[0];
}

function compareBenchmark() {
  const startId = "poi:A122";
  const benchmark = benchmarkStrictRoute(startId);
  const software = planFromStart(startId);
  const topPlan = software.plans[0];
  const shortestGraphCandidate = software.entryCandidates[0];
  const graphInvalidHops = invalidHops(shortestGraphCandidate ? shortestGraphCandidate.path : []);
  const scheduleInvalidHops = invalidHops(topPlan ? topPlan.captures : []);
  const topPlanMainTrunkCaptures = topPlan
    ? topPlan.schedule
        .filter((step) => step.action !== "release" && step.routeRole === "main-trunk")
        .map((step) => step.areaId)
    : [];
  const topPlanSideCaptures = topPlan
    ? topPlan.schedule
        .filter((step) => step.action !== "release" && step.routeRole !== "main-trunk")
        .map((step) => step.areaId)
    : [];
  const mainTrunkInvalidHops = invalidHops(topPlanMainTrunkCaptures);
  const nearestStrictTarget = benchmark ? benchmark.entry.id : null;
  const graphToStrictTarget = nearestStrictTarget
    ? shortestPath(startId, nearestStrictTarget.id, allPoints, graphNeighbors)
    : [];

  return {
    startId,
    benchmark,
    software,
    topPlan,
    graphInvalidHops,
    scheduleInvalidHops,
    topPlanMainTrunkCaptures,
    topPlanSideCaptures,
    mainTrunkInvalidHops,
    graphToStrictTarget
  };
}

function linesForPointList(ids) {
  return ids.map((id, index) => `${index + 1}. \`${formatPoint(pointById(id))}\``);
}

function writeReport(result) {
  const benchmarkLength = result.benchmark ? result.benchmark.path.length : 0;
  const graphLength = result.software.entryCandidates[0] ? result.software.entryCandidates[0].path.length : 0;
  const topPlanCaptures = result.topPlan ? result.topPlan.captures.length : 0;
  const topPlanMainTrunkCaptures = result.topPlanMainTrunkCaptures.length;
  const topPlanSideCaptures = result.topPlanSideCaptures.length;
  const nearestStrictTarget = result.benchmark ? result.benchmark.entry.id : "n/a";
  const topScheduleDays = result.topPlan
    ? Math.max(0, ...result.topPlan.schedule.map((step) => step.day))
    : 0;

  const verdicts = [];
  if (!result.benchmark) verdicts.push("- Benchmark strict path non trovato.");
  if (graphLength && benchmarkLength && graphLength < benchmarkLength) {
    verdicts.push(`- Il grafo usato dal software trova un ingresso in \`${graphLength}\` nodi, meno del benchmark severo \`${benchmarkLength}\`: forte indizio di adiacenza troppo permissiva nel pathfinding iniziale.`);
  }
  if (result.graphInvalidHops.length) {
    verdicts.push(`- Il path base del software contiene \`${result.graphInvalidHops.length}\` hop non validi secondo \`pointsAdjacent\`.`);
  }
  if (result.scheduleInvalidHops.length) {
    verdicts.push(`- Anche il piano finale mantiene \`${result.scheduleInvalidHops.length}\` hop non coerenti rispetto all'adiacenza severa.`);
  }
  if (!result.mainTrunkInvalidHops.length && result.scheduleInvalidHops.length) {
    verdicts.push("- Il corridoio principale del piano e' coerente; i salti residui arrivano soprattutto dalle deviazioni laterali di war day inserite nella stessa sequenza cronologica.");
  }
  if (topPlanCaptures && benchmarkLength && topPlanCaptures < benchmarkLength) {
    verdicts.push(`- Il piano top cattura solo \`${topPlanCaptures}\` territori prima di dichiarare progresso verso il centro; il benchmark geometrico minimo e' \`${benchmarkLength}\`.`);
  }
  if (!verdicts.length) verdicts.push("- Nessuna deviazione evidente rispetto al benchmark geometrico.");

  const sections = [
    "# Season 5 Benchmark Report",
    "",
    "## Scopo",
    "",
    "Confrontare il protocollo logico, il benchmark scritto e l'output reale del motore attuale.",
    "",
    "## Scenario usato",
    "",
    `- Start: \`${result.startId}\``,
    `- Target benchmark: \`${nearestStrictTarget}\` palace-adjacent lv10 bank`,
    "- Confronto tra:",
    "  - benchmark a adiacenza severa",
    "  - pathfinding base del software",
    "  - piano top del motore attuale",
    "",
    "## Esito sintetico",
    "",
    ...verdicts,
    "",
    "## Metriche",
    "",
    `- Benchmark strict path: \`${benchmarkLength}\` nodi`,
    `- Software graph path: \`${graphLength}\` nodi`,
    `- Software top plan captures: \`${topPlanCaptures}\``,
    `- Software top plan main trunk captures: \`${topPlanMainTrunkCaptures}\``,
    `- Software top plan side captures: \`${topPlanSideCaptures}\``,
    `- Software top plan total actions: \`${result.topPlan ? result.topPlan.schedule.length : 0}\``,
    `- Software top plan total days: \`${topScheduleDays}\``,
    "",
    "## Benchmark strict route",
    "",
    ...(result.benchmark ? linesForPointList(result.benchmark.path) : ["- Nessun benchmark strict route trovato."]),
    "",
    "## Software graph route",
    "",
    ...(result.software.entryCandidates[0]
      ? linesForPointList(result.software.entryCandidates[0].path)
      : ["- Nessuna route software trovata."]),
    "",
    "## Software top plan captures",
    "",
    ...(result.topPlan ? linesForPointList(result.topPlan.captures) : ["- Nessun piano generato."]),
    "",
    "## Software top plan main trunk",
    "",
    ...(result.topPlanMainTrunkCaptures.length
      ? linesForPointList(result.topPlanMainTrunkCaptures)
      : ["- Nessuna cattura main trunk."]),
    "",
    "## Software top plan side captures",
    "",
    ...(result.topPlanSideCaptures.length
      ? linesForPointList(result.topPlanSideCaptures)
      : ["- Nessuna cattura laterale."]),
    "",
    "## Hop non validi nel graph route",
    "",
    ...(result.graphInvalidHops.length
      ? result.graphInvalidHops.map((hop, index) => `${index + 1}. \`${hop.from}\` -> \`${hop.to}\``)
      : ["- Nessun hop invalido nel graph route."]),
    "",
    "## Hop non validi nel top plan",
    "",
    ...(result.scheduleInvalidHops.length
      ? result.scheduleInvalidHops.map((hop, index) => `${index + 1}. \`${hop.from}\` -> \`${hop.to}\``)
      : ["- Nessun hop invalido nel top plan."]),
    "",
    "## Hop non validi nel main trunk",
    "",
    ...(result.mainTrunkInvalidHops.length
      ? result.mainTrunkInvalidHops.map((hop, index) => `${index + 1}. \`${hop.from}\` -> \`${hop.to}\``)
      : ["- Nessun hop invalido nel main trunk."]),
    "",
    "## Lettura contro protocollo",
    "",
    "- Se il graph route e' gia' geometricamente troppo corto, il planner parte da un presupposto falsato prima ancora dello scoring.",
    "- Se il top plan eredita hop non validi o rimane troppo corto, il problema principale non e' il ranking finale ma la costruzione della route desiderata.",
    "- Finche' questo report non converge verso il benchmark, ogni ottimizzazione del punteggio resta secondaria.",
    ""
  ];

  fs.writeFileSync(OUTPUT_PATH, sections.join("\n"));
}

const result = compareBenchmark();
writeReport(result);

console.log(JSON.stringify({
  report: OUTPUT_PATH,
  benchmarkLength: result.benchmark ? result.benchmark.path.length : 0,
  graphLength: result.software.entryCandidates[0] ? result.software.entryCandidates[0].path.length : 0,
  topPlanCaptures: result.topPlan ? result.topPlan.captures.length : 0,
  topPlanMainTrunkCaptures: result.topPlanMainTrunkCaptures.length,
  topPlanSideCaptures: result.topPlanSideCaptures.length,
  invalidGraphHops: result.graphInvalidHops.length,
  invalidPlanHops: result.scheduleInvalidHops.length,
  invalidMainTrunkHops: result.mainTrunkInvalidHops.length
}, null, 2));
