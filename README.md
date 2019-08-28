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

### WordPressのプラグイン及びライブラリのインストール

モジュールの追加後

```
$ npm run init
```

を実行してライブラリ類と必要なWordPressプラグインをインストールします。

必要なライブラリ類は `gulpfile.js` にあらかじめ指定します。

```gulpfile.js
const LIB = [
  {
    src: 'node_modules/jquery/dist/jquery.min.js',
    dist: 'assets/js/jquery'
  },
  ...
]
```

また、 `package.json` の `name` `homepage` `author.name` `description` `version` がそれぞれ[WordPressのテーマスタイルシート](https://wpdocs.osdn.jp/%E3%83%86%E3%83%BC%E3%83%9E%E3%81%AE%E4%BD%9C%E6%88%90#.E3.83.86.E3.83.BC.E3.83.9E.E3.82.B9.E3.82.BF.E3.82.A4.E3.83.AB.E3.82.B7.E3.83.BC.E3.83.88)に反映されます。


### Dockerの起動準備

コメントアウトを解除してwordpressのテーマフォルダ名を記述してください。

```
services:
  wordpress:
    volumes:
      # - ./theme:/var/www/html/wp-content/themes/theme-name # テーマ名を指定してください。
```

`docker-compose.yml` にあらかじめ `container_name` を指定しておくと便利です。


## 開発環境について

### スクリプト

```
# Dockerコンテナの通常起動
$ npm run up

# ソース監視とDockerコンテナの起動
$ npm start

# Dockerコンテナの終了
$ npm stop

# Dockerコンテナの終了と削除
$ npm run down

# wp-cliへのアクセス
$ npm run cli

# ソース監視の起動
$ npm run watch

# 'src' の内容をテーマに反映
$ npm run dist
```

Dockerコンテナを起動すると http://localhost:8080 から確認できるようになります。管理画面は http://localhost:8080/wp-admin から確認できます。

`$ npm start` または `$ npm run watch` コマンドでソース監視を起動させると `src` の修正内容がすぐに `dev/wp-content/themes/(テーマファイル名)` 内に反映されます（scssファイルのコンパイル・JSのwebpack・画像の最適化）。

### 開発環境用WordPressプラグイン

`$ npm run plugin` または `$ npx gulp installPlugins` コマンドで開発環境にプラグインがインストールされます。

インストールされる内容は `plugins.yml` に定義されています。定義を変更したときは再度プラグインのインストールを行ってください。ただし、管理画面やwp-cliからプラグインの追加・更新をした場合、インストール後は定義された状態まで巻き戻ってしまうので注意してください。

```plugins.yml
-
  name: plugin name # プラグイン名です(オプション)
  slug: plugin-name # wordpress.org に登録されているプラグインのスラッグ名です(必須)
  version: '0.0.0' # プラグインのバージョンです
  url: https://downloads.wordpress.org/plugin/plugin-name.0.0.0.zip # プラグインのダウンロード元です(オプション)
```

公式配布サイトにプラグインがない場合は、配布元の `url` を指定します。 `url` の指定がない場合は、スラッグとバージョン番号を基準にして `downloads.wordpress.org` からプラグインを取得します。バージョンの指定がない場合、最新版のプラグインをダウンロードします。

wordpress.orgで配布されていない、またはオリジナルのプラグインファイルは `./plugins` フォルダにzipファイルを直接配置してください。インストール時に展開されます。

## ファイル構成

```
.
├── db_data/
│   └── init/
│       └── initial.sql (初期データベース内容)
├── dev/ (Docker環境の /var/www/ がそのままマウントされる)
├── plugins/ (wordpress.orgで配布されていないプラグインを格納する)
├── node_modules/ (各nodeモジュール)
├── src/ (js/css/画像のオリジナル)
│   └── asset/
│       └── js/
│           └── main.js (webpackのエントリーポイント)
├── tasks/ (gulpタスクの設定)
├── theme/ (実運用時のテーマファイル群 => /var/www/wp-content/themes/(テーマ名) にマウントされる)
├── uploads/ (/var/www/wp-content/uploads にマウントされる)
├── .babelrc
├── .browserslistrc (autoprefixer設定)
├── .editorconfig (エディタ制御)
├── .eslintignore (eslint無視設定)
├── .eslintrc (eslint/prettier設定)
├── .gitignore
├── docker-compose.yml
├── gulpfile.js (gulpタスクの定義)
├── package-lock.json
├── package.json
├── plugins.yml (開発環境用WordPressプラグインの定義)
├── webpack.config.js (webpack設定)
└── README.md
```
