import { invoke } from "@tauri-apps/api/core";

export default function TwitchLogin() {
    return (
        <>
            <button type="button" onClick={(e) => {
                e.preventDefault();
                invoke("begin_twitch_oauth");
            }}>Log in with Twitch</button>
        </>
    );
}
