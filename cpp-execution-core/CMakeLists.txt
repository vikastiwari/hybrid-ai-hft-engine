cmake_minimum_required(VERSION 3.20)
project(HighFrequencyTradingEngine VERSION 1.0)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Core engine library
add_library(hft_core SHARED
    src/OrderBook.cpp
    src/ExecutionEngine.cpp
    src/panama_bindings.cpp
    src/network/PosixSocketClient.cpp
    src/network/TCPDirectClient.cpp
)

set_target_properties(hft_core PROPERTIES OUTPUT_NAME "hft_execution")
target_link_libraries(hft_core PRIVATE rt pthread)

# Fetch GoogleTest
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Enable testing
enable_testing()

# Add test executable
add_executable(hft_tests tests/ExecutionEngineTest.cpp)
target_link_libraries(hft_tests hft_core gtest_main)

include(GoogleTest)
gtest_discover_tests(hft_tests)
