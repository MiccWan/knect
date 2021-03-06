# [109-1] Web Programming Final 
## Group 34 - Knect

* Deploy 連結：http://knect.csie.org

* Demo 連結：https://youtu.be/-8s2DVfsI7M

### 簡介

一個線上平台，讓使用者可於線上遊玩 Connect Four 的 3D 版本。

### 如何測試

1. 要在開發環境測試，需要於 server 資料夾新增 .env 內容如下
```
MONGO_URL=<YOUR TESTING MONGO URL>
```

2. 第一次執行前請於 root folder 使用 yarn 安裝 dependency
```
$ yarn
```

3. 於 root folder 使用 yarn start 將自動啟動前後端
```
$ yarn start
```

### 使用說明

* login:
玩家可以選擇一個 name 登入，或是 login as guest 讓伺服器隨機產生一個暫時性的名字給你使用。一旦 name 被使用了之後，該 name 就會被綁在此次登入的裝置當中，直到使用者選擇 logout 才會被清除。在這時間當中，其他裝置無法使用同一個 name 登入。
* lobby:
玩家可以在此創建房間、加入房間、查找房間。右上方會顯示目前在大廳的玩家列表，而右下方是一個可以與同在大廳的玩家聊天的聊天視窗。右上角有logout的按鍵。
* room:
玩家一開始進入房間預設是旁觀者模式，可以透過點選右上角的空位置來加入遊戲，當在位置上時可以點擊右上角的叉叉來離開遊戲。當紅綠雙方都都有人時遊戲就會開始。自己的顏色除了可以在右上方確定以外，遊戲界面的背景顏色也會是自己的顏色。
玩家可以在左半的遊戲視窗內輪流下棋，也可以於右下角的視窗中與同在這個房間內的玩家聊天，或是檢視歷史棋步，以及查看在此房間內的玩家列表。
* game：
遊戲主軸基本上和 connect four 一樣，然而我們將這個遊戲擴展到三維的空間中，遊戲的空間每個維度各有四格，共 64 格。因為重力影響，每列能夠下子的位置一定是最低的一格，以灰色標明。當四個角落的方塊代表自己的顏色在旋轉時，點擊顯示的灰色格子即可落子，最先將四子連成一線者獲勝。

### 使用之第三方套件

* 前端：React, material-ui, three.js
* 後端：socket.io, express, mongoose

### 製作心得

1. 陳冠宇：能在一個禮拜左右的時間內就把這個專案完成實在是滿不容易的。我們這次努力的把這份專案寫的容易擴充，希望以後還有機會能繼續加入更多功能。
1. 萬俊彥：其實本來就一直有在想把這個遊戲重構一遍，再加上房間和大廳等等功能，剛好藉著這次專題完成這個一直沒開始的夢想。看 legacy code 真的有一種翻黑歷史的感覺，完全不敢直視自己以前寫了什麼XD 總之對這次的結果算是很滿意，算是有練習到如何設計一個良好的雙向溝通架構，另外希望之後有空可以再補一些 UX 。
1. 陳希格：這次專題中，學到了很多多人協作一個專案時該注意的事項，還有如何保持專案的穩定性。

### 分工表

1. 萬俊彥：專案環境架設，程式碼架構規劃，除錯，輔助前端，後期測試，佈署至 Heroku。
1. 陳冠宇：完成後端結構，完成後端與前端溝通的各個邏輯部份，後期測試
1. 陳希格：完成前端頁面設計、實做。

### 其他說明

此遊戲規則沿用 [InforGo](https://github.com/TaWeiTu/InforGo) 中的規則。

### 對於此課程的建議

我覺得很棒，老師跟助教都很用心。
