class SceneTitle extends GuaScene {
    constructor(game) {
        super(game)
        game.registerAction('k', function(){
            var s = Scene(game)
            game.replaceScene(s)
        })
        game.registerAction('b', function(){
            var s = SceneEditor(game)
            game.replaceScene(s)
        })
    }
    draw() {
        // draw labels
        this.game.context.fillStyle = "#554"
        this.game.context.fillText('按 k 开始游戏', 150, 120)
        this.game.context.fillText('按 b 编辑关卡', 150, 150)
    }
}
