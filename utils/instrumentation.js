import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';


const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter(),  // Will use OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),  // Will use OTEL_EXPORTER_OTLP_METRICS_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS
  }),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
