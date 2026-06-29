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

include("services:katsubot-api")
project(":services:katsubot-api").projectDir = file("services/katsubot-api")
