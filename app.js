//Creamos la función para inicializar el proyecto
function initCanvas(){
    let ctx = document.getElementById('my_canvas').getContext('2d');
    let backgroundImage = new Image();
    let naveImage       = new Image();
    let enemiespic1     = new Image();
    let enemiespic2     = new Image();

    backgroundImage.src = "Img/background-pic.jpg";
    naveImage.src       = "Img/spaceship-pic.png";
    //Imagen de las naves
    enemiespic1.src     = "Img/enemigo1.png";
    enemiespic2.src     = "Img/enemigo.png"; 
    
    //ancho y alto del lienzo
    let canvaW =ctx.canvas.width;
    let canvaH = ctx.canvas.height;

    //Función retorna la descripción de cada nave enemiga.
    let enemyTemplate = function(options){
        return {
            id:options.id || '',
             x:options.x  || '',
             y:options.y  || '',
             w:options.w  || '',
             h:options.h  || '',
             image : options.image || enemiespic1
        }
    }

    //Arreglo que almacena la cantidad de naves enemigas
    var enemies = [
                   new enemyTemplate({id: "enemy 1", x: 100, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy 2", x: 225, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy 3", x: 350, y: -20, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy 4", x:100,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy 5", x:225,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy 6", x:350,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy 7", x:475,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy 8", x:600,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy 9", x:475,  y:-20,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy 10",x: 600, y: -20, w: 50, h: 30}),
                   // Segundo grupo de enemigos.
                   new enemyTemplate({ id: "enemy 11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy 20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
    ];

    //Mostrar la nave en la pantalla
    let renderEnemies = function(enemyList){
        for(var i = 0; i < enemyList.length; i++){
            var enemy = enemyList[i];
            //Muestra una imagen predefinida por canvas
            ctx.drawImage(enemy.image, enemy.x, enemy.y += .4, enemy.w, enemy.h);
            launcher.hitDetectLowerLevel(enemy);
        }
    }

    function launcher(){
        this.y = 500,
        this.x = canvaW*.5 -25,
        this.w = 100,
        this.h = 100,
        this.speed = 0,//nueva propiedad para controlar la velocidad
        this.maxSpeed = 5,//velocidad maxima
        this.acceleration = .2,//aceleración gradual
        this.friction= 0.95, //Friccion para frenar la nave
        this.direccion,
        this.bg = "White",
        //Arreglo para balas que van a ser disparadas
        this.misiles = [];

        //Mensaje para el jugador cuando pierde su partida
        this.gameStatus = {
            over:false,
            message: "",
            fillStyle: 'red',
            font:'italic bold 36px Arial, sans-serif'
        }

        this.render = function(){
            //Aplicar fricción para reducir la velocidad gradualmente
            this.speed += this.friction;
            //Si la velocidad es muy pequeña, detener completamente
            if(Math.abs(this.speed) < .1) this.speed = 0;

            //Mover la nave segun la velocidad actual
            if(this.direccion === 'left'){
                this.speed = -this.maxSpeed;
            } else if(this.direccion === 'right'){
                this.speed = -this.maxSpeed;
            }else if(this.direccion === 'downArrow'){
                this.y += 3; // Movimiento vertical más lento
            }else if(this.direccion === 'upArrow'){
                this.y -= 3; // Movimiento vertical más lento
            }

            //Aplicar el movimiento hhorizontal
            this.x += this.speed;
            //Limites del canvas
            if(this.x < canvaW* .2 -130){
                this.x =  canvaW*.2 -130;
                this.speed = 0;
            }
            if(this.x > canvaW -110){
                this.x = canvaW -110;
                this.speed = 0;
            }
            if(this.y < canvaH* .2 -80){
                this.y = canvaH* .2 -80;
            }
            if(this.y > canvaH -110){
                this.y = canvaH -110;
            }

            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10);
            ctx.drawImage(naveImage, this.x, this.y, 100, 90);//Centrar las balas salgan del centro de la nave

            for (var i = 0; i < this.misiles.length;  i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y -= 5, m.w, m.h);
                this.hitDetect(m, i); //detecta el golpe de la bala contra el enemigo

                if(m.y <= 0){ //Si la bala pasa los limites del lienzo, retirelo
                    this.misiles.splice(i, 1)
                }
            }

            //Mensaje para el ganador del juego
            if(enemies.length === 0){
                clearInterval(animateInterval);
                ctx.fillStyle = 'orange';
                ctx.font = this.gameStatus.font;
                ctx.fillText('You win!', canvaW + .5 -440, 50);
            }
        }
        //Detectar Impacto de la bala
        this.hitDetect = function(m, mi){
            for(var i = 0; i < enemies.length; i++){
                var e = enemies[i];
                if(m.x <= e.x + e.w && m.x + m.w >= e.x &&
                    m.y >= e.y && m.y <= e.y + e.h){
                    enemies.splice(i, 1); //Elimina al enemigo al que impacto el misil
                    document.querySelector('.barra').innerHTML = "Destroyed " + e.id;
                }
            }
        }

        //Jugamos con las coordenadas x,y para saber cuando se chocan las naves y se estrellan para acabar el juego.
        this.hitDetectLowerLevel= function (enemy){
            //Si la ubicación de la nave es mayor que 550 entonces sabemos que paso un nivel inferior.
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'Enemy (s) have passed! '
            }

            //Si el enemy.y es mayor que this.y entonces -25 sabemos que hay colisión.
            //si el enemy.x es menor que this.x entonces +45 y el enemy.x es menor qeu this.x sabemos que hay una colisión
            if((enemy.y < this.y +25 && enemy.y > this.y -25) &&
               (enemy.x < this.x +45 && enemy.x > this.x -45)){
                this.gameStatus.over = true;
                this.gameStatus.message = 'You Died!';
            }
            if(this.gameStatus.over === true){
                clearInterval(animateInterval);
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;

                ctx.fillText(this.gameStatus.message, canvaW* .5 -80, 50);
            }
        }
    } 

    var launcher = new launcher();
    //Función para mostrar a todos los enemigos
    function animate(){
        //clearRect Funcion predefinida de canva para mostrar las imagenes de manera más limpia
        ctx.clearRect(0,0,canvaW,canvaH);
        launcher.render();
        renderEnemies(enemies);
    }

    let animateInterval = setInterval(animate, 6)
    let left_btn  = document.getElementById('left_btn');
    let right_btn = document.getElementById('right_btn');
    let fire_btn  = document.getElementById('fire_btn');

    //Asignamos el movimiento de la tecla flecha izquierda
    document.addEventListener('keydown', function(e){
        // flecha a la izquierda
        if(e.keyCode === 37){   
            launcher.direccion = 'left';
            //evita salirnos del lienzo 
            if(launcher.x < canvaW* .2 -130){
                launcher.x +=0;
                launcher.direccion = '';
            }
        }
    });

    //Asignamos movimiento mediante la tecla flecha arriba
    document.addEventListener('keyup', function(e){
        if(e.keyCode === 38){
            launcher.x += 0;
            launcher.direccion = '';
        }
    });

    //Asignamos movimeinto a la tecla flecha derecha
    document.addEventListener('keydown', function(e){
        if(e.keyCode === 39){  //tecla hacia abajo
            launcher.direccion = 'right';
            if(launcher.x > canvaW - 110){
                launcher.x -= 0;
                launcher.direccion = '';
            }
         }
    });

    //asignamos movimiento a la tecla flecha abajo
    document.addEventListener('keyup', function(e){
        if(e.keyCode === 40){  //tecla hacia arriba
           launcher.x -= 0;
           launcher.direccion = '';
        }
    });

    //Asignamos movimiento mediante la tecla flecha arriba
    document.addEventListener('keydown', function(e){
        if(e.keyCode === 38){
            launcher.direccion = 'upArrow';
            if(launcher.y < canvaH*.2 -80){
                launcher.y += 0;
                launcher.direccion = 0;
            }            
        }
    });

    document.addEventListener('keyup', function(e){
        if(e.keyCode === 38){  //cuando no presiona tecla o boton
            launcher.y -= 0;
            launcher.direccion = '';             
        }
    });
    
    document.addEventListener('keydown', function(e){
        if(e.keyCode === 40){
            launcher.direccion = 'downArrow';
            if(launcher.y > canvaH -110){
                launcher.y -= 0;
                launcher.direccion = '';
            }            
        }
    });

     document.addEventListener('keyup', function(e){
        if(e.keyCode === 40){ //tecla arriba
            launcher.y +=0;
            launcher.direccion = '';
            
        }
    });

    document.addEventListener('keydown', function(e){
        //Reiniciar juego con tecla P
        if(e.keyCode === 80){ 
            location.reload();
        }
    });

    //Control botones
    left_btn.addEventListener('mousedown', function(e){
        launcher.direccion = 'left';
    });
    
    left_btn.addEventListener('mouseup', function(e){
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(e){
        launcher.direccion = 'right';
    });
    
    right_btn.addEventListener('mouseup', function(e){
        launcher.direccion = '';
    });

    //Funcionalidad a boton de Fire Missile o balas
    fire_btn.addEventListener('mousedown', function(e){
        launcher.misiles.push({
                x:launcher.x + launcher.w * .5,
                y:launcher.y,
                w:3,
                h:10
            });
    });

    //Lanza los misiles con la tecla espaciadora
    document.addEventListener('keydown', function(e){
        if(e.keyCode === 32){
            launcher.misiles.push({
                x:launcher.x + launcher.w * .5,
                y:launcher.y,
                w:3,
                h:10
            });
        }
    });
}
//Funcion muestra pagina cuando se ejecuta la funcion de nuestra página
window.addEventListener('load', function(e){
    initCanvas();
});