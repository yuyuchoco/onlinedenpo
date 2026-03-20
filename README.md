# onlinedenpo

異動のご挨拶用の静的なオンライン電報ページです。`index.html` を起点に、`style.css`、`script.js`、画像素材、`Honbun.txt` をそのまま配信すれば動作します。

## 公開方法

このプロジェクトはビルド不要の静的サイトなので、`gaip.jp` サーバーへ静的ファイルをそのまま配置して公開します。

- 公開 URL: https://gaip.jp/onlinedenpo/idou_maki/
- SSH 接続: `ssh root@gaip.jp -p 8022`
- 配置先: `/var/www/gaip.jp/onlinedenpo/idou_maki/`

### 手順

1. SSH で `root@gaip.jp:8022` に接続する。
2. 配置先ディレクトリ `/var/www/gaip.jp/onlinedenpo/idou_maki/` を作成する。
3. このディレクトリ内の公開用ファイルを `rsync` で同期する。
4. `https://gaip.jp/onlinedenpo/idou_maki/` が `200 OK` を返すことを確認する。

### 更新方法

```bash
rsync -av --delete -e 'ssh -p 8022' \
  --exclude '.git/' \
  --exclude '.gitignore' \
  --exclude '.DS_Store' \
  --exclude '.vscode/' \
  --exclude 'README.md' \
  --exclude 'SPEC.md' \
  --exclude 'washi copy.jpg' \
  --exclude 'makihiroki.jpg_.jpg' \
  ./ root@gaip.jp:/var/www/gaip.jp/onlinedenpo/idou_maki/
```

同期後は、必要に応じて `curl -I https://gaip.jp/onlinedenpo/idou_maki/` で応答を確認します。キャッシュ対策が必要な場合は HTML/CSS/JS のクエリ文字列を更新します。
