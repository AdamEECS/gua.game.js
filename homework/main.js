var loadLevelsFromDb = function () {
    if (localStorage.levels === undefined) {
        localStorage.levels = JSON.stringify(initLevels)
    }
    var levels = JSON.parse(localStorage.levels)
    return levels
}

var saveLevelsToDb = function (level, block, x, y) {
    var levels = loadLevelsFromDb()
    level -= 1
    levels[level][block][0] = x
    levels[level][block][1] = y
    localStorage.levels = JSON.stringify(levels)
}

var loadLevel = function(game, n) {
    n = n - 1
    var levels = loadLevelsFromDb()
    var level = levels[n]
    var blocks = []
    for (var i = 0; i < level.length; i++) {
        var p = level[i]
        var b = Block(game, p)
        blocks.push(b)
    }
    return blocks
}

var enableDebugMode = function(game, enable) {
    if(!enable) {
        return
    }
    window.paused = false
    window.addEventListener('keydown', function(event){
        var k = event.key
        if (k == 'p') {
            // 暂停功能
            window.paused = !window.paused
        } else if ('1234567'.includes(k)) {
            // 为了 debug 临时加的载入关卡功能
            game.scene.blocks = loadLevel(game, Number(k))
            game.scene.level = Number(k)
        }
    })
    // 控制速度
    document.querySelector('#id-input-speed').addEventListener('input', function(event) {
        var input = event.target
        // log(event, input.value)
        window.fps = Number(input.value)
    })
}

var __main = function() {
    var images = {
        ball: 'img/ball.png',
        block: 'img/block.png',
        paddle: 'img/paddle.png',
    }
    var game = GuaGame.instance(30, images, function(g){
        var s = SceneTitle.new(g)
        g.runWithScene(s)
    })

    enableDebugMode(game, true)
}

__main()
