const fs = require("fs");
const path = require("path");

const ROOT = "/home/enrico/last-war-map-planner";
const RAW_PATH = path.join(ROOT, "assets/data/season-5-poi-points.json");
const STRATEGIC_PATH = path.join(ROOT, "assets/data/season-5-strategic-poi.json");
const OUTPUT_PATH = path.join(ROOT, "docs/season5-multialliance-benchmark-report.md");

const SEASON_CONFIG = {
  battle: {
    slotsPerDay: 3,
    slotDurationHours: 1,
    safeTimeHours: 15
  },
  limits: {
    maxCities: 8,
    baseStrongholds: 4,
    maxStrongholds: 12,
    strongholdsPerCity: 1
  }
};

const SERVER_ALLIANCE_BLUEPRINTS = [
  { name: "Main", priorityRank: 1, priorityWeight: 100, style: "safe", seedBanks: 2 },
  { name: "Vanguard A", priorityRank: 2, priorityWeight: 90, style: "safe", seedBanks: 1 },
  { name: "Vanguard B", priorityRank: 2, priorityWeight: 90, style: "safe", seedBanks: 1 },
  { name: "Wing 4", priorityRank: 4, priorityWeight: 78, style: "direct", seedBanks: 1 },
  { name: "Wing 5", priorityRank: 5, priorityWeight: 72, style: "direct", seedBanks: 1 },
  { name: "Wing 6", priorityRank: 6, priorityWeight: 66, style: "direct", seedBanks: 1 },
  { name: "Wing 7", priorityRank: 7, priorityWeight: 60, style: "direct", seedBanks: 0 },
  { name: "Wing 8", priorityRank: 8, priorityWeight: 54, style: "direct", seedBanks: 0 },
  { name: "Wing 9", priorityRank: 9, priorityWeight: 48, style: "direct", seedBanks: 0 },
  { name: "Wing 10", priorityRank: 10, priorityWeight: 42, style: "direct", seedBanks: 0 }
];

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
const traversablePoints = allPoints.filter(isTraversalPoint);
const traversalNeighborsById = new Map(
  traversablePoints.map((point) => [
    point.id,
    traversablePoints.filter((candidate) => candidate.id !== point.id && pointsAdjacent(point, candidate)).map((candidate) => candidate.id)
  ])
);
let currentAlliances = [];

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
  return (traversalNeighborsById.get(point.id) || []).map(pointById).filter(Boolean);
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
  return (traversalNeighborsById.get(point.id) || []).map(pointById).filter(Boolean);
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

function frontierCandidateIds(ownedIds, alliance) {
  const ownedMap = new Set(ownedIds);
  const results = [];
  ownedIds.map(pointById).filter(Boolean).forEach((ownedPoint) => {
    (traversalNeighborsById.get(ownedPoint.id) || []).map(pointById).filter(Boolean).forEach((candidate) => {
      if (
        !ownedMap.has(candidate.id) &&
        territoryOccupancyForAlliance(candidate.id, alliance) !== "blocked"
      ) {
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

function warzoneSectorForPoint(point) {
  const palace = pointById("poi:I61");
  if (!point || !palace) return 1;
  const angle = (Math.atan2(point.y - palace.y, point.x - palace.x) + (Math.PI * 2)) % (Math.PI * 2);
  return Math.floor(((angle + (Math.PI / 8)) % (Math.PI * 2)) / (Math.PI / 4)) + 1;
}

function isWarzoneStartPoint(point) {
  return !!point && isCity(point) && point.level <= 2;
}

function warzoneStartPoints(sectorId) {
  return allPoints
    .filter(isWarzoneStartPoint)
    .filter((point) => warzoneSectorForPoint(point) === sectorId)
    .sort((a, b) => a.y - b.y || a.x - b.x);
}

function evenlySpacedPoints(pointsList, count) {
  if (pointsList.length <= count) return pointsList.slice();
  const results = [];
  for (let index = 0; index < count; index += 1) {
    const pointIndex = Math.round(index * (pointsList.length - 1) / Math.max(1, count - 1));
    results.push(pointsList[pointIndex]);
  }
  return [...new Set(results.map((point) => point.id))].map(pointById).filter(Boolean);
}

function seedBankCandidates(startPoint, usedIds) {
  return allPoints
    .filter((point) =>
      point.territoryKind === "bank" &&
      warzoneSectorForPoint(point) === warzoneSectorForPoint(startPoint) &&
      pointsAdjacent(startPoint, point) &&
      usedIds.indexOf(point.id) === -1
    )
    .sort((a, b) => a.level - b.level || manhattanDistance(a, startPoint) - manhattanDistance(b, startPoint));
}

function sameWarzoneOrNeighbor(point, sectorId) {
  const pointSector = warzoneSectorForPoint(point);
  if (pointSector === sectorId) return true;
  const prev = sectorId === 1 ? 8 : sectorId - 1;
  const next = sectorId === 8 ? 1 : sectorId + 1;
  return pointSector === prev || pointSector === next;
}

function localSupportTargets(startPoints, sectorId, maxDepth = 4) {
  const visited = new Set();
  const queue = startPoints.map((point) => ({ id: point.id, depth: 0 }));
  startPoints.forEach((point) => visited.add(point.id));
  const results = new Set();

  while (queue.length) {
    const current = queue.shift();
    const point = pointById(current.id);
    if (!point) continue;
    if (sameWarzoneOrNeighbor(point, sectorId)) results.add(point.id);
    if (current.depth >= maxDepth) continue;
    (traversalNeighborsById.get(current.id) || []).forEach((neighborId) => {
      if (visited.has(neighborId)) return;
      visited.add(neighborId);
      queue.push({ id: neighborId, depth: current.depth + 1 });
    });
  }

  return [...results].map(pointById).filter(Boolean);
}

function createWarzonePreset(sectorId) {
  const sectorStarts = warzoneStartPoints(sectorId);
  const fallbackStarts = allPoints.filter(isWarzoneStartPoint).sort((a, b) => a.y - b.y || a.x - b.x);
  const startPoints = evenlySpacedPoints(
    sectorStarts.length >= SERVER_ALLIANCE_BLUEPRINTS.length ? sectorStarts : fallbackStarts,
    SERVER_ALLIANCE_BLUEPRINTS.length
  );
  const usedIds = [];
  return SERVER_ALLIANCE_BLUEPRINTS.map((blueprint, index) => {
    const startPoint = startPoints[index];
    if (!startPoint) throw new Error(`Missing start point for alliance preset index ${index} in sector ${sectorId}`);
    const areaIds = [startPoint.id];
    usedIds.push(startPoint.id);
    seedBankCandidates(startPoint, usedIds).slice(0, blueprint.seedBanks).forEach((bankPoint) => {
      areaIds.push(bankPoint.id);
      usedIds.push(bankPoint.id);
    });
    return {
      id: `ally-${sectorId}-${index + 1}`,
      name: `WZ${sectorId} ${blueprint.name}`,
      areaIds,
      priorityRank: blueprint.priorityRank,
      priorityWeight: blueprint.priorityWeight,
      style: blueprint.style,
      serverSector: sectorId,
      safeTimeHours: SEASON_CONFIG.battle.safeTimeHours,
      safeTimeSlot: Math.min(SEASON_CONFIG.battle.slotsPerDay, (index % SEASON_CONFIG.battle.slotsPerDay) + 1)
    };
  }).sort((a, b) =>
    (b.priorityWeight || 0) - (a.priorityWeight || 0) ||
    (a.priorityRank || 0) - (b.priorityRank || 0) ||
    a.name.localeCompare(b.name)
  );
}

function assignedAlliance(pointId) {
  return currentAlliances.find((alliance) => alliance.areaIds.includes(pointId)) || null;
}

function canAllianceAbsorbTerritory(activeAlliance, ownerAlliance) {
  if (!activeAlliance || !ownerAlliance) return false;
  return activeAlliance.id === ownerAlliance.id;
}

function territoryOccupancyForAlliance(pointId, activeAlliance) {
  const owner = assignedAlliance(pointId);
  if (!owner || !activeAlliance || owner.id === activeAlliance.id) return "free";
  if (canAllianceAbsorbTerritory(activeAlliance, owner)) return "transferable";
  return "blocked";
}

function captureBlockedByRestTime(pointId, activeAlliance, slotIndex) {
  const owner = assignedAlliance(pointId);
  const point = pointById(pointId);
  if (!owner || !activeAlliance || !point) return false;
  if (owner.id === activeAlliance.id) return false;
  if (point.territoryKind !== "city" && point.territoryKind !== "bank") return false;
  return owner.safeTimeSlot === slotIndex;
}

function strategicCandidateScore(point, state, desiredRouteIds, style) {
  const desiredSet = {};
  desiredRouteIds.forEach((id, index) => {
    desiredSet[id] = index + 1;
  });
  const nextDesiredId = nextDesiredRouteId(desiredRouteIds, state.ownedIds);
  const desiredIndex = desiredSet[point.id] || 0;
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
  } else if (style === "support-fill") {
    if (point.territoryKind === "city") score += 120;
    if (point.territoryKind === "bank") score += 35;
    score += pointResourceScore(point) / 8000;
    score -= distanceToPalaceZone(point) / 90;
  }

  if (state.alliance && (state.alliance.priorityRank || 99) <= 3) {
    if (desiredIndex && desiredIndex <= 8) score += 260;
    if (desiredIndex && desiredIndex <= 16) score += 120;
    if (point.id === nextDesiredId) score += 480;
    if (!desiredSet[point.id] && point.territoryKind === "city") score -= 260;
    if (!desiredSet[point.id] && point.territoryKind === "bank") score -= 90;
    if (!desiredSet[point.id] && point.territoryKind === "bank" && point.level <= 4) score -= 80;
    if (!desiredSet[point.id] && distanceToPalaceZone(point) > 1200) score -= 120;
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

function buildStrategicSchedule(desiredRouteIds, alliance, style, options = {}) {
  const state = createAllianceDayState(alliance);
  state.day = options.startDay || 1;
  state.desiredRouteIds = desiredRouteIds.slice();
  const schedule = [];
  const desiredRouteMap = {};
  desiredRouteIds.forEach((id) => {
    desiredRouteMap[id] = true;
  });
  let stagnationDays = 0;
  const maxDays = options.maxDays || 14;

  function stepRoleFor(point, action) {
    if (action === "release") return "release";
    if (!point) return "unknown";
    if (desiredRouteMap[point.id]) return "main-trunk";
    if (point.territoryKind === "city") return "war-day-side";
    return "support-side";
  }

  function preferredRolesForSlot(slotIndex) {
    if ((alliance.priorityRank || 99) <= 3) {
      if (isWarDay(state.day) && slotIndex === 3) return ["main-trunk", "war-day-side", "support-side"];
      return ["main-trunk", "support-side", "war-day-side"];
    }
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
    const slotIndex = action === "capture" ? nextBattleSlotIndex(state) : null;
    schedule.push({
      day: state.day,
      areaId,
      territoryKind: point.territoryKind,
      routeRole: role,
      action,
      slotIndex,
      slotLabel: slotIndex ? `S${slotIndex}` : "",
      note: note || ""
    });
    if (action !== "release" && role !== "main-trunk") {
      state.preferredSideByDay[state.day] = pointSide(point, pointById("poi:I61"));
    }
    if (action === "capture") {
      state.actionsToday += 1;
      state.slotsUsedToday[slotIndex] = true;
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
    const maxSideCapturesToday = (alliance.priorityRank || 99) <= 3 ? (isWarDay(state.day) ? 1 : 0) : actionBudget;
    let sideCapturesToday = 0;
    state.capturedNamesToday = {};

    while (capturedToday < actionBudget) {
      const slotIndex = nextBattleSlotIndex(state);
      const frontierIds = frontierCandidateIds(state.ownedIds, alliance);
      const candidates = frontierIds
        .map(pointById)
        .filter(Boolean)
        .filter((point) => {
          const role = stepRoleFor(point, "capture");
          if ((alliance.priorityRank || 99) <= 3 && role !== "main-trunk" && sideCapturesToday >= maxSideCapturesToday) {
            return false;
          }
          if ((alliance.priorityRank || 99) <= 3 && slotIndex <= 2 && role !== "main-trunk") {
            return false;
          }
          if (captureBlockedByRestTime(point.id, alliance, slotIndex)) return false;
          if (point.territoryKind === "golden_palace") return isWarDay(state.day);
          if (point.territoryKind === "city") return isWarDay(state.day) && state.cityCapturesToday < 3;
          if (point.territoryKind === "bank") return state.bankCapturesToday < 2;
          return false;
        })
        .sort((a, b) => strategicCandidateScore(b, state, desiredRouteIds, style) - strategicCandidateScore(a, state, desiredRouteIds, style));

      const strictTrunkCandidates = (alliance.priorityRank || 99) <= 3
        ? candidates.filter((point) => stepRoleFor(point, "capture") === "main-trunk")
        : candidates;

      if (!candidates.length) break;
      const candidate = chooseCandidateForSlot(strictTrunkCandidates.length ? strictTrunkCandidates : candidates);
      if (!candidate) break;
      if (!releaseFor(candidate)) break;

      const occupancy = territoryOccupancyForAlliance(candidate.id, alliance);
      const captureNote = occupancy === "transferable"
        ? `Take over ${pointName(candidate)} from lower-priority alliance in the same warzone.`
        : "";
      addStep(candidate.id, "capture", captureNote);
      state.ownedIds.push(candidate.id);
      state.captureHistory[candidate.id] = (state.captureHistory[candidate.id] || 0) + 1;
      if (stepRoleFor(candidate, "capture") !== "main-trunk") sideCapturesToday += 1;
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

function simulationProfiles(alliance) {
  if ((alliance.priorityRank || 99) === 1) {
    return [
      { key: "safe", label: "Balanced Push" },
      { key: "cannon-heavy", label: "Cannon Control" },
      { key: "direct", label: "Direct Breach" }
    ];
  }
  if ((alliance.priorityRank || 99) <= 3) {
    return [
      { key: "safe", label: "Stable Push" },
      { key: "direct", label: "Fast Push" }
    ];
  }
  return [{ key: "support-fill", label: "Support Fill" }];
}

function uniquePathIds(ids) {
  return [...new Set(ids)];
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

function desiredRouteForAlliance(alliance, preferredRoute = null) {
  const entries = centralBankStrongholds();
  const ownedStarts = alliance.areaIds
    .map(pointById)
    .filter(Boolean)
    .filter(isTraversalPoint);
  const fallback = allianceFrontier(alliance);
  const starts = ownedStarts.length ? ownedStarts : (fallback ? [fallback] : []);
  const ownedSet = new Set(alliance.areaIds);
  const routes = [];

  starts.forEach((startPoint) => {
    entries.forEach((entry) => {
      const strictPath = shortestPath(startPoint.id, entry.id, allPoints, strictNeighbors);
      if (!strictPath.length) return;
      const missingCount = strictPath.filter((id) => !ownedSet.has(id)).length;
      routes.push({
        startPoint,
        entry,
        path: strictPath,
        missingCount
      });
    });
  });

  routes.sort((a, b) =>
    (preferredRoute && a.entry.id === preferredRoute.entryId ? -1 : 0) -
      (preferredRoute && b.entry.id === preferredRoute.entryId ? -1 : 0) ||
    a.missingCount - b.missingCount ||
    a.path.length - b.path.length ||
    manhattanDistance(a.startPoint, a.entry) - manhattanDistance(b.startPoint, b.entry)
  );

  if (!routes.length) return null;
  const best = routes[0];
  return {
    startId: best.startPoint.id,
    entryId: best.entry.id,
    path: best.path,
    desiredRouteIds: uniquePathIds(best.path.concat(["poi:I61"]))
  };
}

function linesForPointList(ids) {
  return ids.map((id, index) => `${index + 1}. \`${formatPoint(pointById(id))}\``);
}

function allianceYield(alliance) {
  return alliance.areaIds
    .map(pointById)
    .filter(Boolean)
    .reduce(
      (totals, point) => {
        totals.influence += point.resources?.influence || 0;
        totals.crystalGold += point.resources?.crystalGold || 0;
        return totals;
      },
      { influence: 0, crystalGold: 0 }
    );
}

function serverOccupancy(result) {
  const finalAreaIds = new Set(result.finalAlliances.flatMap((alliance) => alliance.areaIds));
  const totals = result.finalAlliances.reduce(
    (sum, alliance) => {
      const yields = allianceYield(alliance);
      sum.influence += yields.influence;
      sum.crystalGold += yields.crystalGold;
      return sum;
    },
    { influence: 0, crystalGold: 0 }
  );
  return {
    occupiedAreas: finalAreaIds.size,
    influence: totals.influence,
    crystalGold: totals.crystalGold
  };
}

function scheduleScore(schedule, alliance) {
  return schedule.reduce((score, step) => {
    const point = pointById(step.areaId);
    if (!point) return score;
    if (step.action === "release") return score - 120;
    if (step.routeRole === "main-trunk") score += 220;
    if (step.routeRole === "war-day-side") score += 110;
    if (step.routeRole === "support-side") score += 70;
    if (step.territoryKind === "city") score += 180 + point.level * 20;
    if (step.territoryKind === "bank") score += 60 + point.level * 16;
    if (step.note && step.note.includes("Backfill after release")) score += 140;
    if ((alliance.priorityRank || 99) > 3 && step.routeRole !== "main-trunk") score += 120;
    if ((alliance.priorityRank || 99) <= 3 && step.routeRole === "main-trunk") score += 180;
    if ((alliance.priorityRank || 99) <= 3 && step.routeRole !== "main-trunk") score -= 220;
    score += Math.max(0, 80 - distanceToPalaceZone(point) / 40);
    score += (alliance.priorityWeight || 0) / 20;
    return score;
  }, 0);
}

function supportDesiredRouteForAlliance(alliance, releasedIds = []) {
  const ownedStarts = alliance.areaIds.map(pointById).filter(Boolean).filter(isTraversalPoint);
  const fallback = allianceFrontier(alliance);
  const starts = ownedStarts.length ? ownedStarts : (fallback ? [fallback] : []);
  const releasedSet = new Set(releasedIds);
  const localCandidates = localSupportTargets(starts, alliance.serverSector || 1, 4).filter((point) => point.id !== "poi:I61");
  const releasedCandidates = releasedIds.map(pointById).filter(Boolean);
  const candidates = [...new Map(localCandidates.concat(releasedCandidates).map((point) => [point.id, point])).values()];

  const routes = [];
  starts.forEach((startPoint) => {
    candidates.forEach((target) => {
      const path = shortestPath(startPoint.id, target.id, allPoints, strictNeighbors);
      if (!path.length) return;
      const occupancy = territoryOccupancyForAlliance(target.id, alliance);
      if (occupancy === "blocked") return;
      const routeCost = path.filter((id) => !alliance.areaIds.includes(id)).length;
      if (!releasedSet.has(target.id) && routeCost > 6) return;
      if (!releasedSet.has(target.id) && target.territoryKind === "bank" && target.level >= 5) return;
      const localScore =
        (releasedSet.has(target.id) ? 800 : 0) +
        (target.territoryKind === "city" ? 300 + cityOpportunityScore(target) / 10000 : 0) +
        (target.territoryKind === "bank" ? 120 + target.level * 18 : 0) +
        pointResourceScore(target) / 10000 -
        routeCost * 55 -
        distanceToPalaceZone(target) / 120;
      routes.push({
        startPoint,
        target,
        path,
        score: localScore
      });
    });
  });

  routes.sort((a, b) => b.score - a.score || a.path.length - b.path.length);
  if (!routes.length) return desiredRouteForAlliance(alliance, null);
  const best = routes[0];
  return {
    startId: best.startPoint.id,
    entryId: best.target.id,
    path: best.path,
    desiredRouteIds: uniquePathIds(best.path),
    targetKind: best.target.territoryKind
  };
}

function chooseDayPlan(alliance, day, preferredRoute = null, releasedIds = []) {
  const route = (alliance.priorityRank || 99) > 3
    ? supportDesiredRouteForAlliance(alliance, releasedIds)
    : desiredRouteForAlliance(alliance, preferredRoute);
  if (!route) {
    return {
      route: null,
      profile: null,
      schedule: [],
      score: 0
    };
  }

  const candidates = simulationProfiles(alliance).map((profile) => {
    const schedule = buildStrategicSchedule(route.desiredRouteIds, alliance, profile.key, {
      startDay: day,
      maxDays: day
    });
    return {
      route,
      profile,
      schedule,
      score: scheduleScore(schedule, alliance)
    };
  });

  candidates.sort((a, b) =>
    ((alliance.priorityRank || 99) <= 3
      ? b.schedule.filter((step) => step.routeRole === "main-trunk" && step.action === "capture").length -
        a.schedule.filter((step) => step.routeRole === "main-trunk" && step.action === "capture").length
      : 0) ||
    b.score - a.score ||
    b.schedule.filter((step) => step.routeRole === "main-trunk" && step.action === "capture").length -
      a.schedule.filter((step) => step.routeRole === "main-trunk" && step.action === "capture").length ||
    a.schedule.filter((step) => step.routeRole !== "main-trunk" && step.action === "capture").length -
      b.schedule.filter((step) => step.routeRole !== "main-trunk" && step.action === "capture").length ||
    a.schedule.length - b.schedule.length
  );

  return candidates[0];
}

function applySchedule(alliance, schedule, dayReleaseLog) {
  const applied = [];
  schedule.forEach((step) => {
    const activeAlliance = currentAlliances.find((candidate) => candidate.id === alliance.id);
    if (!activeAlliance) return;
    if (step.action === "release") {
      if (!activeAlliance.areaIds.includes(step.areaId)) return;
      activeAlliance.areaIds = activeAlliance.areaIds.filter((id) => id !== step.areaId);
      dayReleaseLog[step.areaId] = activeAlliance.name;
      applied.push(Object.assign({}, step, { resolvedNote: step.note || "" }));
      return;
    }

    const owner = assignedAlliance(step.areaId);
    if (owner && owner.id !== activeAlliance.id) {
      if (!canAllianceAbsorbTerritory(activeAlliance, owner)) return;
      owner.areaIds = owner.areaIds.filter((id) => id !== step.areaId);
    }
    if (!activeAlliance.areaIds.includes(step.areaId)) {
      activeAlliance.areaIds.push(step.areaId);
    }
    const releasedBy = !owner ? dayReleaseLog[step.areaId] : "";
    applied.push(
      Object.assign({}, step, {
        resolvedOwner: owner && owner.id !== activeAlliance.id ? owner.name : "",
        resolvedOwnerAlliance: owner && owner.id !== activeAlliance.id
          ? {
              id: owner.id,
              name: owner.name,
              safeTimeSlot: owner.safeTimeSlot
            }
          : null,
        resolvedNote:
          owner && owner.id !== activeAlliance.id
            ? `Take over from ${owner.name}`
            : releasedBy && releasedBy !== activeAlliance.name
              ? `Cooperative handoff after release from ${releasedBy}`
            : step.note || ""
      })
    );
  });
  return applied;
}

function protocolViolationsForDay(dayRecord) {
  const violations = [];
  dayRecord.alliances.forEach((entry) => {
    const captures = entry.actions.filter((action) => action.action === "capture");
    const banks = captures.filter((action) => action.territoryKind === "bank").length;
    const cities = captures.filter((action) => action.territoryKind === "city").length;
    if (captures.length > SEASON_CONFIG.battle.slotsPerDay) {
      violations.push(`${entry.name}: ${captures.length} captures in ${dayRecord.label}`);
    }
    if (banks > 2) {
      violations.push(`${entry.name}: ${banks} bank captures in ${dayRecord.label}`);
    }
    if (!dayRecord.isWarDay && cities > 0) {
      violations.push(`${entry.name}: ${cities} city captures outside war day`);
    }
    captures.forEach((action) => {
      const ownerAtCapture = action.resolvedOwnerAlliance || null;
      if (ownerAtCapture && action.slotIndex && ownerAtCapture.safeTimeSlot === action.slotIndex) {
        violations.push(`${entry.name}: attacked ${ownerAtCapture.name} during its rest slot ${action.slotLabel}`);
      }
    });
  });
  return violations;
}

function simulateMultiAllianceDays(sectorId = 6, totalDays = 10) {
  currentAlliances = createWarzonePreset(sectorId);
  const initialAlliances = JSON.parse(JSON.stringify(currentAlliances));
  const history = [];
  const routeMemoryByAllianceId = {};

  for (let day = 1; day <= totalDays; day += 1) {
    const dayReleaseLog = {};
    const releasedIds = [];
    const dayRecord = {
      day,
      label: `Day ${day}`,
      isWarDay: isWarDay(day),
      alliances: []
    };

    const actingOrder = currentAlliances
      .slice()
      .sort((a, b) =>
        (b.priorityWeight || 0) - (a.priorityWeight || 0) ||
        (a.priorityRank || 0) - (b.priorityRank || 0) ||
        a.name.localeCompare(b.name)
      );

    actingOrder.forEach((alliance) => {
      const chosenPlan = chooseDayPlan(alliance, day, routeMemoryByAllianceId[alliance.id] || null, releasedIds);
      const actions = applySchedule(alliance, chosenPlan.schedule || [], dayReleaseLog);
      actions
        .filter((step) => step.action === "release")
        .forEach((step) => {
          if (!releasedIds.includes(step.areaId)) releasedIds.push(step.areaId);
        });
      if (chosenPlan.route) {
        routeMemoryByAllianceId[alliance.id] = {
          startId: chosenPlan.route.startId,
          entryId: chosenPlan.route.entryId
        };
      }
      const counts = computeAllianceCounts(alliance);
      const yields = allianceYield(alliance);
      const mainTrunkCaptures = actions.filter((step) => step.action === "capture" && step.routeRole === "main-trunk").length;
      const sideCaptures = actions.filter((step) => step.action === "capture" && step.routeRole !== "main-trunk").length;
      const releases = actions.filter((step) => step.action === "release").length;
      const handoffs = actions.filter((step) => step.resolvedNote && step.resolvedNote.includes("Cooperative handoff after release")).length;

      dayRecord.alliances.push({
        id: alliance.id,
        name: alliance.name,
        priorityRank: alliance.priorityRank,
        priorityWeight: alliance.priorityWeight,
        style: chosenPlan.profile ? chosenPlan.profile.label : "",
        routeStartId: chosenPlan.route ? chosenPlan.route.startId : "",
        routeEntryId: chosenPlan.route ? chosenPlan.route.entryId : "",
        desiredRouteIds: chosenPlan.route ? chosenPlan.route.desiredRouteIds.slice() : [],
        actions,
        counts,
        yields,
        mainTrunkCaptures,
        sideCaptures,
        releases,
        handoffs,
        ownedIds: alliance.areaIds.slice()
      });
    });

    dayRecord.violations = protocolViolationsForDay(dayRecord);
    history.push(dayRecord);
  }

  return {
    sectorId,
    totalDays,
    initialAlliances,
    finalAlliances: JSON.parse(JSON.stringify(currentAlliances)),
    days: history
  };
}

function mainAllianceSummary(result) {
  const main = result.finalAlliances.find((alliance) => alliance.priorityRank === 1) || result.finalAlliances[0];
  const initialMain = result.initialAlliances.find((alliance) => alliance.id === main.id) || main;
  const benchmark = benchmarkStrictRoute(initialMain.areaIds[0]);
  const dailyEntries = result.days.map((day) => day.alliances.find((entry) => entry.id === main.id)).filter(Boolean);
  const mainTrunkCaptures = dailyEntries.flatMap((entry) =>
    entry.actions.filter((step) => step.action === "capture" && step.routeRole === "main-trunk").map((step) => step.areaId)
  );
  const sideCaptures = dailyEntries.flatMap((entry) =>
    entry.actions.filter((step) => step.action === "capture" && step.routeRole !== "main-trunk").map((step) => step.areaId)
  );
  const allCaptures = dailyEntries.flatMap((entry) =>
    entry.actions.filter((step) => step.action === "capture").map((step) => step.areaId)
  );
  return {
    main,
    initialMain,
    benchmark,
    dailyEntries,
    mainTrunkCaptures,
    sideCaptures,
    allCaptures,
    invalidMainTrunkHops: invalidHops(mainTrunkCaptures),
    invalidAllCaptureHops: invalidHops(allCaptures)
  };
}

function writeReport(result) {
  const summary = mainAllianceSummary(result);
  const serverTotals = serverOccupancy(result);
  const allViolations = result.days.flatMap((day) => day.violations.map((entry) => `Day ${day.day}: ${entry}`));
  const totalHandoffs = result.days.reduce(
    (sum, day) => sum + day.alliances.reduce((daySum, entry) => daySum + entry.handoffs, 0),
    0
  );
  const totalReleases = result.days.reduce(
    (sum, day) => sum + day.alliances.reduce((daySum, entry) => daySum + entry.releases, 0),
    0
  );

  const sections = [
    "# Season 5 Multi-alliance Benchmark Report",
    "",
    "## Scopo",
    "",
    "Simulare 10 alleanze dello stesso warzone giorno per giorno, con stato condiviso, per confrontare il motore con il protocollo logico e con un benchmark geometrico severo verso la capitale.",
    "",
    "## Stato fonti",
    "",
    "Allineato a fonti ufficiali:",
    "",
    "- `3 battle slots/day`",
    "- city solo `Wednesday / Saturday`",
    "- `rest time` difensivo su `Cities/Banks`",
    "- `Cities + Banks`",
    "- `8 warzones`",
    "",
    "Non ancora pienamente allineato a fonti ufficiali:",
    "",
    "- il benchmark modella il blocco del `rest time` su `Cities/Banks`, ma oggi l'effetto e' limitato perche' il modello evita quasi tutto il conflitto diretto intra-server",
    "- `2 bank captures/day` e` trattato come inferenza pubblica, non come regola ufficiale confermata",
    "- `10 alleanze per warzone` e `big release -> small cooperative handoff` sono ipotesi di benchmark, non regole ufficiali",
    "",
    "## Base fonti",
    "",
    "- `Cities + Banks`",
    "- `8 cities / 4 banks` iniziali con crescita del cap stronghold tramite city",
    "- `3 fixed battle slots/day`",
    "- `2 bank captures/day`",
    "- city solo nei war day",
    "- adiacenza severa senza diagonali",
    "- accesso Palace tramite `lv10 Bank` o `lv10 City` adiacente",
    "- 8 warzone sul continente Season 5",
    "",
    "Riferimenti: `season5-conquest-protocol.md`, guida ufficiale Zendesk Season 5 Highlights, guide Season 5 su Cities/Banks/Golden Palace gia' raccolte nel protocollo.",
    "",
    "## Scenario benchmark",
    "",
    `- Warzone simulato: \`WZ${result.sectorId}\``,
    `- Alleanze simulate: \`${result.initialAlliances.length}\``,
    `- Giorni simulati: \`${result.totalDays}\``,
    `- Ordine di priorita': \`${result.initialAlliances.map((alliance) => `${alliance.name} (P${alliance.priorityRank})`).join(" > ")}\``,
    `- Main alliance start: \`${formatPoint(pointById(summary.initialMain.areaIds[0]))}\``,
    `- Main strict benchmark target: \`${summary.benchmark ? formatPoint(summary.benchmark.entry) : "missing"}\``,
    "",
    "## Esito sintetico",
    "",
    `- Violazioni protocollo rilevate: \`${allViolations.length}\``,
    `- Handoff cooperativi su terre rilasciate dalle big: \`${totalHandoffs}\``,
    `- Release totali nel benchmark: \`${totalReleases}\``,
    `- Terre finali occupate dal server: \`${serverTotals.occupiedAreas}\``,
    `- Influence finale del server: \`${serverTotals.influence}\``,
    `- CrystalGold/h finale del server: \`${serverTotals.crystalGold}\``,
    `- Main benchmark strict path: \`${summary.benchmark ? summary.benchmark.path.length : 0}\` nodi`,
    `- Main trunk catturato dal software: \`${summary.mainTrunkCaptures.length}\``,
    `- Main side captures del software: \`${summary.sideCaptures.length}\``,
    `- Main invalid trunk hops: \`${summary.invalidMainTrunkHops.length}\``,
    `- Main invalid all-capture hops: \`${summary.invalidAllCaptureHops.length}\``,
    "",
    "## Lettura contro protocollo",
    "",
    allViolations.length
      ? "- Il motore viola ancora almeno un vincolo del protocollo nel benchmark multialleanza."
      : "- Nel benchmark multialleanza il motore resta dentro i vincoli base del protocollo giorno per giorno.",
    summary.invalidMainTrunkHops.length
      ? "- Il main trunk contiene ancora hop non spiegabili: la route di progresso va corretta."
      : "- Il main trunk della Main alliance resta coerente con l'adiacenza severa.",
    summary.invalidAllCaptureHops.length
      ? "- I salti residui stanno nelle side captures cronologiche: il motore e' leggibile sul trunk ma va ancora rifinita la composizione laterale."
      : "- Anche la sequenza completa delle catture della Main alliance e' coerente nel benchmark.",
    totalHandoffs
      ? "- Il benchmark mostra il comportamento atteso del server: le big avanzano e rilasciano, mentre le minori prendono in carico dietro con handoff cooperativi."
      : "- Nel range simulato non si sono ancora prodotti handoff cooperativi significativi su terre rilasciate dalle big.",
    "",
    "## Main strict benchmark route",
    "",
    ...(summary.benchmark ? linesForPointList(summary.benchmark.path) : ["- Nessun benchmark strict route trovato."]),
    "",
    "## Main software trunk captures",
    "",
    ...(summary.mainTrunkCaptures.length ? linesForPointList(summary.mainTrunkCaptures) : ["- Nessuna cattura trunk registrata."]),
    "",
    "## Day-by-day",
    ""
  ];

  result.days.forEach((day) => {
    sections.push(`### Day ${day.day} · ${day.isWarDay ? "War day" : "Build day"}`);
    sections.push("");
    day.alliances.forEach((entry) => {
      sections.push(
        `- \`${entry.name}\`: ${entry.actions.filter((action) => action.action === "capture").length} captures, ${entry.releases} releases, ${entry.handoffs} handoffs, Cities ${entry.counts.cities.current}/${entry.counts.cities.max}, Banks ${entry.counts.strongholds.current}/${entry.counts.strongholds.max}, Influence ${entry.yields.influence}, CrystalGold/h ${entry.yields.crystalGold}`
      );
      if (entry.actions.length) {
        entry.actions.forEach((action) => {
          sections.push(
            `  - ${action.action === "release" ? "Release" : `${action.slotLabel} Capture`} \`${formatPoint(pointById(action.areaId))}\` [${action.routeRole}]${action.resolvedNote ? ` - ${action.resolvedNote}` : ""}`
          );
        });
      } else {
        sections.push("  - No actions");
      }
    });
    sections.push("");
    sections.push("Violations:");
    if (day.violations.length) {
      day.violations.forEach((violation) => sections.push(`- ${violation}`));
    } else {
      sections.push("- None");
    }
    sections.push("");
  });

  sections.push("## Hop non validi nel main trunk");
  sections.push("");
  if (summary.invalidMainTrunkHops.length) {
    summary.invalidMainTrunkHops.forEach((hop, index) => {
      sections.push(`${index + 1}. \`${hop.from}\` -> \`${hop.to}\``);
    });
  } else {
    sections.push("- Nessun hop invalido nel main trunk.");
  }
  sections.push("");
  sections.push("## Hop non validi in tutte le catture Main");
  sections.push("");
  if (summary.invalidAllCaptureHops.length) {
    summary.invalidAllCaptureHops.forEach((hop, index) => {
      sections.push(`${index + 1}. \`${hop.from}\` -> \`${hop.to}\``);
    });
  } else {
    sections.push("- Nessun hop invalido nella sequenza completa delle catture Main.");
  }
  sections.push("");

  fs.writeFileSync(OUTPUT_PATH, sections.join("\n"));
}

const result = simulateMultiAllianceDays(6, 10);
writeReport(result);

const summary = mainAllianceSummary(result);
const allViolations = result.days.flatMap((day) => day.violations);
console.log(
  JSON.stringify(
    {
      report: OUTPUT_PATH,
      warzone: result.sectorId,
      alliances: result.initialAlliances.length,
      days: result.totalDays,
      protocolViolations: allViolations.length,
      mainBenchmarkLength: summary.benchmark ? summary.benchmark.path.length : 0,
      mainTrunkCaptures: summary.mainTrunkCaptures.length,
      mainSideCaptures: summary.sideCaptures.length,
      invalidMainTrunkHops: summary.invalidMainTrunkHops.length,
      invalidMainAllCaptureHops: summary.invalidAllCaptureHops.length
    },
    null,
    2
  )
);
