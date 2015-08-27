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

  rotateAndPaintImage: function(context, image, angle, x, y) {
    var width = 60;
    var height = 60;
    var context = this.context;

    context.translate(x, y);
    context.rotate(angle * Math.PI/180);
    context.drawImage(image, -width / 2, -height / 2, width, height);
    context.rotate(-angle * Math.PI/180);
    context.translate(-x, -y);
  },

  drawTime: function(context, time) {
    var context = this.context;

    context.font="48px Source Sans Pro";
    context.fillStyle = '#6d6e70';
    context.fillText(this.formatTime(time), 820, 60);
  },

  drawScore: function(context, home, away) {
    var context = this.context;

    context.font="48px Source Sans Pro";
    context.fillStyle = 'white';
    context.fillText(home, 1140, 60);
    context.fillText(away, 1210, 60);
  },

  drawFrame: function(frame) {
    var context = this.context;

    context.drawImage(this.backgroundObj, 0, 0);
    context.drawImage(this.ballObj, frame.ball.x - this.ballObj.width / 2, frame.ball.y - this.ballObj.height / 2);
    for(var i = 0; i < 11; i += 1) {
      var home_player = frame.home_players[i];
      var away_player = frame.away_players[i];

      this.rotateAndPaintImage(context, this.homeObj, home_player.angle, home_player.x, home_player.y);
      this.rotateAndPaintImage(context, this.awayObj, away_player.angle, away_player.x, away_player.y);
    }
    this.drawScore(context, frame.score.home, frame.score.away);
    this.drawTime(context, frame.time);
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
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.scale(0.5, 0.5)

    this.backgroundObj = new Image();
    this.backgroundObj.src = 'assets/images/background.png';

    this.ballObj = new Image();
    this.ballObj.src = 'assets/images/ball.png';

    this.homeObj = new Image();
    this.homeObj.src = 'assets/images/average_home.png';

    this.awayObj = new Image();
    this.awayObj.src = 'assets/images/average_away.png';

    $.getJSON("recorded_game.json", function(json) {
      this.frames = json.frames;
      this.play();
    }.bind(this));
  }
}