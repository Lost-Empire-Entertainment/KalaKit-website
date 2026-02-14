//Copyright(C) 2026 Lost Empire Entertainment
//This program comes with ABSOLUTELY NO WARRANTY.
//This is free software, and you are welcome to redistribute it under certain conditions.
//Read LICENSE.md for more information.

#ifdef _WIN32
#include <windows.h>
#include <shlobj.h>
#endif

#include <iostream>
#include <filesystem>
#include <thread>
#include <chrono>

#include "KalaHeaders/log_utils.hpp"

#include "KalaServer/include/server/ks_server.hpp"
#include "KalaServer/include/server/ks_cloudflare.hpp"

#include "core/core.hpp"

using KalaHeaders::KalaLog::Log;
using KalaHeaders::KalaLog::LogType;

using KalaServer::Server::ServerCore;
using KalaServer::Server::Cloudflare;

#ifdef _WIN32
using std::wstring;
#endif

using std::cin;
using std::filesystem::path;
using std::filesystem::current_path;
using std::filesystem::weakly_canonical;
using std::this_thread::sleep_for;
using std::chrono::seconds;

namespace KalaKitWebsite::Core
{
    void KalaKitWebsiteCore::Initialize()
    {
        Log::Print(
            "Initializing KalaKit website",
            "KALAKIT_WEBSITE",
             LogType::LOG_INFO);

        path serverRoot = weakly_canonical(current_path() / ".." / ".." / "content");

        if (!ServerCore::Initialize(
            10000,
            "kalakit_server",
            "thekalakit.com",
            serverRoot))
        {
            exit(1);
        }

#ifdef _WIN32
        PWSTR winUserDir{};
        SHGetKnownFolderPath(FOLDERID_Profile, 0, NULL, &winUserDir);

        path userDir = path(winUserDir) / ".cloudflared";
        CoTaskMemFree(winUserDir);

        path cloudflareExePath = current_path() / "cloudflared-windows-amd64.exe";
#else
        path userDir = path(getenv("HOME")) / ".cloudflared";
        path cloudflareExePath = current_path() / "cloudflared-linux-amd64";
#endif

        if (!Cloudflare::Initialize("kalakit-tunnel", cloudflareExePath, userDir)) exit(1);

        while (!ServerCore::IsReady())
        {
            sleep_for(seconds(1));

            Log::Print(
                "Waiting for Cloudflare to finish connecting...",
                "KALAKIT_WEBSITE",
                LogType::LOG_INFO);
        }

        if (!ServerCore::HasInternet()) exit(1);

         Log::Print(
            "KalaKit website is ready!",
             "KALAKIT_WEBSITE",
             LogType::LOG_INFO);

        cin.get();

        ServerCore::Shutdown();
        Cloudflare::Shutdown();

        exit(0);
    }
}