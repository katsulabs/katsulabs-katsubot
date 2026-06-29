pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        mavenCentral()
    }
}

rootProject.name = "katsulabs-katsubot"

include("services:chat-api")
project(":services:chat-api").projectDir = file("services/api")
