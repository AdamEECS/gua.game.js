var Scene = function(game) {
    var s = {
        game: game,
        level: 1,
        blocks: [],
    }
    // 初始化
    var paddle = Paddle(game)
    var ball = Ball(game)

    var score = 0

    s.blocks = loadLevel(game, 1)

    game.registerAction('a', function(){
        paddle.moveLeft()
    })
    game.registerAction('d', function(){
        paddle.moveRight()
    })
    game.registerAction('f', function(){
        ball.fire()
    })

    s.draw = function() {
        // draw 背景
        game.context.fillStyle = "#554"
        game.context.fillRect(0, 0, 400, 300)
        // draw
        game.drawImage(paddle)
        game.drawImage(ball)
        // draw blocks
        for (var i = 0; i < s.blocks.length; i++) {
            var block = s.blocks[i]
            if (block.alive) {
                game.drawImage(block)
            }
        }
        // draw labels
        game.context.fillStyle = "#fff"
        game.context.fillText('分数: ' + score, 10, 290)
        game.context.fillText('关卡 ' + game.scene.level, 350, 290)
    }
    s.update = function() {
        if (window.paused) {
            return
        }

        ball.move()
        // 判断游戏结束
        if (ball.y > paddle.y) {
            // 跳转到 游戏结束 的场景
            var end = SceneEnd.new(game)
            game.replaceScene(end)
        }
        // 判断相撞
        if (paddle.collide(ball)) {
            // 这里应该调用一个 ball.反弹() 来实现
            ball.反弹()
        }
        // 判断 ball 和 blocks 相撞
        for (var i = 0; i < s.blocks.length; i++) {
            var block = s.blocks[i]
            if (block.collide(ball)) {
                // log('block 相撞')
                block.kill()
                ball.反弹()
                // 更新分数
                score += 100
            }
        }
    }

    // mouse event
    var enableDrag = false
    game.canvas.addEventListener('mousedown', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        // log(x, y, event)
        // 检查是否点中了 ball
        if (ball.hasPoint(x, y)) {
            // 设置拖拽状态
            enableDrag = true
        }
    })
    game.canvas.addEventListener('mousemove', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        // log(x, y, 'move')
        if (enableDrag) {
            // log(x, y, 'drag')
            ball.x = x
            ball.y = y
        }
    })
    game.canvas.addEventListener('mouseup', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        // log(x, y, 'up')
        enableDrag = false
    })

    return s
}

var SceneEditor = function(game) {
    var s = {
        game: game,
        level: 1,
        blocks: [],
    }

    var score = 0

    s.blocks = loadLevel(game, 1)

    game.registerAction('r', function(){
        var s = SceneTitle.new(game)
        game.replaceScene(s)
    })

    window.addEventListener('keypress', event => {
        // log('press:', event.key)
        if (event.key === '=') {
            s.addBlock()
        } else if (event.key === '-') {
            s.subBlock()
        }
        event.stopImmediatePropagation();
    })

    s.addBlock = function() {
        var levels = loadLevelsFromDb()
        var level = game.scene.level - 1
        // log('before add', level, levels[level])
        levels[level].push([0, 0])
        // log('after add', level, levels[level])
        localStorage.levels = JSON.stringify(levels)

        game.scene.blocks = loadLevel(game, game.scene.level)
    }

    s.subBlock = function() {
        var levels = loadLevelsFromDb()
        var level = game.scene.level - 1
        // log('before sub', level, levels[level])
        levels[level].pop()
        // log('after sub', level, levels[level])
        localStorage.levels = JSON.stringify(levels)

        game.scene.blocks = loadLevel(game, game.scene.level)
    }

    s.draw = function() {
        // draw 背景
        game.context.fillStyle = "#554"
        game.context.fillRect(0, 0, 400, 300)

        // draw blocks
        for (var i = 0; i < s.blocks.length; i++) {
            var block = s.blocks[i]
            if (block.alive) {
                game.drawImage(block)
            }
        }
        // draw labels
        game.context.fillStyle = "#fff"
        game.context.fillText('[=] 增加砖块  [-] 删除砖块  [r] 返回主界面', 10, 290)
        game.context.globalAlpha=0.1;
        game.context.font='80px Arial';
        game.context.fillText('关卡 ' + game.scene.level, 80, 180)
        game.context.font='10px Arial';
        game.context.globalAlpha=1;
    }
    s.update = function() {

    }

    // mouse event
    var enableDrag = false
    var draggingBlock
    game.canvas.addEventListener('mousedown', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        // log(x, y, event)
        // 检查是否点中了 ball
        for (var i = 0; i < s.blocks.length; i++) {
            var block = s.blocks[i]
            if (block.hasPoint(x, y)) {
                // 设置拖拽状态
                enableDrag = true
                draggingBlock = i
                // log('dragging', draggingBlock)
                break
            }
        }

    })
    game.canvas.addEventListener('mousemove', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        // log(x, y, 'move')
        if (enableDrag && draggingBlock !== undefined) {
            // log(x, y, 'drag', draggingBlock)
            var block = s.blocks[draggingBlock]
            block.x = x
            block.y = y
        }
    })
    game.canvas.addEventListener('mouseup', function(event) {
        var x = event.offsetX
        var y = event.offsetY

        if (enableDrag && draggingBlock !== undefined) {
            // log('mouseup', game.scene.level, draggingBlock, x, y)
            saveLevelsToDb(game.scene.level, draggingBlock, x, y)
        }

        enableDrag = false
        draggingBlock = undefined
    })

    return s
}
