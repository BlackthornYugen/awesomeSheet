var classes = (function() {

  var delayUpdateTimer = null;

  function _total(classObjects, key) {
    var currentTotal = 0;
    for (var i = 0; i < classObjects.length; i++) {
      currentTotal = currentTotal + classObjects[i][key];
    };
    currentTotal = parseInt(currentTotal, 10);
    return currentTotal
  };

  function _makeBaseAttackBonuses(totalBab) {
    var allBab = [];
    if (totalBab < 100) {
      if (totalBab >= 5) {
        while (totalBab > 0) {
          allBab.push("+" + totalBab);
          totalBab = totalBab - 5;
        };
      } else {
        if (totalBab > 0) {
          allBab.push("+" + totalBab);
        } else {
          allBab.push(totalBab);
        };
      };
    } else {
      allBab.push("BAB exceeds maximum calculation");
    };
    if (allBab.length > 1) {
      allBab = allBab.join(" / ");
    } else {
      allBab = allBab[0];
    };
    return allBab;
  };

  function delayUpdate(element) {
    render();
    totalBlock.render();
    textBlock.render();
  };

  function bind(inputBlock) {
    var input = inputBlock.querySelector(".js-input-block-field");
    if (input) {
      input.addEventListener("input", function() {
        clearTimeout(delayUpdateTimer);
        delayUpdateTimer = setTimeout(delayUpdate, 300, this);
      }, false);
    };
  };

  function render() {
    var all_classes = helper.getObject({
      object: sheet.get(),
      path: "basics.classes"
    });
    var totalLevels = _total(all_classes, "level");
    var totalHP = _total(all_classes, "hp") + (totalLevels * stats.getMod("con"));
    var totalBab = _total(all_classes, "bab");
    var totalRanks = _total(all_classes, "ranks") + (totalLevels * stats.getMod("int"));
    var totalFortitude = _total(all_classes, "fortitude");
    var totalReflex = _total(all_classes, "reflex");
    var totalWill = _total(all_classes, "will");
    var baseAttackBonuses = _makeBaseAttackBonuses(totalBab);
    helper.setObject({
      object: sheet.get(),
      path: "basics.level",
      newValue: totalLevels
    });
    helper.setObject({
      object: sheet.get(),
      path: "defense.hp.total",
      newValue: totalHP
    });
    helper.setObject({
      object: sheet.get(),
      path: "offense.base_attack",
      newValue: totalBab
    });
    helper.setObject({
      object: sheet.get(),
      path: "offense.base_attack_bonuses",
      newValue: baseAttackBonuses
    });
    helper.setObject({
      object: sheet.get(),
      path: "skills.ranks.total",
      newValue: totalRanks
    });
    helper.setObject({
      object: sheet.get(),
      path: "defense.fortitude.base",
      newValue: totalFortitude
    });
    helper.setObject({
      object: sheet.get(),
      path: "defense.reflex.base",
      newValue: totalReflex
    });
    helper.setObject({
      object: sheet.get(),
      path: "defense.will.base",
      newValue: totalWill
    });
  };

  function get_classLevel(characterObject) {
    var classAndLevel = "";
    var classes = characterObject.basics.classes;
    for (var i = 0; i < classes.length; i++) {
      var classname = classes[i].classname || "No class";
      var level = classes[i].level || "No level";
      classAndLevel = classAndLevel + classname + " " + level;
      if (i < (classes.length - 1)) {
        classAndLevel = classAndLevel + " / ";
      };
    };
    return classAndLevel;
  };

  // exposed methods
  return {
    bind: bind,
    render: render,
    getClassLevel: get_classLevel
  };

})();
