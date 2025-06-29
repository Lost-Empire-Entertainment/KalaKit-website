//Copyright(C) 2025 Lost Empire Entertainment
//This program comes with ABSOLUTELY NO WARRANTY.
//This is free software, and you are welcome to redistribute it under certain conditions.
//Read LICENSE.md for more information.

#include <string>
#include <vector>
#include <filesystem>
#include <thread>
#include <chrono>
#include <fstream>
#include <memory>
#include <unordered_map>

#include "core/core.hpp"
#include "core/server.hpp"
#include "core/event.hpp"
#include "dns/cloudflare.hpp"
#include "dns/dns.hpp"
//#include "external/ktypes.hpp"

using KalaKit::Core::KalaServer;
using KalaKit::Core::Server;
using KalaKit::Core::ErrorMessage;
using KalaKit::Core::DataFile;
using KalaKit::DNS::CloudFlare;
using KalaKit::DNS::CustomDNS;
using KalaKit::Core::Event;
using KalaKit::Core::EventType;
using KalaKit::Core::PrintData;
using KalaKit::Core::PopupData;
using KalaKit::Core::EmailData;
using KalaKit::Core::BanClientData;
using KalaKit::Core::HealthPingData;
using KalaKit::Core::ReceiverPayload;

using std::string;
using std::vector;
using std::filesystem::current_path;
using std::filesystem::path;
using std::this_thread::sleep_for;
using std::chrono::milliseconds;
using std::ifstream;
using std::unique_ptr;
using std::make_unique;
using std::unordered_map;
//using KalaKit::KalaTypes::u16;

int main()
{
	unsigned int port = 30000;

	//How many times should the client be allowed to connect to 
	//the same route per second before they are auto-banned by server
	unsigned int rateLimitCounter = 5;

	string serverName = "KalaServer";
	string domainName = "thekalakit.com";
	
	string tunnelName = "KalaServer";

	string emailSenderDataFile = path(current_path() / "email-sender-data.txt").string();
	ifstream readFile(emailSenderDataFile);
	if (!readFile)
	{
		PopupData pdata =
		{
			.message = "Failed to open email sender data file to read its contents!",
			.severity = EventType::event_severity_error
		};
		unique_ptr<Event> event = make_unique<Event>();
		event->SendEvent(EventType::event_create_popup, pdata);
		return 0;
	}

	string username{};
	string password{};

	string line;
	while (getline(readFile, line))
	{
		auto delimiterPos = line.find('|');
		if (delimiterPos != string::npos)
		{
			auto trim = [](string& s) {
				size_t start = s.find_first_not_of(" \t\r\n");
				size_t end = s.find_last_not_of(" \t\r\n");
				s = (start == string::npos
					|| end == string::npos)
					? ""
					: s.substr(start, end - start + 1);
				};

			if (line.find("username") != string::npos)
			{
				string rawUsername = line.substr(delimiterPos + 1);
				trim(rawUsername);
				username = rawUsername;
			}
			else if (line.find("password") != string::npos)
			{
				string rawPassword = line.substr(delimiterPos + 1);
				trim(rawPassword);
				password = rawPassword;
			}
		}
	}

	readFile.close();

	PrintData printData =
	{
		.indentationLength = 2,
		.addTimeStamp = true,
		.severity = EventType::event_severity_message,
		.customTag = "",
		.message = ""
	};
	vector<string> receivers_email = { username };
	EmailData emailData =
	{
		.smtpServer = "smtp.gmail.com",
		.username = username,
		.password = password,
		.sender = username,
		.receivers_email = receivers_email,
		.subject = "",
		.body = ""
	};

	unordered_map<EventType, vector<ReceiverPayload>> events{};
	vector<ReceiverPayload> bannedClientPayload =
	{
		printData,
		emailData
	};
	vector<ReceiverPayload> alreadyBannedClientPayload =
	{
		printData
	};

	events[EventType::event_client_was_banned_for_blacklisted_route] = bannedClientPayload;
	events[EventType::event_client_was_banned_for_rate_limit] = bannedClientPayload;
	events[EventType::event_already_banned_client_connected] = alreadyBannedClientPayload;
	BanClientData banData =
	{
		.events = events
	};

	vector<ReceiverPayload> hpPayload =
	{
		printData,
		emailData
	};
	HealthPingData hpData =
	{
		.healthTimer = 3600, //3600 seconds (60 minutes) until health message ping
		.receivers = hpPayload
	};

	ErrorMessage errorFiles =
	{
		.error400 = "/errors/400",
		.error401 = "/errors/401",
		.error404 = "/errors/404",
		.error405 = "/errors/405",
		.error413 = "/errors/413",
		.error418 = "/errors/418",
		.error500 = "/errors/500"
	};

	DataFile configRoutes =
	{
		.whitelistedRoutesFolder = "content",
		.whitelistedExtensionsFile = "whitelisted-extensions.txt",
		.whitelistedIPsFile = "whitelisted-ips.txt",
		.bannedIPsFile = "banned-ips.txt",
		.blacklistedKeywordsFile = "blacklisted-keywords.txt"
	};

	vector<string> registeredRoutes{};
	vector<string> adminRoutes
	{
		"/admin"
	};

	bool success = Server::Initialize(
		port,
		rateLimitCounter,
		serverName,
		domainName,
		banData,
		hpData,
		errorFiles,
		configRoutes,
		registeredRoutes,
		adminRoutes);

	if (!success) return 0;

	CloudFlare::Initialize(
		true,                 //shut down cloudflared at server exit
		tunnelName);
	
	//do not run dns and cloudflared together
	//DNS::RunDNS();
		
	PrintData pd =
	{
		.indentationLength = 2,
		.addTimeStamp = true,
		.severity = EventType::event_severity_message,
		.customTag = "SERVER",
		.message = "Reached render loop successfully!"
	};
	unique_ptr<Event> renderEvent = make_unique<Event>();
	renderEvent->SendEvent(EventType::event_print_console_message, pd);

	while (KalaServer::isRunning)
	{
		KalaServer::Run();
		sleep_for(milliseconds(10));
	}

	KalaServer::Quit();
}