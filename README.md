# wp-boiler-plate

wordpressテーマ開発用ボイラープレート

## 準備

### node module のインストール

リポジトリをチェックアウトした後

```
$ npm install
```

を実行して必要なモジュールをインストールします。

node.js環境が必要です。

### Dockerの起動準備

コメントアウトを解除してwordpressのテーマフォルダ名を記述してください。

```
services:
  wordpress:
    volumes:
      # - ./theme:/var/www/html/wp-content/themes/theme-name # テーマ名を指定してください。
```

`docker-compose.yml` にあらかじめ `container_name` を指定しておくと便利です。

#### 初期DB

`db_data/data` にsqlファイルを設置しておくと、コンテナ作成時にデータベースが初期化されます。

## 開発環境について

### スクリプト

```
# Dockerコンテナの通常起動
$ npm start

# ソース監視とDockerコンテナの起動
$ npm run dev

# Dockerコンテナの終了
$ npm stop

# Dockerコンテナの終了と削除
$ npm run down

# wp-cliへのアクセス
$ npm run cli

# ソース監視の起動
$ npm run watch

# 'src' の内容からJS/CSS/画像を最適化してテーマディレクトリを作成
$ npm run build
```

Dockerコンテナを起動すると http://localhost:8080 から確認できるようになります。管理画面は http://localhost:8080/wp-admin から確認できます。

`$ npm run dev` または `$ npm run watch` コマンドでソース監視を起動させると `src` の修正内容がすぐに `dev/wp-content/themes/(テーマファイル名)` 内に反映されます（scssファイルのコンパイル・JSのwebpack・画像の最適化）。

### 開発環境用WordPressプラグイン

`$ npm run plugin` コマンドで開発環境にプラグインがインストールされます。

インストールされる内容は `plugins.yml` に定義されています。定義を変更したときは再度プラグインのインストールを行ってください。ただし、管理画面やwp-cliからプラグインの追加・更新をした場合、インストール後は定義された状態まで巻き戻ってしまうので注意してください。

```plugins.yml
-
  name: plugin name # プラグイン名です(オプション)
  slug: plugin-name # wordpress.org に登録されているプラグインのスラッグ名です(必須)
  version: '0.0.0' # プラグインのバージョンです
  url: https://downloads.wordpress.org/plugin/plugin-name.0.0.0.zip # プラグインのダウンロード元です(オプション)
```

公式配布サイトにプラグインがない場合は、配布元の `url` を指定します。 `url` の指定がない場合は、スラッグとバージョン番号を基準にして `downloads.wordpress.org` からプラグインを取得します。バージョンの指定がない場合、最新版のプラグインをダウンロードします。

wordpress.orgで配布されていない、またはオリジナルのプラグインファイルは `./plugins` フォルダにzipファイルを直接配置してください。`$ npm run plugin` するとwordpressに展開されます。

## ファイル構成

```
.
├ db_data/
│ ├ data/ (データベース永続化ファイル)
│ └ init/initial.sql (初期データベース内容)
├ dev/ (Docker環境の /var/www/html/wp-content/theme/(theme) がそのままマウントされる)
├ dist/ (最適化されたテーマファイル)
├ plugins/ (wordpress.orgで配布されていないプラグインを格納する)
├ src/ (js/css/画像のオリジナル)
│ ├ asset/
│ │ ├ css/style.styl (コンパイル対象stylusファイル)
│ │ ├ image (画像の格納先)
│ │ └ js/main.js (esbuildのエントリーポイント)
│ └ *.pug (phpに変換される)
├ tasks/ (タスク設定)
├ uploads/ (/var/www/html/wp-content/uploads にマウントされる)
├ www/ (/var/www/html にマウントされる)
│ └ wp-config.php (開発環境用wp-config)
├ .browserslistrc (autoprefixer設定)
├ .editorconfig (エディタ制御)
├ .eslintignore (eslint無視設定)
├ .eslintrc (eslint/prettier設定)
├ .gitignore
├ docker-compose.yml
├ package-lock.json
├ package.json
├ plugins.yml (開発環境用WordPressプラグインの定義)
└ README.md
```
