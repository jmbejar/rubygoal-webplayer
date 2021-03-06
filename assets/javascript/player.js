'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Player = (function () {
  _createClass(Player, [{
    key: 'formatTime',
    value: function formatTime(secs) {
      if (secs < 0) {
        secs = 0;
      }

      var minutes = Math.floor(secs / 60);
      var seconds = Math.floor(secs - minutes * 60);

      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      var time = minutes + ':' + seconds;
      return time;
    }
  }, {
    key: 'rotateAndPaintImage',
    value: function rotateAndPaintImage(texture, angle, x, y) {
      var context = this.context;
      var degToRad = Math.PI / 180;

      context.save();
      context.translate(x, y);
      context.rotate(angle * degToRad);
      context.drawImage(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height);
      context.restore();
    }
  }, {
    key: 'rotateAndFillText',
    value: function rotateAndFillText(text, font, style, x, y, angle) {
      var context = this.context;
      var degToRad = Math.PI / 180;

      context.save();
      context.translate(x, y);
      context.rotate(angle * degToRad);
      context.font = font;
      context.textAlign = 'center';
      context.fillStyle = style;
      context.fillText(text, 0, 0);
      context.restore();
    }
  }, {
    key: 'drawTime',
    value: function drawTime(time) {
      var context = this.context;

      context.font = "48px Source Sans Pro";
      context.fillStyle = '#6d6e70';
      context.fillText(this.formatTime(time), 820, 60);
    }
  }, {
    key: 'drawScore',
    value: function drawScore(home, away) {
      var context = this.context;

      context.font = "48px Source Sans Pro";
      context.fillStyle = 'white';
      context.fillText(home, 1140, 60);
      context.fillText(away, 1210, 60);
    }
  }, {
    key: 'drawTeamNames',
    value: function drawTeamNames() {
      var context = this.context;
      var font = "64px Source Sans Pro";
      var style = 'white';

      this.rotateAndFillText(this.teams.home, font, style, 120, 570, 270);
      this.rotateAndFillText(this.teams.away, font, style, 1790, 570, 90);
    }
  }, {
    key: 'drawFrame',
    value: function drawFrame(frame) {
      var _this = this;

      var context = this.context;

      context.drawImage(this.backgroundObj, 0, 0);
      this.rotateAndPaintImage(this.ballObj, 0, frame.ball[0], frame.ball[1]);

      frame.home.forEach(function (p) {
        _this.drawPlayer(p, 'home');
      });
      frame.away.forEach(function (p) {
        _this.drawPlayer(p, 'away');
      });

      this.drawScore(frame.score[0], frame.score[1]);
      this.drawTime(frame.time);

      this.drawTeamNames();
    }
  }, {
    key: 'drawPlayer',
    value: function drawPlayer(data, side) {
      var texture = this.getPlayerTexture(side, data[3]);

      this.rotateAndPaintImage(texture, data[2], data[0], data[1]);
    }
  }, {
    key: 'getPlayerTexture',
    value: function getPlayerTexture(side, type) {
      return this.playerTextures[side][type];
    }
  }, {
    key: 'play',
    value: function play() {
      var _this2 = this;

      var frameRate = 1000.0 / 60;

      this.timer = setInterval(function () {
        if (_this2.frames.length > 0) {
          _this2.drawFrame(_this2.frames.shift());
        } else {
          clearInterval(_this2.timer);
          _this2.timer = undefined;
        }
      }, frameRate);
    }
  }, {
    key: 'play_button',
    value: function play_button() {
      if (this.loaded && this.timer === undefined) {
        this.play();
      }
    }
  }, {
    key: 'stop_button',
    value: function stop_button() {
      if (this.loaded) {
        this.pause_button();

        this.frames = this.original_frames.slice();
        this.drawFrame(this.frames[0]);
      }
    }
  }, {
    key: 'pause_button',
    value: function pause_button() {
      if (this.timer !== undefined) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    }
  }, {
    key: 'load',
    value: function load(src) {
      var _this3 = this;

      this.pause_button();
      this.loaded = false;

      // TODO Reduce image size by a half
      this.context.clearRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
      $(this.loader).show();

      $.getJSON(src, function (json) {
        _this3.original_frames = json.frames.slice();

        _this3.frames = json.frames;
        _this3.teams = json.teams;

        _this3.loaded = true;
        $(_this3.loader).hide();
        _this3.drawFrame(_this3.frames[0]);
      });
    }
  }]);

  function Player(canvas, play_btn, pause_btn, stop_btn, loader) {
    _classCallCheck(this, Player);

    var texture = undefined;
    var webplayer_path = '/bower_components/rubygoal-webplayer/';
    var assets_path = webplayer_path + 'assets/images/';

    this.loaded = false;

    $(play_btn).click(this.play_button.bind(this));
    $(pause_btn).click(this.pause_button.bind(this));
    $(stop_btn).click(this.stop_button.bind(this));

    this.loader = loader;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    // TODO Reduce image size by a half
    this.context.scale(0.5, 0.5);

    this.backgroundObj = new Image();
    this.backgroundObj.src = assets_path + 'background.png';

    this.ballObj = new Image();
    this.ballObj.src = assets_path + 'ball.png';

    this.playerTextures = { home: {}, away: {} };

    texture = new Image();
    texture.src = assets_path + 'average_home.png';
    this.playerTextures.home.a = texture;

    texture = new Image();
    texture.src = assets_path + 'average_away.png';
    this.playerTextures.away.a = texture;

    texture = new Image();
    texture.src = assets_path + 'fast_home.png';
    this.playerTextures.home.f = texture;

    texture = new Image();
    texture.src = assets_path + 'fast_away.png';
    this.playerTextures.away.f = texture;

    texture = new Image();
    texture.src = assets_path + 'captain_home.png';
    this.playerTextures.home.c = texture;

    texture = new Image();
    texture.src = assets_path + 'captain_away.png';
    this.playerTextures.away.c = texture;
  }

  return Player;
})();
