# Online Denpo Current Spec

最終更新: 2026-03-20

## 概要

黒い本革調の表紙を持つオンライン電報です。表紙を開くと本文が表示され、一定時間後に自動スライドが始まります。手動スライドを行った時点で自動スライドは停止し、現時点では再開しません。

## 画面構成

### 1. ローディング画面

- `lexus-loading.js` を使用
- 背景は黒
- 中央に `lexus_logo_white.png` を表示
- ロゴ下に白いラインアニメーションを表示
- 最低 1.5 秒は表示
- `window.load`、ロゴ画像の読み込み完了、最低表示時間の3条件を満たした後にフェードアウト

### 2. メイン画面

- 本を中央に表示
- 左ページに本文
- 右側に表紙
- 初期表示では本は閉じた状態

### 3. 表紙

- 黒い本革調テクスチャを使用
- 表紙文字は金色
- 下部中央に `lexus_logo_white.png` を配置
- 表紙文言:
  - レクサス岡崎
  - ゼネラルマネージャー
  - 牧 宏樹
- 下部に `タップで開く` 表示

## 本文仕様

- 本文データは `Honbun.txt` から取得
- 改行は `<br>` に変換して表示
- 本文末尾に `makihiroki.jpg` を表示
- 本文は縦書き
- 背景は和紙テクスチャ
- 本文は CSS transform による横方向スライドで表示

## アニメーション仕様

### 表紙オープン

- 表紙クリックまたはタップで開く
- 本体に `open` クラスを付与
- 表紙に `open` クラスを付与
- 本文をフェードイン表示

### 自動スライド

- 表紙オープン後、約 4.5 秒後に開始
- スライド速度は `0.25px / frame`
- 終端まで到達したら自動停止

## 手動スライド仕様

### 現在の仕様

- 表紙を開いた直後は手動操作禁止
- 自動スライド開始後にのみ手動操作可能
- 手動操作を一度でも行うと自動スライドは停止
- 停止後は再開しない

### 対応している手動操作

- PC:
  - マウスドラッグ
  - ホイール
  - トラックパッド横スクロール
- スマホ/タブレット:
  - Pointer Events 対応環境ではポインタードラッグ
  - 非対応環境では `touchstart` / `touchmove` / `touchend` フォールバック

### 現在未解決の課題

- iPhone 実機で手動スライドが動かない可能性がある
- PC の開発者ツールによるスマホエミュレーションでは動作するケースあり
- キャッシュ対策として JS/CSS にはバージョン付き URL を付与済み
- 原因候補:
  - Safari のタッチイベント制御差異
  - 3D 変形レイヤー上でのイベント取得
  - 表紙クリック処理との干渉

## フォント仕様

### 通常時

- 既定フォントはロダン系優先
- 指定順:
  - `FOT-ロダン Pro DB`
  - `FOT-NewRodin Pro DB`
  - `Rodin Pro DB`
  - `Rodin`
  - 代替 sans-serif

### 書体見本モード

- URL クエリに `font_sample=true` がある場合のみ書体切替 UI を表示
- `font_sample=true` が無い場合は非表示
- クエリ `font=` で初期書体指定可能

### 切替可能な書体

- `mincho`: Shippori Mincho
- `rodin`: Rodin 系優先
- `gyosho`: Yuji Syuku
- `modern`: Zen Old Mincho
- `elegant`: Klee One

### フォント読み込み

- Web フォントは Google Fonts を利用
- ロダンは無料 Web フォント配信ではなく、端末または別途配信設定がある場合に適用

## クエリパラメータ仕様

### `font_sample`

- `true` の場合のみ書体見本 UI を表示

### `font`

- `font_sample=true` 時の初期フォント指定
- 使用可能値:
  - `mincho`
  - `rodin`
  - `gyosho`
  - `modern`
  - `elegant`

## キャッシュ対策

- `index.html` から読み込むアセットにはバージョン文字列を付与
- 現在の付与対象:
  - `style.css`
  - `lexus-loading.js`
  - `script.js`
- `Honbun.txt` は取得時にタイムスタンプ付きクエリを付与

## 使用アセット

- `Honbun.txt`
- `makihiroki.jpg`
- `washi.jpg`
- `black-leather-texture.jpg`
- `lexus_logo_white.png`
- `lexus-loading.js`

## 実装ファイル

- `index.html`
- `style.css`
- `script.js`
- `lexus-loading.js`

## 今後の想定改修

- iPhone 実機での手動スライド不具合修正
- 手動操作後の自動スライド再開機能
- ロダンの正式な Web フォント配信導入
- 書体見本 UI のデザイン改善
