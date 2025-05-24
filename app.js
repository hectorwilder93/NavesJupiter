//Creamos la función para inicializar el proyecto
function initCanvas(){
    let ctx = document.getElementById('my_canvas').getContext('2d');
    let backgroundImage = new Image();//Imagen de fondo
    let naveImage       = new Image();//Nave del jugador
    let enemiespic1     = new Image();//Nave enemiga 1
    let enemiespic2     = new Image();//Nave enemiga 2

    backgroundImage.src = "Img/background-pic.jpg"; //Asignar una imagen al fondo mediante el atributo source.
    naveImage.src       = "Img/spaceship-pic.png"; //Asignar una imagen a la nave jugador
    //Imagen de las naves
    enemiespic1.src     = "Img/enemigo1.png"; //Se asigna la imagen enemiga a una imagen
    enemiespic2.src     = "Img/enemigo.png"; //se asigna la imagen enemiga a una imagen
    
    //ancho y alto del lienzo
    let canvaW =ctx.canvas.width; //Se asigna el ancho del lienzo
    let canvaH = ctx.canvas.height; // se asigna el alto del lienzo

    //Función retorna la descripción de cada nave enemiga.
    //Objeto con propiedades de tamaño e imagen
    let enemyTemplate = function(options){
        return {
            id:options.id || '',
             x:options.x  || '',
             y:options.y  || '',
             w:options.w  || '',
             h:options.h  || '',
             image : options.image || enemiespic1 //Asignamos la imagen a dicho objeto
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

    //Mostrar la nave enemiga en la pantalla
    let renderEnemies = function(enemyList){
        for(var i = 0; i < enemyList.length; i++){
            var enemy = enemyList[i];
            //Muestra una imagen predefinida por canvas
            ctx.drawImage(enemy.image, enemy.x, enemy.y += .4, enemy.w, enemy.h);
            launcher.hitDetectLowerLevel(enemy);
        }
    }

    //Logica del jugador
    function launcher(){
        this.y = 500,
        this.x = canvaW*.5 -25,//Posicion inicial centrada
        this.w = 100,
        this.h = 100,
        this.speed = 0,//nueva propiedad para controlar la velocidad
        this.maxSpeed = 5,//velocidad maxima
        this.acceleration = .2,//aceleración gradual
        this.friction= 0.95, //Friccion para frenar la nave
        this.direccion,
        this.bg = "White",
        //Arreglo para balas que van a ser disparadas
        this.misiles = [];//Array para misiles disparados

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

            //Aplicar el movimiento horizontal
            this.x += this.speed;
            //Limites del canvas
            if(this.x < canvaW*.2 -130){
                this.x =  canvaW*.2 -130;
                this.speed = 0;
            }
            if(this.x > canvaW -110){
                this.x = canvaW -110;
                this.speed = 0;
            }
            if(this.y < canvaH*.2 -80){
                this.y = canvaH*.2 -80;
            }
            if(this.y > canvaH -110){
                this.y = canvaH -110;
            }

            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10);
            ctx.drawImage(naveImage, this.x, this.y, 100, 90);//Hace que las balas salgan del centro de la nave

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
            if(enemy.y > 650){
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

    let animateInterval = setInterval(animate, 12)
    //Control de teclado
    const keys = {
        left:false,
        right:false,
        up:false,
        down:false
    }

    //Eventos de teclado y botones
    document.addEventListener('keydown', function(e){
        switch(e.keyCode){
            case 37: //izquierda
            keys.left = true;
            launcher.direccion = 'left';
            break;
            case 39: //derecha
            keys.right = true;
            launcher.direccion = 'right';
            break;
            case 38: //arriba
            keys.up = true;
            launcher.direccion = 'upArrow';
            break;
            case 40: //Abajo
            keys.down = true;
            launcher.direccion = 'downArrow';
            break;
            case 32: //espacio
            launcher.misiles.push({
                x:launcher.x + launcher.w * .5,
                y:launcher.y,
                w:3,
                h:10
            });
            break;
            case 80: //tecla P para reiniciar juego
            location.reload();
            break;
        }
    });

    //Asignamos las teclas para el movimiento
    document.addEventListener('keyup', function(e){
        switch(e.keyCode) {
            case 37: //izquierda
                keys.left = false;
                if(!keys.right) launcher.direccion= '';
                break;
            case 39: //derecha
                keys.right = false;
                if(!keys.left) launcher.direccion= '';
                break;               
            case 38: //arriba
                keys.up= false;
                if(!keys.down) launcher.direccion = '';
                break;
            case 40: //abajo
                keys.down = false;
                if(!keys.up) launcher.direccion = '';
                break;               
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

    //Funcionalidad a boton de Fire Misiles o balas
    fire_btn.addEventListener('mousedown', function(e){
        launcher.misiles.push({
                x:launcher.x + launcher.w * .5,
                y:launcher.y,
                w:3,
                h:10
            });
    });    
}

//Funcion muestra pagina cuando se ejecuta la funcion de nuestra página
window.addEventListener('load', function(e){
    initCanvas();
});