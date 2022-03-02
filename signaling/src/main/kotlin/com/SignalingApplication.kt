package com

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SignalingApplication

fun main(args: Array<String>) {
    runApplication<SignalingApplication>(*args)
}
