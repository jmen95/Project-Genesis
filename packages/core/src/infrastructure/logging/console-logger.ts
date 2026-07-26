import type { LogEntry, LogLevel } from '../../domain/logging/logger.interface.js';
import type { ILogger } from '../../domain/logging/logger.interface.js';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export interface ConsoleLoggerOptions {
  readonly component: string;
}

export class ConsoleLogger implements ILogger {
  private readonly bindings: Readonly<Record<string, string>>;
  private readonly minLevel: LogLevel;
  private readonly entries: LogEntry[] = [];

  constructor(bindings: Readonly<Record<string, string>>, minLevel: LogLevel = 'info') {
    this.bindings = bindings;
    this.minLevel = minLevel;
  }

  child(bindings: Readonly<Record<string, string>>): ILogger {
    return new ConsoleLogger({ ...this.bindings, ...bindings }, this.minLevel);
  }

  debug(message: string, meta?: Readonly<Record<string, unknown>>): void {
    this.write('debug', message, meta);
  }

  info(message: string, meta?: Readonly<Record<string, unknown>>): void {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: Readonly<Record<string, unknown>>): void {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: Readonly<Record<string, unknown>>): void {
    this.write('error', message, meta);
  }

  getEntries(): readonly LogEntry[] {
    return this.entries;
  }

  private write(level: LogLevel, message: string, meta?: Readonly<Record<string, unknown>>): void {
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      meta: meta ? { ...this.bindings, ...meta } : { ...this.bindings },
    };

    this.entries.push(entry);
  }
}
