class Player {
  formatTime(secs) {
    if (secs < 0) {
      secs = 0;
    }

    let minutes = Math.floor(secs / 60);
    let seconds = Math.floor(secs - (minutes * 60));

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    let time = `${minutes}:${seconds}`;
    return time;
  }

  rotateAndPaintImage(texture, angle, x, y) {
    let context = this.context;
    const degToRad = Math.PI / 180;

    context.save();
    context.translate(x, y);
    context.rotate(angle * degToRad);
    context.drawImage(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height);
    context.restore();
  }

  rotateAndFillText(text, font, style, x, y, angle) {
    let context = this.context;
    const degToRad = Math.PI / 180;

    context.save();
    context.translate(x, y);
    context.rotate(angle * degToRad);
    context.font = font;
    context.textAlign = 'center';
    context.fillStyle = style;
    context.fillText(text, 0, 0);
    context.restore();
  }

  drawTime(time) {
    let context = this.context;

    context.font="48px Source Sans Pro";
    context.fillStyle = '#6d6e70';
    context.fillText(this.formatTime(time), 820, 60);
  }

  drawScore(home, away) {
    let context = this.context;

    context.font="48px Source Sans Pro";
    context.fillStyle = 'white';
    context.fillText(home, 1140, 60);
    context.fillText(away, 1210, 60);
  }

  drawTeamNames() {
    let context = this.context;
    let font = "64px Source Sans Pro";
    let style = 'white';

    this.rotateAndFillText(this.teams.home, font, style, 120, 570, 270);
    this.rotateAndFillText(this.teams.away, font, style, 1790, 570, 90);
  }

  drawFrame(frame) {
    let context = this.context;

    context.drawImage(this.backgroundObj, 0, 0);
    this.rotateAndPaintImage(this.ballObj, 0, frame.ball[0], frame.ball[1]);

    frame.home.forEach(p => {
      this.drawPlayer(p, 'home')
    });
    frame.away.forEach(p => {
      this.drawPlayer(p, 'away')
    });

    this.drawScore(frame.score[0], frame.score[1]);
    this.drawTime(frame.time);

    this.drawTeamNames();
  }

  drawPlayer(data, side) {
    let texture = this.getPlayerTexture(side, data[3]);

    this.rotateAndPaintImage(
      texture,
      data[2],
      data[0],
      data[1]
    );
  }

  getPlayerTexture(side, type) {
    return this.playerTextures[side][type];
  }

  play() {
    const frameRate = 1000.0 / 60;

    this.timer = setInterval( () => {
      if (this.frames.length > 0) {
        this.drawFrame(this.frames.shift());
      } else {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    }, frameRate);
  }

  play_button() {
    if (this.loaded && this.timer === undefined) {
      this.play();
    }
  }

  stop_button() {
    if (this.loaded) {
      this.pause_button();

      this.frames = this.original_frames.slice();
      this.drawFrame(this.frames[0]);
    }
  }

  pause_button() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  load(src) {
    this.pause_button();
    this.loaded = false;

    // TODO Reduce image size by a half
    this.context.clearRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
    $(this.loader).show();

    $.getJSON(src, json => {
      this.original_frames = json.frames.slice();

      this.frames = json.frames;
      this.teams = json.teams;

      this.loaded = true;
      $(this.loader).hide();
      this.drawFrame(this.frames[0]);
    });
  }

  constructor(canvas, play_btn, pause_btn, stop_btn, loader) {
    let texture;
    let webplayer_path = '/bower_components/rubygoal-webplayer/';
    let assets_path = `${webplayer_path}assets/images/`;

    this.loaded = false;

    $(play_btn).click(this.play_button.bind(this));
    $(pause_btn).click(this.pause_button.bind(this));
    $(stop_btn).click(this.stop_button.bind(this));

    this.loader = loader;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    // TODO Reduce image size by a half
    this.context.scale(0.5, 0.5)

    this.backgroundObj = new Image();
    this.backgroundObj.src = `${assets_path}background.png`;

    this.ballObj = new Image();
    this.ballObj.src = `${assets_path}ball.png`;

    this.playerTextures = { home: {}, away: {} };

    texture = new Image();
    texture.src = `${assets_path}average_home.png`;
    this.playerTextures.home.a = texture;

    texture = new Image();
    texture.src = `${assets_path}average_away.png`;
    this.playerTextures.away.a = texture;

    texture = new Image();
    texture.src = `${assets_path}fast_home.png`;
    this.playerTextures.home.f = texture;

    texture = new Image();
    texture.src = `${assets_path}fast_away.png`;
    this.playerTextures.away.f = texture;

    texture = new Image();
    texture.src = `${assets_path}captain_home.png`;
    this.playerTextures.home.c = texture;

    texture = new Image();
    texture.src = `${assets_path}captain_away.png`;
    this.playerTextures.away.c = texture;
  }
}
