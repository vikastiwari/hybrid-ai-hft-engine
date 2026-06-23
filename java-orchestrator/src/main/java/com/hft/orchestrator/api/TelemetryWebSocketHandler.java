package com.hft.orchestrator.api;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.Random;

@Component
public class TelemetryWebSocketHandler implements WebSocketHandler {
    
    private final Random random = new Random();

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        Flux<String> telemetryFlux = Flux.interval(Duration.ofMillis(800))
                .map(sequence -> generateMockTelemetry());

        return session.send(
                telemetryFlux.map(session::textMessage)
        ).and(session.receive().map(msg -> msg.getPayloadAsText()).doOnNext(System.out::println).then());
    }

    private String generateMockTelemetry() {
        int actionType = random.nextInt(10);
        String action = "INFO";
        String symbol = "AAPL";
        double price = 150.00 + (random.nextDouble() - 0.5);
        int qty = 100 * (random.nextInt(5) + 1);
        
        if (actionType < 2) {
            action = "BUY";
        } else if (actionType < 4) {
            action = "SELL";
        } else if (actionType < 7) {
            return String.format("[Panama FFM] Mapped C++ Memory Segment Pointer: 0x%08X", random.nextInt(Integer.MAX_VALUE));
        } else if (actionType < 9) {
            return String.format("[TCPDirect] DMA Zero-Copy Network Tx Latency: %.2f ns", 400 + random.nextDouble() * 50);
        }
        
        if (action.equals("INFO")) {
            return String.format("[C++ Execution Engine] LOB tick processed in %.2f us", random.nextDouble() * 2.0);
        }
        
        return String.format("[C++ Execution Engine] %s %d %s @ $%.2f", action, qty, symbol, price);
    }
}
