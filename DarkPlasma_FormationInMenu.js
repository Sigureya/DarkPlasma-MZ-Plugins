// DarkPlasma_FormationInMenu 1.0.1
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2020/09/23 1.0.0 公開
 */

/*:ja
 * @plugindesc メニューの並び替えを専用シーンに変える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_Formation
 *
 * @help
 * version: 1.0.1
 * メニューの並び替えを DarkPlasma_Formation の専用並び替えシーンにすり替えます。
 */

(() => {
  'use strict';

  Scene_Menu.prototype.commandFormation = function () {
    SceneManager.push(Scene_Formation);
  };
})();
