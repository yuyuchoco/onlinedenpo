# onlinedenpo

異動のご挨拶用の静的なオンライン電報ページです。`index.html` を起点に、`style.css`、`script.js`、画像素材、`Honbun.txt` をそのまま配信すれば動作します。

## 公開方法

このプロジェクトはビルド不要の静的サイトなので、GitHub Pages で公開する方法を採用しています。

### 手順

1. GitHub に `onlinedenpo` リポジトリを作成する。
2. このディレクトリを `main` ブランチの内容として push する。
3. GitHub Pages を `Deploy from a branch` / `main` / `/(root)` で有効化する。
4. 数分待って公開 URL を確認する。

### 更新方法

```bash
git add .
git commit -m "Update site"
git push origin main
```

公開後は、必要に応じて HTML/CSS/JS のクエリ文字列を更新してキャッシュを切り替えます。
