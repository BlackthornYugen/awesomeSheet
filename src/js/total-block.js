var totalBlock = (function() {

  function _bonusTextLable(label) {
    if (label == "str-bonus" || label == "str_bonus") {
      return "STR Bonus";
    } else if (label == "dex-bonus" || label == "dex_bonus") {
      return "DEX Bonus";
    } else if (label == "con-bonus" || label == "con_bonus") {
      return "CON Bonus";
    } else if (label == "int-bonus" || label == "int_bonus") {
      return "INT Bonus";
    } else if (label == "wis-bonus" || label == "wis_bonus") {
      return "WIS Bonus";
    } else if (label == "cha-bonus" || label == "cha_bonus") {
      return "CHA Bonus";
    } else if (label == "bab") {
      return "Base Attack Bonus";
    } else if (label == "size") {
      return "Size Bonus";
    } else if (label == "special_size") {
      return "Special Size Bonus";
    } else if (label == "size_modifier_fly") {
      return "Size Fly Bonus";
    } else if (label == "size_modifier_stealth") {
      return "Size Stealth Bonus";
    } else if (label == "level") {
      return "Level";
    } else if (label == "half-level" || label == "half_level") {
      return "Half Level";
    } else if (label == "plus-ten" || label == "plus_ten") {
      return "Plus 10";
    } else if (label == "ac-armor" || label == "ac_armor") {
      return "Armor Bonus";
    } else if (label == "ac-shield" || label == "ac_shield") {
      return "Shield Bonus";
    } else if (label == "ac-deflect" || label == "ac_deflect") {
      return "Deflect Bonus";
    } else if (label == "ac-dodge" || label == "ac_dodge") {
      return "Dodge Bonus";
    } else if (label == "ac-natural" || label == "ac_natural") {
      return "Natural Armor Bonus";
    } else if (label == "class-skill" || label == "class_skill") {
      return "Class Skill";
    } else if (label == "check-penalty" || label == "check_penalty") {
      return "Armor Check Penalty";
    } else if (label == "max-dex" || label == "max_dex") {
      return "Max Dex Bonus";
    } else {
      return label;
    };
  };

  function bind(totalBlock) {
    if (totalBlock) {
      _bind_totalBlock(totalBlock);
    } else {
      var all_totalBlock = helper.eA(".js-total-block");
      for (var i = 0; i < all_totalBlock.length; i++) {
        if (all_totalBlock[i].dataset.clone != "true") {
          _bind_totalBlock(all_totalBlock[i]);
        };
      };
    };
  };

  function _bind_totalBlock(totalBlock) {
    var all_totalBlockBonuses = totalBlock.querySelectorAll(".js-total-block-bonuses");
    var all_totalBlockCheck = totalBlock.querySelectorAll(".js-total-block-check");
    if (all_totalBlockCheck) {
      for (var i = 0; i < all_totalBlockCheck.length; i++) {
        var options = helper.makeObject(all_totalBlockCheck[i].dataset.totalBlockCheckOptions);
        if (!options.clone) {
          bind_totalBlockCheck(all_totalBlockCheck[i]);
        };
      };
    };
    if (all_totalBlockBonuses) {
      for (var i = 0; i < all_totalBlockBonuses.length; i++) {
        var options = helper.makeObject(all_totalBlockBonuses[i].dataset.totalBlockBonusesOptions);
        if (!options.clone) {
          bind_totalBlockBonuses(all_totalBlockBonuses[i]);
        };
      };
    };
  };

  function bind_totalBlockCheck(totalBlockCheck) {
    totalBlockCheck.addEventListener("change", function() {
      _render_totalBlockCheck(this);
      render();
      textBlock.render();
      sheet.store();
    }, false);
  };

  function bind_totalBlockBonuses(totalBlockBonuses) {
    totalBlockBonuses.addEventListener("click", function(event) {
      event.stopPropagation();
      event.preventDefault();
      _render_totalBlockBonuses(this);
    }, false);
  };

  function render(totalBlock) {
    if (totalBlock) {
      _render_totalBlock(totalBlock);
    } else {
      _render_all_totalBlock();
    };
  };

  function _render_all_totalBlock() {
    var all_totalBlock = helper.eA(".js-total-block");
    for (var i = 0; i < all_totalBlock.length; i++) {
      _render_totalBlock(all_totalBlock[i]);
    };
  };

  function _render_totalBlock(totalBlock) {
    var options = helper.makeObject(totalBlock.dataset.totalBlockOptions);
    // var totalBlockTotalElement = totalBlock.querySelector(".js-total-block-total");
    var totalBlockObject;
    var toSum = [];
    var _get_totalBlockObject = function() {
      totalBlockObject = helper.getObject({
        object: sheet.get(),
        path: options.path
      });
    };
    var _update_missingBonusKey = function() {
      if (totalBlockObject != undefined) {
        // if the options has bonuses
        if (options.bonuses) {
          // if the total block is missing bonuses
          if (!totalBlockObject.bonuses) {
            totalBlockObject.bonuses = {};
          };
          // loop over the options.bonuses and add them to totalBlockObject.bonuses
          for (var i = 0; i < options.bonuses.length; i++) {
            if (!(options.bonuses[i] in totalBlockObject.bonuses)) {
              totalBlockObject.bonuses[options.bonuses[i]] = false;
            };
          };
        };
      };
    };
    var _checkValue = function(data) {
      var value;
      if (typeof data == "number") {
        value = data;
      } else if (typeof data == "string") {
        value = parseInt(data, 10) || 0;
      };
      if (isNaN(value)) {
        value = 0;
      };
      return value;
    };
    var _checkClassSkill = function(object) {
      var classSkill;
      if (object.ranks > 0) {
        classSkill = 3;
      } else {
        classSkill = 0;
      };
      return classSkill;
    };
    var _push_internalValues = function(array, addOrMinus) {
      if (array) {
        if (options.cloneSet) {
          for (var i = 0; i < totalBlockObject.length; i++) {
            for (var q = 0; q < array.length; q++) {
              if (totalBlockObject[i][array[q]] && totalBlockObject[i][array[q]] != "" && !isNaN(totalBlockObject[i][array[q]])) {
                if (addOrMinus == "add") {
                  toSum.push(totalBlockObject[i][array[q]]);
                } else if (addOrMinus == "minus") {
                  toSum.push(-totalBlockObject[i][array[q]]);
                };
              };
            };
          };
        } else {
          if (array && array.length > 0) {
            for (var i = 0; i < array.length; i++) {
              if (totalBlockObject[array[i]] && totalBlockObject[array[i]] != "" && !isNaN(totalBlockObject[array[i]])) {
                if (addOrMinus == "add") {
                  toSum.push(totalBlockObject[array[i]]);
                } else if (addOrMinus == "minus") {
                  toSum.push(-totalBlockObject[array[i]]);
                };
              };
            };
          };
        };
      };
    };
    var _push_externalValues = function() {
      // loop over bonuses in totalBlockObject
      for (var key in totalBlockObject.bonuses) {
        // if external bonuse is true
        // max dex is not a bonus too add or subtract but a value to limit the dex modifier
        if (totalBlockObject.bonuses[key] && key != "max_dex") {
          var externalBouns;
          if (key == "str_bonus") {
            externalBouns = _checkValue(stats.getMod("str"));
          };
          if (key == "dex_bonus") {
            // if max dex is true
            if (totalBlockObject.bonuses.max_dex) {
              if (helper.getObject({
                  object: sheet.get(),
                  path: "equipment.armor.max_dex"
                }) != "" && helper.getObject({
                  object: sheet.get(),
                  path: "equipment.armor.max_dex"
                }) < _checkValue(stats.getMod("dex"))) {
                externalBouns = helper.getObject({
                  object: sheet.get(),
                  path: "equipment.armor.max_dex"
                });
              } else {
                externalBouns = _checkValue(stats.getMod("dex"));
              };
            } else {
              externalBouns = _checkValue(stats.getMod("dex"));
            };
          };
          if (key == "con_bonus") {
            externalBouns = _checkValue(stats.getMod("con"));
          };
          if (key == "int_bonus") {
            externalBouns = _checkValue(stats.getMod("int"));
          };
          if (key == "wis_bonus") {
            externalBouns = _checkValue(stats.getMod("wis"));
          };
          if (key == "cha_bonus") {
            externalBouns = _checkValue(stats.getMod("cha"));
          };
          if (key == "bab") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "offense.base_attack"
            }));
          };
          if (key == "size") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "basics.size.size_modifier"
            }));
          };
          if (key == "special_size") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "basics.size.special_size_modifier"
            }));
          };
          if (key == "level") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "basics.level"
            }));
          };
          if (key == "half_level") {
            externalBouns = Math.floor(_checkValue(helper.getObject({
              object: sheet.get(),
              path: "basics.level"
            })) / 2);
          };
          if (key == "ac_armor") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "defense.ac.armor"
            }));
          };
          if (key == "ac_shield") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "defense.ac.shield"
            }));
          };
          if (key == "ac_deflect") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "defense.ac.deflect"
            }));
          };
          if (key == "ac_dodge") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "defense.ac.dodge"
            }));
          };
          if (key == "ac_natural") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "defense.ac.natural"
            }));
          };
          if (key == "check_penalty") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "equipment.armor.check_penalty"
            }));
          };
          if (key == "class_skill") {
            externalBouns = _checkClassSkill(totalBlockObject);
          };
          if (key == "size_modifier_fly") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "basics.size.size_modifier_fly"
            }));
          };
          if (key == "size_modifier_stealth") {
            externalBouns = _checkValue(helper.getObject({
              object: sheet.get(),
              path: "basics.size.size_modifier_stealth"
            }));
          };
          if (key == "plus_ten") {
            externalBouns = 10;
          };
          toSum.push(externalBouns);
        };
      };
    };
    var _reduceSum = function(array) {
      var total;
      if (array.length > 0) {
        total = array.reduce(function(a, b) {
          return a + b;
        });
      } else {
        total = 0;
      };
      return total;
    };
    var _render_allCheck = function() {
      var all_bonusCheck = totalBlock.querySelectorAll(".js-total-block-check");
      if (all_bonusCheck.length > 0) {
        for (var i = 0; i < all_bonusCheck.length; i++) {
          var options = helper.makeObject(all_bonusCheck[i].dataset.totalBlockCheckOptions);
          all_bonusCheck[i].checked = totalBlockObject.bonuses[options.type];
        };
      };
    };
    var _store = function(grandTotal) {
      if (options.cloneSet) {
        helper.setObject({
          object: sheet.get(),
          path: options.cloneSetPath + ".current",
          newValue: grandTotal
        });
      } else {
        helper.setObject({
          object: sheet.get(),
          path: options.path + ".current",
          newValue: grandTotal
        });
      };
    };
    _get_totalBlockObject();
    _update_missingBonusKey();
    _push_internalValues(options.addition, "add");
    _push_internalValues(options.subtraction, "minus");
    _push_externalValues();
    _render_allCheck()
    var grandTotal = _reduceSum(toSum);
    // console.log(options.path, toSum, grandTotal);
    _store(grandTotal);
  };

  function _render_totalBlockCheck(input) {
    var options = helper.makeObject(input.dataset.totalBlockCheckOptions);
    var totalBlock = helper.getClosest(input, ".js-total-block");
    var totalBlockOptions = helper.makeObject(totalBlock.dataset.totalBlockOptions);
    var totalBlockBonusesObject;
    var object;
    if (options.path) {
      totalBlockBonusesObject = helper.getObject({
        object: sheet.get(),
        path: options.path
      });
    };
    if (totalBlockBonusesObject) {
      totalBlockBonusesObject[options.type] = input.checked;
    };
  };

  function _render_totalBlockBonuses(button) {
    var options = helper.makeObject(button.dataset.totalBlockBonusesOptions);
    var totalBlock = helper.getClosest(button, ".js-total-block");
    var totalBlockOptions = helper.makeObject(totalBlock.dataset.totalBlockOptions);
    var totalBlockBonusesObject;
    var newBonusesObject;
    var _get_bonusObject = function() {
      if (options.path) {
        totalBlockBonusesObject = helper.getObject({
          object: sheet.get(),
          path: options.path
        });
      };
      // copy object
      newBonusesObject = JSON.parse(JSON.stringify(totalBlockBonusesObject));
    };
    var _store_data = function() {
      helper.setObject({
        object: sheet.get(),
        path: options.path,
        newValue: newBonusesObject
      });
    };
    var _hold_data = function(input, key) {
      newBonusesObject[key] = input.checked;
    };
    var _render_check = function(key) {
      var checkBlock = document.createElement("div");
      checkBlock.setAttribute("class", "m-check-block");
      var checkBlockCheck = document.createElement("input");
      checkBlockCheck.setAttribute("class", "m-check-block-check");
      checkBlockCheck.setAttribute("type", "checkbox");
      checkBlockCheck.setAttribute("id", key);
      checkBlockCheck.checked = totalBlockBonusesObject[key];
      var checkBlockCheckIcon = document.createElement("span");
      checkBlockCheckIcon.setAttribute("class", "m-check-block-check-icon");
      checkBlock.appendChild(checkBlockCheck);
      checkBlock.appendChild(checkBlockCheckIcon);
      checkBlockCheck.addEventListener("change", function() {
        _hold_data(this, key);
      }, false);
      return checkBlock;
    };
    var _render_checkLabel = function(text, key) {
      var editBoxText = document.createElement("label");
      editBoxText.setAttribute("class", "m-edit-box-check-label");
      editBoxText.setAttribute("for", key);
      editBoxText.textContent = text;
      return editBoxText;
    };
    var _render_editBoxItem = function(size, child) {
      var editBoxItem = document.createElement("div");
      editBoxItem.setAttribute("class", "m-edit-box-item-" + size);
      if (child) {
        editBoxItem.appendChild(child);
      };
      return editBoxItem;
    };
    var _render_editBox = function(nodes) {
      var editBox = document.createElement("div");
      editBox.setAttribute("class", "m-edit-box");
      var editBoxHead = document.createElement("div");
      editBoxHead.setAttribute("class", "m-edit-box-head");
      var editBoxBody = document.createElement("div");
      editBoxBody.setAttribute("class", "m-edit-box-body");
      var editBoxContent = document.createElement("div");
      editBoxContent.setAttribute("class", "m-edit-box-content m-edit-box-content-margin-small");
      var editBoxGroup = document.createElement("div");
      editBoxGroup.setAttribute("class", "m-edit-box-item-max m-edit-box-group");
      for (var i = 0; i < arguments.length; i++) {
        editBoxGroup.appendChild(arguments[i]);
      };
      editBoxContent.appendChild(editBoxGroup);
      editBoxBody.appendChild(editBoxContent);
      editBox.appendChild(editBoxBody);
      return editBox;
    };
    var _render_totalBlockBonusesModal = function() {
      var totalBlockControls = document.createElement("div");
      if (totalBlockBonusesObject) {
        // order the bonuses for rendering in modal
        var orderedBonuses = [];
        if ("str_bonus" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "str_bonus": totalBlockBonusesObject["str_bonus"]
          })
        };
        if ("dex_bonus" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "dex_bonus": totalBlockBonusesObject["dex_bonus"]
          })
        };
        if ("con_bonus" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "con_bonus": totalBlockBonusesObject["con_bonus"]
          })
        };
        if ("int_bonus" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "int_bonus": totalBlockBonusesObject["int_bonus"]
          })
        };
        if ("wis_bonus" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "wis_bonus": totalBlockBonusesObject["wis_bonus"]
          })
        };
        if ("cha_bonus" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "cha_bonus": totalBlockBonusesObject["cha_bonus"]
          })
        };
        if ("bab" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "bab": totalBlockBonusesObject["bab"]
          })
        };
        if ("level" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "level": totalBlockBonusesObject["level"]
          })
        };
        if ("half_level" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "half_level": totalBlockBonusesObject["half_level"]
          })
        };
        if ("class_skill" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "class_skill": totalBlockBonusesObject["class_skill"]
          })
        };
        if ("max_dex" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "max_dex": totalBlockBonusesObject["max_dex"]
          })
        };
        if ("check_penalty" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "check_penalty": totalBlockBonusesObject["check_penalty"]
          })
        };
        if ("plus_ten" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "plus_ten": totalBlockBonusesObject["plus_ten"]
          })
        };
        if ("ac_armor" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "ac_armor": totalBlockBonusesObject["ac_armor"]
          })
        };
        if ("ac_shield" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "ac_shield": totalBlockBonusesObject["ac_shield"]
          })
        };
        if ("ac_deflect" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "ac_deflect": totalBlockBonusesObject["ac_deflect"]
          })
        };
        if ("ac_dodge" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "ac_dodge": totalBlockBonusesObject["ac_dodge"]
          })
        };
        if ("ac_natural" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "ac_natural": totalBlockBonusesObject["ac_natural"]
          })
        };
        if ("size" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "size": totalBlockBonusesObject["size"]
          })
        };
        if ("special_size" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "special_size": totalBlockBonusesObject["special_size"]
          })
        };
        if ("size_modifier_fly" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "size_modifier_fly": totalBlockBonusesObject["size_modifier_fly"]
          })
        };
        if ("size_modifier_stealth" in totalBlockBonusesObject) {
          orderedBonuses.push({
            "size_modifier_stealth": totalBlockBonusesObject["size_modifier_stealth"]
          })
        };
        for (var i = 0; i < orderedBonuses.length; i++) {
          for (var key in orderedBonuses[i]) {
            var title = _bonusTextLable(key);
            var check = _render_check(key);
            var label = _render_checkLabel(title, key);
            var editBoxItem1 = _render_editBoxItem("large", label);
            var editBoxItem2 = _render_editBoxItem("check", check);
            var editBox = _render_editBox(editBoxItem1, editBoxItem2);
            totalBlockControls.appendChild(editBox);
          };
        };
      };
      return totalBlockControls;
    };
    _get_bonusObject();
    var modalContent = _render_totalBlockBonusesModal();
    var modalAction = function() {
      _store_data();
      render();
      display.clear();
      display.render();
      textBlock.render();
      sheet.store();
    }.bind(modalContent);
    modal.render({
      heading: options.modalHeading,
      content: modalContent,
      action: modalAction,
      actionText: "Apply",
      size: "small"
    });
    page.update();
  };

  function clear() {
    var all_total = helper.eA(".js-total-block-total");
    for (var i = 0; i < all_total.length; i++) {
      all_total[i].textContent = "";
    };
  };

  // exposed methods
  return {
    clear: clear,
    bind: bind,
    bind_totalBlockCheck: bind_totalBlockCheck,
    bind_totalBlockBonuses: bind_totalBlockBonuses,
    render: render
  };

})();
