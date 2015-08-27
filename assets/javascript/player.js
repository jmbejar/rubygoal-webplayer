var Player = {
  formatTime: function(secs) {
    if (secs < 0) {
      secs = 0;
    }

    var minutes = Math.floor(secs / 60);
    var seconds = Math.floor(secs - (minutes * 60));

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
  },

  rotateAndPaintImage: function(texture, angle, x, y) {
    var context = this.context;

    context.save();
    context.translate(x, y);
    context.rotate(angle * Math.PI/180);
    context.drawImage(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height);
    context.restore();
  },

  rotateAndFillText: function(text, font, style, x, y, angle) {
    var context = this.context;

    context.save();
    context.translate(x, y);
    context.rotate(angle * Math.PI / 180);
    context.font = font;
    context.textAlign = 'center';
    context.fillStyle = style;
    context.fillText(text, 0, 0);
    context.restore();
  },

  drawTime: function(time) {
    var context = this.context;

    context.font="48px Source Sans Pro";
    context.fillStyle = '#6d6e70';
    context.fillText(this.formatTime(time), 820, 60);
  },

  drawScore: function(home, away) {
    var context = this.context;

    context.font="48px Source Sans Pro";
    context.fillStyle = 'white';
    context.fillText(home, 1140, 60);
    context.fillText(away, 1210, 60);
  },

  drawTeamNames: function() {
    var context = this.context;
    var font = "64px Source Sans Pro";
    var style = 'white';

    this.rotateAndFillText(this.teams.home, font, style, 120, 570, 270);
    this.rotateAndFillText(this.teams.away, font, style, 1790, 570, 90);
  },

  drawFrame: function(frame) {
    var context = this.context;

    context.drawImage(this.backgroundObj, 0, 0);
    this.rotateAndPaintImage(this.ballObj, 0, frame.ball.x, frame.ball.y);

    for(var i = 0; i < 11; i += 1) {
      this.drawPlayer(frame.home_players[i], 'home');
      this.drawPlayer(frame.away_players[i], 'away');
    }
    this.drawScore(frame.score.home, frame.score.away);
    this.drawTime(frame.time);

    this.drawTeamNames();
  },

  drawPlayer: function(data, side) {
    var texture = this.getPlayerTexture(side, data.type);

    this.rotateAndPaintImage(
      texture,
      data.angle,
      data.x,
      data.y
    );
  },

  getPlayerTexture: function(side, type) {
    return this.playerTextures[side][type];
  },

  play: function() {
    var timer = setInterval(function(){
      if (this.frames.length > 0) {
        this.drawFrame(this.frames.shift());
      } else {
        clearInterval(timer);
      } 
    }.bind(this), 1000.0 / 60);
  },

  init: function(canvas) {
    var texture;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.scale(0.5, 0.5)

    this.backgroundObj = new Image();
    this.backgroundObj.src = 'assets/images/background.png';

    this.ballObj = new Image();
    this.ballObj.src = 'assets/images/ball.png';

    this.playerTextures = { home: {}, away: {} };

    texture = new Image();
    texture.src = 'assets/images/average_home.png';
    this.playerTextures.home.average = texture;

    texture = new Image();
    texture.src = 'assets/images/average_away.png';
    this.playerTextures.away.average = texture;

    texture = new Image();
    texture.src = 'assets/images/fast_home.png';
    this.playerTextures.home.fast = texture;

    texture = new Image();
    texture.src = 'assets/images/fast_away.png';
    this.playerTextures.away.fast = texture;

    texture = new Image();
    texture.src = 'assets/images/captain_home.png';
    this.playerTextures.home.captain = texture;

    texture = new Image();
    texture.src = 'assets/images/captain_away.png';
    this.playerTextures.away.captain = texture;

    $.getJSON("recorded_game.json", function(json) {
      this.frames = json.frames;
      this.teams = json.teams;

      this.play();
    }.bind(this));
  }
}
