# pacman_js_game
前端homework2
js吃豆人游戏
git pages 
https://wufei-png.github.io/pacman_js_game/
记一个奇怪的bug:
手机端打开多次点击startgame按钮发现时间加快了，原因是点击后没有removeEventListener，导致多次点击有多个计时器，因此commit修复了此bug.
此时手机端和edge打开github page发现均已经修复，但是使用之前我打开过的谷歌浏览器依旧有这个bug,过了一段时间好了，尚不清楚原因。或许是这两者使用的github服务器不同。
