use axum::{
    extract::{Query, State},
    response::Html,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use tauri::{AppHandle, Emitter, Runtime};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_shell::{open::Program, ShellExt};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust LOOOL!", name)
}

async fn root<R: Runtime>(app: State<AppHandle<R>>) -> Html<&'static str> {
    const BODY: &str = r##"
<html>
<head>
<title>Hello</title>
<script type="text/javascript">
const oauthHash = location.hash.slice(1);
const oauthToken = oauthHash
  .slice(oauthHash.indexOf("access_token="))
  .split("&")[0]
  .split("=")[1];
console.log(oauthToken);
fetch("http://localhost:6969/token", {
    method: "POST",
    body: JSON.stringify({
        token: oauthToken,
    }),
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
});
</script>
</head>
<body>
XD
</body>
</html>
"##;
    app.emit("visit", "xd").unwrap();
    Html(BODY)
}

#[derive(Deserialize, Debug)]
struct Token {
    token: String,
}

async fn token<R: Runtime>(app: State<AppHandle<R>>, token: Json<Token>) -> &'static str {
    println!("got token: {token:?}");
    app.emit("got_token", token.token.clone()).unwrap();
    "thx"
}

#[tauri::command]
fn begin_twitch_oauth<R: Runtime>(app: AppHandle<R>) {
    let app2 = app.clone();
    tokio::spawn(async move {
        let app2 = app2;
        let server = Router::new()
            .route("/", get(root))
            .route("/token", post(token))
            .with_state(app2);

        let listener = tokio::net::TcpListener::bind("127.0.0.1:6969")
            .await
            .unwrap();
        axum::serve(listener, server).await.unwrap();
    });

    app.shell().open("https://id.twitch.tv/oauth2/authorize?client_id=nig134os1dj3ne94ozmadhd2cvwvcw&redirect_uri=http://localhost:6969&response_type=token&scope=", None).unwrap();
}

#[tauri::command]
fn select_file<R: Runtime>(app: AppHandle<R>) -> String {
    let app2 = app.clone();
    app.dialog().file().pick_file(move |chosen_file| {
        if let Some(chosen_file) = chosen_file {
            match app2.emit("file_chosen", chosen_file.to_string()) {
                Ok(_) => println!("successfully emitted!!"),
                Err(e) => println!("error emitting: {e:?}"),
            }
        } else {
            println!(" no file chosen");
        }
    });

    "sad".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            select_file,
            begin_twitch_oauth
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
