/******************************************************\
	FONCTIONS
\******************************************************/
/**
*	Random
*	Generate a number between 1 and ceil (1 and ceil included)
*/
window.random = function (ceil) {
    "use strict";
    if ((ceil = parseInt(ceil, 0)) > 0) {
        return Math.abs(Math.floor(Math.random() * ceil + 1)); 
    } else {
        return Math.random(); 
    }
};

/**
* RequestAnimFrame
* request an animation frame to browser
*/
window.requestAnimation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;

/**
*	StopAnimation
*	cancel an animation previously threw trough requestAnimationFrame
*/
window.stopAnimation = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;


window.animStartTime = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime;

function getCodeFromText(txt) {
	var c = new Code();
	return c.codes[c.codesReversed.indexOf(txt)];
}
/******************************************************\
	CLASSES
\******************************************************/

// COLOR
//======================
var Color = function(color) {
    "use strict";
	this.color = '';
	this.colors = ['', 'rgba(255, 0, 0, 0.8)', 'rgba(167, 255, 0, 0.8)', 'rgba(167, 0, 255, 0.8)'];
	
	if(typeof color == 'undefined') {
		this.color = this.colors[random(this.colors.length-1)];
	} else {
		switch(color) {
			case 'red':
				this.color = this.colors[0];
				break;
			case 'green':
				this.color = this.colors[1];
				break;
			case 'purple':
				this.color = this.colors[2];
				break;
			default:
				this.color = '';
				break;
				
		}
	}
	
	this.getColor = function() { return this.color; };
};

// CODE
//=====================
var Code = function() {
    "use strict";
	this.code;
	this.codes = ['', 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
	this.codesReversed = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	
	this.code = this.codes[random(this.codes.length-1)];
	this.getCode = function() { return this.code; };
	this.getText = function() { return this.codesReversed[this.codes.indexOf(this.code)]; };
}


// POSITION
//======================================
var Position = function(x, y) {
	"use strict";
	this.x = 0;
	this.y = 0;
	
	if( typeof x != 'undefined')	this.setX( x );
	if( typeof y != 'undefined')	this.setY( y );
};
// Setters & Getters
Position.prototype.getX = function() { return this.x; };
Position.prototype.getY = function() { return this.y; };
Position.prototype.setX = function(x) { this.x = parseInt(x); };
Position.prototype.setY = function(y) { this.y = parseInt(y); };

// Bubble
//==================================================
var Bubble = function(game, color, code, position) {
	"use strict";
	if( (game instanceof Game) ||
	  	(color instanceof Color) ||
	  	(code instanceof Code) ||
	  	(position instanceof Position) ) {
		
		var obj = this;
		this.toDOM = $('<span class="bubble"></span>');
		this.game = game;
		this.color = color;
		this.code = code;
		this.x = position.getX();
		this.y = position.getY();
		
		// Configurations
		this.toDOM.css({
			background : this.color.getColor(),
				  left : this.x,
				   top : this.y
		});
		this.toDOM.text(this.code.getText());

		// Insertion
		var screen = game.platform.screen; 
		screen.append(this.toDOM);
	}	
};
// Methods
Bubble.prototype.move = function() {
	if(this.game.platform.mode > 1) {
		this.y = this.y - ((this.game.platform.mode * 3)/4);
	} else {
		this.y--;
	}
	this.toDOM.css({top : this.y});
};

// SCORE
//======================
var Score = function(g) {
	"use strict";
	if(g instanceof Game) {
		this.game = g;
		this.score = 0;
		this.screen = $('#score');
	}
};
Score.prototype.display = function() {
	this.screen.text(this.score);
};


// TIMEMANAGER
//=============================
var TimeManager = function(g) {
	"use strict";
	if(g instanceof Game) {
		this.game = g;
		this.timeStart = 0;
		this.time = this.timeStart;
		this.screen = $('#timer');
	}
};
TimeManager.prototype.display = function() {
	this.screen.text(Math.floor(this.time));
};


// MISSING
var Missing = function(g) {
	"use strict";
	if(g instanceof Game) {
		this.game = g;
		this.missing = this.game.missable;
		this.screen = $('#missed');
	}
};
Missing.prototype.display = function() {
	this.screen.text(this.missing);
};


// GAME
//=====================
var Game = function(p) {
	"use strict";
	if( p instanceof Platform) {
		this.missable = 2;
		this.platform = p;
		this.username = '';
		this.score = new Score(this);
		this.time = new TimeManager(this);
		this.missing = new Missing(this);
	}
};

Game.prototype.loop = 0;
// Init Game
Game.prototype.init = function() { 
	this.platform.screen.html(''); 

	this.score = new Score(this);
	this.time = new TimeManager(this);
	this.missing = new Missing(this);
};
// Remove Bubble
Game.prototype.removeBubble = function(code) {
	var g = this;
	g.platform.screen.children().each(function() {
		var bubble = {
				 get : $(this),
				code : getCodeFromText($(this).text())
		};
		
		if(bubble.code == code) {
			bubble.get.animate({top : g.platform.screen.height()}, {
				duration : 500,
				complete : function() { $(this).remove(); }
			});
			g.platform.soundManager.goal.play();
			g.score.score++;
		}
	});
};

// Add Bubble
Game.prototype.addBubble = function() {
	var randomX = random(this.platform.screen.width() - 45);
	var randomY = this.platform.screen.height() + random(200);
	var p = new Position(randomX, randomY); // Random position

	if(this.loop >= 30) { // Generate Bubble
		var b = new Bubble(this, new Color(), new Code(), p);
		this.loop = 0;
	}
};

// Play Game
Game.prototype.play = function(g) {
	if(g instanceof Game) { 
		
		g.addBubble();
		
		if( (new Date().getSeconds() - g.time.timeStart) >= 1) {
			g.time.time++;
			g.time.timeStart = new Date().getSeconds();
		}
		
		g.platform.screen.children().each(function() {
			var bubble = {
				     get : $(this),
				    code : getCodeFromText($(this).text()),
				position : $(this).offset()
			};
			
			if(bubble.get.position().top <= 0) {
				bubble.get.remove();
				g.platform.soundManager.fail.play();
				g.missing.missing--;
			} else {
				if(g.platform.mode > 1) {
					bubble.position.top = bubble.position.top - ((g.platform.mode * 3)/4);
				} else {
					bubble.position.top--;
				}
				bubble.get.offset(bubble.position);
			}
		});
		
		// DISPLAYING SCORE, MISSABLE, TIMER
		g.score.display();
		g.missing.display();
		g.time.display();
		g.loop++;
		
		// TESTING IF GAME IS OVER
		if(g.missing.missing <= 0) {
			g.platform.switchState(g.platform.overState);
		} else {
			g.platform.loop = requestAnimation(function() { g.play(g); });
		}
	}
};

// STATE
// Classe 100% abstraite
//======================
var State = function() {
	"use strict";
	this.enter = function() {};
	this.leave = function() {};
};
State.prototype.loop;
State.prototype.hideMenu = function() { $('#menu').find('li').each(function() { $(this).hide(); }); $('#main').hide(); };
State.prototype.showState = function(el) { $('#main').show(); el.fadeIn(300); };

// MENU
// extends State
//=====================
var MenuState = function(g) {
	"use strict";
	if(g instanceof Game) { 
		this.game = g;
		this.screen = $('#menuscreen');
		this.gameMode = $('#gameMode');
		
		this.enter = function() {
			$(document).off('keyup');
			var obj = g;
			g.platform.stopAnim();
			g.init();
			this.hideMenu();
			this.showState(this.screen);
			
			this.gameMode.children().on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				switch(this.id) {
					case 'modeBeginner':
						obj.platform.mode = 1;
						break;
					case 'modeMedium':
						obj.platform.mode = 2;
						break;
					case 'modePro':
						obj.platform.mode = 3;
						break;
					default:
						obj.platform.mode = 1;
						break;
				}
				
				obj.platform.switchState(obj.platform.playState);
				
				return false;
			});
		};
	}
};
MenuState.prototype = new State();

// PLAY
// extends State
//=====================
var PlayState = function(g) {
	"use strict";
	if(g instanceof Game) {
		this.game = g;
		
		this.enter = function() {
			g.time.timeStart = new Date().getSeconds();
			$('#stat').fadeIn('slow');
			this.hideMenu();
			g.platform.stopAnim();
			
			$(document).on('keyup', function(e) {
				// Removing bubble
				if(e.keyCode >= 48 && e.keyCode <= 90) {
					g.removeBubble(e.keyCode);
				}
				// PAUSE
				else if(e.keyCode == 32) {
					g.platform.switchState(g.platform.pauseState);
				}
				// else not allowed touch
				else {
					g.platform.soundManager.warning.play();
				}
			});
			
			g.platform.loop = requestAnimation(function() { g.play(g); });
		};
		
		this.leave = function() { $(document).off('keyup'); $('#stat').hide(); };
	}
};
PlayState.prototype = new State();

// PAUSE
// extends State
//=====================
var PauseState = function(g) {
	"use strict";
	if(g instanceof Game) { 
		this.game = g;
		this.screen = $('#pausescreen');
		
		this.enter = function() {
			var obj = g;
			g.platform.stopAnim();
			this.hideMenu();
			this.showState(this.screen);
			
			$('.returnMenu').on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				obj.platform.switchState(obj.platform.menuState);
				
				return false;
			});
			
			$(document).on('keyup', function(e) {
				if(e.keyCode == 32) {
					g.platform.switchState(g.platform.playState);
				}
			});
		};
		
		this.leave = function() { $(document).off('keyup'); };
	}
};
PauseState.prototype = new State();

// OVER
// extends State
//=====================
var OverState = function(g) {
	"use strict";
	if(g instanceof Game) { 
		this.game = g;
		this.screen = $('#scorescreen');
		
		this.enter = function() {
			var obj = g;
			g.platform.soundManager.gameover.play();
			var result = $('<ul><li>'+ g.username +', You type '+g.score.score+' characters in '+g.time.time+' seconds.</li><li><u>Your speed</u> : about ' + Math.floor( (Math.ceil(g.score.score / 5) / g.time.time) * 60) +' words per minutes!</li></ul>');
			g.platform.stopAnim();
			this.hideMenu();
			$('#gameresult').append(result);
			this.showState(this.screen);

			var data = {
				username: g.username,
				seconds: g.time.time,
				action: 'register_score',
				characters: g.score.score
			};

			var jqxhr = jQuery.post("ajax.php", data);

			jqxhr.done(function (response) {
				console.log(response);
			});
			
			$('.returnMenu').on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				obj.platform.switchState(obj.platform.menuState);
				
				return false;
			});
		};
	}
};
OverState.prototype = new State();

// SOUNDMANAGER
//=============================
var SoundManager = function() {
	"use strict";
	this.sound = {};
};

SoundManager.prototype.play = function() {
	this.sound.pause();
	this.sound.currentTime = 0;
	this.sound.play();
};

var GoalSound = function() {};
GoalSound.prototype = new SoundManager();
GoalSound.prototype.sound = document.getElementById('soundGoal');

var FailSound = function() {};
FailSound.prototype = new SoundManager();
FailSound.prototype.sound = document.getElementById('soundFailure');

var WarningSound = function() {};
WarningSound.prototype = new SoundManager();
WarningSound.prototype.sound = document.getElementById('soundNope');

var GameOverSound = function() {};
GameOverSound.prototype = new SoundManager();
GameOverSound.prototype.sound = document.getElementById('soundEnd');

// PLATFORM
//=========================
var Platform = function() {
	"use strict";
	var obj = this;
};

Platform.prototype.mode = 1;
Platform.prototype.loop = undefined;

Platform.prototype.switchState = function(state) {
	"use strict";
	if( state instanceof State ) {
		this.current_state.leave();
		this.current_state = state;
		this.current_state.enter();
	}
};

Platform.prototype.stopAnim = function() { 
	if(typeof this.loop != 'undefined') {
		stopAnimation(this.loop);
		this.loop = undefined;
	} 
};

Platform.prototype.init = function() {
	"use strict";

	var username = undefined;

	do
	{
		username = prompt("Please enter a username in order to register your score?");
	}
	while ((username == '') || (typeof username != 'string'));

	this.loop = undefined;
	this.game = new Game(this);
	this.game.username = username;
	this.soundManager = {
		    goal : new GoalSound(),
		    fail : new FailSound(),
		 warning : new WarningSound(),
		gameover : new GameOverSound()
	};
	this.screen = $('#gamescreen');
	this.menuState = new MenuState(this.game);
	this.playState = new PlayState(this.game);
	this.pauseState = new PauseState(this.game);
	this.overState = new OverState(this.game);
	this.current_state = this.menuState;
	
	this.switchState(this.current_state);
};