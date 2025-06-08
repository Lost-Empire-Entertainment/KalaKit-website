cmake_minimum_required(VERSION 3.30.3)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

project("Server")

set(SERVER_ROOT "${CMAKE_SOURCE_DIR}/server")

set(SRC_DIR "${SERVER_ROOT}/src")
set(INCLUDE_DIR "${SERVER_ROOT}/include")

set(KALASERVER_ROOT "${CMAKE_SOURCE_DIR}/external/KalaServer")

file(GLOB_RECURSE SERVER_SOURCE_FILES CONFIGURE_DEPENDS
	${SRC_DIR}/*.cpp
	${SRC_DIR}/*/*.cpp
)

add_executable(Server ${SERVER_SOURCE_FILES})

target_include_directories(Server PUBLIC 
	"${INCLUDE_DIR}"
	"${KALASERVER_ROOT}/include"
)

if(CMAKE_BUILD_TYPE STREQUAL "Release" OR CMAKE_BUILD_TYPE STREQUAL "RelWithDebInfo")
	target_link_libraries(Server PRIVATE "${KALASERVER_ROOT}/release/KalaServer.lib")
else()
	target_link_libraries(Server PRIVATE "${KALASERVER_ROOT}/debug/KalaServer.lib")
endif()