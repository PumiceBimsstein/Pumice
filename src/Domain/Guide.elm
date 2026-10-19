module Domain.Guide exposing (defaultAppState)

import Type exposing (..)
import Domain.Helper exposing (extractHeadings)

{-| 初期起動時のデフォルトAppState -}
defaultAppState : AppState
defaultAppState =
    let
        firstPageContent =
            guidePage1.content
    in
    { shelves = [ guideShelf ]
    , currentShelfId = "guide-shelf"
    , currentBookId = Just "guide-book"
    , currentPageIndex = 0
    , currentHeading = 
        extractHeadings 0 firstPageContent 
            |> List.map .text
    }


guideShelf : Shelf
guideShelf =
    { id = "guide-shelf"
    , name = "ガイド"
    , books = [ guideBook ]
    }


guideBook : Book
guideBook =
    { id = "guide-book"
    , title = "クイックスタートガイド"
    , pages = [ guidePage1, guidePage2, guidePage3 ]
    }


guidePage1 : Page
guidePage1 =
    { id = "guide-page-1"
    , title = "ようこそ"
    , content = """# ようこそ

このアプリは、本棚・本・ページという3つの層でMarkdown文書を整理・閲覧・編集できるノートアプリです。データはブラウザに保存され、ダウウンロードしてPCに保存することもできます。

**サーバー通信なし**

**AI機能なし✨**

## 主な特徴

- **階層管理**: 「本棚」の中に「本」を作り、「ページ」単位で閲覧・編集できます。
- **閲覧・編集画面の同期**: 閲覧モード（VIEW）と編集モード（EDIT）を切り替えても、表示される位置が概ね保たれます。
- **目次ジャンプ**: サイドバーの目次から、各見出しへ直接ジャンプできます。

## 画面の見方

1. **左サイドバー**: 本棚の一覧、本の一覧、目次を切り替えられます。
2. **フッター（下部）**: シークバーでページを前後にめくることができます。
3. **右サイドバー**: テーマ切り替え、文字サイズ、エクスポートなどが行えます。
"""
    }


guidePage2 : Page
guidePage2 =
    { id = "guide-page-2"
    , title = "操作のヒント"
    , content = """# 操作のヒント

## ページの切り替え方法
- VIEWモードでのみ、矢印キー（←/→）。
- フッターのシークバーをクリック。
- **フッターのシークバーの上でマウスホイール操作。**
- 右サイドバー下部のアイコンをクリック。またはその付近でのマウスホイール操作。
- 右サイドバーの何もない部分でマウスホイール操作。

## 目次の表示切り替え
- サイドバーの下部のセレクターで、目次として表示するマークダウンの見出しを「見出し1 (H1)」から「見出し3 (H3)」まで切り替えられます。

## ページの入れ替え
- 右サイドバーの「PAGES」で、マウス操作によるページの入れ替え、複製、追加、削除ができます。

## ページの追加と削除
- 右サイドバーの **「+ Next Page」** をクリックすると、次のページが作成されます。
- 不要になったページは、編集モード（EDIT）時のフッターにある削除ボタンから削除できます。

## インポートとエクスポート
- テキストファイルやMarkdownファイルをドラッグ＆ドロップすると、新規ページとして取り込めます。
- 本棚や本は、ZIP形式やJSON形式で読み込み・書き出しが可能です。
- **左サイドバー下部のアイコンをクリックすると、全データのバックアップファイルがダウンロードされます。**
"""
    }


guidePage3 : Page
guidePage3 =
    { id = "guide-page-3"
    , title = "その他の機能"
    , content = """# その他の機能

## コードハイライト
- コードブロック内はいくつかの言語でハイライトが付きます。




## 数式レンダリング
- LaTeX形式の数式をレンダリングします。
- 不要になったページは、編集モード（EDIT）時のフッターにある削除ボタンから削除できます。



""" ++ content
    }


content : String
content = "### 数式として記述する方法\n\n※ EDITモードで確認してください。\n\n\n$$\nG_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}\n$$\n\n\n```math\nL = \\frac{1}{2}m\\dot{x}^2 - \\frac{1}{2}kx^2\n```\n\nインラインの書き方：$L(q, \\dot{q}, t) = T - V$\n\nガウスの法則：`math \\nabla \\cdot \\mathbf{B} = 0`\n\nシュレーディンガー方程式：\\(\\^{H}\\psi =E\\psi \\)\n\n種類が多いのはAIによって数式ブロックの記述方法が異なるためです。"
