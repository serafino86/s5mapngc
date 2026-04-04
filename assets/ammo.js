(function () {
  var page = document.body.dataset.page;
  if (page !== "ammo-bonanza") return;

  var DATA_URL = "../../assets/data/ammo-bonanza.json";
  var modeInputs = document.querySelectorAll('input[name="mode"]');
  var valueInput = document.getElementById("value-input");
  var valueLabel = document.getElementById("value-label");
  var calculateButton = document.getElementById("calculate-button");
  var statMain = document.getElementById("stat-main");
  var statRange = document.getElementById("stat-range");
  var statNote = document.getElementById("stat-note");
  var histogram = document.getElementById("histogram");
  var config = null;

  function currentMode() {
    return Array.from(modeInputs).find(function (input) {
      return input.checked;
    }).value;
  }

  function runs() {
    return config ? config.simulationRuns : 5000;
  }

  function setModeUi() {
    if (currentMode() === "target") {
      valueLabel.textContent = "Target level";
      valueInput.value = "99";
      valueInput.max = String(config ? config.maxLevelForCurrentAmmo : 100);
    } else {
      valueLabel.textContent = "Current ammo";
      valueInput.value = "500";
      valueInput.max = "100000";
    }
  }

  function requiredAttempts(level) {
    return config.targetAttemptsByRemainder[String(level % 5)];
  }

  function attemptWeight(attempt) {
    for (var i = 0; i < config.earlyAttemptWeights.length; i += 1) {
      var rule = config.earlyAttemptWeights[i];
      if (rule.maxAttempt === null || attempt <= rule.maxAttempt) {
        return rule.weight;
      }
    }
    return config.earlyAttemptWeights[config.earlyAttemptWeights.length - 1].weight;
  }

  function simulateLevel(level) {
    var target = requiredAttempts(level);
    var attempts = 0;
    var finished = false;
    var depleted = new Set();

    while (!finished) {
      attempts += 1;
      var weight = attemptWeight(attempts);
      var totalWeight = weight + (config.poolSize - depleted.size) * config.depletionBonusPerRemainingPrize;
      var successChance = weight / totalWeight;

      if (attempts >= target) {
        finished = true;
      } else if (Math.random() < successChance) {
        finished = true;
      } else {
        var index = Math.floor(config.poolSize * Math.random());
        while (depleted.has(index)) {
          index = Math.floor(config.poolSize * Math.random());
        }
        depleted.add(index);
        if (depleted.size >= config.poolSize) {
          finished = true;
        }
      }
    }

    return attempts;
  }

  function attemptsForTarget(level) {
    var total = 0;
    for (var current = 1; current < level; current += 1) {
      total += simulateLevel(current);
    }
    return total;
  }

  function levelForAmmo(ammo) {
    var remaining = ammo;
    var level = 1;

    while (remaining > 0 && level < config.maxLevelForCurrentAmmo) {
      remaining -= simulateLevel(level);
      if (remaining >= 0) {
        level += 1;
      }
    }

    return Math.max(1, level);
  }

  function summarize(values) {
    return {
      min: Math.min.apply(null, values),
      max: Math.max.apply(null, values),
      avg: values.reduce(function (sum, value) {
        return sum + value;
      }, 0) / values.length
    };
  }

  function buildHistogram(values, mode) {
    var buckets = new Map();

    values.forEach(function (value) {
      var bucket = mode === "target" ? Math.floor(value / 10) * 10 : value;
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
    });

    return Array.from(buckets.entries())
      .sort(function (a, b) {
        return a[0] - b[0];
      })
      .slice(0, 18);
  }

  function renderHistogram(entries, mode) {
    histogram.innerHTML = "";
    if (!entries.length) return;

    var top = Math.max.apply(
      null,
      entries.map(function (entry) {
        return entry[1];
      })
    );

    entries.forEach(function (entry) {
      var wrap = document.createElement("div");
      wrap.className = "bar-wrap";

      var bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = Math.max(10, Math.round((entry[1] / top) * 180)) + "px";
      bar.title = entry[1] + " runs";

      var label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = mode === "target" ? entry[0] + "-" + (entry[0] + 9) : String(entry[0]);

      wrap.appendChild(bar);
      wrap.appendChild(label);
      histogram.appendChild(wrap);
    });
  }

  function calculate() {
    var value = Number(valueInput.value || 0);
    if (!value || !config) return;

    var mode = currentMode();
    var values = Array.from({ length: runs() }, function () {
      return mode === "target" ? attemptsForTarget(value) : levelForAmmo(value);
    });
    var summary = summarize(values);

    statMain.textContent = mode === "target" ? Math.round(summary.avg) : (Math.round(summary.avg * 10) / 10).toFixed(1);
    statRange.textContent = summary.min + " / " + summary.max;
    statNote.textContent =
      (mode === "target" ? "Ammo medio stimato" : "Level reach medio") + " su " + runs() + " run";

    renderHistogram(buildHistogram(values, mode), mode);
  }

  function init() {
    fetch(DATA_URL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        config = data;
        setModeUi();
        statNote.textContent = runs() + " run, config da JSON";
      });
  }

  modeInputs.forEach(function (input) {
    input.addEventListener("change", setModeUi);
  });

  calculateButton.addEventListener("click", calculate);
  init();
})();
