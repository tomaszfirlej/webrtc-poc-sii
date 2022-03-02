package com.websocket

import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.AbstractWebSocketHandler

class SignalingWebSocketHandler : AbstractWebSocketHandler() {

    var sessionOne: WebSocketSession? = null
    var sessionTwo: WebSocketSession? = null

    override fun afterConnectionEstablished(session: WebSocketSession) {
        if (sessionOne == null) {
            sessionOne = session
        } else if (sessionTwo == null) {
            sessionTwo = session
        }
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        if (sessionOne != null && sessionTwo != null) {
            sendToOtherSession(message, session)
        }
    }

    private fun sendToOtherSession(message: TextMessage, session: WebSocketSession?) {
        if (session == sessionOne) {
            sessionTwo?.sendMessage(message)
        } else {
            sessionOne?.sendMessage(message)
        }
    }


    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        if (sessionOne == session) {
            sessionOne = null
        } else if (sessionTwo == session) {
            sessionTwo = null
        }
    }
}
